<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use InvalidArgumentException;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use RuntimeException;
use Throwable;
use UnexpectedValueException;

final class SyncJobRepository implements SyncJobStoreInterface
{
    /** @var object */
    private $db;

    /** @var string */
    private $dbPrefix;

    /**
     * @param object $db PrestaShop database connection
     */
    public function __construct($db, ?string $dbPrefix = null)
    {
        $this->db = $db;
        $dbPrefix = null === $dbPrefix && defined('_DB_PREFIX_') ? (string) constant('_DB_PREFIX_') : (string) $dbPrefix;
        if (1 !== preg_match('/^[A-Za-z0-9_]*$/D', $dbPrefix)) {
            throw new InvalidArgumentException('Database prefix is invalid.');
        }
        $this->dbPrefix = $dbPrefix;
    }

    /**
     * @param array<string, mixed> $snapshot
     * @param string[] $offerKeys
     */
    public function createJob(int $shopId, array $snapshot, array $offerKeys): int
    {
        $this->assertPositiveId($shopId, 'Shop');
        $offerKeys = $this->validateCreateInput($snapshot, $offerKeys);
        $now = gmdate('Y-m-d H:i:s');
        $hasWork = [] !== $offerKeys;

        if (!$this->db->execute('START TRANSACTION')) {
            throw new RuntimeException('Unable to start the sync job transaction.');
        }

        try {
            $created = $this->db->insert(Config::SYNC_JOB_TABLE, [
                'id_shop' => $shopId,
                'merchant_account' => $snapshot['merchant_id'],
                'data_source' => $snapshot['data_source'],
                'id_lang' => $snapshot['prestashop_language_id'],
                'content_language' => $snapshot['content_language'],
                'feed_label' => $snapshot['feed_label'],
                'full_sync' => $snapshot['full_sync'] ? 1 : 0,
                'status' => $hasWork ? 'pending' : 'completed',
                'total' => count($offerKeys),
                'succeeded' => 0,
                'failed' => 0,
                'skipped' => 0,
                'created_at' => $now,
                'started_at' => null,
                'finished_at' => $hasWork ? null : $now,
            ]);
            if (!$created) {
                throw new RuntimeException('Unable to persist the sync job.');
            }

            $jobId = (int) $this->db->Insert_ID();
            if (0 >= $jobId) {
                throw new RuntimeException('Unable to resolve the persisted sync job ID.');
            }

            foreach ($offerKeys as $offerKey) {
                if (!$this->db->insert(Config::SYNC_ITEM_TABLE, [
                    'id_job' => $jobId,
                    'offer_key' => $offerKey,
                    'status' => 'pending',
                    'attempts' => 0,
                    'next_attempt_at' => $now,
                    'error_code' => null,
                    'error_field' => null,
                    'error_message' => null,
                    'updated_at' => $now,
                ])) {
                    throw new RuntimeException('Unable to persist a sync job item.');
                }
            }

            if (!$this->db->execute('COMMIT')) {
                throw new RuntimeException('Unable to commit the sync job transaction.');
            }

            return $jobId;
        } catch (Throwable $exception) {
            $this->db->execute('ROLLBACK');

            throw $exception;
        }
    }

