<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogOfferSourceInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProduct;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\GoogleConnectionProviderInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\MerchantProductGatewayInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\MerchantProductMapper;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncJobStoreInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncProcessor;

class SyncProcessorTest extends TestCase
{
    public function testRetryingFailedItemsNeverDuplicatesSuccessfulWrites(): void
    {
        self::assertTrue(class_exists(SyncProcessor::class), 'The durable sync processor must exist.');

        $jobs = new ProcessorMemoryJobStore();
        $catalog = new ProcessorMemoryCatalog(['10-0', '20-0']);
        $connections = new ProcessorMemoryConnection();
        $merchant = new ProcessorMemoryMerchant(['10-0' => 1]);
        $processor = new SyncProcessor(
            $jobs,
            $catalog,
            $connections,
            $merchant,
            new MerchantProductMapper(),
            self::context(1, 2)
        );

        $jobId = $processor->create(1, true);
        self::assertSame('partial', $processor->runBatch($jobId)['status']);
        self::assertSame($jobId, $processor->retryFailed($jobId));
        self::assertSame('completed', $processor->runBatch($jobId)['status']);

        self::assertSame(['10-0', '20-0', '10-0'], $merchant->insertedOfferIds);
        self::assertSame(1, count(array_keys($merchant->insertedOfferIds, '20-0', true)));
    }

    public function testRunBatchRecoversStaleRowsAndCapsEveryClaimAtTwentyFive(): void
    {
        $keys = [];
        for ($productId = 1; 30 >= $productId; ++$productId) {
            $keys[] = $productId . '-0';
        }
        $jobs = new ProcessorMemoryJobStore();
        $processor = new SyncProcessor(
            $jobs,
            new ProcessorMemoryCatalog($keys),
            new ProcessorMemoryConnection(),
            new ProcessorMemoryMerchant(),
            new MerchantProductMapper(),
            self::context(1, 2)
        );
        $jobId = $processor->create(1, true);

        $status = $processor->runBatch($jobId, 100);

        self::assertSame([[1, $jobId, 900]], $jobs->recoverCalls);
        self::assertSame([25], $jobs->claimLimits);
        self::assertSame(25, $status['succeeded']);
        self::assertSame(5, $status['pending']);
    }

    public function testProductValidationFailureIsPermanentAndDoesNotAbortTheBatch(): void
    {
        $jobs = new ProcessorMemoryJobStore();
        $catalog = new ProcessorMemoryCatalog(['10-0', '20-0']);
        $catalog->products['10-0'] = new CatalogProduct(
            '10-0',
            '',
            'Invalid product followed by a valid product',
            'https://thetinylux.com/products/10',
            'https://thetinylux.com/img/10.jpg',
            true,
            '10.00',
            'USD',
            null,
            null,
            null
        );
        $merchant = new ProcessorMemoryMerchant();
        $processor = new SyncProcessor(
            $jobs,
            $catalog,
            new ProcessorMemoryConnection(),
            $merchant,
            new MerchantProductMapper(),
            self::context(1, 2)
        );

        $status = $processor->runBatch($processor->create(1, true));

        self::assertSame('partial', $status['status']);
        self::assertSame(1, $status['failed']);
        self::assertSame(1, $status['succeeded']);
        self::assertSame(['20-0'], $merchant->insertedOfferIds);
        self::assertSame('required', $jobs->jobs[70]['items'][1]['error_code']);
        self::assertSame('title', $jobs->jobs[70]['items'][1]['error_field']);
        self::assertSame(
            'Product data needs attention before it can be synchronized.',
            $jobs->jobs[70]['items'][1]['error_message']
        );
    }

    public function testRetryableGoogleFailureStopsAfterThreeAttempts(): void
    {
        $jobs = new ProcessorMemoryJobStore();
        $merchant = new ProcessorMemoryMerchant();
        for ($attempt = 0; 3 > $attempt; ++$attempt) {
            $merchant->queueFailure('10-0', new GoogleApiException(
                'Sensitive upstream body must not be stored.',
                true,
                503,
                'google_retryable'
            ));
        }
        $processor = new SyncProcessor(
            $jobs,
            new ProcessorMemoryCatalog(['10-0']),
            new ProcessorMemoryConnection(),
            $merchant,
            new MerchantProductMapper(),
            self::context(1, 2)
        );
        $jobId = $processor->create(1, true);

        self::assertSame('pending', $processor->runBatch($jobId)['status']);
        self::assertSame('pending', $processor->runBatch($jobId)['status']);
        self::assertSame('failed', $processor->runBatch($jobId)['status']);

        self::assertSame(3, $jobs->jobs[$jobId]['items'][1]['attempts']);
        self::assertSame('google_retryable', $jobs->jobs[$jobId]['items'][1]['error_code']);
        self::assertSame('Google Merchant is temporarily unavailable.', $jobs->jobs[$jobId]['items'][1]['error_message']);
    }

