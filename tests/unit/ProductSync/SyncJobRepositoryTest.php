<?php

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncJobRepository;

final class SyncJobRepositoryTest extends TestCase
{
    public function testCreateJobRejectsNonPositiveShopIdBeforeWriting(): void
    {
        if (!class_exists(SyncJobRepository::class)) {
            self::fail('The sync job repository has not been implemented yet.');
        }

        $database = new class() {
            /** @var int */
            public $writeCount = 0;

            public function insert(): bool
            {
                ++$this->writeCount;

                return true;
            }
        };
        $repository = new SyncJobRepository($database);

        try {
            $repository->createJob(0, [
                'merchant_id' => '123456',
                'data_source' => 'accounts/123456/dataSources/42',
                'prestashop_language_id' => 1,
                'content_language' => 'en',
                'feed_label' => 'US',
                'full_sync' => true,
            ], ['1-0']);
            self::fail('Expected a non-positive shop ID to be rejected.');
        } catch (\InvalidArgumentException $exception) {
            self::assertSame(0, $database->writeCount);
        }
    }

    public function testCreateJobPersistsShopSnapshotAndDeterministicUniqueOffers(): void
    {
        $database = new SyncJobDatabaseFake();
        $repository = new SyncJobRepository($database);

        $jobId = $repository->createJob(7, [
            'merchant_id' => '123456',
            'data_source' => 'accounts/123456/dataSources/42',
            'prestashop_language_id' => 3,
            'content_language' => 'en',
            'feed_label' => 'GB_MAIN',
            'full_sync' => true,
        ], ['20-0', '3-2', '3-0', '20-0']);

        self::assertSame(41, $jobId);
        self::assertSame(['START TRANSACTION', 'COMMIT'], $database->transactionStatements);
        self::assertSame([
            'id_shop' => 7,
            'merchant_account' => '123456',
            'data_source' => 'accounts/123456/dataSources/42',
            'id_lang' => 3,
            'content_language' => 'en',
            'feed_label' => 'GB_MAIN',
            'full_sync' => 1,
            'status' => 'pending',
            'total' => 3,
            'succeeded' => 0,
            'failed' => 0,
            'skipped' => 0,
            'created_at' => $database->jobRows[0]['created_at'],
            'started_at' => null,
            'finished_at' => null,
        ], $database->jobRows[0]);
        self::assertSame(['3-0', '3-2', '20-0'], array_column($database->itemRows, 'offer_key'));
        self::assertSame([41, 41, 41], array_column($database->itemRows, 'id_job'));
        self::assertSame(['pending', 'pending', 'pending'], array_column($database->itemRows, 'status'));
    }

    public function testClaimPendingAtomicallyClaimsAtMostTwentyFiveAndIncrementsAttemptsOnce(): void
    {
        if (!method_exists(SyncJobRepository::class, 'claimPending')) {
            self::fail('Pending item claiming has not been implemented yet.');
        }

        $database = new SyncJobDatabaseFake();
        $database->seedJob(41, 7);
        for ($itemId = 1; 30 >= $itemId; ++$itemId) {
            $database->seedItem($itemId, 41, sprintf('%d-0', $itemId));
        }
        $firstWorker = new SyncJobRepository($database, '');
        $secondWorker = new SyncJobRepository($database, '');

        $firstClaim = $firstWorker->claimPending(7, 41, 100);
        $secondClaim = $secondWorker->claimPending(7, 41, 25);
        $thirdClaim = $firstWorker->claimPending(7, 41, 25);

        self::assertCount(25, $firstClaim);
        self::assertSame(range(1, 25), array_column($firstClaim, 'id_item'));
        self::assertSame(range(26, 30), array_column($secondClaim, 'id_item'));
        self::assertSame([], $thirdClaim);
        self::assertSame(array_fill(0, 30, 1), array_column($database->itemRows, 'attempts'));
        self::assertSame(array_fill(0, 30, 'running'), array_column($database->itemRows, 'status'));
        self::assertSame('running', $database->jobRows[0]['status']);
        self::assertNotNull($database->jobRows[0]['started_at']);
    }

