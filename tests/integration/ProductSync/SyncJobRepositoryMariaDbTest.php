<?php

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Integration\ProductSync;

use Db;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncJobRepository;

final class SyncJobRepositoryMariaDbTest extends TestCase
{
    /** @var Db */
    private $db;

    /** @var string */
    private $schema;

    protected function setUp(): void
    {
        $schema = getenv('TASK7_DISPOSABLE_SCHEMA');
        if (!is_string($schema) || 1 !== preg_match('/^psxmg_task7_fix_[a-z0-9_]+$/D', $schema)) {
            self::markTestSkipped('A validated disposable Task 7 schema is required.');
        }

        $this->schema = $schema;
        $this->db = Db::getInstance();
        self::assertTrue($this->db->execute('USE `' . $schema . '`'));
    }

    public function testUpgradeTwiceTerminalizesInvalidLegacySnapshotAndLeavesLaterValidJobSelectable(): void
    {
        $jobTable = _DB_PREFIX_ . Config::SYNC_JOB_TABLE;
        $itemTable = _DB_PREFIX_ . Config::SYNC_ITEM_TABLE;
        foreach ([$itemTable, $jobTable, _DB_PREFIX_ . Config::OAUTH_STATE_TABLE, _DB_PREFIX_ . Config::CONNECTION_TABLE] as $table) {
            self::assertTrue($this->db->execute('DROP TABLE IF EXISTS `' . $table . '`'));
        }

        self::assertTrue($this->db->execute(
            'CREATE TABLE `' . $jobTable . '` ('
            . ' `id_job` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,'
            . ' `id_shop` INT UNSIGNED NOT NULL,'
            . " `status` ENUM('pending','running','completed','partial','failed') NOT NULL,"
            . ' `total` INT UNSIGNED NOT NULL DEFAULT 0,'
            . ' `succeeded` INT UNSIGNED NOT NULL DEFAULT 0,'
            . ' `failed` INT UNSIGNED NOT NULL DEFAULT 0,'
            . ' `skipped` INT UNSIGNED NOT NULL DEFAULT 0,'
            . ' `created_at` DATETIME NOT NULL,'
            . ' `started_at` DATETIME NULL,'
            . ' `finished_at` DATETIME NULL,'
            . ' PRIMARY KEY (`id_job`)'
            . ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
        ));
        self::assertTrue($this->db->execute(
            'CREATE TABLE `' . $itemTable . '` ('
            . ' `id_item` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,'
            . ' `id_job` BIGINT UNSIGNED NOT NULL,'
            . ' `offer_key` VARCHAR(191) NOT NULL,'
            . " `status` ENUM('pending','running','success','failed','skipped') NOT NULL,"
            . ' `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,'
            . ' `error_code` VARCHAR(64) NULL,'
            . ' `error_field` VARCHAR(191) NULL,'
            . ' `error_message` VARCHAR(500) NULL,'
            . ' `updated_at` DATETIME NOT NULL,'
            . ' PRIMARY KEY (`id_item`),'
            . ' UNIQUE KEY `uniq_psxmg_sync_item_job_offer` (`id_job`, `offer_key`)'
            . ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
        ));
        self::assertTrue($this->db->execute(
            'INSERT INTO `' . $jobTable . '`'
            . ' (`id_shop`, `status`, `total`, `succeeded`, `failed`, `skipped`, `created_at`)'
            . " VALUES (7, 'pending', 99, 88, 7, 6, '2020-01-01 00:00:00')"
        ));
        self::assertTrue($this->db->execute(
            'INSERT INTO `' . $itemTable . '` (`id_job`, `offer_key`, `status`, `attempts`, `updated_at`) VALUES'
            . " (1, '10-0', 'success', 1, '2020-01-01 00:00:00'),"
            . " (1, '20-0', 'pending', 0, '2020-01-01 00:00:00')"
        ));

        require_once dirname(__DIR__, 3) . '/upgrade/upgrade-2.0.0.php';
        self::assertTrue(\upgrade_module_2_0_0(new \stdClass()));
        self::assertTrue(\upgrade_module_2_0_0(new \stdClass()));

        $legacyJob = $this->db->getRow('SELECT * FROM `' . $jobTable . '` WHERE id_job = 1');
        self::assertIsArray($legacyJob);
        self::assertSame('partial', $legacyJob['status']);
        self::assertSame('2', (string) $legacyJob['total']);
        self::assertSame('1', (string) $legacyJob['succeeded']);
        self::assertSame('1', (string) $legacyJob['failed']);
        self::assertSame('0', (string) $legacyJob['skipped']);
        self::assertNotNull($legacyJob['finished_at']);

        $legacyPendingItem = $this->db->getRow(
            'SELECT status, claim_token, next_attempt_at, error_code, error_field, error_message'
            . ' FROM `' . $itemTable . '` WHERE id_item = 2'
        );
        self::assertIsArray($legacyPendingItem);
        self::assertSame('failed', $legacyPendingItem['status']);
        self::assertNull($legacyPendingItem['claim_token']);
        self::assertNull($legacyPendingItem['next_attempt_at']);
        self::assertSame('legacy_snapshot_invalid', $legacyPendingItem['error_code']);
        self::assertNull($legacyPendingItem['error_field']);
        self::assertSame(
            'Synchronization stopped because the saved routing snapshot is invalid.',
            $legacyPendingItem['error_message']
        );

        $repository = new SyncJobRepository($this->db, _DB_PREFIX_);
        $validJobId = $repository->createJob(7, [
            'merchant_id' => '123456',
            'data_source' => 'accounts/123456/dataSources/42',
            'prestashop_language_id' => 1,
            'content_language' => 'en',
            'feed_label' => 'US',
            'full_sync' => true,
        ], ['30-0']);

        self::assertSame($validJobId, $repository->findOldestActiveJob(7)['id_job']);
    }