    public function testPermanentGoogleAuthFailureIsTerminalAndSanitized(): void
    {
        $jobs = new ProcessorMemoryJobStore();
        $merchant = new ProcessorMemoryMerchant();
        $merchant->queueFailure('10-0', new GoogleApiException(
            'Authorization: Bearer live-secret raw-body',
            false,
            401,
            'google_reconnect_required'
        ));
        $processor = new SyncProcessor(
            $jobs,
            new ProcessorMemoryCatalog(['10-0']),
            new ProcessorMemoryConnection(),
            $merchant,
            new MerchantProductMapper(),
            self::context(1, 2)
        );

        $status = $processor->runBatch($processor->create(1, true));

        self::assertSame('failed', $status['status']);
        self::assertSame('google_reconnect_required', $jobs->jobs[70]['items'][1]['error_code']);
        self::assertSame('Google Merchant rejected the product request.', $jobs->jobs[70]['items'][1]['error_message']);
        self::assertStringNotContainsString('live-secret', json_encode($jobs->jobs[70]['items'][1]));
    }

    public function testExistingJobUsesItsSnapshotAfterDataSourceFilterAndRoutingChanges(): void
    {
        $jobs = new ProcessorMemoryJobStore();
        $catalog = new ProcessorMemoryCatalog(['10-0', '20-0']);
        $connections = new ProcessorMemoryConnection();
        $merchant = new ProcessorMemoryMerchant();
        $processor = new SyncProcessor(
            $jobs,
            $catalog,
            $connections,
            $merchant,
            new MerchantProductMapper(),
            self::context(1, 2)
        );
        $jobId = $processor->create(1, true);

        $connections->dataSource = 'accounts/123/dataSources/999';
        $merchant->sources = [[
            'id' => '999',
            'name' => 'accounts/123/dataSources/999',
            'displayName' => 'Replacement',
            'input' => 'API',
            'primaryProductDataSource' => ['feedLabel' => 'CA', 'contentLanguage' => 'fr'],
        ]];
        $catalog->offerKeys = ['30-0'];
        $processor->runBatch($jobId);

        self::assertSame(['10-0', '20-0'], $merchant->insertedOfferIds);
        self::assertSame(
            ['accounts/123/dataSources/456', 'accounts/123/dataSources/456'],
            array_column($merchant->insertRequests, 'dataSourceName')
        );
        self::assertSame(['US', 'US'], array_column(array_column($merchant->insertRequests, 'payload'), 'feedLabel'));
        self::assertSame(['en', 'en'], array_column(array_column($merchant->insertRequests, 'payload'), 'contentLanguage'));
    }

    public function testExistingJobRunsFromSnapshotAfterCurrentDataSourceSelectionIsCleared(): void
    {
        $jobs = new ProcessorMemoryJobStore();
        $connections = new ProcessorMemoryConnection();
        $merchant = new ProcessorMemoryMerchant();
        $processor = new SyncProcessor(
            $jobs,
            new ProcessorMemoryCatalog(['10-0']),
            $connections,
            $merchant,
            new MerchantProductMapper(),
            self::context(1, 2)
        );
        $jobId = $processor->create(1, true);
        $connections->dataSource = null;

        $status = $processor->runBatch($jobId);

        self::assertSame('completed', $status['status']);
        self::assertSame(['10-0'], $merchant->insertedOfferIds);
        self::assertSame('123', $merchant->insertRequests[0]['accountId']);
        self::assertSame('accounts/123/dataSources/456', $merchant->insertRequests[0]['dataSourceName']);
    }

    public function testChangedMerchantAccountFailsBeforeClaimOrTransport(): void
    {
        $jobs = new ProcessorMemoryJobStore();
        $connections = new ProcessorMemoryConnection();
        $merchant = new ProcessorMemoryMerchant();
        $processor = new SyncProcessor(
            $jobs,
            new ProcessorMemoryCatalog(['10-0']),
            $connections,
            $merchant,
            new MerchantProductMapper(),
            self::context(1, 2)
        );
        $jobId = $processor->create(1, true);
        $connections->merchantAccount = '999';
        $connections->dataSource = 'accounts/999/dataSources/1';

        try {
            $processor->runBatch($jobId);
            self::fail('A changed Merchant account must stop a snapshotted job.');
        } catch (GoogleApiException $exception) {
            self::assertSame('merchant_account_changed', $exception->safeCode());
            self::assertSame([], $jobs->claimLimits);
            self::assertSame([], $merchant->insertedOfferIds);
        }
    }