    public function testRetryableFailureUsesExponentialEligibilityAndThirdFailureIsTerminal(): void
    {
        if (!method_exists(SyncJobRepository::class, 'recordFailure')) {
            self::fail('Sync item failure recording has not been implemented yet.');
        }

        $database = new SyncJobDatabaseFake();
        $database->seedJob(41, 7);
        $database->seedItem(9, 41, '9-0');
        $repository = new SyncJobRepository($database, '');

        self::assertCount(1, $repository->claimPending(7, 41));
        $repository->recordFailure(7, 41, 9, true, 'quota', null, 'Quota exhausted');
        self::assertSame('pending', $database->itemRows[0]['status']);
        self::assertSame(60, $database->itemRows[0]['retry_delay_seconds']);

        $database->advanceSeconds(60);
        self::assertCount(1, $repository->claimPending(7, 41));
        $repository->recordFailure(7, 41, 9, true, 'quota', null, 'Quota exhausted');
        self::assertSame('pending', $database->itemRows[0]['status']);
        self::assertSame(120, $database->itemRows[0]['retry_delay_seconds']);

        $database->advanceSeconds(120);
        self::assertCount(1, $repository->claimPending(7, 41));
        $repository->recordFailure(7, 41, 9, true, 'quota', null, 'Quota exhausted');
        self::assertSame('failed', $database->itemRows[0]['status']);
        self::assertNull($database->itemRows[0]['next_attempt_at']);
        self::assertSame(3, $database->itemRows[0]['attempts']);
        self::assertSame([], $repository->claimPending(7, 41));
    }

    public function testPermanentFailureIsTerminalAndPersistsOnlyBoundedSanitizedErrors(): void
    {
        $database = new SyncJobDatabaseFake();
        $database->seedJob(41, 7);
        $database->seedItem(9, 41, '9-0');
        $repository = new SyncJobRepository($database, '');
        $repository->claimPending(7, 41);

        $repository->recordFailure(
            7,
            41,
            9,
            false,
            " invalid code\n" . str_repeat('x', 80),
            '<b>product.title</b>' . str_repeat('f', 200),
            "Merchant rejected payload.\nAuthorization: Bearer live-token-secret "
                . '{"refresh_token":"refresh-secret"} <script>unsafe()</script> '
                . str_repeat('m', 600)
        );

        $item = $database->itemRows[0];
        self::assertSame('failed', $item['status']);
        self::assertNull($item['next_attempt_at']);
        self::assertLessThanOrEqual(64, strlen($item['error_code']));
        self::assertSame(1, preg_match('/^[A-Za-z0-9_.:-]+$/D', $item['error_code']));
        self::assertLessThanOrEqual(191, strlen($item['error_field']));
        self::assertLessThanOrEqual(500, strlen($item['error_message']));
        self::assertStringNotContainsString('live-token-secret', $item['error_message']);
        self::assertStringNotContainsString('refresh-secret', $item['error_message']);
        self::assertStringNotContainsString('<script>', $item['error_message']);
        self::assertStringNotContainsString("\n", $item['error_message']);
        self::assertSame([], $repository->claimPending(7, 41));
    }

    public function testRetryFailedResetsOnlyFailuresInTheOwnedJobAndReturnsSameId(): void
    {
        if (!method_exists(SyncJobRepository::class, 'retryFailed')) {
            self::fail('Explicit failed-item retry has not been implemented yet.');
        }

        $database = new SyncJobDatabaseFake();
        $database->seedJob(41, 7);
        $database->seedJob(42, 7);
        $database->seedItem(1, 41, '1-0');
        $database->seedItem(2, 41, '2-0');
        $database->seedItem(3, 42, '3-0');
        $database->itemRows[0]['status'] = 'success';
        foreach ([1, 2] as $index) {
            $database->itemRows[$index]['status'] = 'failed';
            $database->itemRows[$index]['attempts'] = 3;
            $database->itemRows[$index]['error_code'] = 'quota';
            $database->itemRows[$index]['error_field'] = 'title';
            $database->itemRows[$index]['error_message'] = 'Old failure';
            $database->itemRows[$index]['next_attempt_at'] = null;
        }
        $repository = new SyncJobRepository($database, '');

        self::assertSame(41, $repository->retryFailed(7, 41));
        self::assertSame('success', $database->itemRows[0]['status']);
        self::assertSame('pending', $database->itemRows[1]['status']);
        self::assertSame(0, $database->itemRows[1]['attempts']);
        self::assertNull($database->itemRows[1]['error_code']);
        self::assertNull($database->itemRows[1]['error_field']);
        self::assertNull($database->itemRows[1]['error_message']);
        self::assertNotNull($database->itemRows[1]['next_attempt_at']);
        self::assertSame('failed', $database->itemRows[2]['status']);
        self::assertSame(3, $database->itemRows[2]['attempts']);
        self::assertSame('pending', $database->jobRows[0]['status']);
        self::assertSame('pending', $database->jobRows[1]['status']);
    }