    public function testRecountAndItemCompletionAreSerializedAcrossTwoConnections(): void
    {
        self::assertTrue(function_exists('proc_open'), 'The deterministic concurrency regression requires proc_open.');

        $jobTable = _DB_PREFIX_ . Config::SYNC_JOB_TABLE;
        $itemTable = _DB_PREFIX_ . Config::SYNC_ITEM_TABLE;
        foreach ([$itemTable, $jobTable, _DB_PREFIX_ . Config::OAUTH_STATE_TABLE, _DB_PREFIX_ . Config::CONNECTION_TABLE] as $table) {
            self::assertTrue($this->db->execute('DROP TABLE IF EXISTS `' . $table . '`'));
        }
        self::assertTrue((bool) include dirname(__DIR__, 3) . '/sql/install.php');

        $setupRepository = new SyncJobRepository($this->db, _DB_PREFIX_);
        $jobId = $setupRepository->createJob(7, [
            'merchant_id' => '123456',
            'data_source' => 'accounts/123456/dataSources/42',
            'prestashop_language_id' => 1,
            'content_language' => 'en',
            'feed_label' => 'US',
            'full_sync' => true,
        ], ['10-0']);
        $claimed = $setupRepository->claimPending(7, $jobId);
        self::assertCount(1, $claimed);
        $itemId = $claimed[0]['id_item'];

        $coordinationDirectory = sys_get_temp_dir() . '/psxmg-task7-concurrency-' . getmypid();
        self::assertTrue(mkdir($coordinationDirectory, 0700));
        $aggregated = $coordinationDirectory . '/aggregated';
        $release = $coordinationDirectory . '/release';
        $completionStarted = $coordinationDirectory . '/completion-started';
        $completionFinished = $coordinationDirectory . '/completion-finished';

        [$recountProcess, $recountPipes] = $this->startConcurrencyWorker(
            'recount',
            $jobId,
            $itemId,
            $coordinationDirectory
        );

        $aggregatePaused = $this->waitForFile($aggregated, 5.0);
        [$completionProcess, $completionPipes] = $this->startConcurrencyWorker(
            'complete',
            $jobId,
            $itemId,
            $coordinationDirectory
        );

        $completionDidStart = $this->waitForFile($completionStarted, 5.0);
        usleep(250000);
        $completionFinishedBeforeRelease = is_file($completionFinished);
        touch($release);
        $recountOutput = stream_get_contents($recountPipes[1]) . stream_get_contents($recountPipes[2]);
        $completionOutput = stream_get_contents($completionPipes[1]) . stream_get_contents($completionPipes[2]);
        foreach ([$recountPipes[1], $recountPipes[2], $completionPipes[1], $completionPipes[2]] as $pipe) {
            fclose($pipe);
        }
        $recountStatus = proc_close($recountProcess);
        $completionStatus = proc_close($completionProcess);

        $job = $this->db->getRow(
            'SELECT status, total, succeeded, failed, skipped FROM `' . $jobTable . '` WHERE id_job = ' . $jobId
        );
        foreach ([$aggregated, $release, $completionStarted, $completionFinished] as $path) {
            if (is_file($path)) {
                unlink($path);
            }
        }
        rmdir($coordinationDirectory);

        self::assertSame('', $recountOutput);
        self::assertSame('', $completionOutput);
        self::assertSame(0, $recountStatus);
        self::assertSame(0, $completionStatus);
        self::assertTrue($aggregatePaused);
        self::assertTrue($completionDidStart);
        self::assertFalse($completionFinishedBeforeRelease, 'The item completion must wait for the recount job lock.');
        self::assertIsArray($job);
        self::assertSame('completed', $job['status']);
        self::assertSame('1', (string) $job['total']);
        self::assertSame('1', (string) $job['succeeded']);
        self::assertSame('0', (string) $job['failed']);
        self::assertSame('0', (string) $job['skipped']);
    }

    private function waitForFile(string $path, float $timeoutSeconds): bool
    {
        $deadline = microtime(true) + $timeoutSeconds;
        while (!is_file($path) && microtime(true) < $deadline) {
            usleep(10000);
        }

        return is_file($path);
    }

    /** @return array{0: resource, 1: array<int, resource>} */
    private function startConcurrencyWorker(
        string $mode,
        int $jobId,
        int $itemId,
        string $coordinationDirectory
    ): array {
        $process = proc_open([
            PHP_BINARY,
            __DIR__ . '/concurrency-worker.php',
            $mode,
            $this->schema,
            (string) $jobId,
            (string) $itemId,
            $coordinationDirectory,
        ], [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ], $pipes);
        self::assertTrue(is_resource($process));
        fclose($pipes[0]);

        return [$process, $pipes];
    }
}
