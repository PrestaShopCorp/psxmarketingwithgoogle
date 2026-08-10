<?php

namespace {
    if (!class_exists('Db')) {
        class Db
        {
            public const ON_DUPLICATE_KEY = 1;

            public function insert($table, $row, $nullValues = false, $useCache = true, $type = 1, $addPrefix = true)
            {
                unset($table, $row, $nullValues, $useCache, $type, $addPrefix);

                return true;
            }

            public function getRow($query, $useCache = true)
            {
                unset($useCache);
                unset($query);

                return false;
            }

            public function getNumberError()
            {
                return 0;
            }

            public function getMsgError()
            {
                return '';
            }

            public function delete($table, $where = '', $limit = 0, $useCache = true, $addPrefix = true)
            {
                unset($table, $limit, $useCache, $addPrefix);
                unset($where);

                return true;
            }
        }
    }

    if (!function_exists('pSQL')) {
        function pSQL($value)
        {
            return (string) $value;
        }
    }

    if (!function_exists('bqSQL')) {
        function bqSQL($value)
        {
            return (string) $value;
        }
    }

    if (!defined('_DB_PREFIX_')) {
        define('_DB_PREFIX_', 'ps_');
    }
}

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\Merchant {
    use PHPUnit\Framework\TestCase;
    use PrestaShop\Module\PsxMarketingWithGoogle\Api\LocalGoogleApi;
    use PrestaShop\Module\PsxMarketingWithGoogle\Google\GoogleApiException;
    use PrestaShop\Module\PsxMarketingWithGoogle\Merchant\MerchantAccountService;
    use PrestaShop\Module\PsxMarketingWithGoogle\Merchant\MerchantApiClient;
    use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleConnectionService;
    use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleCredentialRepository;
    use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthRedirectUriResolver;
    use PrestaShop\Module\PsxMarketingWithGoogle\Security\SecretBox;
    use ReflectionClass;

    class MerchantAccountServiceTest extends TestCase
    {
        /** @var \Db */
        private $db;

        /** @var GoogleCredentialRepository */
        private $credentials;

        /** @var MerchantRecordingTransport */
        private $transport;

        /** @var MerchantAccountService */
        private $service;

        /** @var array<int, array<string, mixed>> */
        private $credentialRows = [];

        protected function setUp(): void
        {
            $this->credentialRows = [];
            $this->db = $this->createMock(\Db::class);
            $this->configureDatabaseFake();
            $this->credentials = new GoogleCredentialRepository($this->db, new SecretBox(str_repeat('m', 32)));
            $this->credentials->save(1, [
                'client_id' => 'client-id',
                'client_secret' => 'client-secret',
                'refresh_token' => 'refresh-token',
                'merchant_account' => '999',
                'data_source' => 'accounts/999/dataSources/888',
            ]);
            $this->transport = new MerchantRecordingTransport();
            $this->service = new MerchantAccountService(
                $this->cachedConnection('server-only-access-token'),
                new MerchantApiClient($this->transport),
                $this->credentials
            );
        }

        public function testSelectValidatesAccessAndDeveloperRegistrationBeforeOnePersistedChange(): void
        {
            $before = $this->credentialRows[1];
            $this->transport->queueJson(200, ['accounts' => [
                ['name' => 'accounts/123', 'accountName' => 'Tiny Lux'],
            ]]);
            $this->transport->queueJson(200, [
                'name' => 'accounts/123/developerRegistration',
                'gcpIds' => ['123456789012'],
            ]);

            self::assertSame(['id' => '123', 'name' => 'Tiny Lux'], $this->service->select(1, '123'));
            self::assertSame('123', $this->credentials->find(1)['merchant_account']);
            self::assertNull($this->credentials->find(1)['data_source']);
            self::assertNotSame($before, $this->credentialRows[1]);
            self::assertCount(2, $this->transport->requests);
            self::assertStringContainsString('/accounts', $this->transport->requests[0]['url']);
            self::assertStringContainsString('/accounts/123/developerRegistration', $this->transport->requests[1]['url']);
        }

        public function testSelectPreservesDataSourceWhenAccountDoesNotChange(): void
        {
            $this->credentials->save(1, [
                'merchant_account' => '123',
                'data_source' => 'accounts/123/dataSources/456',
            ]);
            $this->transport->queueJson(200, ['accounts' => [
                ['name' => 'accounts/123', 'accountName' => 'Tiny Lux'],
            ]]);
            $this->transport->queueJson(200, [
                'name' => 'accounts/123/developerRegistration',
                'gcpIds' => ['123456789012'],
            ]);

            $this->service->select(1, '123');

            self::assertSame('accounts/123/dataSources/456', $this->credentials->find(1)['data_source']);
        }

        public function testSelectNeverMutatesOnInvalidInaccessibleOrUnregisteredAccount(): void
        {
            foreach (['abc', '12/3', '', ' 123'] as $invalidId) {
                try {
                    $this->service->select(1, $invalidId);
                    self::fail('Invalid account IDs must be rejected.');
                } catch (\InvalidArgumentException $exception) {
                    self::assertSame('999', $this->credentials->find(1)['merchant_account']);
                    self::assertCount(0, $this->transport->requests);
                }
            }

            $this->transport->queueJson(200, ['accounts' => [
                ['name' => 'accounts/456', 'accountName' => 'Other account'],
            ]]);
            try {
                $this->service->select(1, '123');
                self::fail('An inaccessible account must not be selected.');
            } catch (GoogleApiException $exception) {
                self::assertSame('merchant_account_unavailable', $exception->safeCode());
                self::assertSame('999', $this->credentials->find(1)['merchant_account']);
            }

            $this->transport->queueJson(200, ['accounts' => [
                ['name' => 'accounts/123', 'accountName' => 'Tiny Lux'],
            ]]);
            $this->transport->queue(new \PrestaShop\Module\PsxMarketingWithGoogle\Http\Response(404, '{"secret":"server-only-access-token"}'));
            try {
                $this->service->select(1, '123');
                self::fail('An unregistered account must not be selected.');
            } catch (GoogleApiException $exception) {
                self::assertSame('developer_registration_missing', $exception->safeCode());
                self::assertSame('999', $this->credentials->find(1)['merchant_account']);
                self::assertSame('accounts/999/dataSources/888', $this->credentials->find(1)['data_source']);
            }
        }

        public function testCreateDataSourceReusesOnlyAnExactNormalizedTinyLuxApiSource(): void
        {
            $this->credentials->save(1, ['merchant_account' => '123', 'data_source' => null]);
            $this->transport->queueJson(200, ['dataSources' => [[
                'name' => 'accounts/123/dataSources/456',
                'displayName' => 'Tiny Lux PrestaShop API',
                'input' => 'API',
                'primaryProductDataSource' => ['feedLabel' => 'GB', 'contentLanguage' => 'en'],
            ]]]);

            $source = $this->service->createDataSource(1, 'GB', 'en');

            self::assertSame('accounts/123/dataSources/456', $source['name']);
            self::assertSame('accounts/123/dataSources/456', $this->credentials->find(1)['data_source']);
            self::assertCount(1, $this->transport->requests);
            self::assertSame('GET', $this->transport->requests[0]['method']);
        }

        public function testCreateDataSourceRejectsConflictingTinyLuxSourceWithoutCreatingOrStoring(): void
        {
            $this->credentials->save(1, ['merchant_account' => '123', 'data_source' => null]);
            $this->transport->queueJson(200, ['dataSources' => [[
                'name' => 'accounts/123/dataSources/456',
                'displayName' => 'Tiny Lux PrestaShop API',
                'input' => 'API',
                'primaryProductDataSource' => ['feedLabel' => 'US', 'contentLanguage' => 'en'],
            ]]]);

            try {
                $this->service->createDataSource(1, 'GB', 'en');
                self::fail('Conflicting source settings must not create a duplicate.');
            } catch (GoogleApiException $exception) {
                self::assertSame(409, $exception->statusCode());
                self::assertSame('data_source_conflict', $exception->safeCode());
                self::assertNull($this->credentials->find(1)['data_source']);
                self::assertCount(1, $this->transport->requests);
            }
        }

        /**
         * @dataProvider tinyLuxSourceOrderingProvider
         *
         * @param array<int, array<string, mixed>> $dataSources
         */
        public function testCreateDataSourceRejectsAnyConflictingTinyLuxSourceRegardlessOfOrdering(array $dataSources): void
        {
            $this->credentials->save(1, ['merchant_account' => '123', 'data_source' => null]);
            $this->transport->queueJson(200, ['dataSources' => $dataSources]);

            try {
                $this->service->createDataSource(1, 'GB', 'en');
                self::fail('Any conflicting Tiny Lux source must fail the operation.');
            } catch (GoogleApiException $exception) {
                self::assertSame(409, $exception->statusCode());
                self::assertSame('data_source_conflict', $exception->safeCode());
                self::assertNull($this->credentials->find(1)['data_source']);
                self::assertCount(1, $this->transport->requests);
            }
        }

        /** @return array<string, array{0: array<int, array<string, mixed>>}> */
        public function tinyLuxSourceOrderingProvider(): array
        {
            $exact = [
                'name' => 'accounts/123/dataSources/100',
                'displayName' => 'Tiny Lux PrestaShop API',
                'input' => 'API',
                'primaryProductDataSource' => ['feedLabel' => 'GB', 'contentLanguage' => 'en'],
            ];
            $conflict = [
                'name' => 'accounts/123/dataSources/200',
                'displayName' => 'Tiny Lux PrestaShop API',
                'input' => 'FILE',
                'primaryProductDataSource' => ['feedLabel' => 'GB', 'contentLanguage' => 'en'],
            ];

            return [
                'exact then conflict' => [[$exact, $conflict]],
                'conflict then exact' => [[$conflict, $exact]],
            ];
        }

        public function testCreateDataSourceChoosesDeterministicExactTinyLuxSource(): void
        {
            $this->credentials->save(1, ['merchant_account' => '123', 'data_source' => null]);
            $this->transport->queueJson(200, ['dataSources' => [
                [
                    'name' => 'accounts/123/dataSources/900',
                    'displayName' => 'Tiny Lux PrestaShop API',
                    'input' => 'API',
                    'primaryProductDataSource' => ['feedLabel' => 'GB', 'contentLanguage' => 'en'],
                ],
                [
                    'name' => 'accounts/123/dataSources/100',
                    'displayName' => 'Tiny Lux PrestaShop API',
                    'input' => 'API',
                    'primaryProductDataSource' => ['feedLabel' => 'GB', 'contentLanguage' => 'en'],
                ],
            ]]);

            $source = $this->service->createDataSource(1, 'GB', 'en');

            self::assertSame('accounts/123/dataSources/100', $source['name']);
            self::assertSame($source['name'], $this->credentials->find(1)['data_source']);
            self::assertCount(1, $this->transport->requests);
        }

        public function testMalformedMerchantResponseMapsToSanitizedLocalBadGateway(): void
        {
            $sensitiveBody = '{"accounts":[{"name":"accounts/not-valid","accountName":"server-only-access-token"}]}';
            $this->transport->queue(new \PrestaShop\Module\PsxMarketingWithGoogle\Http\Response(200, $sensitiveBody));

            $response = $this->localApi()->dispatch('GET', 'merchant-accounts');

            self::assertSame(502, $response->getStatusCode());
            self::assertSame(['code' => 'google_invalid_response'], $this->json($response));
            self::assertStringNotContainsString($sensitiveBody, $response->getBody());
            self::assertStringNotContainsString('server-only-access-token', $response->getBody());
        }

        public function testCreateDataSourceRejectsCrossAccountResponseBeforePersistence(): void
        {
            $this->credentials->save(1, ['merchant_account' => '123', 'data_source' => null]);
            $this->transport->queueJson(200, ['dataSources' => []]);
            $this->transport->queueJson(200, [
                'name' => 'accounts/999/dataSources/456',
                'displayName' => 'Tiny Lux PrestaShop API',
                'input' => 'API',
                'primaryProductDataSource' => ['feedLabel' => 'GB', 'contentLanguage' => 'en'],
            ]);

            try {
                $this->service->createDataSource(1, 'GB', 'en');
                self::fail('A cross-account source response must be rejected.');
            } catch (GoogleApiException $exception) {
                self::assertSame('Google returned an invalid Merchant response.', $exception->getMessage());
                self::assertNull($this->credentials->find(1)['data_source']);
            }
        }

        public function testLocalRoutesUseStrictBodiesAndReturnOnlySafeShapes(): void
        {
            $this->credentials->save(1, ['merchant_account' => '123', 'data_source' => null]);
            $this->transport->queueJson(200, ['accounts' => [
                ['name' => 'accounts/123', 'accountName' => 'Tiny Lux'],
            ]]);
            $this->transport->queueJson(200, ['accounts' => [
                ['name' => 'accounts/123', 'accountName' => 'Tiny Lux'],
            ]]);
            $this->transport->queueJson(200, [
                'name' => 'accounts/123/developerRegistration',
                'gcpIds' => ['123456789012'],
            ]);
            $this->transport->queueJson(200, ['dataSources' => []]);
            $this->transport->queueJson(200, ['dataSources' => []]);
            $this->transport->queueJson(200, [
                'name' => 'accounts/123/dataSources/456',
                'displayName' => 'Tiny Lux PrestaShop API',
                'input' => 'API',
                'primaryProductDataSource' => ['feedLabel' => 'GB', 'contentLanguage' => 'en'],
            ]);
            $api = $this->localApi();

            self::assertSame(['accounts' => [['id' => '123', 'name' => 'Tiny Lux']]], $this->json(
                $api->dispatch('GET', 'merchant-accounts')
            ));
            self::assertSame(['account' => ['id' => '123', 'name' => 'Tiny Lux']], $this->json(
                $api->dispatch('POST', 'merchant-accounts/select', ['accountId' => '123'])
            ));
            self::assertSame(['dataSources' => []], $this->json(
                $api->dispatch('GET', 'merchant-data-sources')
            ));
            self::assertSame('456', $this->json(
                $api->dispatch('POST', 'merchant-data-sources', [
                    'feedLabel' => 'GB',
                    'contentLanguage' => 'en',
                ])
            )['dataSource']['id']);

            foreach ([
                ['POST', 'merchant-accounts/select', ['accountId' => 123]],
                ['POST', 'merchant-accounts/select', ['accountId' => '123', 'extra' => true]],
                ['GET', 'merchant-accounts', ['unexpected' => true]],
                ['GET', 'merchant-data-sources', ['unexpected' => true]],
                ['POST', 'merchant-data-sources', ['feedLabel' => 'GB', 'contentLanguage' => 'en', 'input' => 'API']],
            ] as $request) {
                $response = $api->dispatch($request[0], $request[1], $request[2]);
                self::assertSame(422, $response->getStatusCode());
                self::assertSame(['code' => 'invalid_request'], $this->json($response));
            }

            $serialized = json_encode([
                $this->json($api->dispatch('GET', 'oauth')),
                $this->json($api->dispatch('GET', 'merchant-data-sources')),
            ]);
            self::assertStringNotContainsString('server-only-access-token', (string) $serialized);
            self::assertStringNotContainsString('refresh-token', (string) $serialized);
            self::assertStringNotContainsString('client-secret', (string) $serialized);
        }

        private function cachedConnection(string $accessToken): GoogleConnectionService
        {
            $reflection = new ReflectionClass(GoogleConnectionService::class);
            /** @var GoogleConnectionService $connection */
            $connection = $reflection->newInstanceWithoutConstructor();
            $tokens = $reflection->getProperty('accessTokens');
            $tokens->setAccessible(true);
            $tokens->setValue($connection, [
                1 => ['access_token' => $accessToken, 'expires_at' => time() + 3600],
            ]);

            return $connection;
        }

        private function configureDatabaseFake(): void
        {
            $this->db->method('insert')->willReturnCallback(function (string $table, array $row): bool {
                if ('psxmarketingwithgoogle_connection' === $table) {
                    $this->credentialRows[(int) $row['id_shop']] = $row;
                }

                return true;
            });
            $this->db->method('getRow')->willReturnCallback(function ($query) {
                self::assertSame(1, preg_match('/id_shop = ([0-9]+)/', (string) $query, $match));

                return $this->credentialRows[(int) $match[1]] ?? false;
            });
            $this->db->method('getNumberError')->willReturn(0);
            $this->db->method('getMsgError')->willReturn('');
            $this->db->method('delete')->willReturn(true);
        }

        private function localApi(): LocalGoogleApi
        {
            return new LocalGoogleApi(
                $this->credentials,
                $this->cachedConnection('server-only-access-token'),
                new GoogleOAuthRedirectUriResolver(static function (): array {
                    return [
                        'domain_ssl' => 'thetinylux.com',
                        'physical_uri' => '/',
                        'virtual_uri' => '',
                    ];
                }),
                static function (): int { return 1; },
                static function (): int { return 7; },
                $this->service
            );
        }

        /** @return array<string, mixed> */
        private function json(\PrestaShop\Module\PsxMarketingWithGoogle\Http\Response $response): array
        {
            $decoded = json_decode($response->getBody(), true);
            self::assertIsArray($decoded);

            return $decoded;
        }
    }
}
