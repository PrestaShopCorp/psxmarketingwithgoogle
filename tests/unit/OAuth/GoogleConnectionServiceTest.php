<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\OAuth;

use DateTimeImmutable;
use DateTimeZone;
use Db;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleTransportInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleConnectionService;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleCredentialRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthCallback;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthClient;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthRedirectUriResolver;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\OAuthStateRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Security\SecretBox;
use UnexpectedValueException;

class GoogleConnectionServiceTest extends TestCase
{
    private const REDIRECT_URI = 'https://thetinylux.com/module/tlgoogleshopping/oauth';

    /** @var array<string, array<string, mixed>> */
    private $stateRows = [];

    /** @var array<int, array<string, mixed>> */
    private $credentialRows = [];

    /** @var int */
    private $affectedRows = 0;

    /** @var Db&MockObject */
    private $db;

    /** @var OAuthStateRepository */
    private $states;

    /** @var GoogleCredentialRepository */
    private $credentials;

    protected function setUp(): void
    {
        $this->stateRows = [];
        $this->credentialRows = [];
        $this->affectedRows = 0;
        $this->db = $this->createMock(Db::class);
        $this->configureDatabaseFake();
        $this->states = new OAuthStateRepository($this->db);
        $this->credentials = new GoogleCredentialRepository($this->db, new SecretBox(str_repeat('s', 32)));
    }

    public function testAuthorizationUrlIssuesOnlyAHashedShortLivedState(): void
    {
        $this->saveClientConfiguration();
        $transport = new ServiceGoogleTransport();

        $url = $this->service($transport)->authorizationUrl(1, 7, self::REDIRECT_URI);
        parse_str((string) parse_url($url, PHP_URL_QUERY), $query);

        self::assertArrayHasKey('state', $query);
        self::assertCount(1, $this->stateRows);
        $stored = reset($this->stateRows);
        self::assertSame(hash('sha256', $query['state']), $stored['state_hash']);
        self::assertNotContains($query['state'], $stored, true);
        self::assertSame(1, $stored['id_shop']);
        self::assertSame(7, $stored['id_employee']);
        self::assertLessThanOrEqual(
            new DateTimeImmutable('+11 minutes', new DateTimeZone('UTC')),
            new DateTimeImmutable($stored['expires_at'], new DateTimeZone('UTC'))
        );
    }

    public function testInvalidExpiredAndReusedStatePreventTokenExchange(): void
    {
        $this->saveClientConfiguration();
        $transport = new ServiceGoogleTransport($this->successfulConnectionResponses());
        $service = $this->service($transport);

        foreach (['invalid-state', $this->states->issue(1, 7, new DateTimeImmutable('-1 second'))] as $state) {
            try {
                $service->complete(1, $state, 'authorization-code-value', self::REDIRECT_URI);
                self::fail('Invalid or expired state must stop before Google exchange.');
            } catch (UnexpectedValueException $exception) {
                self::assertCount(0, $transport->requests);
            }
        }

        $validState = $this->states->issue(1, 7, new DateTimeImmutable('+5 minutes'));
        $service->complete(1, $validState, 'authorization-code-value', self::REDIRECT_URI);
        self::assertCount(2, $transport->requests);

        try {
            $service->complete(1, $validState, 'authorization-code-value-2', self::REDIRECT_URI);
            self::fail('Reused state must stop before a second Google exchange.');
        } catch (UnexpectedValueException $exception) {
            self::assertCount(2, $transport->requests);
        }
    }

    public function testSuccessfulExchangeEncryptsRefreshTokenAndStoresValidatedEmail(): void
    {
        $this->saveClientConfiguration();
        $transport = new ServiceGoogleTransport($this->successfulConnectionResponses());
        $state = $this->states->issue(1, 7, new DateTimeImmutable('+5 minutes'));

        $service = $this->service($transport);
        $service->complete(
            1,
            $state,
            'authorization-code-value',
            self::REDIRECT_URI
        );

        self::assertNotSame('refresh-token-value', $this->credentialRows[1]['refresh_token']);
        self::assertStringNotContainsString('refresh-token-value', json_encode($this->credentialRows[1]));
        self::assertSame('refresh-token-value', $this->credentials->find(1)['refresh_token']);
        self::assertSame('owner@example.com', $this->credentials->find(1)['google_email']);
        self::assertSame('access-token-value', $service->accessToken(1));
    }

