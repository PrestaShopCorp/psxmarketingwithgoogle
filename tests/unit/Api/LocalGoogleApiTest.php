<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\Api;

use Db;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Api\LocalGoogleApi;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleTransportInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleConnectionService;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleCredentialRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthClient;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthRedirectUriResolver;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\OAuthStateRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Security\SecretBox;

class LocalGoogleApiTest extends TestCase
{
    private const PRODUCTION_REDIRECT_URI = 'https://thetinylux.com/module/tlgoogleshopping/oauth';

    /** @var array<int, array<string, mixed>> */
    private $credentialRows = [];

    /** @var Db&MockObject */
    private $db;

    /** @var GoogleCredentialRepository */
    private $credentials;

    /** @var LocalGoogleApi */
    private $api;

    protected function setUp(): void
    {
        $this->credentialRows = [];
        $this->db = $this->createMock(Db::class);
        $this->configureCredentialDatabaseFake();
        $this->credentials = new GoogleCredentialRepository(
            $this->db,
            new SecretBox(str_repeat('a', 32))
        );

        $resolver = new GoogleOAuthRedirectUriResolver(static function (int $shopId): array {
            self::assertSame(1, $shopId);

            return [
                'domain_ssl' => 'thetinylux.com',
                'physical_uri' => '/',
                'virtual_uri' => '',
            ];
        });
        $connections = new GoogleConnectionService(
            new OAuthStateRepository($this->db),
            $this->credentials,
            new GoogleOAuthClient(new ApiNullGoogleTransport())
        );
        $this->api = new LocalGoogleApi(
            $this->credentials,
            $connections,
            $resolver,
            static function (): int {
                return 1;
            },
            static function (): int {
                return 7;
            }
        );
    }

    public function testCredentialImportRejectsNonWebClient(): void
    {
        $response = $this->api->dispatch('POST', 'settings/credentials', [
            'installed' => ['client_id' => 'id', 'client_secret' => 'secret'],
        ]);

        self::assertSame(422, $response->getStatusCode());
        self::assertSame(['code' => 'invalid_web_client'], $this->json($response));
        self::assertSame([], $this->credentialRows);
    }

    public function testCredentialImportPersistsEncryptedWebClientAndReturnsOnlySafeFields(): void
    {
        $secret = 'client-secret-value-never-returned';
        $response = $this->api->dispatch('POST', 'settings/credentials', [
            'web' => [
                'client_id' => 'tiny-lux-client-id-1234567890',
                'client_secret' => $secret,
                'redirect_uris' => [self::PRODUCTION_REDIRECT_URI],
            ],
        ]);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame([
            'configured' => true,
            'clientIdSuffix' => '34567890',
            'redirectUri' => self::PRODUCTION_REDIRECT_URI,
        ], $this->json($response));
        self::assertStringNotContainsString($secret, $response->getBody());
        self::assertStringNotContainsString($secret, json_encode($this->credentialRows));
        self::assertSame($secret, $this->credentials->find(1)['client_secret']);
    }

    public function testCredentialReplacementPreservesCronAndClearsEveryGoogleConnectionField(): void
    {
        $this->credentials->save(1, [
            'client_id' => 'old-client-id',
            'client_secret' => 'old-client-secret',
            'refresh_token' => 'old-refresh-token',
            'google_email' => 'old-owner@example.com',
            'merchant_account' => 'merchant-123',
            'data_source' => 'accounts/123/dataSources/456',
            'cron_token' => 'stable-cron-token',
        ]);
        $encryptedCron = $this->credentialRows[1]['cron_token'];
        $newSecret = 'new-client-secret-never-returned';

        $response = $this->api->dispatch('POST', 'settings/credentials', [
            'web' => [
                'client_id' => 'new-client-id-12345678',
                'client_secret' => $newSecret,
                'redirect_uris' => [self::PRODUCTION_REDIRECT_URI],
            ],
        ]);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame([
            'configured' => true,
            'clientIdSuffix' => '12345678',
            'redirectUri' => self::PRODUCTION_REDIRECT_URI,
        ], $this->json($response));
        self::assertSame($encryptedCron, $this->credentialRows[1]['cron_token']);
        self::assertNull($this->credentialRows[1]['refresh_token']);
        self::assertNull($this->credentialRows[1]['google_email']);
        self::assertNull($this->credentialRows[1]['merchant_account']);
        self::assertNull($this->credentialRows[1]['data_source']);
        self::assertStringNotContainsString($newSecret, $response->getBody());
        self::assertStringNotContainsString($newSecret, json_encode($this->credentialRows));
        self::assertSame([
            'connected' => false,
            'googleEmail' => null,
            'merchantAccount' => null,
            'dataSource' => null,
        ], $this->json($this->api->dispatch('GET', 'oauth')));
    }

