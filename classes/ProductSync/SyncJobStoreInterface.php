<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

interface SyncJobStoreInterface
{
    /** @param array<string, mixed> $snapshot
     * @param string[] $offerKeys
     */
    public function createJob(int $shopId, array $snapshot, array $offerKeys): int;

    /** @return array<string, mixed> */
    public function findJob(int $shopId, int $jobId): array;

    public function recoverStale(int $shopId, int $jobId, int $ageSeconds = 900): int;

    /** @return array<int, array{id_item: int, id_job: int, offer_key: string, attempts: int}> */
    public function claimPending(int $shopId, int $jobId, int $limit = 25): array;

    public function recordSuccess(int $shopId, int $jobId, int $itemId): void;

    public function recordSkipped(int $shopId, int $jobId, int $itemId): void;

    public function recordFailure(
        int $shopId,
        int $jobId,
        int $itemId,
        bool $retryable,
        string $errorCode,
        ?string $errorField,
        string $errorMessage
    ): void;

    public function retryFailed(int $shopId, int $jobId): int;

    /** @return array{id_job: int, status: string, total: int, succeeded: int, failed: int, skipped: int, pending: int} */
    public function recount(int $shopId, int $jobId): array;

    /** @return array<int, array{offer_key: string, code: string, field: string|null, message: string}> */
    public function errorSummaries(int $shopId, int $jobId, int $limit = 25): array;
}
