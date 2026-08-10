<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\Merchant;

use InvalidArgumentException;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleConnectionService;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleCredentialRepository;

final class MerchantAccountService
{
    /** @var GoogleConnectionService */
    private $connections;

    /** @var MerchantApiClient */
    private $client;

    /** @var GoogleCredentialRepository */
    private $credentials;

    public function __construct(
        GoogleConnectionService $connections,
        MerchantApiClient $client,
        GoogleCredentialRepository $credentials
    ) {
        $this->connections = $connections;
        $this->client = $client;
        $this->credentials = $credentials;
    }

    /** @return array<int, array{id: string, name: string}> */
    public function accounts(int $shopId): array
    {
        return $this->client->listAccounts($this->connections->accessToken($shopId));
    }

    /** @return array{id: string, name: string} */
    public function select(int $shopId, string $accountId): array
    {
        $this->assertAccountId($accountId);
        $accessToken = $this->connections->accessToken($shopId);
        $selected = null;
        foreach ($this->client->listAccounts($accessToken) as $account) {
            if ($accountId === $account['id']) {
                $selected = $account;
                break;
            }
        }
        if (null === $selected) {
            throw new GoogleApiException('The Merchant account is not accessible.', false, 403, 'merchant_account_unavailable');
        }

        $this->client->developerRegistration($accessToken, $accountId);
        $connection = $this->credentials->find($shopId);
        if (null === $connection) {
            throw new GoogleApiException('Google connection requires authorization.');
        }
        $update = ['merchant_account' => $accountId];
        if ($accountId !== $connection['merchant_account']) {
            $update['data_source'] = null;
        }
        $this->credentials->save($shopId, $update);

        return $selected;
    }

    /** @return array<int, array<string, mixed>> */
    public function dataSources(int $shopId): array
    {
        $accountId = $this->selectedAccount($shopId);

        return $this->client->listDataSources($this->connections->accessToken($shopId), $accountId);
    }

    /** @return array<string, mixed> */
    public function createDataSource(int $shopId, string $feedLabel, string $contentLanguage): array
    {
        $this->client->validateDataSourceConfiguration($feedLabel, $contentLanguage);
        $accountId = $this->selectedAccount($shopId);
        $accessToken = $this->connections->accessToken($shopId);
        $expectedPrimary = [
            'feedLabel' => $feedLabel,
            'contentLanguage' => $contentLanguage,
        ];
        $matchingTinyLux = [];
        $hasConflict = false;
        foreach ($this->client->listDataSources($accessToken, $accountId) as $dataSource) {
            if (MerchantApiClient::displayName() === $dataSource['displayName']) {
                if ('API' !== $dataSource['input']
                    || !isset($dataSource['primaryProductDataSource'])
                    || $expectedPrimary !== $dataSource['primaryProductDataSource']
                ) {
                    $hasConflict = true;
                } else {
                    $matchingTinyLux[] = $dataSource;
                }
            }
        }
        if ($hasConflict) {
            throw new GoogleApiException('A Tiny Lux data source already exists with different settings.', false, 409, 'data_source_conflict');
        }
        if ([] !== $matchingTinyLux) {
            usort($matchingTinyLux, static function (array $left, array $right): int {
                return strcmp($left['name'], $right['name']);
            });
            $dataSource = $matchingTinyLux[0];
        } else {
            $dataSource = $this->client->createPrimaryDataSource(
                $accessToken,
                $accountId,
                $contentLanguage,
                $feedLabel
            );
        }

        $connection = $this->credentials->find($shopId);
        if (null === $connection || $accountId !== $connection['merchant_account']) {
            throw new GoogleApiException('The selected Merchant account changed.', false, 409, 'merchant_account_changed');
        }
        $this->credentials->save($shopId, ['data_source' => $dataSource['name']]);

        return $dataSource;
    }

    private function selectedAccount(int $shopId): string
    {
        $connection = $this->credentials->find($shopId);
        $accountId = null === $connection ? null : $connection['merchant_account'];
        if (!is_string($accountId) || 1 !== preg_match('/^[0-9]{1,20}$/D', $accountId)) {
            throw new GoogleApiException('A Merchant account must be selected first.', false, 409, 'merchant_account_required');
        }

        return $accountId;
    }

    private function assertAccountId(string $accountId): void
    {
        if (1 !== preg_match('/^[0-9]{1,20}$/D', $accountId)) {
            throw new InvalidArgumentException('Merchant account ID must contain digits only.');
        }
    }
}
