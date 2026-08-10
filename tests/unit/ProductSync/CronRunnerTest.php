<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronAuthorization;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronRequestHandler;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronRunner;

class CronRunnerTest extends TestCase
{
    public function testAuthorizedRequestWithNoActiveJobReturnsExactZeroCountsWithoutHeavyResolution(): void
    {
        if (!class_exists(CronRunner::class)) {
            self::fail('CronRunner is not implemented.');
        }

        $events = [];
        $runner = new CronRunner(
            static function (int $shopId) use (&$events): ?array {
                $events[] = 'oldest:' . $shopId;

                return null;
            },
            static function () use (&$events): void {
                $events[] = 'switch';
                self::fail('Context must not switch without an active job.');
            },
            static function () use (&$events) {
                $events[] = 'resolve';
                self::fail('Processor must not resolve without an active job.');
            }
        );
        $handler = new CronRequestHandler(
            new CronAuthorization(static function (int $shopId) use (&$events): ?string {
                $events[] = 'authorize:' . $shopId;

                return 'correct-token';
            }),
            $runner
        );

        self::assertSame(
            '{"total":0,"succeeded":0,"failed":0,"skipped":0,"pending":0}',
            $handler->handle('GET', $this->validQuery())->getBody()
        );
        self::assertSame(['authorize:7', 'oldest:7'], $events);
    }

    public function testRunnerOrdersAuthorizationLookupSwitchResolutionAndExecution(): void
    {
        if (!class_exists(CronRunner::class)) {
            self::fail('CronRunner is not implemented.');
        }

        $events = [];
        $processor = new CronRecordingProcessor($events, [
            'id_job' => 41,
            'status' => 'running',
            'total' => 12,
            'succeeded' => 8,
            'failed' => 1,
            'skipped' => 2,
            'pending' => 1,
            'errors' => [['message' => 'must stay private']],
        ]);
        $runner = new CronRunner(
            static function (int $shopId) use (&$events): array {
                $events[] = 'oldest:' . $shopId;

                return ['id_job' => 41, 'id_lang' => 3];
            },
            static function (int $shopId, int $languageId) use (&$events): void {
                $events[] = 'switch:' . $shopId . ':' . $languageId;
            },
            static function () use (&$events, $processor): CronRecordingProcessor {
                $events[] = 'resolve';

                return $processor;
            }
        );
        $handler = new CronRequestHandler(
            new CronAuthorization(static function (int $shopId) use (&$events): ?string {
                $events[] = 'authorize:' . $shopId;

                return 'correct-token';
            }),
            $runner
        );

        self::assertSame(
            '{"total":12,"succeeded":8,"failed":1,"skipped":2,"pending":1}',
            $handler->handle('GET', [
                'shop' => '7',
                'token' => 'correct-token',
                'limit' => '20',
            ])->getBody()
        );
        self::assertSame([
            'authorize:7',
            'oldest:7',
            'switch:7:3',
            'resolve',
            'run:7:41:20',
        ], $events);
    }

    public function testContainerObjectsKeepProcessorLookupAfterContextSwitch(): void
    {
        $events = [];
        $processor = new CronRecordingProcessor($events, [
            'total' => 1,
            'succeeded' => 1,
            'failed' => 0,
            'skipped' => 0,
            'pending' => 0,
        ]);
        $runner = new CronRunner(
            new CronJobRepositoryDouble($events),
            static function (int $shopId, int $languageId) use (&$events): void {
                $events[] = 'switch:' . $shopId . ':' . $languageId;
            },
            new CronModuleDouble($events, $processor)
        );

        self::assertSame([
            'total' => 1,
            'succeeded' => 1,
            'failed' => 0,
            'skipped' => 0,
            'pending' => 0,
        ], $runner(7, 25));
        self::assertSame([
            'oldest:7',
            'switch:7:3',
            'get-service:' . \PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncProcessor::class,
            'run:7:41:25',
        ], $events);
    }

    /** @return array<string, string> */
    private function validQuery(): array
    {
        return [
            'shop' => '7',
            'token' => 'correct-token',
            'limit' => '25',
        ];
    }
}

final class CronRecordingProcessor
{
    /** @var string[] */
    private $events;

    /** @var array<string, mixed> */
    private $result;

    /**
     * @param string[] $events
     * @param array<string, mixed> $result
     */
    public function __construct(array &$events, array $result)
    {
        $this->events = &$events;
        $this->result = $result;
    }

    /** @return array<string, mixed> */
    public function runBatchForShop(int $shopId, int $jobId, int $limit): array
    {
        $this->events[] = 'run:' . $shopId . ':' . $jobId . ':' . $limit;

        return $this->result;
    }
}

final class CronJobRepositoryDouble
{
    /** @var string[] */
    private $events;

    /** @param string[] $events */
    public function __construct(array &$events)
    {
        $this->events = &$events;
    }

    /** @return array<string, int> */
    public function findOldestActiveJob(int $shopId): array
    {
        $this->events[] = 'oldest:' . $shopId;

        return ['id_job' => 41, 'id_lang' => 3];
    }
}

final class CronModuleDouble
{
    /** @var string[] */
    private $events;

    /** @var object */
    private $processor;

    /** @param string[] $events */
    public function __construct(array &$events, object $processor)
    {
        $this->events = &$events;
        $this->processor = $processor;
    }

    /** @return object */
    public function getService(string $serviceName)
    {
        $this->events[] = 'get-service:' . $serviceName;

        return $this->processor;
    }
}