    public function testRemovedSnapshottedOfferIsSkippedWithoutRemoteDeletion(): void
    {
        $jobs = new ProcessorMemoryJobStore();
        $catalog = new ProcessorMemoryCatalog(['10-0']);
        $merchant = new ProcessorMemoryMerchant();
        $processor = new SyncProcessor(
            $jobs,
            $catalog,
            new ProcessorMemoryConnection(),
            $merchant,
            new MerchantProductMapper(),
            self::context(1, 2)
        );
        $jobId = $processor->create(1, true);
        unset($catalog->products['10-0']);

        $status = $processor->runBatch($jobId);

        self::assertSame('completed', $status['status']);
        self::assertSame(1, $status['skipped']);
        self::assertSame([], $merchant->insertedOfferIds);
    }

    public function testStatusReturnsOnlyBoundedOperatorFieldsAndSanitizedFailures(): void
    {
        $jobs = new ProcessorMemoryJobStore();
        $merchant = new ProcessorMemoryMerchant();
        $merchant->queueFailure('10-0', new \RuntimeException(
            'Bearer secret-token {"refresh_token":"refresh-secret"} stack trace'
        ));
        $processor = new SyncProcessor(
            $jobs,
            new ProcessorMemoryCatalog(['10-0']),
            new ProcessorMemoryConnection(),
            $merchant,
            new MerchantProductMapper(),
            self::context(1, 2)
        );
        $jobId = $processor->create(1, true);
        $processor->runBatch($jobId);

        $status = $processor->status($jobId);
        $encoded = json_encode($status);

        self::assertSame(
            ['id_job', 'status', 'total', 'succeeded', 'failed', 'skipped', 'pending', 'errors'],
            array_keys($status)
        );
        self::assertSame(
            ['offer_key', 'code', 'field', 'message'],
            array_keys($status['errors'][0])
        );
        self::assertSame('internal_error', $status['errors'][0]['code']);
        self::assertStringNotContainsString('secret-token', $encoded);
        self::assertStringNotContainsString('refresh-secret', $encoded);
        self::assertStringNotContainsString('merchant_account', $encoded);
        self::assertStringNotContainsString('data_source', $encoded);
    }

    public function testRequiredMethodsUseTrustedShopOwnershipChecks(): void
    {
        $jobs = new ProcessorMemoryJobStore();
        $jobId = $jobs->createJob(2, [
            'merchant_id' => '123',
            'data_source' => 'accounts/123/dataSources/456',
            'prestashop_language_id' => 2,
            'content_language' => 'en',
            'feed_label' => 'US',
            'full_sync' => true,
        ], ['10-0']);
        $processor = new SyncProcessor(
            $jobs,
            new ProcessorMemoryCatalog(['10-0']),
            new ProcessorMemoryConnection(),
            new ProcessorMemoryMerchant(),
            new MerchantProductMapper(),
            self::context(1, 2)
        );

        $this->expectException(\UnexpectedValueException::class);
        $processor->status($jobId);
    }

    public function testCreateRejectsIncrementalModeAndInvalidPrimaryDataSourceSettings(): void
    {
        $jobs = new ProcessorMemoryJobStore();
        $merchant = new ProcessorMemoryMerchant();
        $processor = new SyncProcessor(
            $jobs,
            new ProcessorMemoryCatalog(['10-0']),
            new ProcessorMemoryConnection(),
            $merchant,
            new MerchantProductMapper(),
            self::context(1, 2)
        );
        try {
            $processor->create(1, false);
            self::fail('Incremental mode must be rejected explicitly.');
        } catch (\InvalidArgumentException $exception) {
            self::assertSame([], $jobs->jobs);
        }

        $merchant->sources[0]['primaryProductDataSource']['contentLanguage'] = 'en-GB';
        try {
            $processor->create(1, true);
            self::fail('Regional content language must not enter a sync snapshot.');
        } catch (GoogleApiException $exception) {
            self::assertSame('data_source_unavailable', $exception->safeCode());
            self::assertSame([], $jobs->jobs);
        }

        $merchant->sources[0]['primaryProductDataSource']['contentLanguage'] = 'fr';
        try {
            $processor->create(1, true);
            self::fail('The snapshotted language ID must match the data source content language.');
        } catch (GoogleApiException $exception) {
            self::assertSame('content_language_unavailable', $exception->safeCode());
            self::assertSame([], $jobs->jobs);
        }
    }