    public function testFirstExchangeWithoutRefreshTokenDoesNotCreatePartialConnection(): void
    {
        $this->saveClientConfiguration();
        $state = $this->states->issue(1, 7, new DateTimeImmutable('+5 minutes'));
        $transport = new ServiceGoogleTransport([
            new Response(200, '{"access_token":"access-token-value","expires_in":3600,"token_type":"Bearer"}'),
        ]);

        try {
            $this->service($transport)->complete(1, $state, 'authorization-code-value', self::REDIRECT_URI);
            self::fail('The first OAuth exchange must provide an offline refresh token.');
        } catch (GoogleApiException $exception) {
            self::assertSame('Google did not provide offline access.', $exception->getMessage());
            self::assertNull($this->credentials->find(1)['refresh_token']);
            self::assertNull($this->credentials->find(1)['google_email']);
            self::assertCount(1, $transport->requests);
        }
    }

    public function testRefreshPreservesExistingEncryptedRefreshTokenWhenGoogleOmitsANewOne(): void
    {
        $this->saveClientConfiguration('old-refresh-token-value');
        $storedCiphertext = $this->credentialRows[1]['refresh_token'];
        $transport = new ServiceGoogleTransport([
            new Response(200, '{"access_token":"new-access-token-value","expires_in":1800,"token_type":"Bearer"}'),
        ]);

        self::assertSame('new-access-token-value', $this->service($transport)->accessToken(1));
        self::assertSame($storedCiphertext, $this->credentialRows[1]['refresh_token']);
        self::assertSame('old-refresh-token-value', $this->credentials->find(1)['refresh_token']);
    }

    public function testStatusContainsNoSecretTokenCodeOrStateFieldsOrValues(): void
    {
        $this->credentials->save(1, [
            'client_id' => 'client-id-value',
            'client_secret' => 'client-secret-value',
            'refresh_token' => 'refresh-token-value',
            'google_email' => 'owner@example.com',
            'merchant_account' => 'merchant-123',
            'data_source' => 'accounts/123/dataSources/456',
            'cron_token' => 'cron-token-value',
        ]);

        $status = $this->service(new ServiceGoogleTransport())->status(1);
        $serialized = json_encode($status);

        self::assertSame([
            'connected' => true,
            'googleEmail' => 'owner@example.com',
            'merchantAccount' => 'merchant-123',
            'dataSource' => 'accounts/123/dataSources/456',
        ], $status);
        self::assertRegExp('/^(?!.*(?:secret|token|code|state))/i', implode(',', array_keys($status)));
        foreach (['client-id-value', 'client-secret-value', 'refresh-token-value', 'cron-token-value'] as $secret) {
            self::assertStringNotContainsString($secret, $serialized);
        }
    }

    public function testDisconnectDeletesLocalConnectionEvenWhenGoogleRevocationFails(): void
    {
        $this->saveClientConfiguration('refresh-token-value');
        $transport = new ServiceGoogleTransport([
            new Response(503, '{"error":"server_error","token":"refresh-token-value"}'),
        ]);

        $this->service($transport)->disconnect(1);

        self::assertNull($this->credentials->find(1));
        self::assertCount(1, $transport->requests);
        self::assertSame('https://oauth2.googleapis.com/revoke', $transport->requests[0]['url']);
    }

    public function testCallbackDenialDerivesAndConsumesStateWithoutCallingGoogle(): void
    {
        $this->saveClientConfiguration();
        $state = $this->states->issue(1, 7, new DateTimeImmutable('+5 minutes'));
        $transport = new ServiceGoogleTransport();
        $callback = $this->oauthCallback($transport);

        $redirect = $callback->handle(
            ['error' => 'access_denied', 'state' => $state],
            'https://thetinylux.com/admin/module'
        );

        self::assertSame('https://thetinylux.com/admin/module?oauth_result=denied', $redirect);
        self::assertCount(0, $transport->requests);
        $this->expectException(UnexpectedValueException::class);
        $this->states->consume($state, 1);
    }

    public function testCallbackRejectsMissingParametersAndQueryShopAuthorityWithSanitizedRedirects(): void
    {
        $this->saveClientConfiguration();
        $transport = new ServiceGoogleTransport();
        $callback = $this->oauthCallback($transport);
        $backOfficeUrl = 'https://thetinylux.com/admin/module';

        self::assertSame(
            $backOfficeUrl . '?oauth_result=invalid_request',
            $callback->handle([], $backOfficeUrl)
        );
        $state = $this->states->issue(1, 7, new DateTimeImmutable('+5 minutes'));
        $redirect = $callback->handle(
            ['id_shop' => '999', 'code' => 'authorization-code-value', 'state' => $state],
            $backOfficeUrl
        );

        self::assertSame($backOfficeUrl . '?oauth_result=invalid_request', $redirect);
        self::assertStringNotContainsString('999', $redirect);
        self::assertStringNotContainsString('authorization-code-value', $redirect);
        self::assertStringNotContainsString($state, $redirect);
        self::assertCount(0, $transport->requests);
    }

