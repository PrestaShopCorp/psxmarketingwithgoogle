<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use RuntimeException;

final class CronRunner
{
    /** @var mixed */
    private $oldestJobFinder;

    /** @var callable */
    private $contextSwitcher;

    /** @var mixed */
    private $processorResolver;

    /**
     * @param mixed $oldestJobFinder
     * @param mixed $processorResolver
     */
    public function __construct(
        $oldestJobFinder,
        callable $contextSwitcher,
        $processorResolver
    ) {
        if (!is_callable($oldestJobFinder)
            && (!is_object($oldestJobFinder) || !method_exists($oldestJobFinder, 'findOldestActiveJob'))
        ) {
            throw new RuntimeException('Cron job repository is unavailable.');
        }
        if (!is_callable($processorResolver)
            && (!is_object($processorResolver) || !method_exists($processorResolver, 'getService'))
        ) {
            throw new RuntimeException('Cron processor resolver is unavailable.');
        }
        $this->oldestJobFinder = $oldestJobFinder;
        $this->contextSwitcher = $contextSwitcher;
        $this->processorResolver = $processorResolver;
    }

    /** @return array{total: int, succeeded: int, failed: int, skipped: int, pending: int} */
    public function __invoke(int $shopId, int $limit): array
    {
        $job = $this->oldestJob($shopId);
        if (null === $job) {
            return $this->zeroCounts();
        }
        if (!is_array($job)) {
            throw new RuntimeException('Cron job is unavailable.');
        }

        $jobId = $this->positiveInteger($job['id_job'] ?? null);
        $languageId = $this->positiveInteger($job['id_lang'] ?? null);
        if (null === $jobId || null === $languageId) {
            throw new RuntimeException('Cron job is unavailable.');
        }

        ($this->contextSwitcher)($shopId, $languageId);
        $processor = $this->processor();
        if (!is_object($processor) || !method_exists($processor, 'runBatchForShop')) {
            throw new RuntimeException('Cron processor is unavailable.');
        }

        /** @var mixed $result */
        $result = $processor->runBatchForShop($shopId, $jobId, $limit);

        return $this->counts($result);
    }

    /** @return array<string, mixed>|null */
    private function oldestJob(int $shopId): ?array
    {
        if (is_callable($this->oldestJobFinder)) {
            return ($this->oldestJobFinder)($shopId);
        }

        return $this->oldestJobFinder->findOldestActiveJob($shopId);
    }

    /** @return mixed */
    private function processor()
    {
        if (is_callable($this->processorResolver)) {
            return ($this->processorResolver)();
        }

        return $this->processorResolver->getService(SyncProcessor::class);
    }

    /** @return array{total: int, succeeded: int, failed: int, skipped: int, pending: int} */
    private function zeroCounts(): array
    {
        return [
            'total' => 0,
            'succeeded' => 0,
            'failed' => 0,
            'skipped' => 0,
            'pending' => 0,
        ];
    }

    /**
     * @param mixed $result
     *
     * @return array{total: int, succeeded: int, failed: int, skipped: int, pending: int}
     */
    private function counts($result): array
    {
        if (!is_array($result)) {
            throw new RuntimeException('Cron result is unavailable.');
        }

        $counts = [];
        foreach (['total', 'succeeded', 'failed', 'skipped', 'pending'] as $field) {
            $value = $this->nonNegativeInteger($result[$field] ?? null);
            if (null === $value) {
                throw new RuntimeException('Cron result is unavailable.');
            }
            $counts[$field] = $value;
        }

        return $counts;
    }

    /** @param mixed $value */
    private function positiveInteger($value): ?int
    {
        $value = $this->nonNegativeInteger($value);

        return null !== $value && 0 < $value ? $value : null;
    }

    /** @param mixed $value */
    private function nonNegativeInteger($value): ?int
    {
        if (is_int($value)) {
            return 0 <= $value ? $value : null;
        }
        if (!is_string($value) || 1 !== preg_match('/^(?:0|[1-9][0-9]*)$/D', $value)) {
            return null;
        }

        $integer = (int) $value;

        return 0 <= $integer && (string) $integer === $value ? $integer : null;
    }
}
