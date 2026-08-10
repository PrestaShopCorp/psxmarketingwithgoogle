<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\Merchant;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleTransportInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
use PrestaShop\Module\PsxMarketingWithGoogle\Merchant\MerchantApiClient;

class MerchantApiClientTest extends TestCase
{
    /** @var MerchantRecordingTransport */
    private $transport;

    /** @var MerchantApiClient */
    private $client;

    protected function setUp(): void
    {
        $this->transport = new MerchantRecordingTransport();
        $this->client = new MerchantApiClient($this->transport);
    }

    public function testListAccountsNormalizesResourceNamesAndPaginatesWithEncodedTokens(): void
    {
        $this->transport->queueJson(200, [
            'accounts' => [['name' => 'accounts/123', 'accountName' => 'Tiny Lux']],
            'nextPageToken' => 'next token+/=',
        ]);
        $this->transport->queueJson(200, [
            'accounts' => [['name' => 'accounts/456', 'accountName' => 'Outlet']],
        ]);

        self::assertSame([
            ['id' => '123', 'name' => 'Tiny Lux'],
            ['id' => '456', 'name' => 'Outlet'],
        ], $this->client->listAccounts('access-token-value'));
        self::assertSame(
            'https://merchantapi.googleapis.com/accounts/v1/accounts',
            $this->transport->requests[0]['url']
        );
        self::assertSame(
            'https://merchantapi.googleapis.com/accounts/v1/accounts?pageToken=next%20token%2B%2F%3D',
            $this->transport->requests[1]['url']
        );
        foreach ($this->transport->requests as $request) {
            self::assertSame('GET', $request['method']);
            self::assertContains('Authorization: Bearer access-token-value', $request['headers']);
            self::assertStringNotContainsString('access-token-value', $request['url']);
            self::assertNull($request['body']);
        }
    }

    /**
     * @dataProvider malformedAccountResponseProvider
     *
     * @param array<string, mixed> $payload
     */
    public function testListAccountsRejectsMalformedArraysNamesAndDuplicates(array $payload): void
    {
        $this->transport->queueJson(200, $payload);

        $this->expectException(GoogleApiException::class);
        $this->expectExceptionMessage('Google returned an invalid Merchant response.');
        $this->client->listAccounts('access-token-value');
    }

    public function testMalformedUpstreamResponseHasExplicitSanitizedBadGatewayMetadata(): void
    {
        $sensitiveBody = '{"accounts":[{"name":"accounts/other","accountName":"access-token-value"}]}';
        $this->transport->queue(new Response(200, $sensitiveBody));

        try {
            $this->client->listAccounts('access-token-value');
            self::fail('Malformed upstream resources must be rejected.');
        } catch (GoogleApiException $exception) {
            self::assertSame(502, $exception->statusCode());
            self::assertSame('google_invalid_response', $exception->safeCode());
            self::assertFalse($exception->isRetryable());
            self::assertStringNotContainsString($sensitiveBody, $exception->getMessage());
            self::assertStringNotContainsString('access-token-value', $exception->getMessage());
        }
    }

    /** @return array<string, array{0: array<string, mixed>}> */
    public function malformedAccountResponseProvider(): array
    {
        return [
            'accounts is object' => [['accounts' => ['name' => 'accounts/123']]],
            'account entry is scalar' => [['accounts' => ['accounts/123']]],
            'account name has suffix' => [['accounts' => [['name' => 'accounts/123/children', 'accountName' => 'Tiny Lux']]]],
            'account id is not digits' => [['accounts' => [['name' => 'accounts/abc', 'accountName' => 'Tiny Lux']]]],
            'display name is not text' => [['accounts' => [['name' => 'accounts/123', 'accountName' => 123]]]],
            'duplicate account' => [['accounts' => [
                ['name' => 'accounts/123', 'accountName' => 'Tiny Lux'],
                ['name' => 'accounts/123', 'accountName' => 'Duplicate'],
            ]]],
            'next token is not text' => [['accounts' => [], 'nextPageToken' => 123]],
        ];
    }

    public function testListAccountsRejectsRepeatedPaginationTokenWithoutLooping(): void
    {
        $this->transport->queueJson(200, ['accounts' => [], 'nextPageToken' => 'repeat']);
        $this->transport->queueJson(200, ['accounts' => [], 'nextPageToken' => 'repeat']);

        try {
            $this->client->listAccounts('access-token-value');
            self::fail('A repeated token must terminate pagination.');
        } catch (GoogleApiException $exception) {
            self::assertSame('Google returned an invalid Merchant response.', $exception->getMessage());
            self::assertCount(2, $this->transport->requests);
        }
    }