    public function testRecountDerivesAuthoritativeCountsAndLifecycleStatusFromItems(): void
    {
        if (!method_exists(SyncJobRepository::class, 'recount')) {
            self::fail('Authoritative job recounting has not been implemented yet.');
        }

        $database = new SyncJobDatabaseFake();
        $database->seedJob(41, 7);
        foreach (['success', 'failed', 'skipped', 'pending', 'running'] as $index => $status) {
            $database->seedItem($index + 1, 41, sprintf('%d-0', $index + 1));
            $database->itemRows[$index]['status'] = $status;
        }
        $repository = new SyncJobRepository($database, '');

        self::assertSame([
            'id_job' => 41,
            'status' => 'running',
            'total' => 5,
            'succeeded' => 1,
            'failed' => 1,
            'skipped' => 1,
            'pending' => 2,
        ], $repository->recount(7, 41));

        $database->itemRows[4]['status'] = 'pending';
        self::assertSame('pending', $repository->recount(7, 41)['status']);

        $database->itemRows[3]['status'] = 'success';
        $database->itemRows[4]['status'] = 'success';
        self::assertSame('partial', $repository->recount(7, 41)['status']);

        $database->itemRows[1]['status'] = 'success';
        self::assertSame('completed', $repository->recount(7, 41)['status']);

        foreach ([0, 1, 3, 4] as $index) {
            $database->itemRows[$index]['status'] = 'failed';
        }
        self::assertSame('failed', $repository->recount(7, 41)['status']);
    }

    public function testRecoverStaleReturnsOnlyRunningRowsOlderThanDeterministicThresholdToPending(): void
    {
        if (!method_exists(SyncJobRepository::class, 'recoverStale')) {
            self::fail('Stale running-item recovery has not been implemented yet.');
        }

        $database = new SyncJobDatabaseFake();
        $database->seedJob(41, 7);
        foreach ([1, 2, 3] as $itemId) {
            $database->seedItem($itemId, 41, sprintf('%d-0', $itemId));
        }
        $database->setItemStateAndAge(0, 'running', 901);
        $database->setItemStateAndAge(1, 'running', 900);
        $database->setItemStateAndAge(2, 'pending', 5000);
        $repository = new SyncJobRepository($database, '');

        self::assertSame(1, $repository->recoverStale(7, 41, 900));
        self::assertSame('pending', $database->itemRows[0]['status']);
        self::assertNull($database->itemRows[0]['claim_token']);
        self::assertSame('running', $database->itemRows[1]['status']);
        self::assertSame('pending', $database->itemRows[2]['status']);
    }

    public function testFindOldestActiveJobIsShopScopedAndOrdersByCreationThenId(): void
    {
        if (!method_exists(SyncJobRepository::class, 'findOldestActiveJob')) {
            self::fail('Oldest active job lookup has not been implemented yet.');
        }

        $database = new SyncJobDatabaseFake();
        $database->seedJob(43, 7, 'pending', 200);
        $database->seedJob(42, 7, 'running', 100);
        $database->seedJob(41, 7, 'completed', 50);
        $database->seedJob(11, 8, 'pending', 10);
        $database->seedJob(40, 7, 'pending', 100);
        $repository = new SyncJobRepository($database, '');

        self::assertSame(40, $repository->findOldestActiveJob(7)['id_job']);
        self::assertSame(11, $repository->findOldestActiveJob(8)['id_job']);
        self::assertNull($repository->findOldestActiveJob(9));
    }