    /**
     * @dataProvider invalidCredentialProvider
     *
     * @param array<string, mixed> $body
     */
    public function testCredentialImportRejectsMalformedWrongTypeAndOversizedValues(array $body): void
    {
        $response = $this->api->dispatch('POST', 'settings/credentials', $body);

        self::assertSame(422, $response->getStatusCode());
        self::assertSame(['code' => 'invalid_web_client'], $this->json($response));
        self::assertSame([], $this->credentialRows);
    }

    /** @return array<string, array{0: array<string, mixed>}> */
    public function invalidCredentialProvider(): array
    {
        $valid = [
            'client_id' => 'client-id',
            'client_secret' => 'client-secret',
            'redirect_uris' => [self::PRODUCTION_REDIRECT_URI],
        ];

        return [
            'extra top-level key' => [['web' => $valid, 'installed' => $valid]],
            'web is not an object' => [['web' => 'not-an-object']],
            'empty client id' => [['web' => array_merge($valid, ['client_id' => '  '])]],
            'non-string secret' => [['web' => array_merge($valid, ['client_secret' => 123])]],
            'redirect list is not an array' => [['web' => array_merge($valid, ['redirect_uris' => self::PRODUCTION_REDIRECT_URI])]],
            'redirect entry is not a string' => [['web' => array_merge($valid, ['redirect_uris' => [123]])]],
            'wrong redirect' => [['web' => array_merge($valid, ['redirect_uris' => ['https://attacker.test/callback']])]],
            'oversized id' => [['web' => array_merge($valid, ['client_id' => str_repeat('i', 2049)])]],
            'oversized secret' => [['web' => array_merge($valid, ['client_secret' => str_repeat('s', 4097)])]],
            'too many redirects' => [['web' => array_merge($valid, ['redirect_uris' => array_fill(0, 21, self::PRODUCTION_REDIRECT_URI)])]],
        ];
    }

    public function testSettingsStatusAndOAuthStatusContainNoCredentialOrTokenValues(): void
    {
        $this->credentials->save(1, [
            'client_id' => 'tiny-lux-client-id-1234567890',
            'client_secret' => 'client-secret-value',
            'refresh_token' => 'refresh-token-value',
            'google_email' => 'owner@example.com',
            'cron_token' => 'cron-token-value',
        ]);

        $settings = $this->api->dispatch('GET', 'settings/status');
        $connection = $this->api->dispatch('GET', 'oauth');

        self::assertSame([
            'configured' => true,
            'clientIdSuffix' => '34567890',
            'redirectUri' => self::PRODUCTION_REDIRECT_URI,
        ], $this->json($settings));
        self::assertSame([
            'connected' => true,
            'googleEmail' => 'owner@example.com',
            'merchantAccount' => null,
            'dataSource' => null,
        ], $this->json($connection));
        $serialized = $settings->getBody() . $connection->getBody();
        foreach (['client-secret-value', 'refresh-token-value', 'cron-token-value'] as $secret) {
            self::assertStringNotContainsString($secret, $serialized);
        }
    }

    public function testUnknownRouteReturnsSanitizedNotFoundResponse(): void
    {
        $response = $this->api->dispatch('GET', 'settings/credentials');

        self::assertSame(404, $response->getStatusCode());
        self::assertSame(['code' => 'route_not_found'], $this->json($response));
    }

    /** @return array<string, mixed> */
    private function json(Response $response): array
    {
        $decoded = json_decode($response->getBody(), true);
        self::assertIsArray($decoded);

        return $decoded;
    }

    private function configureCredentialDatabaseFake(): void
    {
        $this->db->method('insert')->willReturnCallback(function (string $table, array $row): bool {
            if ('psxmarketingwithgoogle_connection' === $table) {
                $this->credentialRows[(int) $row['id_shop']] = $row;
            }

            return true;
        });
        $this->db->method('getRow')->willReturnCallback(function ($query) {
            $query = (string) $query;
            if (false !== strpos($query, 'psxmarketingwithgoogle_oauth_state')) {
                return false;
            }
            self::assertSame(1, preg_match('/id_shop = ([0-9]+)/', $query, $match));

            return $this->credentialRows[(int) $match[1]] ?? false;
        });
        $this->db->method('getNumberError')->willReturn(0);
        $this->db->method('getMsgError')->willReturn('');
        $this->db->method('delete')->willReturnCallback(function (string $table, string $where): bool {
            self::assertSame('psxmarketingwithgoogle_connection', $table);
            self::assertSame(1, preg_match('/id_shop = ([0-9]+)/', $where, $match));
            unset($this->credentialRows[(int) $match[1]]);

            return true;
        });
    }
}

final class ApiNullGoogleTransport implements GoogleTransportInterface
{
    public function request(string $method, string $url, array $headers, ?string $body): Response
    {
        unset($method, $url, $headers, $body);

        return new Response(500, 'No network request is permitted in local API tests.');
    }
}