    /**
     * @dataProvider googleFailureProvider
     */
    public function testGoogleFailuresUseSanitizedStatusAndRetryMetadata(
        int $status,
        string $safeCode,
        bool $retryable
    ): void {
        $sensitiveBody = '{"error":{"message":"access-token-value secret-response"}}';
        $this->transport->queue(new Response($status, $sensitiveBody));

        try {
            $this->client->listAccounts('access-token-value');
            self::fail('A failed Google request must throw.');
        } catch (GoogleApiException $exception) {
            self::assertSame($status, $exception->statusCode());
            self::assertSame($safeCode, $exception->safeCode());
            self::assertSame($retryable, $exception->isRetryable());
            self::assertStringNotContainsString($sensitiveBody, $exception->getMessage());
            self::assertStringNotContainsString('access-token-value', $exception->getMessage());
            self::assertNull($exception->getPrevious());
        }
    }

    /** @return array<string, array{0: int, 1: string, 2: bool}> */
    public function googleFailureProvider(): array
    {
        return [
            'unauthorized' => [401, 'google_reconnect_required', false],
            'forbidden' => [403, 'merchant_access_required', false],
            'rate limited' => [429, 'google_retryable', true],
            'server failure' => [503, 'google_retryable', true],
            'other failure' => [400, 'google_request_failed', false],
        ];
    }

    public function testDeveloperRegistrationRequiresAccountOwnedNameAndNonEmptyUniqueGcpIds(): void
    {
        $this->transport->queueJson(200, [
            'name' => 'accounts/123/developerRegistration',
            'gcpIds' => ['tiny-lux-project', '987654321098'],
        ]);

        self::assertSame([
            'name' => 'accounts/123/developerRegistration',
            'gcpIds' => ['tiny-lux-project', '987654321098'],
        ], $this->client->developerRegistration('access-token-value', '123'));
        self::assertSame(
            'https://merchantapi.googleapis.com/accounts/v1/accounts/123/developerRegistration',
            $this->transport->requests[0]['url']
        );

        foreach ([
            ['name' => 'accounts/999/developerRegistration', 'gcpIds' => ['123456789012']],
            ['name' => 'accounts/123/developerRegistration', 'gcpIds' => []],
            ['name' => 'accounts/123/developerRegistration', 'gcpIds' => ['INVALID_ID']],
            ['name' => 'accounts/123/developerRegistration', 'gcpIds' => ['123', '123']],
        ] as $payload) {
            $transport = new MerchantRecordingTransport();
            $transport->queueJson(200, $payload);
            try {
                (new MerchantApiClient($transport))->developerRegistration('access-token-value', '123');
                self::fail('Malformed developer registration must be rejected.');
            } catch (GoogleApiException $exception) {
                self::assertSame('developer_registration_missing', $exception->safeCode());
            }
        }
    }

    public function testMissingDeveloperRegistrationMaps404ToExplicitPrerequisite(): void
    {
        $this->transport->queue(new Response(404, '{"token":"access-token-value"}'));

        try {
            $this->client->developerRegistration('access-token-value', '123');
            self::fail('A missing registration must throw.');
        } catch (GoogleApiException $exception) {
            self::assertSame(404, $exception->statusCode());
            self::assertSame('developer_registration_missing', $exception->safeCode());
            self::assertFalse($exception->isRetryable());
            self::assertStringNotContainsString('access-token-value', $exception->getMessage());
        }
    }

    public function testDataSourcesNormalizeOnlyAccountOwnedResourcesAndPaginate(): void
    {
        $this->transport->queueJson(200, [
            'dataSources' => [[
                'name' => 'accounts/123/dataSources/456',
                'displayName' => 'Tiny Lux PrestaShop API',
                'input' => 'API',
                'primaryProductDataSource' => ['feedLabel' => 'GB', 'contentLanguage' => 'en'],
            ]],
            'nextPageToken' => 'next/source',
        ]);
        $this->transport->queueJson(200, ['dataSources' => [[
            'name' => 'accounts/123/dataSources/789',
            'displayName' => 'Legacy file',
            'input' => 'FILE',
            'primaryProductDataSource' => ['feedLabel' => 'US', 'contentLanguage' => 'en'],
        ]]]);

        self::assertSame([
            [
                'id' => '456',
                'name' => 'accounts/123/dataSources/456',
                'displayName' => 'Tiny Lux PrestaShop API',
                'input' => 'API',
                'primaryProductDataSource' => ['feedLabel' => 'GB', 'contentLanguage' => 'en'],
            ],
            [
                'id' => '789',
                'name' => 'accounts/123/dataSources/789',
                'displayName' => 'Legacy file',
                'input' => 'FILE',
                'primaryProductDataSource' => ['feedLabel' => 'US', 'contentLanguage' => 'en'],
            ],
        ], $this->client->listDataSources('access-token-value', '123'));
        self::assertSame(
            'https://merchantapi.googleapis.com/datasources/v1/accounts/123/dataSources?pageToken=next%2Fsource',
            $this->transport->requests[1]['url']
        );
    }

