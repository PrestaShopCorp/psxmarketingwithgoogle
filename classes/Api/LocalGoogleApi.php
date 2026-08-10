<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\Api;

use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
use PrestaShop\Module\PsxMarketingWithGoogle\Merchant\MerchantAccountService;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleConnectionService;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleCredentialRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthRedirectUriResolver;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogFilterSettingsInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncProcessor;
use Throwable;

final class LocalGoogleApi
{
    public const CLIENT_ID_SUFFIX_LENGTH = 8;

    private const MAX_CLIENT_ID_BYTES = 2048;
    private const MAX_CLIENT_SECRET_BYTES = 4096;
    private const MAX_REDIRECT_URI_BYTES = 2048;
    private const MAX_REDIRECT_URIS = 20;

    private const ROUTES = [
        'GET settings/status' => 'settingsStatus',
        'POST settings/credentials' => 'saveCredentials',
        'GET oauth/authorized-url' => 'authorizationUrl',
        'GET oauth' => 'connectionStatus',
        'DELETE oauth' => 'disconnect',
        'GET merchant-accounts' => 'merchantAccounts',
        'POST merchant-accounts/select' => 'selectMerchantAccount',
        'GET merchant-data-sources' => 'dataSources',
        'POST merchant-data-sources' => 'createDataSource',
        'GET product-filters' => 'productFilters',
        'POST product-filters' => 'replaceProductFilters',
        'POST sync/jobs' => 'createSyncJob',
        'POST sync/jobs/run' => 'runSyncBatch',
        'GET sync/jobs/status' => 'syncStatus',
        'POST sync/jobs/retry' => 'retrySyncJob',
    ];

    /** @var GoogleCredentialRepository */
    private $credentials;

    /** @var GoogleConnectionService */
    private $connections;

    /** @var GoogleOAuthRedirectUriResolver */
    private $redirectUris;

    /** @var callable|null */
    private $shopIdProvider;

    /** @var callable|null */
    private $employeeIdProvider;

    /** @var MerchantAccountService|null */
    private $merchant;

    /** @var SyncProcessor|null */
    private $syncProcessor;

    /** @var CatalogFilterSettingsInterface|null */
    private $filterSettings;

    public function __construct(
        GoogleCredentialRepository $credentials,
        GoogleConnectionService $connections,
        GoogleOAuthRedirectUriResolver $redirectUris,
        ?callable $shopIdProvider = null,
        ?callable $employeeIdProvider = null,
        ?MerchantAccountService $merchant = null,
        ?SyncProcessor $syncProcessor = null,
        ?CatalogFilterSettingsInterface $filterSettings = null
    ) {
        $this->credentials = $credentials;
        $this->connections = $connections;
        $this->redirectUris = $redirectUris;
        $this->shopIdProvider = $shopIdProvider;
        $this->employeeIdProvider = $employeeIdProvider;
        $this->merchant = $merchant;
        $this->syncProcessor = $syncProcessor;
        $this->filterSettings = $filterSettings;
    }

    /** @param array<string, mixed> $body */
    public function dispatch(string $method, string $path, array $body = []): Response
    {
        $handler = self::ROUTES[$method . ' ' . $path] ?? null;
        if (null === $handler) {
            return $this->error(404, 'route_not_found');
        }

        try {
            return $this->$handler($body);
        } catch (GoogleApiException $exception) {
            return $this->googleError($exception);
        } catch (\InvalidArgumentException $exception) {
            unset($exception);

            return $this->error(422, 'invalid_request');
        } catch (Throwable $exception) {
            unset($exception);

            return $this->error(500, 'internal_error');
        }
    }

    /** @param array<string, mixed> $body */
    private function settingsStatus(array $body): Response
    {
        unset($body);
        $shopId = $this->shopId();
        $connection = $this->credentials->find($shopId);
        $clientId = null === $connection ? null : ($connection['client_id'] ?? null);
        $configured = is_string($clientId) && '' !== trim($clientId)
            && is_string($connection['client_secret'] ?? null)
            && '' !== trim($connection['client_secret']);

        return $this->json(200, [
            'configured' => $configured,
            'clientIdSuffix' => $configured ? $this->clientIdSuffix($clientId) : '',
            'redirectUri' => $this->redirectUris->resolve($shopId),
        ]);
    }

