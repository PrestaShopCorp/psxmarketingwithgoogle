<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronAuthorization;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronRequestHandler;

class CronRequestHandlerTest extends TestCase
{
    private const RAW_TOKEN = 'handler-token-that-must-never-appear';

    public function testWrongTokenNeverInvokesExecutionRunner(): void
    {
        if (!class_exists(CronRequestHandler::class)) {
            self::fail('CronRequestHandler is not implemented.');
        }

        $invocations = 0;
        $handler = new CronRequestHandler(
            new CronAuthorization(static function (int $shopId): ?string {
                return 7 === $shopId ? 'correct-token' : null;
            }),
            static function () use (&$invocations): array {
                ++$invocations;

                return [];
            }
        );

        $response = $handler->handle('GET', $this->query(self::RAW_TOKEN));

        self::assertSame(403, $response->getStatusCode());
        self::assertSame('{"code":"forbidden"}', $response->getBody());
        self::assertSame('no-store', $response->getHeaders()['Cache-Control']);
        self::assertSame(0, $invocations);
    }

    public function testGetReturnsOnlyAllowlistedCountsAsNoStoreJson(): void
    {
        if (!class_exists(CronRequestHandler::class)) {
            self::fail('CronRequestHandler is not implemented.');
        }

        $handler = new CronRequestHandler(
            $this->authorization(),
            static function (int $shopId, int $limit): array {
                self::assertSame(7, $shopId);
                self::assertSame(25, $limit);

                return [
                    'id_job' => 41,
                    'status' => 'running',
                    'total' => 12,
                    'succeeded' => 8,
                    'failed' => 1,
                    'skipped' => 2,
                    'pending' => 1,
                    'errors' => [['message' => 'private detail']],
                ];
            }
        );

        $response = $handler->handle('GET', $this->query('correct-token', '900'));

        self::assertSame(200, $response->getStatusCode());
        self::assertSame(
            '{"total":12,"succeeded":8,"failed":1,"skipped":2,"pending":1}',
            $response->getBody()
        );
        self::assertSame([
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
        ], $response->getHeaders());
    }

    public function testNonGetRequestIsRejectedBeforeAuthorizationOrExecution(): void
    {
        if (!class_exists(CronRequestHandler::class)) {
            self::fail('CronRequestHandler is not implemented.');
        }

        $events = [];
        $handler = new CronRequestHandler(
            new CronAuthorization(static function () use (&$events): ?string {
                $events[] = 'authorize';

                return 'correct-token';
            }),
            static function () use (&$events): array {
                $events[] = 'run';

                return [];
            }
        );

        $response = $handler->handle('POST', $this->query('correct-token'));

        self::assertSame(405, $response->getStatusCode());
        self::assertSame('{"code":"method_not_allowed"}', $response->getBody());
        self::assertSame('no-store', $response->getHeaders()['Cache-Control']);
        self::assertSame([], $events);
    }

    public function testRuntimeFailureReturnsOneGenericBodyWithoutTokenOrUpstreamDetails(): void
    {
        if (!class_exists(CronRequestHandler::class)) {
            self::fail('CronRequestHandler is not implemented.');
        }

        $handler = new CronRequestHandler(
            $this->authorization(),
            static function (): array {
                throw new \RuntimeException('upstream body with token ' . self::RAW_TOKEN . ' and merchant details');
            }
        );

        $response = $handler->handle('GET', $this->query('correct-token'));

        self::assertSame(500, $response->getStatusCode());
        self::assertSame('{"code":"sync_failed"}', $response->getBody());
        self::assertSame('no-store', $response->getHeaders()['Cache-Control']);
        self::assertStringNotContainsString(self::RAW_TOKEN, $response->getBody());
        self::assertStringNotContainsString('merchant details', $response->getBody());
    }

    public function testContextFailureStopsBeforeProcessorResolutionAndReturnsGenericBody(): void
    {
        $processorResolved = false;
        $runner = new \PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronRunner(
            static function (): array {
                return ['id_job' => 41, 'id_lang' => 3];
            },
            static function (): void {
                throw new \RuntimeException('inactive shop detail');
            },
            static function () use (&$processorResolved) {
                $processorResolved = true;

                return null;
            }
        );
        $handler = new CronRequestHandler($this->authorization(), $runner);

        $response = $handler->handle('GET', $this->query('correct-token'));

        self::assertSame(500, $response->getStatusCode());
        self::assertSame('{"code":"sync_failed"}', $response->getBody());
        self::assertFalse($processorResolved);
        self::assertStringNotContainsString('inactive shop detail', $response->getBody());
    }

    private function authorization(): CronAuthorization
    {
        return new CronAuthorization(static function (int $shopId): ?string {
            return 7 === $shopId ? 'correct-token' : null;
        });
    }

    /** @return array<string, string> */
    private function query(string $token, string $limit = '25'): array
    {
        return [
            'shop' => '7',
            'token' => $token,
            'limit' => $limit,
        ];
    }
}
