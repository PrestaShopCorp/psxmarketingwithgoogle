<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\Merchant;

use InvalidArgumentException;
use JsonException;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleTransportInterface;

final class MerchantApiClient
{
    private const ACCOUNTS_ROOT = 'https://merchantapi.googleapis.com/accounts/v1';
    private const DATASOURCES_ROOT = 'https://merchantapi.googleapis.com/datasources/v1';
    private const DISPLAY_NAME = 'Tiny Lux PrestaShop API';
    private const MAX_PAGES = 100;
    private const MAX_ITEMS = 1000;
    private const MAX_PAGE_TOKEN_BYTES = 2048;
    private const MAX_ACCESS_TOKEN_BYTES = 16384;

    /** @var GoogleTransportInterface */
    private $transport;

    public function __construct(GoogleTransportInterface $transport)
    {
        $this->transport = $transport;
    }

    /** @return array<int, array{id: string, name: string}> */
    public function listAccounts(string $accessToken): array
    {
        $accounts = [];
        $seenIds = [];
        $pageToken = null;
        $seenTokens = [];

        for ($page = 0; $page < self::MAX_PAGES; ++$page) {
            $url = self::ACCOUNTS_ROOT . '/accounts';
            if (null !== $pageToken) {
                $url .= '?pageToken=' . rawurlencode($pageToken);
            }
            $payload = $this->requestJson('GET', $url, $accessToken, null);
            $items = $this->listField($payload, 'accounts');
            foreach ($items as $item) {
                if (!is_array($item) || array_is_list($item)) {
                    throw $this->invalidResponse();
                }
                $resourceName = $item['name'] ?? null;
                $displayName = $item['accountName'] ?? null;
                if (!is_string($resourceName)
                    || 1 !== preg_match('#^accounts/([0-9]{1,20})$#D', $resourceName, $matches)
                    || !is_string($displayName)
                    || '' === trim($displayName)
                    || 255 < strlen($displayName)
                    || isset($seenIds[$matches[1]])
                ) {
                    throw $this->invalidResponse();
                }
                $seenIds[$matches[1]] = true;
                $accounts[] = ['id' => $matches[1], 'name' => trim($displayName)];
                if (self::MAX_ITEMS < count($accounts)) {
                    throw $this->invalidResponse();
                }
            }

            $pageToken = $this->nextPageToken($payload, $seenTokens);
            if (null === $pageToken) {
                return $accounts;
            }
        }

        throw $this->invalidResponse();
    }

    /** @return array{name: string, gcpIds: string[]} */
    public function developerRegistration(string $accessToken, string $accountId): array
    {
        $this->assertAccountId($accountId);
        try {
            $payload = $this->requestJson(
                'GET',
                self::ACCOUNTS_ROOT . '/accounts/' . $accountId . '/developerRegistration',
                $accessToken,
                null,
                true
            );
        } catch (GoogleApiException $exception) {
            if (404 === $exception->statusCode()) {
                throw $this->missingDeveloperRegistration();
            }

            throw $exception;
        }

        $expectedName = 'accounts/' . $accountId . '/developerRegistration';
        $name = $payload['name'] ?? null;
        $gcpIds = $payload['gcpIds'] ?? null;
        if ($expectedName !== $name || !is_array($gcpIds) || !array_is_list($gcpIds) || [] === $gcpIds) {
            throw $this->missingDeveloperRegistration();
        }
        $normalized = [];
        $seenGcpIds = [];
        foreach ($gcpIds as $gcpId) {
            if (!is_string($gcpId)
                || !$this->validGcpId($gcpId)
                || isset($seenGcpIds['gcp:' . $gcpId])
            ) {
                throw $this->missingDeveloperRegistration();
            }
            $seenGcpIds['gcp:' . $gcpId] = true;
            $normalized[] = $gcpId;
        }

        return ['name' => $expectedName, 'gcpIds' => $normalized];
    }

