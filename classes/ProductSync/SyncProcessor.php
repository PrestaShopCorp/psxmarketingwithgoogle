<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use InvalidArgumentException;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
use Throwable;

final class SyncProcessor
{
    /** @var SyncJobStoreInterface */
    private $jobs;

    /** @var CatalogOfferSourceInterface */
    private $catalog;

    /** @var GoogleConnectionProviderInterface */
    private $connections;

    /** @var MerchantProductGatewayInterface */
    private $merchant;

    /** @var MerchantProductMapper */
    private $mapper;

    /** @var object */
    private $context;

    /** @param object $context Trusted active PrestaShop context. */
    public function __construct(
        SyncJobStoreInterface $jobs,
        CatalogOfferSourceInterface $catalog,
        GoogleConnectionProviderInterface $connections,
        MerchantProductGatewayInterface $merchant,
        MerchantProductMapper $mapper,
        $context
    ) {
        if (!is_object($context)) {
            throw new InvalidArgumentException('A trusted PrestaShop context is required.');
        }
        $this->jobs = $jobs;
        $this->catalog = $catalog;
        $this->connections = $connections;
        $this->merchant = $merchant;
        $this->mapper = $mapper;
        $this->context = $context;
    }

    public function create(int $shopId, bool $full): int
    {
        $this->assertCurrentShop($shopId);
        if (!$full) {
            throw new InvalidArgumentException('Incremental product synchronization is not available.');
        }
        $connection = $this->creationConnection($shopId);
        $accessToken = $this->connections->accessToken($shopId);
        $selected = null;
        foreach ($this->merchant->listDataSources($accessToken, $connection['merchantAccount']) as $dataSource) {
            if (($dataSource['name'] ?? null) === $connection['dataSource']) {
                $selected = $dataSource;
                break;
            }
        }
        if (!is_array($selected)
            || 'API' !== ($selected['input'] ?? null)
            || !isset($selected['primaryProductDataSource'])
            || !is_array($selected['primaryProductDataSource'])
            || !is_string($selected['primaryProductDataSource']['contentLanguage'] ?? null)
            || !is_string($selected['primaryProductDataSource']['feedLabel'] ?? null)
            || 1 !== preg_match('/^[a-z]{2}$/D', $selected['primaryProductDataSource']['contentLanguage'])
            || 1 !== preg_match('/^[A-Z0-9_-]{1,20}$/D', $selected['primaryProductDataSource']['feedLabel'])
        ) {
            throw new GoogleApiException('The selected Merchant data source is unavailable for synchronization.', false, 409, 'data_source_unavailable');
        }
        $contentLanguage = $selected['primaryProductDataSource']['contentLanguage'];
        $languageId = $this->currentLanguageIdFor($contentLanguage);

        return $this->jobs->createJob($shopId, [
            'merchant_id' => $connection['merchantAccount'],
            'data_source' => $connection['dataSource'],
            'prestashop_language_id' => $languageId,
            'content_language' => $contentLanguage,
            'feed_label' => $selected['primaryProductDataSource']['feedLabel'],
            'full_sync' => true,
        ], $this->catalog->offerKeys($shopId, $languageId));
    }

    /** @return array<string, mixed> */
    public function runBatch(int $jobId, int $limit = 25): array
    {
        return $this->runBatchForShop($this->currentShopId(), $jobId, $limit);
    }

    /** @return array<string, mixed> */
    public function runBatchForShop(int $shopId, int $jobId, int $limit = 25): array
    {
        if (0 >= $limit) {
            throw new InvalidArgumentException('Batch limit must be positive.');
        }
        $job = $this->jobs->findJob($shopId, $jobId);
        $connection = $this->runtimeConnection($shopId);
        if ($job['merchant_account'] !== $connection['merchantAccount']) {
            throw new GoogleApiException('The selected Merchant account changed after this job was created.', false, 409, 'merchant_account_changed');
        }

        $this->jobs->recoverStale($shopId, $jobId);
        $items = $this->jobs->claimPending($shopId, $jobId, min(25, $limit));
        if ([] === $items) {
            return $this->jobs->recount($shopId, $jobId);
        }
        try {
            $accessToken = $this->connections->accessToken($shopId);
        } catch (GoogleApiException $exception) {
            foreach ($items as $item) {
                $this->recordGoogleFailure($shopId, $jobId, $item['id_item'], $exception);
            }

            return $this->jobs->recount($shopId, $jobId);
        } catch (Throwable $exception) {
            unset($exception);
            foreach ($items as $item) {
                $this->jobs->recordFailure(
                    $shopId,
                    $jobId,
                    $item['id_item'],
                    false,
                    'internal_error',
                    null,
                    'An internal synchronization error occurred.'
                );
            }

            return $this->jobs->recount($shopId, $jobId);
        }

        foreach ($items as $item) {
            try {
                $product = $this->catalog->offer($item['offer_key'], $shopId, (int) $job['id_lang']);
                if (null === $product) {
                    $this->jobs->recordSkipped($shopId, $jobId, $item['id_item']);
                    continue;
                }
                $payload = $this->mapper->map(
                    $product,
                    (string) $job['content_language'],
                    (string) $job['feed_label']
                );
                $this->merchant->insertProductInput(
                    $accessToken,
                    (string) $job['merchant_account'],
                    (string) $job['data_source'],
                    $payload
                );
                $this->jobs->recordSuccess($shopId, $jobId, $item['id_item']);
            } catch (ProductValidationException $exception) {
                $error = $exception->errors()[0];
                $this->jobs->recordFailure(
                    $shopId,
                    $jobId,
                    $item['id_item'],
                    false,
                    $error['code'],
                    $error['field'],
                    'Product data needs attention before it can be synchronized.'
                );
            } catch (GoogleApiException $exception) {
                $this->recordGoogleFailure($shopId, $jobId, $item['id_item'], $exception);
            } catch (Throwable $exception) {
                unset($exception);
                $this->jobs->recordFailure(
                    $shopId,
                    $jobId,
                    $item['id_item'],
                    false,
                    'internal_error',
                    null,
                    'An internal synchronization error occurred.'
                );
            }
        }

        return $this->jobs->recount($shopId, $jobId);
    }

