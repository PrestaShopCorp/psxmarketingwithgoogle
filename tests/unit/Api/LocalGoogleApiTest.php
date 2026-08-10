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
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogFilterSettingsInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogOfferSourceInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProduct;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\GoogleConnectionProviderInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\MerchantProductGatewayInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\MerchantProductMapper;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncJobStoreInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncProcessor;
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

    public function testProductFiltersAreReadForTheAuthenticatedShopOnly(): void
    {
        $filters = [[
            'attribute' => 'active',
            'condition' => 'equals',
            'value' => true,
        ]];
        $settings = $this->createMock(CatalogFilterSettingsInterface::class);
        $settings->expects(self::once())
            ->method('filtersForShop')
            ->with(1)
            ->willReturn($filters);

        $response = $this->filterApi($settings)->dispatch('GET', 'product-filters');

        self::assertSame(200, $response->getStatusCode());
        self::assertSame(['filters' => $filters], $this->json($response));
    }

    public function testProductFiltersAreReplacedForTheAuthenticatedShopAndEchoedSafely(): void
    {
        $filters = [[
            'attribute' => 'price',
            'condition' => 'greater_than',
            'value' => 20,
        ]];
        $settings = $this->createMock(CatalogFilterSettingsInterface::class);
        $settings->expects(self::once())
            ->method('replaceForShop')
            ->with(1, $filters);

        $response = $this->filterApi($settings)->dispatch('POST', 'product-filters', [
            'filters' => $filters,
        ]);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame(['filters' => $filters], $this->json($response));
    }

    /** @dataProvider invalidProductFiltersEnvelopeProvider */
    public function testProductFiltersRejectMalformedExactEnvelopes(string $method, array $body): void
    {
        $settings = $this->createMock(CatalogFilterSettingsInterface::class);
        $response = $this->filterApi($settings)->dispatch($method, 'product-filters', $body);

        self::assertSame(422, $response->getStatusCode());
        self::assertSame(['code' => 'invalid_request'], $this->json($response));
    }

    /** @return array<string, array{0: string, 1: array<string, mixed>}> */
    public function invalidProductFiltersEnvelopeProvider(): array
    {
        return [
            'GET body must be empty' => ['GET', ['filters' => []]],
            'POST missing filters' => ['POST', []],
            'POST filters must be a list' => ['POST', ['filters' => ['attribute' => 'active']]],
            'POST unknown key' => ['POST', ['filters' => [], 'unknown' => true]],
        ];
    }

    public function testProductFiltersHideValidationInternals(): void
    {
        $settings = $this->createMock(CatalogFilterSettingsInterface::class);
        $settings->method('replaceForShop')->willThrowException(
            new \InvalidArgumentException('sensitive filter validation detail')
        );

        $response = $this->filterApi($settings)->dispatch('POST', 'product-filters', [
            'filters' => [['not' => 'canonical']],
        ]);

        self::assertSame(422, $response->getStatusCode());
        self::assertSame(['code' => 'invalid_request'], $this->json($response));
        self::assertStringNotContainsString('sensitive', $response->getBody());
    }

    public function testCreateSyncJobRejectsAnyKeyOutsideTheExactFullBooleanEnvelope(): void
    {
        $response = $this->api->dispatch('POST', 'sync/jobs', [
            'full' => true,
            'jobId' => 91,
        ]);

        self::assertSame(422, $response->getStatusCode());
        self::assertSame(['code' => 'invalid_request'], $this->json($response));
    }

    public function testCreateSyncJobReturnsOnlyTheNewJobId(): void
    {
        $api = $this->syncApi(new ApiSyncJobStore());

        $response = $api->dispatch('POST', 'sync/jobs', ['full' => true]);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame(['jobId' => 91], $this->json($response));
        self::assertStringNotContainsString('never-return-this-access-token', $response->getBody());
    }

    public function testRunSyncBatchCapsTheBatchAndReturnsOnlySafeJobCounts(): void
    {
        $jobs = new ApiSyncJobStore();
        $jobs->seedJob(91, 1);
        $api = $this->syncApi($jobs, 2);

        $response = $api->dispatch('POST', 'sync/jobs/run', [
            'limit' => 100,
            'jobId' => 91,
        ]);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame([
            'jobId' => 91,
            'status' => 'pending',
            'total' => 30,
            'succeeded' => 4,
            'failed' => 3,
            'skipped' => 2,
            'pending' => 21,
        ], $this->json($response));
        self::assertSame([25], $jobs->claimLimits);
        self::assertStringNotContainsString('never-return-this-refresh-token', $response->getBody());
        self::assertStringNotContainsString('accounts/123/dataSources/456', $response->getBody());
    }

    public function testSyncStatusReturnsOnlySafeCountsAndBoundedSanitizedErrors(): void
    {
        $jobs = new ApiSyncJobStore();
        $jobs->seedJob(91, 1);

        $response = $this->syncApi($jobs, 2)->dispatch('GET', 'sync/jobs/status', ['jobId' => 91]);
        $payload = $this->json($response);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame([
            'jobId',
            'status',
            'total',
            'succeeded',
            'failed',
            'skipped',
            'pending',
            'errors',
        ], array_keys($payload));
        self::assertCount(25, $payload['errors']);
        self::assertSame(['offerKey', 'code', 'field', 'message'], array_keys($payload['errors'][0]));
        self::assertSame('1-0', $payload['errors'][0]['offerKey']);
        self::assertSame('merchant_validation', $payload['errors'][0]['code']);
        self::assertSame('title', $payload['errors'][0]['field']);
        self::assertLessThanOrEqual(500, mb_strlen($payload['errors'][0]['message'], 'UTF-8'));
        self::assertStringNotContainsString('<script>', $response->getBody());
        self::assertStringNotContainsString('never-return-this-error-secret', $response->getBody());
        self::assertStringNotContainsString('never-return-this-bearer-token', $response->getBody());
        self::assertStringNotContainsString('accounts/123/dataSources/456', $response->getBody());
    }

    public function testRetrySyncJobReturnsOnlyTheOwnedJobId(): void
    {
        $jobs = new ApiSyncJobStore();
        $jobs->seedJob(91, 1);

        $response = $this->syncApi($jobs, 2)->dispatch('POST', 'sync/jobs/retry', ['jobId' => 91]);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame(['jobId' => 91], $this->json($response));
        self::assertSame([[1, 91]], $jobs->retryCalls);
    }

    /**
     * @dataProvider invalidSyncEnvelopeProvider
     *
     * @param array<string, mixed> $body
     */
    public function testSyncRoutesRejectInvalidExactEnvelopes(string $method, string $path, array $body): void
    {
        $response = $this->api->dispatch($method, $path, $body);

        self::assertSame(422, $response->getStatusCode());
        self::assertSame(['code' => 'invalid_request'], $this->json($response));
    }

    /** @return array<string, array{0: string, 1: string, 2: array<string, mixed>}> */
    public function invalidSyncEnvelopeProvider(): array
    {
        return [
            'create missing full' => ['POST', 'sync/jobs', []],
            'create string full' => ['POST', 'sync/jobs', ['full' => 'true']],
            'create integer full' => ['POST', 'sync/jobs', ['full' => 1]],
            'create float full' => ['POST', 'sync/jobs', ['full' => 1.0]],
            'create null full' => ['POST', 'sync/jobs', ['full' => null]],
            'create unknown key' => ['POST', 'sync/jobs', ['full' => true, 'unknown' => false]],
            'run missing job' => ['POST', 'sync/jobs/run', []],
            'run numeric-string job' => ['POST', 'sync/jobs/run', ['jobId' => '91']],
            'run zero job' => ['POST', 'sync/jobs/run', ['jobId' => 0]],
            'run negative job' => ['POST', 'sync/jobs/run', ['jobId' => -1]],
            'run boolean job' => ['POST', 'sync/jobs/run', ['jobId' => true]],
            'run float job' => ['POST', 'sync/jobs/run', ['jobId' => 91.0]],
            'run numeric-string limit' => ['POST', 'sync/jobs/run', ['jobId' => 91, 'limit' => '25']],
            'run zero limit' => ['POST', 'sync/jobs/run', ['jobId' => 91, 'limit' => 0]],
            'run negative limit' => ['POST', 'sync/jobs/run', ['jobId' => 91, 'limit' => -1]],
            'run boolean limit' => ['POST', 'sync/jobs/run', ['jobId' => 91, 'limit' => true]],
            'run float limit' => ['POST', 'sync/jobs/run', ['jobId' => 91, 'limit' => 25.0]],
            'run null limit' => ['POST', 'sync/jobs/run', ['jobId' => 91, 'limit' => null]],
            'run unknown key' => ['POST', 'sync/jobs/run', ['jobId' => 91, 'unknown' => 25]],
            'status missing job' => ['GET', 'sync/jobs/status', []],
            'status numeric-string job' => ['GET', 'sync/jobs/status', ['jobId' => '91']],
            'status zero job' => ['GET', 'sync/jobs/status', ['jobId' => 0]],
            'status negative job' => ['GET', 'sync/jobs/status', ['jobId' => -1]],
            'status boolean job' => ['GET', 'sync/jobs/status', ['jobId' => true]],
            'status float job' => ['GET', 'sync/jobs/status', ['jobId' => 91.0]],
            'status unknown key' => ['GET', 'sync/jobs/status', ['jobId' => 91, 'unknown' => true]],
            'retry missing job' => ['POST', 'sync/jobs/retry', []],
            'retry numeric-string job' => ['POST', 'sync/jobs/retry', ['jobId' => '91']],
            'retry zero job' => ['POST', 'sync/jobs/retry', ['jobId' => 0]],
            'retry negative job' => ['POST', 'sync/jobs/retry', ['jobId' => -1]],
            'retry boolean job' => ['POST', 'sync/jobs/retry', ['jobId' => true]],
            'retry float job' => ['POST', 'sync/jobs/retry', ['jobId' => 91.0]],
            'retry unknown key' => ['POST', 'sync/jobs/retry', ['jobId' => 91, 'unknown' => true]],
        ];
    }

    /** @dataProvider ownedSyncJobRouteProvider */
    public function testSyncJobRoutesHideUnknownAndCrossShopJobs(string $method, string $path): void
    {
        $jobs = new ApiSyncJobStore();
        $jobs->seedJob(92, 2);
        $api = $this->syncApi($jobs);

        $crossShop = $api->dispatch($method, $path, ['jobId' => 92]);
        $unknown = $api->dispatch($method, $path, ['jobId' => 999]);

        self::assertSame(404, $crossShop->getStatusCode());
        self::assertSame($crossShop->getStatusCode(), $unknown->getStatusCode());
        self::assertSame(['code' => 'sync_job_not_found'], $this->json($crossShop));
        self::assertSame($this->json($crossShop), $this->json($unknown));
        self::assertStringNotContainsString('shop', $crossShop->getBody());
    }

    /** @return array<string, array{0: string, 1: string}> */
    public function ownedSyncJobRouteProvider(): array
    {
        return [
            'run' => ['POST', 'sync/jobs/run'],
            'status' => ['GET', 'sync/jobs/status'],
            'retry' => ['POST', 'sync/jobs/retry'],
        ];
    }

    /** @return array<string, mixed> */
    private function json(Response $response): array
    {
        $decoded = json_decode($response->getBody(), true);
        self::assertIsArray($decoded);

        return $decoded;
    }

    private function connections(): GoogleConnectionService
    {
        return new GoogleConnectionService(
            new OAuthStateRepository($this->db),
            $this->credentials,
            new GoogleOAuthClient(new ApiNullGoogleTransport())
        );
    }

    private function redirectUris(): GoogleOAuthRedirectUriResolver
    {
        return new GoogleOAuthRedirectUriResolver(static function (int $shopId): array {
            self::assertSame(1, $shopId);

            return [
                'domain_ssl' => 'thetinylux.com',
                'physical_uri' => '/',
                'virtual_uri' => '',
            ];
        });
    }

    private function syncApi(ApiSyncJobStore $jobs, int $processorContextShopId = 1): LocalGoogleApi
    {
        $context = (object) [
            'shop' => (object) ['id' => $processorContextShopId],
            'language' => (object) ['id' => 2, 'iso_code' => 'en'],
        ];

        return new LocalGoogleApi(
            $this->credentials,
            $this->connections(),
            $this->redirectUris(),
            static function (): int {
                return 1;
            },
            static function (): int {
                return 7;
            },
            null,
            new SyncProcessor(
                $jobs,
                new ApiSyncCatalog(),
                new ApiSyncConnection(),
                new ApiSyncMerchant(),
                new MerchantProductMapper(),
                $context
            )
        );
    }

    private function filterApi(CatalogFilterSettingsInterface $settings): LocalGoogleApi
    {
        return new LocalGoogleApi(
            $this->credentials,
            $this->connections(),
            $this->redirectUris(),
            static function (): int {
                return 1;
            },
            static function (): int {
                return 7;
            },
            null,
            null,
            $settings
        );
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

final class ApiSyncJobStore implements SyncJobStoreInterface
{
    /** @var array<int, int> */
    private $owners = [];

    /** @var int[] */
    public $claimLimits = [];

    /** @var array<int, array{0: int, 1: int}> */
    public $retryCalls = [];

    public function seedJob(int $jobId, int $shopId): void
    {
        $this->owners[$jobId] = $shopId;
    }

    public function createJob(int $shopId, array $snapshot, array $offerKeys): int
    {
        unset($snapshot, $offerKeys);
        $this->owners[91] = $shopId;

        return 91;
    }

    public function findJob(int $shopId, int $jobId): array
    {
        $this->assertOwned($shopId, $jobId);

        return [
            'id_job' => $jobId,
            'id_shop' => $shopId,
            'merchant_account' => '123',
            'data_source' => 'accounts/123/dataSources/456',
            'id_lang' => 2,
            'content_language' => 'en',
            'feed_label' => 'US',
            'full_sync' => true,
        ];
    }

    public function recoverStale(int $shopId, int $jobId, int $ageSeconds = 900): int
    {
        unset($ageSeconds);
        $this->assertOwned($shopId, $jobId);

        return 0;
    }

    public function claimPending(int $shopId, int $jobId, int $limit = 25): array
    {
        $this->assertOwned($shopId, $jobId);
        $this->claimLimits[] = $limit;

        return [];
    }

    public function recordSuccess(int $shopId, int $jobId, int $itemId): void
    {
        unset($itemId);
        $this->assertOwned($shopId, $jobId);
    }

    public function recordSkipped(int $shopId, int $jobId, int $itemId): void
    {
        unset($itemId);
        $this->assertOwned($shopId, $jobId);
    }

    public function recordFailure(
        int $shopId,
        int $jobId,
        int $itemId,
        bool $retryable,
        string $errorCode,
        ?string $errorField,
        string $errorMessage
    ): void {
        unset($itemId, $retryable, $errorCode, $errorField, $errorMessage);
        $this->assertOwned($shopId, $jobId);
    }

    public function retryFailed(int $shopId, int $jobId): int
    {
        $this->assertOwned($shopId, $jobId);
        $this->retryCalls[] = [$shopId, $jobId];

        return $jobId;
    }

    public function recount(int $shopId, int $jobId): array
    {
        $this->assertOwned($shopId, $jobId);

        return [
            'id_job' => $jobId,
            'status' => 'pending',
            'total' => 30,
            'succeeded' => 4,
            'failed' => 3,
            'skipped' => 2,
            'pending' => 21,
            'merchant_account' => '123',
            'data_source' => 'accounts/123/dataSources/456',
            'refresh_token' => 'never-return-this-refresh-token',
        ];
    }

    public function errorSummaries(int $shopId, int $jobId, int $limit = 25): array
    {
        $this->assertOwned($shopId, $jobId);
        $errors = [];
        for ($index = 0; 30 > $index; ++$index) {
            $errors[] = [
                'offer_key' => ($index + 1) . '-0',
                'code' => 0 === $index ? ' merchant validation ' : 'merchant_validation',
                'field' => 0 === $index ? "<b>title</b>\0" : 'title',
                'message' => 0 === $index
                    ? '<script>Operator detail</script> Bearer never-return-this-bearer-token '
                        . '{"refresh_token":"never-return-this-error-secret"} '
                        . str_repeat('x', 600)
                    : 'Product data needs attention.',
                'refresh_token' => 'never-return-this-error-secret',
            ];
        }

        return array_slice($errors, 0, $limit);
    }

    private function assertOwned(int $shopId, int $jobId): void
    {
        if (($this->owners[$jobId] ?? null) !== $shopId) {
            throw new \UnexpectedValueException('Sync job does not exist for this shop.');
        }
    }
}

final class ApiSyncCatalog implements CatalogOfferSourceInterface
{
    public function offerKeys(int $shopId, int $languageId): array
    {
        unset($shopId, $languageId);

        return [];
    }

    public function offer(string $offerKey, int $shopId, int $languageId): ?CatalogProduct
    {
        unset($offerKey, $shopId, $languageId);

        return null;
    }
}

final class ApiSyncConnection implements GoogleConnectionProviderInterface
{
    public function status(int $shopId): array
    {
        unset($shopId);

        return [
            'connected' => true,
            'googleEmail' => 'owner@example.com',
            'merchantAccount' => '123',
            'dataSource' => 'accounts/123/dataSources/456',
        ];
    }

    public function accessToken(int $shopId): string
    {
        unset($shopId);

        return 'never-return-this-access-token';
    }
}

final class ApiSyncMerchant implements MerchantProductGatewayInterface
{
    public function listDataSources(string $accessToken, string $accountId): array
    {
        unset($accessToken, $accountId);

        return [[
            'name' => 'accounts/123/dataSources/456',
            'input' => 'API',
            'primaryProductDataSource' => [
                'contentLanguage' => 'en',
                'feedLabel' => 'US',
            ],
        ]];
    }

    public function insertProductInput(
        string $accessToken,
        string $accountId,
        string $dataSourceName,
        array $payload
    ): array {
        unset($accessToken, $accountId, $dataSourceName);

        return $payload;
    }
}