    /** @return array<int, array<string, mixed>> */
    public function listDataSources(string $accessToken, string $accountId): array
    {
        $this->assertAccountId($accountId);
        $dataSources = [];
        $seenNames = [];
        $pageToken = null;
        $seenTokens = [];

        for ($page = 0; $page < self::MAX_PAGES; ++$page) {
            $url = self::DATASOURCES_ROOT . '/accounts/' . $accountId . '/dataSources';
            if (null !== $pageToken) {
                $url .= '?pageToken=' . rawurlencode($pageToken);
            }
            $payload = $this->requestJson('GET', $url, $accessToken, null);
            foreach ($this->listField($payload, 'dataSources') as $item) {
                if (!is_array($item) || array_is_list($item)) {
                    throw $this->invalidResponse();
                }
                $normalized = $this->normalizeDataSource($item, $accountId);
                if (isset($seenNames[$normalized['name']])) {
                    throw $this->invalidResponse();
                }
                $seenNames[$normalized['name']] = true;
                $dataSources[] = $normalized;
                if (self::MAX_ITEMS < count($dataSources)) {
                    throw $this->invalidResponse();
                }
            }

            $pageToken = $this->nextPageToken($payload, $seenTokens);
            if (null === $pageToken) {
                return $dataSources;
            }
        }

        throw $this->invalidResponse();
    }

    /** @return array<string, mixed> */
    public function createPrimaryDataSource(
        string $accessToken,
        string $accountId,
        string $contentLanguage,
        string $feedLabel
    ): array {
        $this->assertAccountId($accountId);
        $this->assertContentLanguage($contentLanguage);
        $this->assertFeedLabel($feedLabel);
        $body = json_encode([
            'displayName' => self::DISPLAY_NAME,
            'primaryProductDataSource' => [
                'feedLabel' => $feedLabel,
                'contentLanguage' => $contentLanguage,
            ],
        ], JSON_UNESCAPED_SLASHES);
        if (!is_string($body)) {
            throw new GoogleApiException('Unable to create the Merchant data source.');
        }

        $payload = $this->requestJson(
            'POST',
            self::DATASOURCES_ROOT . '/accounts/' . $accountId . '/dataSources',
            $accessToken,
            $body
        );
        $dataSource = $this->normalizeDataSource($payload, $accountId);
        if (self::DISPLAY_NAME !== $dataSource['displayName']
            || 'API' !== $dataSource['input']
            || !isset($dataSource['primaryProductDataSource'])
            || [
                'feedLabel' => $feedLabel,
                'contentLanguage' => $contentLanguage,
            ] !== $dataSource['primaryProductDataSource']
        ) {
            throw $this->invalidResponse();
        }

        return $dataSource;
    }

    public static function displayName(): string
    {
        return self::DISPLAY_NAME;
    }

    public function validateDataSourceConfiguration(string $feedLabel, string $contentLanguage): void
    {
        $this->assertFeedLabel($feedLabel);
        $this->assertContentLanguage($contentLanguage);
    }

    /**
     * @param array<string, mixed> $payload
     *
     * @return array<int, mixed>
     */
    private function listField(array $payload, string $field): array
    {
        if (!array_key_exists($field, $payload)) {
            return [];
        }
        if (!is_array($payload[$field]) || !array_is_list($payload[$field])) {
            throw $this->invalidResponse();
        }

        return $payload[$field];
    }

    /**
     * @param array<string, mixed> $payload
     * @param array<string, bool> $seenTokens
     */
    private function nextPageToken(array $payload, array &$seenTokens): ?string
    {
        if (!array_key_exists('nextPageToken', $payload) || '' === $payload['nextPageToken']) {
            return null;
        }
        $token = $payload['nextPageToken'];
        if (!is_string($token)
            || self::MAX_PAGE_TOKEN_BYTES < strlen($token)
            || isset($seenTokens[$token])
        ) {
            throw $this->invalidResponse();
        }
        $seenTokens[$token] = true;

        return $token;
    }

    /**
     * @param array<string, mixed> $payload
     *
     * @return array<string, mixed>
     */
    private function normalizeDataSource(array $payload, string $accountId): array
    {
        $name = $payload['name'] ?? null;
        $displayName = $payload['displayName'] ?? null;
        $input = $payload['input'] ?? null;
        if (!is_string($name)
            || 1 !== preg_match(
                '#^accounts/' . preg_quote($accountId, '#') . '/dataSources/([0-9]{1,20})$#D',
                $name,
                $matches
            )
            || !is_string($displayName)
            || '' === trim($displayName)
            || 255 < strlen($displayName)
            || !is_string($input)
            || 1 !== preg_match('/^[A-Z][A-Z0-9_]{0,31}$/D', $input)
        ) {
            throw $this->invalidResponse();
        }
        $normalized = [
            'id' => $matches[1],
            'name' => $name,
            'displayName' => trim($displayName),
            'input' => $input,
        ];
        if (array_key_exists('primaryProductDataSource', $payload)) {
            $primary = $payload['primaryProductDataSource'];
            if (!is_array($primary) || array_is_list($primary)) {
                throw $this->invalidResponse();
            }
            $feedLabel = $primary['feedLabel'] ?? null;
            $contentLanguage = $primary['contentLanguage'] ?? null;
            if (!is_string($feedLabel) || !is_string($contentLanguage)) {
                throw $this->invalidResponse();
            }
            try {
                $this->assertFeedLabel($feedLabel);
                $this->assertContentLanguage($contentLanguage);
            } catch (InvalidArgumentException $exception) {
                unset($exception);
                throw $this->invalidResponse();
            }
            $normalized['primaryProductDataSource'] = [
                'feedLabel' => $feedLabel,
                'contentLanguage' => $contentLanguage,
            ];
        }

        return $normalized;
    }