    /**
     * Atomically claim an eligible batch for one shop-owned job.
     *
     * @return array<int, array{id_item: int, id_job: int, offer_key: string, attempts: int}>
     */
    public function claimPending(int $shopId, int $jobId, int $limit = 25): array
    {
        $this->assertPositiveId($shopId, 'Shop');
        $this->assertPositiveId($jobId, 'Job');
        if (0 >= $limit) {
            throw new InvalidArgumentException('Claim limit must be positive.');
        }
        $limit = min(25, $limit);

        $claimToken = bin2hex(random_bytes(16));
        $itemTable = $this->table(Config::SYNC_ITEM_TABLE);
        if (!$this->db->execute('START TRANSACTION')) {
            throw new RuntimeException('Unable to start the item claim transaction.');
        }

        try {
            $this->lockOwnedJob($shopId, $jobId);
            $claimed = $this->db->execute(
                'UPDATE `' . $itemTable . '`'
                . " SET status = 'running', attempts = attempts + 1,"
                . " claim_token = '" . $claimToken . "', updated_at = UTC_TIMESTAMP()"
                . ' WHERE id_job = ' . $jobId
                . " AND status = 'pending'"
                . ' AND attempts < 3'
                . ' AND next_attempt_at <= UTC_TIMESTAMP()'
                . ' ORDER BY id_item ASC LIMIT ' . $limit
            );
            if (!$claimed) {
                throw new RuntimeException('Unable to claim pending sync items.');
            }
            $claimedCount = (int) $this->db->Affected_Rows();
            if (0 > $claimedCount || $limit < $claimedCount) {
                throw new RuntimeException('Database returned an invalid claimed item count.');
            }

            if (0 < $claimedCount && !$this->db->execute(
                'UPDATE `' . $this->table(Config::SYNC_JOB_TABLE) . '`'
                . " SET status = 'running', started_at = COALESCE(started_at, UTC_TIMESTAMP()), finished_at = NULL"
                . ' WHERE id_job = ' . $jobId
                . ' AND id_shop = ' . $shopId
                . " AND status IN ('pending', 'running')"
            )) {
                throw new RuntimeException('Unable to mark the sync job as running.');
            }

            $rows = $this->db->executeS(
                'SELECT id_item, id_job, offer_key, attempts'
                . ' FROM `' . $itemTable . '`'
                . ' WHERE id_job = ' . $jobId
                . " AND claim_token = '" . $claimToken . "'"
                . ' ORDER BY id_item ASC'
            );
            if (!is_array($rows)) {
                throw new RuntimeException('Unable to read claimed sync items.');
            }
            if ($claimedCount !== count($rows)) {
                throw new RuntimeException('Database returned an invalid claimed item set.');
            }

            if (!$this->db->execute('COMMIT')) {
                throw new RuntimeException('Unable to commit the item claim transaction.');
            }
        } catch (Throwable $exception) {
            $this->db->execute('ROLLBACK');

            throw $exception;
        }

        return array_map(static function (array $row): array {
            return [
                'id_item' => (int) $row['id_item'],
                'id_job' => (int) $row['id_job'],
                'offer_key' => (string) $row['offer_key'],
                'attempts' => (int) $row['attempts'],
            ];
        }, $rows);
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
        $this->assertPositiveId($shopId, 'Shop');
        $this->assertPositiveId($jobId, 'Job');
        $this->assertPositiveId($itemId, 'Item');

        $errorCode = $this->sanitizeErrorCode($errorCode);
        $errorField = $this->sanitizeOperatorText($errorField, 191);
        $errorMessage = $this->sanitizeErrorMessage($errorMessage);

        $retryCondition = $retryable ? 'attempts < 3' : '0 = 1';
        if (!$this->db->execute('START TRANSACTION')) {
            throw new RuntimeException('Unable to start the sync item failure transaction.');
        }

        try {
            $this->lockOwnedJob($shopId, $jobId);
            $updated = $this->db->execute(
                'UPDATE `' . $this->table(Config::SYNC_ITEM_TABLE) . '`'
                . ' SET status = CASE WHEN ' . $retryCondition . " THEN 'pending' ELSE 'failed' END,"
                . ' next_attempt_at = CASE WHEN ' . $retryCondition
                . ' THEN TIMESTAMPADD(SECOND, LEAST(3600, 60 * POW(2, GREATEST(attempts - 1, 0))), UTC_TIMESTAMP())'
                . ' ELSE NULL END,'
                . ' claim_token = NULL,'
                . " error_code = '" . $this->escape($errorCode) . "',"
                . ' error_field = ' . $this->nullableString($errorField) . ','
                . " error_message = '" . $this->escape($errorMessage) . "',"
                . ' updated_at = UTC_TIMESTAMP()'
                . ' WHERE id_item = ' . $itemId
                . ' AND id_job = ' . $jobId
                . " AND status = 'running'"
            );
            if (!$updated) {
                throw new RuntimeException('Unable to record the sync item failure.');
            }
            if (1 !== (int) $this->db->Affected_Rows()) {
                throw new UnexpectedValueException('Running sync item does not exist for this job.');
            }
            if (!$this->db->execute('COMMIT')) {
                throw new RuntimeException('Unable to commit the sync item failure transaction.');
            }
        } catch (Throwable $exception) {
            $this->db->execute('ROLLBACK');

            throw $exception;
        }
    }

    public function recordSuccess(int $shopId, int $jobId, int $itemId): void
    {
        $this->recordTerminalStatus($shopId, $jobId, $itemId, 'success');
    }