    /** @param array<string, mixed> $body */
    private function saveCredentials(array $body): Response
    {
        if (!$this->validCredentialEnvelope($body)) {
            return $this->error(422, 'invalid_web_client');
        }

        /** @var array<string, mixed> $web */
        $web = $body['web'];
        $clientId = trim($web['client_id']);
        $clientSecret = $web['client_secret'];
        $shopId = $this->shopId();
        $redirectUri = $this->redirectUris->resolve($shopId);
        if (!in_array($redirectUri, $web['redirect_uris'], true)) {
            return $this->error(422, 'invalid_web_client');
        }

        $this->credentials->replaceClientCredentials($shopId, $clientId, $clientSecret);

        return $this->json(200, [
            'configured' => true,
            'clientIdSuffix' => $this->clientIdSuffix($clientId),
            'redirectUri' => $redirectUri,
        ]);
    }

    /** @param array<string, mixed> $body */
    private function authorizationUrl(array $body): Response
    {
        unset($body);
        $shopId = $this->shopId();

        return $this->json(200, [
            'authorizedUrl' => $this->connections->authorizationUrl(
                $shopId,
                $this->employeeId(),
                $this->redirectUris->resolve($shopId)
            ),
        ]);
    }

    /** @param array<string, mixed> $body */
    private function connectionStatus(array $body): Response
    {
        unset($body);

        return $this->json(200, $this->connections->status($this->shopId()));
    }

    /** @param array<string, mixed> $body */
    private function disconnect(array $body): Response
    {
        unset($body);
        $this->connections->disconnect($this->shopId());

        return $this->json(200, ['connected' => false]);
    }

    /** @param array<string, mixed> $body */
    private function merchantAccounts(array $body): Response
    {
        if ([] !== $body) {
            return $this->error(422, 'invalid_request');
        }

        return $this->json(200, ['accounts' => $this->merchant()->accounts($this->shopId())]);
    }

    /** @param array<string, mixed> $body */
    private function selectMerchantAccount(array $body): Response
    {
        if (['accountId'] !== array_keys($body) || !is_string($body['accountId'])) {
            return $this->error(422, 'invalid_request');
        }

        return $this->json(200, [
            'account' => $this->merchant()->select($this->shopId(), $body['accountId']),
        ]);
    }

    /** @param array<string, mixed> $body */
    private function dataSources(array $body): Response
    {
        if ([] !== $body) {
            return $this->error(422, 'invalid_request');
        }

        return $this->json(200, ['dataSources' => $this->merchant()->dataSources($this->shopId())]);
    }

    /** @param array<string, mixed> $body */
    private function createDataSource(array $body): Response
    {
        $keys = array_keys($body);
        sort($keys);
        if (['contentLanguage', 'feedLabel'] !== $keys
            || !is_string($body['feedLabel'])
            || !is_string($body['contentLanguage'])
        ) {
            return $this->error(422, 'invalid_request');
        }

        return $this->json(200, [
            'dataSource' => $this->merchant()->createDataSource(
                $this->shopId(),
                $body['feedLabel'],
                $body['contentLanguage']
            ),
        ]);
    }

    /** @param array<string, mixed> $body */
    private function productFilters(array $body): Response
    {
        if ([] !== $body) {
            return $this->error(422, 'invalid_request');
        }

        return $this->json(200, [
            'filters' => $this->filterSettings()->filtersForShop($this->shopId()),
        ]);
    }

    /** @param array<string, mixed> $body */
    private function replaceProductFilters(array $body): Response
    {
        if (['filters'] !== array_keys($body)
            || !is_array($body['filters'])
            || !array_is_list($body['filters'])
        ) {
            return $this->error(422, 'invalid_request');
        }
        $shopId = $this->shopId();
        $this->filterSettings()->replaceForShop($shopId, $body['filters']);

        return $this->json(200, ['filters' => $body['filters']]);
    }

    /** @param array<string, mixed> $body */
    private function createSyncJob(array $body): Response
    {
        if (['full'] !== array_keys($body) || !is_bool($body['full'])) {
            return $this->error(422, 'invalid_request');
        }

        return $this->json(200, [
            'jobId' => $this->syncProcessor()->create($this->shopId(), $body['full']),
        ]);
    }

    /** @param array<string, mixed> $body */
    private function runSyncBatch(array $body): Response
    {
        $keys = array_keys($body);
        sort($keys);
        if (!in_array($keys, [['jobId'], ['jobId', 'limit']], true)
            || !$this->isPositiveInt($body['jobId'])
            || (array_key_exists('limit', $body) && !$this->isPositiveInt($body['limit']))
        ) {
            return $this->error(422, 'invalid_request');
        }
        $jobId = $body['jobId'];
        $limit = array_key_exists('limit', $body) ? $body['limit'] : 25;
        $shopId = $this->shopId();

        return $this->syncJobResponse(function () use ($shopId, $jobId, $limit): Response {
            return $this->json(200, $this->safeJobCounts(
                $this->syncProcessor()->runBatchForShop($shopId, $jobId, $limit),
                $jobId
            ));
        });
    }

