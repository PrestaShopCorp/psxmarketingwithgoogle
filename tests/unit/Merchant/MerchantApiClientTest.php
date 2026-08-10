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

    public function testInsertProductInputUsesExactMerchantV1UrlAndJsonBody(): void
    {
        self::assertTrue(
            method_exists($this->client, 'insertProductInput'),
            'Merchant v1 ProductInput insertion must be implemented.'
        );
        $payload = [
            'offerId' => 'lamp-42',
            'contentLanguage' => 'en',
            'feedLabel' => 'US_MAIN',
            'productAttributes' => [
                'title' => 'Tiny Lux Lamp',
                'description' => 'Hand-finished lamp',
                'link' => 'https://thetinylux.com/products/lamp-42',
                'imageLink' => 'https://thetinylux.com/img/lamp-42.jpg',
                'availability' => 'IN_STOCK',
                'condition' => 'NEW',
                'price' => ['amountMicros' => '449990000', 'currencyCode' => 'USD'],
            ],
        ];
        $this->transport->queueJson(200, $payload + [
            'name' => 'accounts/123/productInputs/en~US_MAIN~lamp-42',
        ]);

        $response = $this->client->insertProductInput(
            'access-token-value',
            '123',
            'accounts/123/dataSources/456',
            $payload
        );

        self::assertSame('lamp-42', $response['offerId']);
        self::assertSame('POST', $this->transport->requests[0]['method']);
        self::assertSame(
            'https://merchantapi.googleapis.com/products/v1/accounts/123/productInputs:insert'
            . '?dataSource=accounts%2F123%2FdataSources%2F456',
            $this->transport->requests[0]['url']
        );
        self::assertSame(
            '{"offerId":"lamp-42","contentLanguage":"en","feedLabel":"US_MAIN",'
            . '"productAttributes":{"title":"Tiny Lux Lamp","description":"Hand-finished lamp",'
            . '"link":"https://thetinylux.com/products/lamp-42",'
            . '"imageLink":"https://thetinylux.com/img/lamp-42.jpg","availability":"IN_STOCK",'
            . '"condition":"NEW","price":{"amountMicros":"449990000","currencyCode":"USD"}}}',
            $this->transport->requests[0]['body']
        );
        self::assertContains('Authorization: Bearer access-token-value', $this->transport->requests[0]['headers']);
        self::assertContains('Content-Type: application/json', $this->transport->requests[0]['headers']);
    }

    public function testInsertProductInputRejectsInvalidOwnershipTokenAndExactPayloadShapeBeforeTransport(): void
    {
        $valid = $this->validProductInput();
        $invalidInputs = [
            ['token' => "bad\ntoken", 'account' => '123', 'source' => 'accounts/123/dataSources/456', 'payload' => $valid],
            ['token' => str_repeat('t', 16385), 'account' => '123', 'source' => 'accounts/123/dataSources/456', 'payload' => $valid],
            ['token' => 'token', 'account' => '123', 'source' => 'accounts/999/dataSources/456', 'payload' => $valid],
            ['token' => 'token', 'account' => '123', 'source' => 'accounts/123/dataSources/456', 'payload' => $valid + ['channel' => 'ONLINE']],
            ['token' => 'token', 'account' => '123', 'source' => 'accounts/123/dataSources/456', 'payload' => array_diff_key($valid, ['offerId' => true])],
            [
                'token' => 'token',
                'account' => '123',
                'source' => 'accounts/123/dataSources/456',
                'payload' => array_replace($valid, ['productAttributes' => $valid['productAttributes'] + ['customAttribute' => 'x']]),
            ],
            [
                'token' => 'token',
                'account' => '123',
                'source' => 'accounts/123/dataSources/456',
                'payload' => array_replace($valid, ['productAttributes' => array_diff_key(
                    $valid['productAttributes'],
                    ['price' => true]
                )]),
            ],
            [
                'token' => 'token',
                'account' => '123',
                'source' => 'accounts/123/dataSources/456',
                'payload' => array_replace($valid, ['productAttributes' => array_replace(
                    $valid['productAttributes'],
                    ['link' => 'https://user:pass@evil.example/product']
                )]),
            ],
            [
                'token' => 'token',
                'account' => '123',
                'source' => 'accounts/123/dataSources/456',
                'payload' => array_replace($valid, ['productAttributes' => array_replace(
                    $valid['productAttributes'],
                    ['title' => str_repeat('T', 151)]
                )]),
            ],
            [
                'token' => 'token',
                'account' => '123',
                'source' => 'accounts/123/dataSources/456',
                'payload' => array_replace($valid, ['productAttributes' => array_replace(
                    $valid['productAttributes'],
                    ['link' => 'https://thetinylux.com/' . str_repeat('p', 1978)]
                )]),
            ],
            [
                'token' => 'token',
                'account' => '123',
                'source' => 'accounts/123/dataSources/456',
                'payload' => array_replace($valid, ['productAttributes' => array_replace(
                    $valid['productAttributes'],
                    ['description' => str_repeat('x', 70000)]
                )]),
            ],
        ];

        foreach ($invalidInputs as $index => $input) {
            try {
                $this->client->insertProductInput(
                    $input['token'],
                    $input['account'],
                    $input['source'],
                    $input['payload']
                );
                self::fail('Invalid Merchant ProductInput case ' . $index . ' reached transport.');
            } catch (\InvalidArgumentException $exception) {
                self::assertSame([], $this->transport->requests, 'Invalid case ' . $index . ' must fail before transport.');
            }
        }
    }

    public function testInsertProductInputRejectsEmptyListOversizedAndIdentityMismatchedResponses(): void
    {
        $invalidResponses = [
            '',
            '[]',
            '{}',
            json_encode(array_replace($this->validProductInput(), ['offerId' => 'other-offer']), JSON_UNESCAPED_SLASHES),
            json_encode($this->validProductInput() + ['padding' => str_repeat('x', 70000)], JSON_UNESCAPED_SLASHES),
        ];

        foreach ($invalidResponses as $index => $body) {
            self::assertIsString($body);
            $transport = new MerchantRecordingTransport();
            $transport->queue(new Response(200, $body));
            $client = new MerchantApiClient($transport);
            try {
                $client->insertProductInput(
                    'access-token-value',
                    '123',
                    'accounts/123/dataSources/456',
                    $this->validProductInput()
                );
                self::fail('Malformed Merchant response case ' . $index . ' must be rejected.');
            } catch (GoogleApiException $exception) {
                self::assertSame('google_invalid_response', $exception->safeCode());
                self::assertStringNotContainsString('lamp-42', $exception->getMessage());
                self::assertStringNotContainsString('padding', $exception->getMessage());
            }
        }
    }

    public function testDataSourceValidationAllowsUnderscoreAndRejectsRegionalOrThreeLetterLanguage(): void
    {
        $this->client->validateDataSourceConfiguration('US_MAIN', 'en');
        self::assertSame([], $this->transport->requests);

        foreach (['eng', 'en-US'] as $language) {
            try {
                $this->client->validateDataSourceConfiguration('US_MAIN', $language);
                self::fail('Only exact two-letter lowercase content language is syncable.');
            } catch (\InvalidArgumentException $exception) {
                self::assertSame([], $this->transport->requests);
            }
        }
    }

    /** @return array<string, mixed> */
    private function validProductInput(): array
    {
        return [
            'offerId' => 'lamp-42',
            'contentLanguage' => 'en',
            'feedLabel' => 'US_MAIN',
            'productAttributes' => [
                'title' => 'Tiny Lux Lamp',
                'description' => 'Hand-finished lamp',
                'link' => 'https://thetinylux.com/products/lamp-42',
                'imageLink' => 'https://thetinylux.com/img/lamp-42.jpg',
                'availability' => 'IN_STOCK',
                'condition' => 'NEW',
                'price' => ['amountMicros' => '449990000', 'currencyCode' => 'USD'],
            ],
        ];
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
            'feed label punctuation' => ['en', 'GB.1'],
            'uppercase language' => ['EN', 'GB'],
            'three-letter language' => ['eng', 'GB'],
            'regional language' => ['en-GB', 'GB'],
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