    public function recordSkipped(int $shopId, int $jobId, int $itemId): void
    {
        $this->recordTerminalStatus($shopId, $jobId, $itemId, 'skipped');
    }

    public function retryFailed(int $shopId, int $jobId): int
    {
        $this->assertPositiveId($shopId, 'Shop');
        $this->assertPositiveId($jobId, 'Job');

        if (!$this->db->execute('START TRANSACTION')) {
            throw new RuntimeException('Unable to start the failed-item retry transaction.');
        }

        try {
            $this->lockOwnedJob($shopId, $jobId);
            $reset = $this->db->execute(
                'UPDATE `' . $this->table(Config::SYNC_ITEM_TABLE) . '`'
                . " SET status = 'pending', attempts = 0, next_attempt_at = UTC_TIMESTAMP(),"
                . ' claim_token = NULL, error_code = NULL, error_field = NULL, error_message = NULL,'
                . ' updated_at = UTC_TIMESTAMP()'
                . ' WHERE id_job = ' . $jobId
                . " AND status = 'failed'"
            );
            if (!$reset) {
                throw new RuntimeException('Unable to reset failed sync items.');
            }

            if (0 < (int) $this->db->Affected_Rows()) {
                $reopened = $this->db->execute(
                    'UPDATE `' . $this->table(Config::SYNC_JOB_TABLE) . '`'
                    . " SET status = 'pending', finished_at = NULL"
                    . ' WHERE id_job = ' . $jobId
                    . ' AND id_shop = ' . $shopId
                );
                if (!$reopened) {
                    throw new RuntimeException('Unable to reopen the sync job.');
                }
            }

            if (!$this->db->execute('COMMIT')) {
                throw new RuntimeException('Unable to commit the failed-item retry transaction.');
            }
        } catch (Throwable $exception) {
            $this->db->execute('ROLLBACK');

            throw $exception;
        }

        return $jobId;
    }

    /**
     * @return array{id_job: int, status: string, total: int, succeeded: int, failed: int, skipped: int, pending: int}
     */
    public function recount(int $shopId, int $jobId): array
    {
        $this->assertPositiveId($shopId, 'Shop');
        $this->assertPositiveId($jobId, 'Job');
        if (!$this->db->execute('START TRANSACTION')) {
            throw new RuntimeException('Unable to start the sync job recount transaction.');
        }

        try {
            $this->lockOwnedJob($shopId, $jobId);
            $counts = $this->db->getRow(
                'SELECT COUNT(*) AS total,'
                . " COALESCE(SUM(status = 'success'), 0) AS succeeded,"
                . " COALESCE(SUM(status = 'failed'), 0) AS failed,"
                . " COALESCE(SUM(status = 'skipped'), 0) AS skipped,"
                . " COALESCE(SUM(status = 'running'), 0) AS running"
                . ' FROM `' . $this->table(Config::SYNC_ITEM_TABLE) . '`'
                . ' WHERE id_job = ' . $jobId
            );
            if (!is_array($counts)) {
                throw new RuntimeException('Unable to recount the sync job.');
            }

            foreach (['total', 'succeeded', 'failed', 'skipped', 'running'] as $field) {
                if (!array_key_exists($field, $counts) || !is_numeric($counts[$field])) {
                    throw new RuntimeException('Unable to recount the sync job.');
                }
                $counts[$field] = (int) $counts[$field];
            }

            $pending = $counts['total'] - $counts['succeeded'] - $counts['failed'] - $counts['skipped'];
            if (0 > $pending) {
                throw new RuntimeException('Sync job counts are invalid.');
            }

            if (0 < $pending) {
                $status = 0 < $counts['running'] ? 'running' : 'pending';
            } elseif (0 === $counts['failed']) {
                $status = 'completed';
            } elseif ($counts['failed'] === $counts['total'] - $counts['skipped']) {
                $status = 'failed';
            } else {
                $status = 'partial';
            }

            $timestamps = 'finished_at = NULL';
            if ('running' === $status) {
                $timestamps = 'started_at = COALESCE(started_at, UTC_TIMESTAMP()), finished_at = NULL';
            } elseif (in_array($status, ['completed', 'partial', 'failed'], true)) {
                $timestamps = 'finished_at = COALESCE(finished_at, UTC_TIMESTAMP())';
            }

            $updated = $this->db->execute(
                'UPDATE `' . $this->table(Config::SYNC_JOB_TABLE) . '`'
                . ' SET total = ' . $counts['total']
                . ', succeeded = ' . $counts['succeeded']
                . ', failed = ' . $counts['failed']
                . ', skipped = ' . $counts['skipped']
                . ", status = '" . $status . "', " . $timestamps
                . ' WHERE id_job = ' . $jobId
                . ' AND id_shop = ' . $shopId
            );
            if (!$updated) {
                throw new RuntimeException('Unable to update the sync job counts.');
            }
            if (!$this->db->execute('COMMIT')) {
                throw new RuntimeException('Unable to commit the sync job recount transaction.');
            }
        } catch (Throwable $exception) {
            $this->db->execute('ROLLBACK');

            throw $exception;
        }

        return [
            'id_job' => $jobId,
            'status' => $status,
            'total' => $counts['total'],
            'succeeded' => $counts['succeeded'],
            'failed' => $counts['failed'],
            'skipped' => $counts['skipped'],
            'pending' => $pending,
        ];
    }