    public function testDataSourcesRejectCrossAccountMalformedAndDuplicateResources(): void
    {
        foreach ([
            ['dataSources' => 'not-a-list'],
            ['dataSources' => [['name' => 'accounts/999/dataSources/456', 'displayName' => 'Wrong account', 'input' => 'API']]],
            ['dataSources' => [['name' => 'accounts/123/dataSources/not-digits', 'displayName' => 'Bad ID', 'input' => 'API']]],
            ['dataSources' => [
                ['name' => 'accounts/123/dataSources/456', 'displayName' => 'One', 'input' => 'API'],
                ['name' => 'accounts/123/dataSources/456', 'displayName' => 'Two', 'input' => 'API'],
            ]],
        ] as $payload) {
            $transport = new MerchantRecordingTransport();
            $transport->queueJson(200, $payload);
            try {
                (new MerchantApiClient($transport))->listDataSources('access-token-value', '123');
                self::fail('Malformed data-source resources must be rejected.');
            } catch (GoogleApiException $exception) {
                self::assertSame('Google returned an invalid Merchant response.', $exception->getMessage());
            }
        }
    }

    public function testCreatePrimaryDataSourceSendsOnlyCurrentWritableV1Fields(): void
    {
        $this->transport->queueJson(200, [
            'name' => 'accounts/123/dataSources/456',
            'displayName' => 'Tiny Lux PrestaShop API',
            'input' => 'API',
            'primaryProductDataSource' => ['feedLabel' => 'GB', 'contentLanguage' => 'en'],
        ]);

        $created = $this->client->createPrimaryDataSource('access-token-value', '123', 'en', 'GB');

        self::assertSame('456', $created['id']);
        self::assertSame('POST', $this->transport->requests[0]['method']);
        self::assertSame(
            'https://merchantapi.googleapis.com/datasources/v1/accounts/123/dataSources',
            $this->transport->requests[0]['url']
        );
        self::assertContains('Authorization: Bearer access-token-value', $this->transport->requests[0]['headers']);
        self::assertSame([
            'displayName' => 'Tiny Lux PrestaShop API',
            'primaryProductDataSource' => [
                'feedLabel' => 'GB',
                'contentLanguage' => 'en',
            ],
        ], json_decode((string) $this->transport->requests[0]['body'], true));
        foreach (['type', 'input', 'channel', 'countries'] as $obsoleteField) {
            self::assertArrayNotHasKey($obsoleteField, json_decode((string) $this->transport->requests[0]['body'], true));
            self::assertArrayNotHasKey(
                $obsoleteField,
                json_decode((string) $this->transport->requests[0]['body'], true)['primaryProductDataSource']
            );
        }
        self::assertStringNotContainsString('access-token-value', (string) $this->transport->requests[0]['body']);
    }

    /**
     * @dataProvider invalidDataSourceInputProvider
     */
    public function testCreatePrimaryDataSourceRejectsUnsafeFeedLabelsAndLanguages(
        string $contentLanguage,
        string $feedLabel
    ): void {
        $this->expectException(\InvalidArgumentException::class);
        $this->client->createPrimaryDataSource('access-token-value', '123', $contentLanguage, $feedLabel);
    }

    /** @return array<string, array{0: string, 1: string}> */
    public function invalidDataSourceInputProvider(): array
    {
        return [
            'lowercase feed label' => ['en', 'gb'],
            'feed label too long' => ['en', str_repeat('A', 21)],
            'feed label punctuation' => ['en', 'GB_1'],
            'uppercase language' => ['EN', 'GB'],
            'language injection' => ['en/../../x', 'GB'],
        ];
    }
}

final class MerchantRecordingTransport implements GoogleTransportInterface
{
    /** @var Response[] */
    private $responses = [];

    /** @var array<int, array{method: string, url: string, headers: array<int, string>, body: string|null}> */
    public $requests = [];

    /** @param array<string, mixed> $payload */
    public function queueJson(int $status, array $payload): void
    {
        $body = json_encode($payload, JSON_UNESCAPED_SLASHES);
        if (!is_string($body)) {
            throw new \LogicException('Unable to encode a fake Merchant response.');
        }
        $this->responses[] = new Response($status, $body);
    }

    public function queue(Response $response): void
    {
        $this->responses[] = $response;
    }

    public function request(string $method, string $url, array $headers, ?string $body): Response
    {
        $this->requests[] = compact('method', 'url', 'headers', 'body');
        if ([] === $this->responses) {
            return new Response(500, 'No fake response configured.');
        }

        return array_shift($this->responses);
    }
}
