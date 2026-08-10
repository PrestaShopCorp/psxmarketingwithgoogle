<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
use RuntimeException;
use Throwable;

final class CronRequestHandler
{
    /** @var CronAuthorization */
    private $authorization;

    /** @var callable */
    private $runner;

    public function __construct(CronAuthorization $authorization, callable $runner)
    {
        $this->authorization = $authorization;
        $this->runner = $runner;
    }

    /** @param array<string, mixed> $query */
    public function handle(string $httpMethod, array $query): Response
    {
        if ('GET' !== $httpMethod) {
            return $this->error(405, 'method_not_allowed');
        }

        try {
            $request = $this->authorization->authorize($query);
            $result = ($this->runner)($request['shop'], $request['limit']);

            return $this->success($this->counts($result));
        } catch (CronAuthorizationException $exception) {
            return $exception->response();
        } catch (Throwable $exception) {
            unset($exception);

            return $this->error(500, 'sync_failed');
        }
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
            if (!isset($result[$field]) || !is_int($result[$field]) || 0 > $result[$field]) {
                throw new RuntimeException('Cron result is unavailable.');
            }
            $counts[$field] = $result[$field];
        }

        return $counts;
    }

    /** @param array{total: int, succeeded: int, failed: int, skipped: int, pending: int} $counts */
    private function success(array $counts): Response
    {
        return new Response(200, (string) json_encode($counts), $this->headers());
    }

    private function error(int $statusCode, string $code): Response
    {
        return new Response($statusCode, '{"code":"' . $code . '"}', $this->headers());
    }

    /** @return array<string, string> */
    private function headers(): array
    {
        return [
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
        ];
    }
}