    public function testCallbackSuccessRedirectContainsOnlyNonSensitiveResult(): void
    {
        $this->saveClientConfiguration();
        $state = $this->states->issue(1, 7, new DateTimeImmutable('+5 minutes'));
        $transport = new ServiceGoogleTransport($this->successfulConnectionResponses());
        $callback = $this->oauthCallback($transport);

        $redirect = $callback->handle(
            ['code' => 'authorization-code-value', 'state' => $state],
            'https://thetinylux.com/admin/module?token=admin-token-value'
        );

        self::assertSame(
            'https://thetinylux.com/admin/module?token=admin-token-value&oauth_result=connected',
            $redirect
        );
        self::assertStringNotContainsString('authorization-code-value', $redirect);
        self::assertStringNotContainsString($state, $redirect);
        self::assertStringNotContainsString('refresh-token-value', $redirect);
    }

    public function testAuthorizationAndStateDerivedExchangeUseTheSameTrustedDevRedirectUri(): void
    {
        $this->credentials->save(2, [
            'client_id' => 'dev-client-id',
            'client_secret' => 'dev-client-secret-value',
            'cron_token' => 'dev-cron-token-value',
        ]);
        $transport = new ServiceGoogleTransport($this->successfulConnectionResponses());
        $service = $this->service($transport);
        $resolver = $this->redirectResolver();

        $authorizationUrl = $service->authorizationUrl(2, 7, $resolver->resolve(2));
        parse_str((string) parse_url($authorizationUrl, PHP_URL_QUERY), $authorizationQuery);
        self::assertSame(
            'https://preview.trycloudflare.com/prestashop/module/tlgoogleshopping/oauth',
            $authorizationQuery['redirect_uri']
        );

        $callback = new GoogleOAuthCallback($this->states, $service, $resolver);
        $callback->handle(
            ['code' => 'authorization-code-value', 'state' => $authorizationQuery['state']],
            'https://preview.trycloudflare.com/admin/module'
        );

        parse_str((string) $transport->requests[0]['body'], $exchangeBody);
        self::assertSame($authorizationQuery['redirect_uri'], $exchangeBody['redirect_uri']);
        self::assertSame('dev-client-id', $exchangeBody['client_id']);
    }

    public function testProductionRouteAliasRegistersAndDispatchesToTechnicalModuleController(): void
    {
        self::assertContains('moduleRoutes', Config::HOOK_LIST);

        $reflection = new \ReflectionClass(\PsxMarketingWithGoogle::class);
        /** @var \PsxMarketingWithGoogle $module */
        $module = $reflection->newInstanceWithoutConstructor();
        $module->name = 'psxmarketingwithgoogle';

        self::assertSame([
            'module-tlgoogleshopping-oauth' => [
                'controller' => 'oauth',
                'rule' => 'module/tlgoogleshopping/oauth',
                'keywords' => [],
                'params' => ['fc' => 'module', 'module' => 'psxmarketingwithgoogle'],
            ],
        ], $module->hookModuleRoutes());

        require_once __DIR__ . '/../../../controllers/front/oauth.php';
        self::assertTrue(is_subclass_of(
            'PsxmarketingwithgoogleOauthModuleFrontController',
            \ModuleFrontController::class
        ));
    }

    private function service(ServiceGoogleTransport $transport): GoogleConnectionService
    {
        return new GoogleConnectionService(
            $this->states,
            $this->credentials,
            new GoogleOAuthClient($transport)
        );
    }

    private function oauthCallback(ServiceGoogleTransport $transport): GoogleOAuthCallback
    {
        return new GoogleOAuthCallback(
            $this->states,
            $this->service($transport),
            $this->redirectResolver()
        );
    }

    private function redirectResolver(): GoogleOAuthRedirectUriResolver
    {
        return new GoogleOAuthRedirectUriResolver(static function (int $shopId): array {
            if (2 === $shopId) {
                return [
                    'domain_ssl' => 'preview.trycloudflare.com',
                    'physical_uri' => '/prestashop/',
                    'virtual_uri' => '',
                ];
            }

            return [
                'domain_ssl' => 'thetinylux.com',
                'physical_uri' => '/',
                'virtual_uri' => '',
            ];
        });
    }