    public function testFindJobReturnsTheOwnedDurableRoutingSnapshot(): void
    {
        self::assertTrue(method_exists(SyncJobRepository::class, 'findJob'), 'Owned job lookup must be implemented.');
        $database = new SyncJobDatabaseFake();
        $database->seedJob(41, 7, 'running');
        $repository = new SyncJobRepository($database, '');

        self::assertSame([
            'id_job' => 41,
            'id_shop' => 7,
            'merchant_account' => '123456',
            'data_source' => 'accounts/123456/dataSources/42',
            'id_lang' => 1,
            'content_language' => 'en',
            'feed_label' => 'US',
            'full_sync' => true,
            'status' => 'running',
            'total' => 0,
            'succeeded' => 0,
            'failed' => 0,
            'skipped' => 0,
            'created_at' => '2026-01-01 00:00:00',
            'started_at' => null,
            'finished_at' => null,
        ], $repository->findJob(7, 41));

        $this->expectException(\UnexpectedValueException::class);
        $repository->findJob(8, 41);
    }

    public function testErrorSummariesAreShopOwnedBoundedAndExposeOnlySafeOperatorFields(): void
    {
        self::assertTrue(
            method_exists(SyncJobRepository::class, 'errorSummaries'),
            'Bounded item error summaries must be implemented.'
        );
        $database = new SyncJobDatabaseFake();
        $database->seedJob(41, 7, 'failed');
        for ($itemId = 1; 30 >= $itemId; ++$itemId) {
            $database->seedItem($itemId, 41, $itemId . '-0');
            $database->itemRows[$itemId - 1]['status'] = 'failed';
            $database->itemRows[$itemId - 1]['error_code'] = 'invalid_product';
            $database->itemRows[$itemId - 1]['error_field'] = 'title';
            $database->itemRows[$itemId - 1]['error_message'] = 'Product data needs attention.';
        }
        $repository = new SyncJobRepository($database, '');

        $summaries = $repository->errorSummaries(7, 41, 100);

        self::assertCount(25, $summaries);
        self::assertSame(range(1, 25), array_map('intval', array_column($summaries, 'offer_key')));
        self::assertSame(
            ['offer_key', 'code', 'field', 'message'],
            array_keys($summaries[0])
        );
        self::assertSame('invalid_product', $summaries[0]['code']);
        self::assertSame('title', $summaries[0]['field']);
        self::assertSame('Product data needs attention.', $summaries[0]['message']);
    }

    /**
     * @dataProvider invalidCreateInputProvider
     *
     * @param array<string, mixed> $snapshot
     * @param mixed[] $offerKeys
     */
    public function testCreateJobRejectsInvalidSnapshotAndOfferInputBeforeWriting(array $snapshot, array $offerKeys): void
    {
        $database = new SyncJobDatabaseFake();
        $repository = new SyncJobRepository($database, '');

        try {
            $repository->createJob(7, $snapshot, $offerKeys);
            self::fail('Expected invalid durable job input to be rejected.');
        } catch (\InvalidArgumentException $exception) {
            self::assertSame([], $database->jobRows);
            self::assertSame([], $database->itemRows);
            self::assertSame([], $database->transactionStatements);
        }
    }

    public function testTerminalOutcomeMethodsCompleteOnlyClaimedItems(): void
    {
        if (!method_exists(SyncJobRepository::class, 'recordSuccess')
            || !method_exists(SyncJobRepository::class, 'recordSkipped')) {
            self::fail('Terminal sync item outcomes have not been implemented yet.');
        }

        $database = new SyncJobDatabaseFake();
        $database->seedJob(41, 7);
        $database->seedItem(1, 41, '1-0');
        $database->seedItem(2, 41, '2-0');
        $repository = new SyncJobRepository($database, '');
        $repository->claimPending(7, 41, 2);

        $repository->recordSuccess(7, 41, 1);
        $repository->recordSkipped(7, 41, 2);

        self::assertSame('success', $database->itemRows[0]['status']);
        self::assertSame('skipped', $database->itemRows[1]['status']);
        self::assertNull($database->itemRows[0]['claim_token']);
        self::assertNull($database->itemRows[1]['claim_token']);
        self::assertNull($database->itemRows[0]['next_attempt_at']);
        self::assertNull($database->itemRows[1]['next_attempt_at']);
    }

