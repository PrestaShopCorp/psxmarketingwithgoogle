<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronAuthorization;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronAuthorizationException;

class CronAuthorizationTest extends TestCase
{
    private const RAW_TOKEN = 'cron-token-that-must-never-appear';

    public function testValidCredentialsReturnParsedShopAndDefaultLimit(): void
    {
        $authorization = new CronAuthorization(static function (int $shopId): ?string {
            self::assertSame(7, $shopId);

            return 'correct-token';
        });

        self::assertSame([
            'shop' => 7,
            'limit' => 25,
        ], $authorization->authorize([
            'shop' => '7',
            'token' => 'correct-token',
        ]));
    }

    public function testAuthorizedLimitIsClampedWhileRoutingKeysAreIgnored(): void
    {
        $authorization = new CronAuthorization(static function (int $shopId): ?string {
            return 7 === $shopId ? 'correct-token' : null;
        });

        self::assertSame([
            'shop' => 7,
            'limit' => 25,
        ], $authorization->authorize([
            'shop' => '7',
            'token' => 'correct-token',
            'limit' => '900',
            'fc' => 'module',
            'module' => 'psxmarketingwithgoogle',
            'controller' => 'cron',
        ]));
    }

    public function testRepositoryRowSuppliesTheDecryptedPerShopCronToken(): void
    {
        $repository = new CronCredentialRepositoryDouble([
            'id_shop' => 7,
            'cron_token' => 'decrypted-correct-token',
        ]);
        $authorization = new CronAuthorization($repository);

        self::assertSame([
            'shop' => 7,
            'limit' => 25,
        ], $authorization->authorize([
            'shop' => '7',
            'token' => 'decrypted-correct-token',
        ]));
        self::assertSame([7], $repository->shops);
    }

    public function testMissingAndMalformedQueryValuesAreForbiddenBeforeCredentialLookup(): void
    {
        $queries = [
            'missing shop' => ['token' => self::RAW_TOKEN],
            'zero shop' => ['shop' => '0', 'token' => self::RAW_TOKEN],
            'noncanonical shop' => ['shop' => '07', 'token' => self::RAW_TOKEN],
            'array shop' => ['shop' => ['7'], 'token' => self::RAW_TOKEN],
            'missing token' => ['shop' => '7'],
            'empty token' => ['shop' => '7', 'token' => ''],
            'oversized token' => ['shop' => '7', 'token' => str_repeat('t', 513)],
            'zero limit' => ['shop' => '7', 'token' => self::RAW_TOKEN, 'limit' => '0'],
            'noncanonical limit' => ['shop' => '7', 'token' => self::RAW_TOKEN, 'limit' => '025'],
            'array limit' => ['shop' => '7', 'token' => self::RAW_TOKEN, 'limit' => [25]],
        ];

        foreach ($queries as $name => $query) {
            $lookups = 0;
            $authorization = new CronAuthorization(static function () use (&$lookups): ?string {
                ++$lookups;

                return 'correct-token';
            });

            $response = $this->forbiddenResponse($authorization, $query);
            self::assertSame(403, $response->getStatusCode(), $name);
            self::assertSame('{"code":"forbidden"}', $response->getBody(), $name);
            self::assertSame('no-store', $response->getHeaders()['Cache-Control'], $name);
            self::assertSame(0, $lookups, $name);
            self::assertStringNotContainsString(self::RAW_TOKEN, $response->getBody(), $name);
        }
    }

    public function testWrongTokenUsesTheComparatorAndReturnsTheSameNonDisclosingForbiddenResponse(): void
    {
        if (!class_exists(CronAuthorization::class)) {
            self::fail('CronAuthorization is not implemented.');
        }

        $comparisons = [];
        $authorization = new CronAuthorization(
            static function (int $shopId): ?string {
                self::assertSame(7, $shopId);

                return 'correct-token';
            },
            static function (string $known, string $provided) use (&$comparisons): bool {
                $comparisons[] = [$known, $provided];

                return hash_equals($known, $provided);
            }
        );

        $response = $this->forbiddenResponse($authorization, [
            'shop' => '7',
            'token' => self::RAW_TOKEN,
            'limit' => '25',
        ]);

        self::assertSame(403, $response->getStatusCode());
        self::assertSame('{"code":"forbidden"}', $response->getBody());
        self::assertSame('no-store', $response->getHeaders()['Cache-Control']);
        self::assertCount(1, $comparisons);
        self::assertSame('correct-token', $comparisons[0][0]);
        self::assertSame(self::RAW_TOKEN, $comparisons[0][1]);
        self::assertStringNotContainsString(self::RAW_TOKEN, $response->getBody());
    }

    public function testMissingMalformedWrongAndUnknownCredentialsShareOneBodyWithoutRawTokenLeak(): void
    {
        if (!class_exists(CronAuthorization::class)) {
            self::fail('CronAuthorization is not implemented.');
        }

        $failures = [
            new CronAuthorization(static function (int $shopId): ?string {
                unset($shopId);

                return null;
            }),
            new CronAuthorization(static function (int $shopId): ?string {
                throw new \RuntimeException('Unknown shop ' . $shopId);
            }),
            new CronAuthorization(static function (int $shopId): ?string {
                unset($shopId);

                return 'correct-token';
            }),
        ];
        $queries = [
            ['shop' => '7', 'token' => self::RAW_TOKEN, 'limit' => '25'],
            ['shop' => '999', 'token' => self::RAW_TOKEN, 'limit' => '25'],
            ['shop' => '7', 'token' => "malformed\0" . self::RAW_TOKEN, 'limit' => '25'],
        ];

        $bodies = [];
        foreach ($failures as $index => $authorization) {
            $response = $this->forbiddenResponse($authorization, $queries[$index]);
            self::assertSame(403, $response->getStatusCode());
            self::assertStringNotContainsString(self::RAW_TOKEN, $response->getBody());
            $bodies[] = $response->getBody();
        }

        self::assertSame(['{"code":"forbidden"}'], array_values(array_unique($bodies)));
    }

    /** @param array<string, mixed> $query */
    private function forbiddenResponse(CronAuthorization $authorization, array $query)
    {
        try {
            $authorization->authorize($query);
            self::fail('Authorization must fail.');
        } catch (CronAuthorizationException $exception) {
            self::assertStringNotContainsString(self::RAW_TOKEN, $exception->getMessage());

            return $exception->response();
        }
    }
}

final class CronCredentialRepositoryDouble
{
    /** @var array<string, mixed>|null */
    private $row;

    /** @var int[] */
    public $shops = [];

    /** @param array<string, mixed>|null $row */
    public function __construct(?array $row)
    {
        $this->row = $row;
    }

    /** @return array<string, mixed>|null */
    public function find(int $shopId): ?array
    {
        $this->shops[] = $shopId;

        return $this->row;
    }
}