    private static function context(int $shopId, int $languageId, string $languageIso = 'en'): object
    {
        $context = new \stdClass();
        $context->shop = (object) ['id' => $shopId];
        $context->language = (object) ['id' => $languageId, 'iso_code' => $languageIso];

        return $context;
    }
}

final class ProcessorMemoryJobStore implements SyncJobStoreInterface
{
    /** @var array<int, array<string, mixed>> */
    public $jobs = [];

    /** @var int */
    private $nextJobId = 70;

    /** @var array<int, array{0: int, 1: int, 2: int}> */
    public $recoverCalls = [];

    /** @var int[] */
    public $claimLimits = [];

    public function createJob(int $shopId, array $snapshot, array $offerKeys): int
    {
        $jobId = $this->nextJobId++;
        $items = [];
        foreach ($offerKeys as $index => $offerKey) {
            $items[$index + 1] = [
                'id_item' => $index + 1,
                'id_job' => $jobId,
                'offer_key' => $offerKey,
                'status' => 'pending',
                'attempts' => 0,
                'error_code' => null,
                'error_field' => null,
                'error_message' => null,
            ];
        }
        $this->jobs[$jobId] = [
            'id_job' => $jobId,
            'id_shop' => $shopId,
            'merchant_account' => $snapshot['merchant_id'],
            'data_source' => $snapshot['data_source'],
            'id_lang' => $snapshot['prestashop_language_id'],
            'content_language' => $snapshot['content_language'],
            'feed_label' => $snapshot['feed_label'],
            'full_sync' => $snapshot['full_sync'],
            'items' => $items,
        ];

        return $jobId;
    }

    public function findJob(int $shopId, int $jobId): array
    {
        if (!isset($this->jobs[$jobId]) || $shopId !== $this->jobs[$jobId]['id_shop']) {
            throw new \UnexpectedValueException('Sync job does not exist for this shop.');
        }

        return array_diff_key($this->jobs[$jobId], ['items' => true]);
    }

    public function recoverStale(int $shopId, int $jobId, int $ageSeconds = 900): int
    {
        $this->recoverCalls[] = [$shopId, $jobId, $ageSeconds];

        return 0;
    }

    public function claimPending(int $shopId, int $jobId, int $limit = 25): array
    {
        $this->findJob($shopId, $jobId);
        $this->claimLimits[] = $limit;
        $claimed = [];
        foreach ($this->jobs[$jobId]['items'] as &$item) {
            if ('pending' !== $item['status'] || count($claimed) >= min(25, $limit)) {
                continue;
            }
            $item['status'] = 'running';
            ++$item['attempts'];
            $claimed[] = [
                'id_item' => $item['id_item'],
                'id_job' => $jobId,
                'offer_key' => $item['offer_key'],
                'attempts' => $item['attempts'],
            ];
        }
        unset($item);

        return $claimed;
    }

    public function recordSuccess(int $shopId, int $jobId, int $itemId): void
    {
        $this->findJob($shopId, $jobId);
        $this->jobs[$jobId]['items'][$itemId]['status'] = 'success';
    }

    public function recordSkipped(int $shopId, int $jobId, int $itemId): void
    {
        $this->findJob($shopId, $jobId);
        $this->jobs[$jobId]['items'][$itemId]['status'] = 'skipped';
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
        $this->findJob($shopId, $jobId);
        $item = &$this->jobs[$jobId]['items'][$itemId];
        $item['status'] = $retryable && $item['attempts'] < 3 ? 'pending' : 'failed';
        $item['error_code'] = $errorCode;
        $item['error_field'] = $errorField;
        $item['error_message'] = $errorMessage;
    }

    public function retryFailed(int $shopId, int $jobId): int
    {
        $this->findJob($shopId, $jobId);
        foreach ($this->jobs[$jobId]['items'] as &$item) {
            if ('failed' === $item['status']) {
                $item['status'] = 'pending';
                $item['attempts'] = 0;
            }
        }
        unset($item);

        return $jobId;
    }

    public function recount(int $shopId, int $jobId): array
    {
        $this->findJob($shopId, $jobId);
        $statuses = array_column($this->jobs[$jobId]['items'], 'status');
        $total = count($statuses);
        $succeeded = count(array_keys($statuses, 'success', true));
        $failed = count(array_keys($statuses, 'failed', true));
        $skipped = count(array_keys($statuses, 'skipped', true));
        $pending = $total - $succeeded - $failed - $skipped;
        if (0 < $pending) {
            $status = in_array('running', $statuses, true) ? 'running' : 'pending';
        } elseif (0 === $failed) {
            $status = 'completed';
        } elseif ($failed === $total - $skipped) {
            $status = 'failed';
        } else {
            $status = 'partial';
        }

        return [
            'id_job' => $jobId,
            'status' => $status,
            'total' => $total,
            'succeeded' => $succeeded,
            'failed' => $failed,
            'skipped' => $skipped,
            'pending' => $pending,
        ];
    }