    public function testCreateJobWithNoOffersIsImmediatelyCompleted(): void
    {
        $database = new SyncJobDatabaseFake();
        $repository = new SyncJobRepository($database, '');

        $repository->createJob(7, [
            'merchant_id' => '123456',
            'data_source' => 'accounts/123456/dataSources/42',
            'prestashop_language_id' => 1,
            'content_language' => 'en',
            'feed_label' => 'US',
            'full_sync' => true,
        ], []);

        self::assertSame('completed', $database->jobRows[0]['status']);
        self::assertNotNull($database->jobRows[0]['finished_at']);
        self::assertSame([], $database->itemRows);
    }

    /**
     * @return array<string, array{0: array<string, mixed>, 1: mixed[]}>
     */
    public function invalidCreateInputProvider(): array
    {
        $valid = [
            'merchant_id' => '123456',
            'data_source' => 'accounts/123456/dataSources/42',
            'prestashop_language_id' => 1,
            'content_language' => 'en',
            'feed_label' => 'US',
            'full_sync' => true,
        ];

        return [
            'missing snapshot field' => [array_diff_key($valid, ['feed_label' => true]), ['1-0']],
            'unknown secret field' => [$valid + ['refresh_token' => 'must-not-be-stored'], ['1-0']],
            'invalid merchant account' => [array_replace($valid, ['merchant_id' => 'account-1']), ['1-0']],
            'overlong merchant account' => [array_replace($valid, ['merchant_id' => str_repeat('1', 21)]), ['1-0']],
            'mismatched data source account' => [array_replace($valid, ['data_source' => 'accounts/999/dataSources/42']), ['1-0']],
            'overlong data source' => [array_replace($valid, ['data_source' => 'accounts/123456/dataSources/' . str_repeat('1', 102)]), ['1-0']],
            'invalid PrestaShop language ID' => [array_replace($valid, ['prestashop_language_id' => 0]), ['1-0']],
            'invalid content language' => [array_replace($valid, ['content_language' => 'EN_us']), ['1-0']],
            'three-letter content language' => [array_replace($valid, ['content_language' => 'eng']), ['1-0']],
            'regional content language' => [array_replace($valid, ['content_language' => 'en-GB']), ['1-0']],
            'overlong content language' => [array_replace($valid, ['content_language' => 'en-' . str_repeat('a', 33)]), ['1-0']],
            'invalid feed label' => [array_replace($valid, ['feed_label' => 'us']), ['1-0']],
            'overlong feed label' => [array_replace($valid, ['feed_label' => str_repeat('U', 21)]), ['1-0']],
            'non-boolean full sync' => [array_replace($valid, ['full_sync' => 1]), ['1-0']],
            'zero product ID' => [$valid, ['0-0']],
            'negative attribute ID' => [$valid, ['1--1']],
            'noncanonical offer key' => [$valid, ['01-0']],
            'oversized product ID' => [$valid, ['4294967296-0']],
            'non-string offer key' => [$valid, [10]],
        ];
    }
}

final class SyncJobDatabaseFake
{
    /** @var array<int, array<string, mixed>> */
    public $jobRows = [];

    /** @var array<int, array<string, mixed>> */
    public $itemRows = [];

    /** @var string[] */
    public $transactionStatements = [];

    /** @var int */
    private $insertId = 41;

    /** @var int */
    private $clock = 1000;

    /** @var int */
    private $affectedRows = 0;

    /**
     * @param array<string, mixed> $row
     */
    public function insert(string $table, array $row): bool
    {
        if ('psxmarketingwithgoogle_sync_job' === $table) {
            $this->jobRows[] = $row;

            return true;
        }

        if ('psxmarketingwithgoogle_sync_item' === $table) {
            $this->itemRows[] = $row;

            return true;
        }

        return false;
    }

    public function Insert_ID(): int
    {
        return $this->insertId;
    }