    private function saveClientConfiguration(?string $refreshToken = null): void
    {
        $this->credentials->save(1, [
            'client_id' => 'client-id',
            'client_secret' => 'client-secret-value',
            'refresh_token' => $refreshToken,
            'cron_token' => 'cron-token-value',
        ]);
    }

    /** @return Response[] */
    private function successfulConnectionResponses(): array
    {
        return [
            new Response(200, '{"access_token":"access-token-value","expires_in":3600,"refresh_token":"refresh-token-value","token_type":"Bearer"}'),
            new Response(200, '{"sub":"123","email":"owner@example.com","email_verified":true}'),
        ];
    }

    private function configureDatabaseFake(): void
    {
        $this->db->method('insert')->willReturnCallback(function (string $table, array $row): bool {
            if ('psxmarketingwithgoogle_oauth_state' === $table) {
                $this->stateRows[$row['state_hash']] = $row;
            } elseif ('psxmarketingwithgoogle_connection' === $table) {
                $this->credentialRows[(int) $row['id_shop']] = $row;
            } else {
                self::fail('Unexpected table insert: ' . $table);
            }

            return true;
        });
        $this->db->method('getRow')->willReturnCallback(function ($query) {
            $query = (string) $query;
            if (false !== strpos($query, 'psxmarketingwithgoogle_oauth_state')) {
                self::assertSame(1, preg_match("/state_hash = '([a-f0-9]{64})'/", $query, $stateMatch));
                $row = $this->stateRows[$stateMatch[1]] ?? null;
                if (!is_array($row)) {
                    return false;
                }
                if (preg_match('/id_shop = ([0-9]+)/', $query, $shopMatch)
                    && (int) $row['id_shop'] !== (int) $shopMatch[1]
                ) {
                    return false;
                }
                if (false !== strpos($query, 'consumed_at IS NULL')) {
                    if (null !== $row['consumed_at'] || !$this->isFuture((string) $row['expires_at'])) {
                        return false;
                    }
                }

                return $row;
            }

            self::assertSame(1, preg_match('/id_shop = ([0-9]+)/', $query, $shopMatch));

            return $this->credentialRows[(int) $shopMatch[1]] ?? false;
        });
        $this->db->method('execute')->willReturnCallback(function ($query): bool {
            $query = (string) $query;
            self::assertSame(1, preg_match("/state_hash = '([a-f0-9]{64})'/", $query, $stateMatch));
            self::assertSame(1, preg_match('/id_shop = ([0-9]+)/', $query, $shopMatch));
            $this->affectedRows = 0;
            $row = &$this->stateRows[$stateMatch[1]];
            if (is_array($row)
                && (int) $row['id_shop'] === (int) $shopMatch[1]
                && null === $row['consumed_at']
                && $this->isFuture((string) $row['expires_at'])
            ) {
                $row['consumed_at'] = gmdate('Y-m-d H:i:s');
                $this->affectedRows = 1;
            }

            return true;
        });
        $this->db->method('Affected_Rows')->willReturnCallback(function (): int {
            return $this->affectedRows;
        });
        $this->db->method('delete')->willReturnCallback(function (string $table, string $where): bool {
            self::assertSame('psxmarketingwithgoogle_connection', $table);
            self::assertSame(1, preg_match('/id_shop = ([0-9]+)/', $where, $match));
            unset($this->credentialRows[(int) $match[1]]);

            return true;
        });
        $this->db->method('getNumberError')->willReturn(0);
        $this->db->method('getMsgError')->willReturn('');
    }

    private function isFuture(string $date): bool
    {
        return new DateTimeImmutable($date, new DateTimeZone('UTC'))
            >= new DateTimeImmutable('now', new DateTimeZone('UTC'));
    }
}

final class ServiceGoogleTransport implements GoogleTransportInterface
{
    /** @var Response[] */
    private $responses;

    /** @var array<int, array{method: string, url: string, headers: array<int, string>, body: string|null}> */
    public $requests = [];

    /** @param Response[] $responses */
    public function __construct(array $responses = [])
    {
        $this->responses = $responses;
    }

    public function request(string $method, string $url, array $headers, ?string $body): Response
    {
        $this->requests[] = compact('method', 'url', 'headers', 'body');

        return array_shift($this->responses) ?: new Response(500, 'No fake response configured.');
    }
}