    public function recoverStale(int $shopId, int $jobId, int $ageSeconds = 900): int
    {
        $this->assertPositiveId($shopId, 'Shop');
        $this->assertPositiveId($jobId, 'Job');
        if (60 > $ageSeconds || 86400 < $ageSeconds) {
            throw new InvalidArgumentException('Stale age must be between 60 and 86400 seconds.');
        }
        if (!$this->db->execute('START TRANSACTION')) {
            throw new RuntimeException('Unable to start the stale-item recovery transaction.');
        }

        try {
            $this->lockOwnedJob($shopId, $jobId);
            $recovered = $this->db->execute(
                'UPDATE `' . $this->table(Config::SYNC_ITEM_TABLE) . '`'
                . " SET status = CASE WHEN attempts < 3 THEN 'pending' ELSE 'failed' END,"
                . ' claim_token = NULL,'
                . ' next_attempt_at = CASE WHEN attempts < 3 THEN UTC_TIMESTAMP() ELSE NULL END,'
                . " error_code = CASE WHEN attempts < 3 THEN error_code ELSE 'stale_attempt_limit' END,"
                . ' error_field = CASE WHEN attempts < 3 THEN error_field ELSE NULL END,'
                . ' error_message = CASE WHEN attempts < 3 THEN error_message'
                . " ELSE 'Synchronization stopped after repeated stale worker attempts.' END,"
                . ' updated_at = UTC_TIMESTAMP()'
                . ' WHERE id_job = ' . $jobId
                . " AND status = 'running'"
                . ' AND updated_at < TIMESTAMPADD(SECOND, -' . $ageSeconds . ', UTC_TIMESTAMP())'
            );
            if (!$recovered) {
                throw new RuntimeException('Unable to recover stale sync items.');
            }
            $recoveredCount = (int) $this->db->Affected_Rows();
            if (!$this->db->execute('COMMIT')) {
                throw new RuntimeException('Unable to commit the stale-item recovery transaction.');
            }
        } catch (Throwable $exception) {
            $this->db->execute('ROLLBACK');

            throw $exception;
        }

        return $recoveredCount;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findOldestActiveJob(int $shopId): ?array
    {
        $this->assertPositiveId($shopId, 'Shop');

        $row = $this->db->getRow(
            'SELECT id_job, id_shop, merchant_account, data_source, id_lang, content_language,'
            . ' feed_label, full_sync, status, total, succeeded, failed, skipped, created_at, started_at, finished_at'
            . ' FROM `' . $this->table(Config::SYNC_JOB_TABLE) . '`'
            . ' WHERE id_shop = ' . $shopId
            . " AND status IN ('pending', 'running')"
            . ' ORDER BY created_at ASC, id_job ASC'
        );
        if (false === $row || null === $row) {
            if ($this->hasDatabaseError()) {
                throw new RuntimeException('Unable to read the oldest active sync job.');
            }

            return null;
        }
        if (!is_array($row)) {
            throw new RuntimeException('Unable to read the oldest active sync job.');
        }

        return $this->normalizeJobRow($row);
    }

    /** @return array<string, mixed> */
    public function findJob(int $shopId, int $jobId): array
    {
        $this->assertPositiveId($shopId, 'Shop');
        $this->assertPositiveId($jobId, 'Job');
        $this->assertOwnedJob($shopId, $jobId);
        $row = $this->db->getRow(
            'SELECT id_job, id_shop, merchant_account, data_source, id_lang, content_language,'
            . ' feed_label, full_sync, status, total, succeeded, failed, skipped, created_at, started_at, finished_at'
            . ' FROM `' . $this->table(Config::SYNC_JOB_TABLE) . '`'
            . ' WHERE id_job = ' . $jobId
            . ' AND id_shop = ' . $shopId
        );
        if (!is_array($row)) {
            throw new RuntimeException('Unable to read the sync job.');
        }

        return $this->normalizeJobRow($row);
    }

    /**
     * @return array<int, array{offer_key: string, code: string, field: string|null, message: string}>
     */
    public function errorSummaries(int $shopId, int $jobId, int $limit = 25): array
    {
        $this->assertPositiveId($shopId, 'Shop');
        $this->assertPositiveId($jobId, 'Job');
        if (0 >= $limit) {
            throw new InvalidArgumentException('Error summary limit must be positive.');
        }
        $limit = min(25, $limit);
        $this->assertOwnedJob($shopId, $jobId);
        $rows = $this->db->executeS(
            'SELECT offer_key, error_code, error_field, error_message'
            . ' FROM `' . $this->table(Config::SYNC_ITEM_TABLE) . '`'
            . ' WHERE id_job = ' . $jobId
            . ' AND error_code IS NOT NULL'
            . ' ORDER BY id_item ASC LIMIT ' . $limit
        );
        if (!is_array($rows)) {
            throw new RuntimeException('Unable to read sync item errors.');
        }

        $summaries = [];
        foreach ($rows as $row) {
            if (!is_array($row)
                || !isset($row['offer_key'], $row['error_code'], $row['error_message'])
                || !is_string($row['offer_key'])
                || !is_string($row['error_code'])
                || !is_string($row['error_message'])
                || (isset($row['error_field']) && !is_string($row['error_field']))
            ) {
                throw new RuntimeException('Unable to read sync item errors.');
            }
            $summaries[] = [
                'offer_key' => 1 === preg_match('/^[1-9][0-9]*-(?:0|[1-9][0-9]*)$/D', $row['offer_key'])
                    ? $row['offer_key']
                    : 'unknown',
                'code' => $this->sanitizeErrorCode($row['error_code']),
                'field' => $this->sanitizeOperatorText($row['error_field'] ?? null, 191),
                'message' => $this->sanitizeErrorMessage($row['error_message']),
            ];
        }

        return $summaries;
    }

    private function assertPositiveId(int $id, string $name): void
    {
        if (0 >= $id) {
            throw new InvalidArgumentException($name . ' ID must be positive.');
        }
    }

    /** @param array<string, mixed> $row
     *
     * @return array<string, mixed>
     */
    private function normalizeJobRow(array $row): array
    {
        foreach (['id_job', 'id_shop', 'id_lang', 'total', 'succeeded', 'failed', 'skipped'] as $field) {
            if (!array_key_exists($field, $row) || !is_numeric($row[$field])) {
                throw new RuntimeException('Unable to read the sync job.');
            }
            $row[$field] = (int) $row[$field];
        }
        if (0 >= $row['id_job']
            || 0 >= $row['id_shop']
            || 0 >= $row['id_lang']
            || 4294967295 < $row['id_lang']
            || 0 > $row['total']
            || 0 > $row['succeeded']
            || 0 > $row['failed']
            || 0 > $row['skipped']
            || $row['total'] < $row['succeeded'] + $row['failed'] + $row['skipped']
            || !isset($row['merchant_account'], $row['data_source'], $row['content_language'], $row['feed_label'], $row['status'])
            || !is_string($row['merchant_account'])
            || 1 !== preg_match('/^[0-9]{1,20}$/D', $row['merchant_account'])
            || !is_string($row['data_source'])
            || 1 !== preg_match(
                '#^accounts/' . preg_quote($row['merchant_account'], '#') . '/dataSources/[0-9]{1,20}$#D',
                $row['data_source']
            )
            || !is_string($row['content_language'])
            || 1 !== preg_match('/^[a-z]{2}$/D', $row['content_language'])
            || !is_string($row['feed_label'])
            || 1 !== preg_match('/^[A-Z0-9_-]{1,20}$/D', $row['feed_label'])
            || !is_string($row['status'])
            || !in_array($row['status'], ['pending', 'running', 'completed', 'partial', 'failed'], true)
            || !array_key_exists('full_sync', $row)
            || !in_array($row['full_sync'], [1, '1'], true)
        ) {
            throw new RuntimeException('Unable to read the sync job.');
        }
        $row['full_sync'] = true;

        return $row;
    }

    private function recordTerminalStatus(int $shopId, int $jobId, int $itemId, string $status): void
    {
        $this->assertPositiveId($shopId, 'Shop');
        $this->assertPositiveId($jobId, 'Job');
        $this->assertPositiveId($itemId, 'Item');
        if (!$this->db->execute('START TRANSACTION')) {
            throw new RuntimeException('Unable to start the sync item outcome transaction.');
        }

        try {
            $this->lockOwnedJob($shopId, $jobId);
            $updated = $this->db->execute(
                'UPDATE `' . $this->table(Config::SYNC_ITEM_TABLE) . '`'
                . " SET status = '" . $status . "', claim_token = NULL, next_attempt_at = NULL,"
                . ' error_code = NULL, error_field = NULL, error_message = NULL, updated_at = UTC_TIMESTAMP()'
                . ' WHERE id_item = ' . $itemId
                . ' AND id_job = ' . $jobId
                . " AND status = 'running'"
            );
            if (!$updated) {
                throw new RuntimeException('Unable to record the sync item outcome.');
            }
            if (1 !== (int) $this->db->Affected_Rows()) {
                throw new UnexpectedValueException('Running sync item does not exist for this job.');
            }
            if (!$this->db->execute('COMMIT')) {
                throw new RuntimeException('Unable to commit the sync item outcome transaction.');
            }
        } catch (Throwable $exception) {
            $this->db->execute('ROLLBACK');

            throw $exception;
        }
    }

    /**
     * @param array<string, mixed> $snapshot
     * @param mixed[] $offerKeys
     *
     * @return string[]
     */
    private function validateCreateInput(array $snapshot, array $offerKeys): array
    {
        $requiredFields = [
            'merchant_id',
            'data_source',
            'prestashop_language_id',
            'content_language',
            'feed_label',
            'full_sync',
        ];
        $actualFields = array_keys($snapshot);
        sort($requiredFields);
        sort($actualFields);
        if ($requiredFields !== $actualFields) {
            throw new InvalidArgumentException('Sync job snapshot fields are invalid.');
        }

        if (!is_string($snapshot['merchant_id'])
            || 1 !== preg_match('/^[0-9]{1,20}$/D', $snapshot['merchant_id'])) {
            throw new InvalidArgumentException('Merchant account ID must contain at most 20 digits.');
        }
        if (!is_string($snapshot['data_source'])
            || 128 < strlen($snapshot['data_source'])
            || 1 !== preg_match(
                '#^accounts/([0-9]{1,20})/dataSources/([0-9]{1,20})$#D',
                $snapshot['data_source'],
                $dataSourceParts
            )
            || $snapshot['merchant_id'] !== $dataSourceParts[1]
        ) {
            throw new InvalidArgumentException('Data source resource is invalid for the Merchant account.');
        }
        if (!is_int($snapshot['prestashop_language_id'])
            || 0 >= $snapshot['prestashop_language_id']
            || 4294967295 < $snapshot['prestashop_language_id']) {
            throw new InvalidArgumentException('PrestaShop language ID must be positive.');
        }
        if (!is_string($snapshot['content_language'])
            || 1 !== preg_match('/^[a-z]{2}$/D', $snapshot['content_language'])) {
            throw new InvalidArgumentException('Content language has an invalid format.');
        }
        if (!is_string($snapshot['feed_label'])
            || 1 !== preg_match('/^[A-Z0-9_-]{1,20}$/D', $snapshot['feed_label'])) {
            throw new InvalidArgumentException('Feed label has an invalid format.');
        }
        if (!is_bool($snapshot['full_sync'])) {
            throw new InvalidArgumentException('Full sync mode must be boolean.');
        }

        $validated = [];
        foreach ($offerKeys as $offerKey) {
            if (!is_string($offerKey)
                || 1 !== preg_match('/^([1-9][0-9]*)-(0|[1-9][0-9]*)$/D', $offerKey, $offerParts)
                || 4294967295 < (int) $offerParts[1]
                || 4294967295 < (int) $offerParts[2]
            ) {
                throw new InvalidArgumentException('Offer key must contain a positive product ID and nonnegative attribute ID.');
            }
            $validated[$offerKey] = [(int) $offerParts[1], (int) $offerParts[2]];
        }

        uasort($validated, static function (array $left, array $right): int {
            return $left <=> $right;
        });

        return array_keys($validated);
    }

    private function assertOwnedJob(int $shopId, int $jobId): void
    {
        $owner = $this->db->getValue(
            'SELECT id_shop FROM `' . $this->table(Config::SYNC_JOB_TABLE) . '`'
            . ' WHERE id_job = ' . $jobId
        );
        if (false === $owner || null === $owner) {
            if ($this->hasDatabaseError()) {
                throw new RuntimeException('Unable to read the sync job.');
            }

            throw new UnexpectedValueException('Sync job does not exist for this shop.');
        }
        if (!is_numeric($owner)) {
            throw new RuntimeException('Unable to read the sync job.');
        }
        if ($shopId !== (int) $owner) {
            throw new UnexpectedValueException('Sync job does not exist for this shop.');
        }
    }

    private function lockOwnedJob(int $shopId, int $jobId): void
    {
        $rows = $this->db->executeS(
            'SELECT id_job FROM `' . $this->table(Config::SYNC_JOB_TABLE) . '`'
            . ' WHERE id_job = ' . $jobId
            . ' AND id_shop = ' . $shopId
            . ' FOR UPDATE'
        );
        if (!is_array($rows)) {
            throw new RuntimeException('Unable to lock the sync job.');
        }
        if (1 !== count($rows)) {
            if ($this->hasDatabaseError()) {
                throw new RuntimeException('Unable to lock the sync job.');
            }

            throw new UnexpectedValueException('Sync job does not exist for this shop.');
        }
        $row = $rows[0];
        if (!is_array($row)
            || !array_key_exists('id_job', $row)
            || !is_numeric($row['id_job'])
            || $jobId !== (int) $row['id_job']
        ) {
            throw new RuntimeException('Unable to lock the sync job.');
        }
    }

    private function hasDatabaseError(): bool
    {
        try {
            return 0 !== (int) $this->db->getNumberError()
                || '' !== trim((string) $this->db->getMsgError());
        } catch (Throwable $exception) {
            unset($exception);

            return true;
        }
    }

    private function table(string $table): string
    {
        return $this->dbPrefix . $table;
    }

    private function escape(string $value): string
    {
        return (string) $this->db->escape($value);
    }

    private function nullableString(?string $value): string
    {
        return null === $value ? 'NULL' : "'" . $this->escape($value) . "'";
    }

    private function sanitizeErrorCode(string $errorCode): string
    {
        $errorCode = (string) preg_replace('/[^A-Za-z0-9_.:-]+/', '_', trim($errorCode));
        $errorCode = trim($errorCode, '_');
        if ('' === $errorCode) {
            $errorCode = 'sync_error';
        }

        return substr($errorCode, 0, 64);
    }

    private function sanitizeErrorMessage(string $errorMessage): string
    {
        $errorMessage = strip_tags($errorMessage);
        $errorMessage = (string) preg_replace(
            '/\bBearer\s+[A-Za-z0-9._~+\/=:-]+/i',
            'Bearer [REDACTED]',
            $errorMessage
        );
        $errorMessage = (string) preg_replace(
            '/("(?:access_token|refresh_token|client_secret|cron_token)"\s*:\s*")[^"]*(")/i',
            '$1[REDACTED]$2',
            $errorMessage
        );
        $errorMessage = (string) preg_replace(
            '/\b(access_token|refresh_token|client_secret|cron_token)\s*[=:]\s*[^\s&,;]+/i',
            '$1=[REDACTED]',
            $errorMessage
        );
        $errorMessage = $this->sanitizeOperatorText($errorMessage, 500);

        return null === $errorMessage || '' === $errorMessage ? 'Synchronization failed.' : $errorMessage;
    }

    private function sanitizeOperatorText(?string $value, int $maxLength): ?string
    {
        if (null === $value) {
            return null;
        }

        $value = strip_tags($value);
        $value = (string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value);
        $value = trim((string) preg_replace('/\s+/u', ' ', $value));
        if ('' === $value) {
            return null;
        }

        $characters = preg_split('//u', $value, -1, PREG_SPLIT_NO_EMPTY);
        if (false === $characters) {
            return substr($value, 0, $maxLength);
        }

        return implode('', array_slice($characters, 0, $maxLength));
    }
}