    public function execute(string $statement): bool
    {
        $this->transactionStatements[] = $statement;
        $this->affectedRows = 0;

        if (false !== strpos($statement, 'attempts = attempts + 1')) {
            preg_match("/claim_token = '([a-f0-9]{32})'/", $statement, $tokenMatch);
            preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);
            preg_match('/LIMIT ([0-9]+)/', $statement, $limitMatch);
            $remaining = (int) $limitMatch[1];
            foreach ($this->itemRows as &$row) {
                if (0 === $remaining) {
                    break;
                }
                if ((int) $jobMatch[1] !== $row['id_job'] || 'pending' !== $row['status'] || $row['eligible_at'] > $this->clock) {
                    continue;
                }

                $row['status'] = 'running';
                ++$row['attempts'];
                $row['claim_token'] = $tokenMatch[1];
                ++$this->affectedRows;
                --$remaining;
            }
            unset($row);
        } elseif (false !== strpos($statement, "SET status = 'success'")
            || false !== strpos($statement, "SET status = 'skipped'")) {
            preg_match("/SET status = '(success|skipped)'/", $statement, $statusMatch);
            preg_match('/WHERE id_item = ([0-9]+)/', $statement, $itemMatch);
            preg_match('/AND id_job = ([0-9]+)/', $statement, $jobMatch);
            foreach ($this->itemRows as &$row) {
                if ((int) $itemMatch[1] !== $row['id_item']
                    || (int) $jobMatch[1] !== $row['id_job']
                    || 'running' !== $row['status']) {
                    continue;
                }

                $row['status'] = $statusMatch[1];
                $row['claim_token'] = null;
                $row['next_attempt_at'] = null;
                $row['error_code'] = null;
                $row['error_field'] = null;
                $row['error_message'] = null;
                ++$this->affectedRows;
            }
            unset($row);
        } elseif (false !== strpos($statement, 'updated_at < TIMESTAMPADD(SECOND')) {
            preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);
            preg_match('/TIMESTAMPADD\(SECOND, -([0-9]+)/', $statement, $ageMatch);
            foreach ($this->itemRows as &$row) {
                if ((int) $jobMatch[1] !== $row['id_job']
                    || 'running' !== $row['status']
                    || $row['updated_epoch'] >= $this->clock - (int) $ageMatch[1]) {
                    continue;
                }

                $row['status'] = 'pending';
                $row['claim_token'] = null;
                $row['eligible_at'] = $this->clock;
                $row['next_attempt_at'] = 'eligible-now';
                $row['updated_epoch'] = $this->clock;
                ++$this->affectedRows;
            }
            unset($row);
        } elseif (false !== strpos($statement, "SET status = 'pending', attempts = 0")) {
            preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);
            foreach ($this->itemRows as &$row) {
                if ((int) $jobMatch[1] !== $row['id_job'] || 'failed' !== $row['status']) {
                    continue;
                }

                $row['status'] = 'pending';
                $row['attempts'] = 0;
                $row['next_attempt_at'] = 'eligible-now';
                $row['eligible_at'] = $this->clock;
                $row['claim_token'] = null;
                $row['error_code'] = null;
                $row['error_field'] = null;
                $row['error_message'] = null;
                ++$this->affectedRows;
            }
            unset($row);
        } elseif (false !== strpos($statement, 'UPDATE `psxmarketingwithgoogle_sync_job`')
            && false !== strpos($statement, "SET status = 'pending'")) {
            preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);
            preg_match('/AND id_shop = ([0-9]+)/', $statement, $shopMatch);
            foreach ($this->jobRows as &$row) {
                if ((int) $jobMatch[1] === ($row['id_job'] ?? null)
                    && (int) $shopMatch[1] === $row['id_shop']) {
                    $row['status'] = 'pending';
                    $row['finished_at'] = null;
                    ++$this->affectedRows;
                }
            }
            unset($row);
        } elseif (false !== strpos($statement, 'UPDATE `psxmarketingwithgoogle_sync_job`')
            && false !== strpos($statement, "SET status = 'running'")) {
            preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);
            preg_match('/AND id_shop = ([0-9]+)/', $statement, $shopMatch);
            foreach ($this->jobRows as &$row) {
                if ((int) $jobMatch[1] !== ($row['id_job'] ?? null) || (int) $shopMatch[1] !== $row['id_shop']) {
                    continue;
                }

                $row['status'] = 'running';
                $row['started_at'] = 'started-now';
                $row['finished_at'] = null;
                ++$this->affectedRows;
            }
            unset($row);
        } elseif (false !== strpos($statement, 'UPDATE `psxmarketingwithgoogle_sync_job`')
            && false !== strpos($statement, 'SET total =')) {
            preg_match('/SET total = ([0-9]+)/', $statement, $totalMatch);
            preg_match('/succeeded = ([0-9]+)/', $statement, $succeededMatch);
            preg_match('/failed = ([0-9]+)/', $statement, $failedMatch);
            preg_match('/skipped = ([0-9]+)/', $statement, $skippedMatch);
            preg_match("/status = '([^']+)'/", $statement, $statusMatch);
            preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);
            preg_match('/AND id_shop = ([0-9]+)/', $statement, $shopMatch);
            foreach ($this->jobRows as &$row) {
                if ((int) $jobMatch[1] !== ($row['id_job'] ?? null) || (int) $shopMatch[1] !== $row['id_shop']) {
                    continue;
                }

                $row['total'] = (int) $totalMatch[1];
                $row['succeeded'] = (int) $succeededMatch[1];
                $row['failed'] = (int) $failedMatch[1];
                $row['skipped'] = (int) $skippedMatch[1];
                $row['status'] = $statusMatch[1];
                ++$this->affectedRows;
            }
            unset($row);
        } elseif (false !== strpos($statement, 'status = CASE WHEN')) {
            preg_match('/WHERE id_item = ([0-9]+)/', $statement, $itemMatch);
            preg_match('/AND id_job = ([0-9]+)/', $statement, $jobMatch);
            preg_match("/error_code = '((?:\\\\.|[^'])*)'/", $statement, $codeMatch);
            preg_match("/error_field = (NULL|'((?:\\\\.|[^'])*)')/", $statement, $fieldMatch);
            preg_match("/error_message = '((?:\\\\.|[^'])*)'/", $statement, $messageMatch);
            $retryable = false !== strpos($statement, 'CASE WHEN attempts < 3');
            foreach ($this->itemRows as &$row) {
                if ((int) $itemMatch[1] !== $row['id_item'] || (int) $jobMatch[1] !== $row['id_job'] || 'running' !== $row['status']) {
                    continue;
                }

                if ($retryable && 3 > $row['attempts']) {
                    $row['status'] = 'pending';
                    $row['retry_delay_seconds'] = min(3600, 60 * (2 ** ($row['attempts'] - 1)));
                    $row['eligible_at'] = $this->clock + $row['retry_delay_seconds'];
                    $row['next_attempt_at'] = 'scheduled';
                } else {
                    $row['status'] = 'failed';
                    $row['next_attempt_at'] = null;
                }
                $row['claim_token'] = null;
                $row['error_code'] = stripslashes($codeMatch[1]);
                $row['error_field'] = 'NULL' === $fieldMatch[1] ? null : stripslashes($fieldMatch[2]);
                $row['error_message'] = stripslashes($messageMatch[1]);
                ++$this->affectedRows;
            }
            unset($row);
        }

        return true;
    }

    /**
     * @return int|false
     */
    public function getValue(string $statement)
    {
        preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);
        foreach ($this->jobRows as $row) {
            if ((int) $jobMatch[1] === ($row['id_job'] ?? null)) {
                return $row['id_shop'];
            }
        }

        return false;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function executeS(string $statement): array
    {
        if (false !== strpos($statement, 'error_code IS NOT NULL')) {
            preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);
            preg_match('/LIMIT ([0-9]+)/', $statement, $limitMatch);
            $rows = array_values(array_filter($this->itemRows, static function (array $row) use ($jobMatch): bool {
                return (int) $jobMatch[1] === $row['id_job'] && null !== $row['error_code'];
            }));
            usort($rows, static function (array $left, array $right): int {
                return $left['id_item'] <=> $right['id_item'];
            });

            return array_map(static function (array $row): array {
                return array_intersect_key($row, array_flip([
                    'offer_key', 'error_code', 'error_field', 'error_message',
                ]));
            }, array_slice($rows, 0, (int) $limitMatch[1]));
        }

        preg_match("/claim_token = '([a-f0-9]{32})'/", $statement, $tokenMatch);
        preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);

        return array_values(array_filter($this->itemRows, static function (array $row) use ($jobMatch, $tokenMatch): bool {
            return (int) $jobMatch[1] === $row['id_job'] && $tokenMatch[1] === $row['claim_token'];
        }));
    }

    /**
     * @return array<string, int>|false
     */
    public function getRow(string $statement)
    {
        if (false !== strpos($statement, 'ORDER BY created_at ASC')) {
            preg_match('/WHERE id_shop = ([0-9]+)/', $statement, $shopMatch);
            $matches = array_values(array_filter($this->jobRows, static function (array $row) use ($shopMatch): bool {
                return (int) $shopMatch[1] === $row['id_shop'] && in_array($row['status'], ['pending', 'running'], true);
            }));
            usort($matches, static function (array $left, array $right): int {
                return [$left['created_order'], $left['id_job']] <=> [$right['created_order'], $right['id_job']];
            });

            return $matches[0] ?? false;
        }

        if (false !== strpos($statement, 'WHERE id_job =')
            && false === strpos($statement, 'COUNT(*) AS total')) {
            preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);
            preg_match('/AND id_shop = ([0-9]+)/', $statement, $shopMatch);
            foreach ($this->jobRows as $row) {
                if ((int) $jobMatch[1] === ($row['id_job'] ?? null)
                    && (int) $shopMatch[1] === $row['id_shop']) {
                    $selected = [];
                    foreach ([
                        'id_job', 'id_shop', 'merchant_account', 'data_source', 'id_lang', 'content_language',
                        'feed_label', 'full_sync', 'status', 'total', 'succeeded', 'failed', 'skipped',
                        'created_at', 'started_at', 'finished_at',
                    ] as $field) {
                        $selected[$field] = $row[$field];
                    }

                    return $selected;
                }
            }

            return false;
        }

        if (false === strpos($statement, 'COUNT(*) AS total')) {
            return false;
        }

        preg_match('/WHERE id_job = ([0-9]+)/', $statement, $jobMatch);
        $counts = [
            'total' => 0,
            'succeeded' => 0,
            'failed' => 0,
            'skipped' => 0,
            'running' => 0,
        ];
        foreach ($this->itemRows as $row) {
            if ((int) $jobMatch[1] !== $row['id_job']) {
                continue;
            }

            ++$counts['total'];
            $countField = 'success' === $row['status'] ? 'succeeded' : $row['status'];
            if (array_key_exists($countField, $counts)) {
                ++$counts[$countField];
            }
        }

        return $counts;
    }

    public function getNumberError(): int
    {
        return 0;
    }

    public function getMsgError(): string
    {
        return '';
    }

    public function Affected_Rows(): int
    {
        return $this->affectedRows;
    }

    public function escape(string $value): string
    {
        return addslashes($value);
    }

    public function seedJob(int $jobId, int $shopId, string $status = 'pending', int $createdOrder = 0): void
    {
        $this->jobRows[] = [
            'id_job' => $jobId,
            'id_shop' => $shopId,
            'status' => $status,
            'created_order' => $createdOrder,
            'merchant_account' => '123456',
            'data_source' => 'accounts/123456/dataSources/42',
            'id_lang' => 1,
            'content_language' => 'en',
            'feed_label' => 'US',
            'full_sync' => 1,
            'total' => 0,
            'succeeded' => 0,
            'failed' => 0,
            'skipped' => 0,
            'created_at' => '2026-01-01 00:00:00',
            'started_at' => null,
            'finished_at' => null,
        ];
    }

    public function seedItem(int $itemId, int $jobId, string $offerKey): void
    {
        $this->itemRows[] = [
            'id_item' => $itemId,
            'id_job' => $jobId,
            'offer_key' => $offerKey,
            'status' => 'pending',
            'attempts' => 0,
            'claim_token' => null,
            'next_attempt_at' => '2000-01-01 00:00:00',
            'error_code' => null,
            'error_field' => null,
            'error_message' => null,
            'updated_at' => '2000-01-01 00:00:00',
            'updated_epoch' => $this->clock,
            'eligible_at' => $this->clock,
        ];
    }

    public function advanceSeconds(int $seconds): void
    {
        $this->clock += $seconds;
    }

    public function setItemStateAndAge(int $index, string $status, int $ageSeconds): void
    {
        $this->itemRows[$index]['status'] = $status;
        $this->itemRows[$index]['updated_epoch'] = $this->clock - $ageSeconds;
        $this->itemRows[$index]['claim_token'] = 'worker-token';
    }
}