    /** @return array<string, mixed> */
    private function requestJson(
        string $method,
        string $url,
        string $accessToken,
        ?string $body,
        bool $developerRegistration = false
    ): array {
        $this->assertAccessToken($accessToken);
        $headers = [
            'Authorization: Bearer ' . $accessToken,
            'Accept: application/json',
        ];
        if (null !== $body) {
            $headers[] = 'Content-Type: application/json';
        }
        $response = $this->transport->request($method, $url, $headers, $body);
        $status = $response->getStatusCode();
        if (200 > $status || 300 <= $status) {
            throw $this->requestFailure($status, $developerRegistration);
        }

        $raw = $response->getBody();
        if ('' === $raw || '{' !== substr(ltrim($raw), 0, 1)) {
            throw $this->invalidResponse();
        }
        try {
            $decoded = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            unset($exception);
            throw $this->invalidResponse();
        }
        if (!is_array($decoded)) {
            throw $this->invalidResponse();
        }

        return $decoded;
    }

    private function requestFailure(int $status, bool $developerRegistration): GoogleApiException
    {
        if (401 === $status) {
            return new GoogleApiException(
                'Google authorization must be renewed.',
                false,
                401,
                'google_reconnect_required'
            );
        }
        if (403 === $status) {
            return new GoogleApiException(
                'Merchant access or developer registration is required.',
                false,
                403,
                'merchant_access_required'
            );
        }
        if (404 === $status && $developerRegistration) {
            return $this->missingDeveloperRegistration();
        }
        if (429 === $status || 500 <= $status || 0 === $status) {
            return new GoogleApiException('Google Merchant is temporarily unavailable.', true, $status, 'google_retryable');
        }

        return new GoogleApiException('Google Merchant request failed.', false, $status, 'google_request_failed');
    }

    private function invalidResponse(): GoogleApiException
    {
        return new GoogleApiException('Google returned an invalid Merchant response.');
    }

    private function missingDeveloperRegistration(): GoogleApiException
    {
        return new GoogleApiException(
            'Merchant developer registration is missing or invalid.',
            false,
            404,
            'developer_registration_missing'
        );
    }

    private function assertAccessToken(string $accessToken): void
    {
        if ('' === $accessToken
            || self::MAX_ACCESS_TOKEN_BYTES < strlen($accessToken)
            || false !== strpos($accessToken, "\r")
            || false !== strpos($accessToken, "\n")
        ) {
            throw new InvalidArgumentException('A valid Google access token is required.');
        }
    }

    private function validGcpId(string $gcpId): bool
    {
        return 1 === preg_match('/^[0-9]{1,30}$/D', $gcpId)
            || 1 === preg_match('/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/D', $gcpId);
    }

    private function assertAccountId(string $accountId): void
    {
        if (1 !== preg_match('/^[0-9]{1,20}$/D', $accountId)) {
            throw new InvalidArgumentException('Merchant account ID must contain digits only.');
        }
    }

    private function assertFeedLabel(string $feedLabel): void
    {
        if (1 !== preg_match('/^[A-Z0-9-]{1,20}$/D', $feedLabel)) {
            throw new InvalidArgumentException('Feed label has an invalid format.');
        }
    }

    private function assertContentLanguage(string $contentLanguage): void
    {
        if (35 < strlen($contentLanguage)
            || 1 !== preg_match('/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8}){0,3}$/D', $contentLanguage)
        ) {
            throw new InvalidArgumentException('Content language has an invalid format.');
        }
    }
}