    public function retryFailed(int $jobId): int
    {
        return $this->retryFailedForShop($this->currentShopId(), $jobId);
    }

    public function retryFailedForShop(int $shopId, int $jobId): int
    {
        return $this->jobs->retryFailed($shopId, $jobId);
    }

    /** @return array<string, mixed> */
    public function status(int $jobId): array
    {
        return $this->statusForShop($this->currentShopId(), $jobId);
    }

    /** @return array<string, mixed> */
    public function statusForShop(int $shopId, int $jobId): array
    {
        $status = $this->jobs->recount($shopId, $jobId);
        $status['errors'] = $this->jobs->errorSummaries($shopId, $jobId);

        return $status;
    }

    private function recordGoogleFailure(
        int $shopId,
        int $jobId,
        int $itemId,
        GoogleApiException $exception
    ): void {
        $this->jobs->recordFailure(
            $shopId,
            $jobId,
            $itemId,
            $exception->isRetryable(),
            $exception->safeCode(),
            null,
            $exception->isRetryable()
                ? 'Google Merchant is temporarily unavailable.'
                : 'Google Merchant rejected the product request.'
        );
    }

    /** @return array{connected: bool, merchantAccount: string, dataSource: string} */
    private function creationConnection(int $shopId): array
    {
        $connection = $this->connections->status($shopId);
        if (true !== $connection['connected']
            || !is_string($connection['merchantAccount'])
            || 1 !== preg_match('/^[0-9]{1,20}$/D', $connection['merchantAccount'])
            || !is_string($connection['dataSource'])
            || 1 !== preg_match(
                '#^accounts/' . preg_quote($connection['merchantAccount'], '#') . '/dataSources/[0-9]{1,20}$#D',
                $connection['dataSource']
            )
        ) {
            throw new GoogleApiException('A connected Google user, Merchant account, and data source are required.', false, 409, 'merchant_connection_required');
        }

        return [
            'connected' => true,
            'merchantAccount' => $connection['merchantAccount'],
            'dataSource' => $connection['dataSource'],
        ];
    }

    /** @return array{connected: bool, merchantAccount: string} */
    private function runtimeConnection(int $shopId): array
    {
        $connection = $this->connections->status($shopId);
        if (true !== $connection['connected']
            || !is_string($connection['merchantAccount'])
            || 1 !== preg_match('/^[0-9]{1,20}$/D', $connection['merchantAccount'])
        ) {
            throw new GoogleApiException('A connected Google user and Merchant account are required.', false, 409, 'merchant_connection_required');
        }

        return [
            'connected' => true,
            'merchantAccount' => $connection['merchantAccount'],
        ];
    }

    private function assertCurrentShop(int $shopId): void
    {
        if ($shopId !== $this->currentShopId()) {
            throw new InvalidArgumentException('The requested shop is not the active trusted shop.');
        }
    }

    private function currentShopId(): int
    {
        $shopId = $this->context->shop->id ?? null;
        if (!is_int($shopId) && (!is_string($shopId) || 1 !== preg_match('/^[1-9][0-9]*$/D', $shopId))) {
            throw new InvalidArgumentException('The active shop context is invalid.');
        }
        $shopId = (int) $shopId;
        if (0 >= $shopId) {
            throw new InvalidArgumentException('The active shop context is invalid.');
        }

        return $shopId;
    }

    private function currentLanguageIdFor(string $contentLanguage): int
    {
        $languageId = $this->context->language->id ?? null;
        $languageIso = $this->context->language->iso_code ?? null;
        if (!is_int($languageId)
            && (!is_string($languageId) || 1 !== preg_match('/^[1-9][0-9]*$/D', $languageId))) {
            throw new GoogleApiException('The selected content language is unavailable in the active shop.', false, 409, 'content_language_unavailable');
        }
        $languageId = (int) $languageId;
        if (0 >= $languageId
            || !is_string($languageIso)
            || 1 !== preg_match('/^[a-z]{2}$/D', $languageIso)
            || $contentLanguage !== $languageIso
        ) {
            throw new GoogleApiException('The selected content language is unavailable in the active shop.', false, 409, 'content_language_unavailable');
        }

        return $languageId;
    }
}