    /** @param array<string, mixed> $body */
    private function syncStatus(array $body): Response
    {
        if (['jobId'] !== array_keys($body) || !$this->isPositiveInt($body['jobId'])) {
            return $this->error(422, 'invalid_request');
        }
        $jobId = $body['jobId'];
        $shopId = $this->shopId();

        return $this->syncJobResponse(function () use ($shopId, $jobId): Response {
            $status = $this->syncProcessor()->statusForShop($shopId, $jobId);
            $payload = $this->safeJobCounts($status, $jobId);
            $payload['errors'] = $this->safeSyncErrors($status['errors'] ?? null);

            return $this->json(200, $payload);
        });
    }

    /** @param array<string, mixed> $body */
    private function retrySyncJob(array $body): Response
    {
        if (['jobId'] !== array_keys($body) || !$this->isPositiveInt($body['jobId'])) {
            return $this->error(422, 'invalid_request');
        }
        $jobId = $body['jobId'];
        $shopId = $this->shopId();

        return $this->syncJobResponse(function () use ($shopId, $jobId): Response {
            $retriedJobId = $this->syncProcessor()->retryFailedForShop($shopId, $jobId);
            if ($retriedJobId !== $jobId) {
                throw new \RuntimeException('Synchronization retried an unexpected job.');
            }

            return $this->json(200, ['jobId' => $jobId]);
        });
    }

    /** @param array<string, mixed> $body */
    private function validCredentialEnvelope(array $body): bool
    {
        if (['web'] !== array_keys($body) || !is_array($body['web']) || array_is_list($body['web'])) {
            return false;
        }
        $web = $body['web'];
        $clientId = $web['client_id'] ?? null;
        $clientSecret = $web['client_secret'] ?? null;
        $redirectUris = $web['redirect_uris'] ?? null;
        if (!is_string($clientId) || '' === trim($clientId) || self::MAX_CLIENT_ID_BYTES < strlen($clientId)
            || !is_string($clientSecret) || '' === trim($clientSecret) || self::MAX_CLIENT_SECRET_BYTES < strlen($clientSecret)
            || !is_array($redirectUris) || !array_is_list($redirectUris)
            || 0 === count($redirectUris) || self::MAX_REDIRECT_URIS < count($redirectUris)
        ) {
            return false;
        }
        foreach ($redirectUris as $redirectUri) {
            if (!is_string($redirectUri) || '' === $redirectUri
                || self::MAX_REDIRECT_URI_BYTES < strlen($redirectUri)
            ) {
                return false;
            }
        }

        return true;
    }

    /** @param mixed $value */
    private function isPositiveInt($value): bool
    {
        return is_int($value) && 0 < $value;
    }

    /**
     * @param array<string, mixed> $status
     *
     * @return array{jobId: int, status: string, total: int, succeeded: int, failed: int, skipped: int, pending: int}
     */
    private function safeJobCounts(array $status, int $jobId): array
    {
        $state = $status['status'] ?? null;
        if (($status['id_job'] ?? null) !== $jobId
            || !is_string($state)
            || !in_array($state, ['pending', 'running', 'completed', 'partial', 'failed'], true)
        ) {
            throw new \RuntimeException('Synchronization returned an invalid job status.');
        }
        foreach (['total', 'succeeded', 'failed', 'skipped', 'pending'] as $count) {
            if (!isset($status[$count]) || !is_int($status[$count]) || 0 > $status[$count]) {
                throw new \RuntimeException('Synchronization returned invalid job counts.');
            }
        }
        if ($status['total'] !== $status['succeeded'] + $status['failed'] + $status['skipped'] + $status['pending']) {
            throw new \RuntimeException('Synchronization returned inconsistent job counts.');
        }

        return [
            'jobId' => $jobId,
            'status' => $state,
            'total' => $status['total'],
            'succeeded' => $status['succeeded'],
            'failed' => $status['failed'],
            'skipped' => $status['skipped'],
            'pending' => $status['pending'],
        ];
    }