    public function errorSummaries(int $shopId, int $jobId, int $limit = 25): array
    {
        $this->findJob($shopId, $jobId);
        $errors = [];
        foreach ($this->jobs[$jobId]['items'] as $item) {
            if (null !== $item['error_code']) {
                $errors[] = [
                    'offer_key' => $item['offer_key'],
                    'code' => $item['error_code'],
                    'field' => $item['error_field'],
                    'message' => $item['error_message'],
                ];
            }
        }

        return array_slice($errors, 0, $limit);
    }
}

final class ProcessorMemoryCatalog implements CatalogOfferSourceInterface
{
    /** @var string[] */
    public $offerKeys;

    /** @var array<string, CatalogProduct> */
    public $products = [];

    public function __construct(array $offerKeys)
    {
        $this->offerKeys = $offerKeys;
        foreach ($offerKeys as $offerKey) {
            $this->products[$offerKey] = self::product($offerKey);
        }
    }

    public function offerKeys(int $shopId, int $languageId): array
    {
        unset($shopId, $languageId);

        return $this->offerKeys;
    }

    public function offer(string $offerKey, int $shopId, int $languageId): ?CatalogProduct
    {
        unset($shopId, $languageId);
        if (!isset($this->products[$offerKey])) {
            return null;
        }

        return $this->products[$offerKey];
    }

    private static function product(string $offerKey): CatalogProduct
    {
        return new CatalogProduct(
            $offerKey,
            'Tiny Lux Lamp',
            'Hand-finished lamp',
            'https://thetinylux.com/products/' . $offerKey,
            'https://thetinylux.com/img/' . $offerKey . '.jpg',
            true,
            '449.99',
            'USD',
            'Tiny Lux',
            null,
            'TL-' . $offerKey
        );
    }
}

final class ProcessorMemoryConnection implements GoogleConnectionProviderInterface
{
    /** @var bool */
    public $connected = true;

    /** @var string */
    public $merchantAccount = '123';

    /** @var string|null */
    public $dataSource = 'accounts/123/dataSources/456';

    /** @return array<string, mixed> */
    public function status(int $shopId): array
    {
        unset($shopId);

        return [
            'connected' => $this->connected,
            'googleEmail' => 'operator@example.com',
            'merchantAccount' => $this->merchantAccount,
            'dataSource' => $this->dataSource,
        ];
    }

    public function accessToken(int $shopId): string
    {
        unset($shopId);

        return 'fake-access-token';
    }
}

final class ProcessorMemoryMerchant implements MerchantProductGatewayInterface
{
    /** @var array<string, array<int, \Throwable>> */
    private $failures = [];

    /** @var string[] */
    public $insertedOfferIds = [];

    /** @var array<int, array<string, mixed>> */
    public $insertRequests = [];

    /** @var array<int, array<string, mixed>> */
    public $sources = [[
        'id' => '456',
        'name' => 'accounts/123/dataSources/456',
        'displayName' => 'Tiny Lux PrestaShop API',
        'input' => 'API',
        'primaryProductDataSource' => ['feedLabel' => 'US', 'contentLanguage' => 'en'],
    ]];

    public function __construct(array $remainingFailures = [])
    {
        foreach ($remainingFailures as $offerKey => $count) {
            for ($attempt = 0; $count > $attempt; ++$attempt) {
                $this->queueFailure($offerKey, new GoogleApiException(
                    'Permanent fake rejection.',
                    false,
                    400,
                    'merchant_validation'
                ));
            }
        }
    }

    public function queueFailure(string $offerKey, \Throwable $exception): void
    {
        $this->failures[$offerKey][] = $exception;
    }

    public function listDataSources(string $accessToken, string $accountId): array
    {
        unset($accessToken);

        return $this->sources;
    }

    public function insertProductInput(
        string $accessToken,
        string $accountId,
        string $dataSourceName,
        array $payload
    ): array {
        $offerId = $payload['offerId'];
        $this->insertedOfferIds[] = $offerId;
        $this->insertRequests[] = compact('accessToken', 'accountId', 'dataSourceName', 'payload');
        if ([] !== ($this->failures[$offerId] ?? [])) {
            throw array_shift($this->failures[$offerId]);
        }

        return $payload;
    }
}