    /**
     * @param mixed $errors
     *
     * @return array<int, array{offerKey: string, code: string, field: string|null, message: string}>
     */
    private function safeSyncErrors($errors): array
    {
        if (!is_array($errors) || !array_is_list($errors)) {
            throw new \RuntimeException('Synchronization returned invalid error summaries.');
        }
        $safe = [];
        foreach (array_slice($errors, 0, 25) as $error) {
            if (!is_array($error)
                || !is_string($error['offer_key'] ?? null)
                || !is_string($error['code'] ?? null)
                || (null !== ($error['field'] ?? null) && !is_string($error['field']))
                || !is_string($error['message'] ?? null)
            ) {
                throw new \RuntimeException('Synchronization returned an invalid error summary.');
            }
            $code = trim((string) preg_replace('/[^A-Za-z0-9_.:-]+/', '_', trim($error['code'])), '_');
            $message = strip_tags($error['message']);
            $message = (string) preg_replace(
                '/\bBearer\s+[A-Za-z0-9._~+\/=:-]+/i',
                'Bearer [REDACTED]',
                $message
            );
            $message = (string) preg_replace(
                '/("(?:access_token|refresh_token|client_secret|cron_token)"\s*:\s*")[^"]*(")/i',
                '$1[REDACTED]$2',
                $message
            );
            $message = (string) preg_replace(
                '/\b(access_token|refresh_token|client_secret|cron_token)\s*[=:]\s*[^\s&,;]+/i',
                '$1=[REDACTED]',
                $message
            );
            $message = $this->sanitizeOperatorText($message, 500);
            $safe[] = [
                'offerKey' => 1 === preg_match('/^[1-9][0-9]*-(?:0|[1-9][0-9]*)$/D', $error['offer_key'])
                    ? $error['offer_key']
                    : 'unknown',
                'code' => substr('' === $code ? 'sync_error' : $code, 0, 64),
                'field' => $this->sanitizeOperatorText($error['field'] ?? null, 191),
                'message' => null === $message || '' === $message ? 'Synchronization failed.' : $message,
            ];
        }

        return $safe;
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

    private function shopId(): int
    {
        $shopId = null === $this->shopIdProvider
            ? (int) \Context::getContext()->shop->id
            : (int) call_user_func($this->shopIdProvider);
        if (0 >= $shopId) {
            throw new \UnexpectedValueException('Active shop context is unavailable.');
        }

        return $shopId;
    }

    private function employeeId(): int
    {
        $employeeId = null === $this->employeeIdProvider
            ? (int) \Context::getContext()->employee->id
            : (int) call_user_func($this->employeeIdProvider);
        if (0 >= $employeeId) {
            throw new \UnexpectedValueException('Active employee context is unavailable.');
        }

        return $employeeId;
    }

    private function clientIdSuffix(string $clientId): string
    {
        return substr($clientId, -self::CLIENT_ID_SUFFIX_LENGTH);
    }

    private function merchant(): MerchantAccountService
    {
        if (null === $this->merchant) {
            throw new \LogicException('Merchant services are unavailable.');
        }

        return $this->merchant;
    }

    private function syncProcessor(): SyncProcessor
    {
        if (null === $this->syncProcessor) {
            throw new \LogicException('Product synchronization is unavailable.');
        }

        return $this->syncProcessor;
    }

    private function filterSettings(): CatalogFilterSettingsInterface
    {
        if (null === $this->filterSettings) {
            throw new \LogicException('Product filter settings are unavailable.');
        }

        return $this->filterSettings;
    }

    /** @param callable(): Response $operation */
    private function syncJobResponse(callable $operation): Response
    {
        try {
            return $operation();
        } catch (\UnexpectedValueException $exception) {
            unset($exception);

            return $this->error(404, 'sync_job_not_found');
        }
    }

    private function googleError(GoogleApiException $exception): Response
    {
        $status = $exception->statusCode();
        $safeCode = $exception->safeCode();
        if (null === $status) {
            return $this->error(412, 'google_not_configured');
        }
        if (502 === $status && 'google_invalid_response' === $safeCode) {
            return $this->error(502, 'google_invalid_response');
        }
        if (in_array($status, [401, 403, 404, 409, 429], true)) {
            return $this->error($status, $safeCode);
        }
        if (500 <= $status || $exception->isRetryable()) {
            return $this->error(503, 'google_retryable');
        }

        return $this->error(502, 'google_request_failed');
    }

    /** @param array<string, mixed> $payload */
    private function json(int $statusCode, array $payload): Response
    {
        $body = json_encode($payload, JSON_UNESCAPED_SLASHES);
        if (!is_string($body)) {
            return $this->error(500, 'internal_error');
        }

        return new Response($statusCode, $body, [
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
        ]);
    }

    private function error(int $statusCode, string $code): Response
    {
        return new Response($statusCode, '{"code":"' . $code . '"}', [
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
        ]);
    }
}
