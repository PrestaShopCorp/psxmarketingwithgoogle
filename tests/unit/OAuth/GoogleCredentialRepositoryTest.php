<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\OAuth;

use Db;
use InvalidArgumentException;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleCredentialRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Security\SecretBox;
use RuntimeException;

class GoogleCredentialRepositoryTest extends TestCase
{
    /** @var array<int, array<string, mixed>> */
    private $rows = [];

    /** @var Db&MockObject */
    private $db;

    /** @var GoogleCredentialRepository */
    private $repository;

    /** @var int */
    private $readCalls = 0;

    /** @var int */
    private $writeCalls = 0;

    /** @var int */
    private $deleteCalls = 0;

    /** @var int */
    private $readErrorNumber = 0;

    /** @var string */
    private $readErrorMessage = '';

    /** @var RuntimeException|null */
    private $readException;

    protected function setUp(): void
    {
        $this->rows = [];
        $this->resetDatabaseCalls();
        $this->readErrorNumber = 0;
        $this->readErrorMessage = '';
        $this->readException = null;
        $this->db = $this->createMock(Db::class);
        $this->db->method('insert')->willReturnCallback(function (
            string $table,
            array $row,
            bool $nullValues,
            bool $useCache,
            int $type
        ): bool {
            ++$this->writeCalls;
            self::assertSame('psxmarketingwithgoogle_connection', $table);
            self::assertTrue($nullValues);
            self::assertSame(Db::ON_DUPLICATE_KEY, $type);
            $this->rows[(int) $row['id_shop']] = $row;

            return true;
        });
        $this->db->method('getRow')->willReturnCallback(function ($query) {
            ++$this->readCalls;
            if (null !== $this->readException) {
                throw $this->readException;
            }
            if (0 !== $this->readErrorNumber || '' !== $this->readErrorMessage) {
                return false;
            }

            self::assertSame(1, preg_match('/id_shop = ([0-9]+)/', (string) $query, $match));

            return $this->rows[(int) $match[1]] ?? false;
        });
        $this->db->method('getNumberError')->willReturnCallback(function (): int {
            return $this->readErrorNumber;
        });
        $this->db->method('getMsgError')->willReturnCallback(function (): string {
            return $this->readErrorMessage;
        });
        $this->db->method('delete')->willReturnCallback(function (string $table, string $where): bool {
            ++$this->deleteCalls;
            self::assertSame('psxmarketingwithgoogle_connection', $table);
            self::assertSame(1, preg_match('/id_shop = ([0-9]+)/', $where, $match));
            unset($this->rows[(int) $match[1]]);

            return true;
        });

        $this->repository = new GoogleCredentialRepository($this->db, new SecretBox(str_repeat('k', 32)));
    }

    public function testEncryptedConnectionCrudDoesNotPersistPlaintextSecrets(): void
    {
        $connection = [
            'client_id' => 'client-id-1',
            'client_secret' => 'client-secret-value',
            'refresh_token' => 'refresh-token-value',
            'google_email' => 'owner@example.com',
            'merchant_account' => 'merchant-123',
            'data_source' => 'accounts/123/dataSources/456',
            'cron_token' => 'cron-token-value',
        ];

        $this->repository->save(1, $connection);
        $stored = $this->rows[1];

        self::assertNotSame($connection['client_secret'], $stored['client_secret']);
        self::assertNotSame($connection['refresh_token'], $stored['refresh_token']);
        self::assertNotSame($connection['cron_token'], $stored['cron_token']);
        self::assertStringNotContainsString($connection['client_secret'], json_encode($stored));
        self::assertStringNotContainsString($connection['refresh_token'], json_encode($stored));
        self::assertStringNotContainsString($connection['cron_token'], json_encode($stored));

        $loaded = $this->repository->find(1);
        self::assertSame($connection['client_id'], $loaded['client_id']);
        self::assertSame($connection['client_secret'], $loaded['client_secret']);
        self::assertSame($connection['refresh_token'], $loaded['refresh_token']);
        self::assertSame($connection['cron_token'], $loaded['cron_token']);

        $this->repository->delete(1);
        self::assertNull($this->repository->find(1));
    }

    public function testConnectionsAreScopedByShop(): void
    {
        $this->repository->save(1, [
            'client_id' => 'client-id-1',
            'client_secret' => 'client-secret-1',
            'cron_token' => 'cron-token-1',
        ]);
        $this->repository->save(2, [
            'client_id' => 'client-id-2',
            'client_secret' => 'client-secret-2',
            'cron_token' => 'cron-token-2',
        ]);

        self::assertSame('client-id-1', $this->repository->find(1)['client_id']);
        self::assertSame('client-id-2', $this->repository->find(2)['client_id']);
        self::assertSame('client-secret-1', $this->repository->find(1)['client_secret']);
        self::assertSame('client-secret-2', $this->repository->find(2)['client_secret']);
    }

    public function testOmittedSecretsAndCronTokenPreserveExistingCiphertext(): void
    {
        $this->repository->save(1, [
            'client_id' => 'client-id-1',
            'client_secret' => 'client-secret-value',
            'refresh_token' => 'refresh-token-value',
            'cron_token' => 'cron-token-value',
        ]);
        $before = $this->rows[1];

        $this->repository->save(1, ['google_email' => 'new-owner@example.com']);
        $after = $this->rows[1];

        self::assertSame($before['client_id'], $after['client_id']);
        self::assertSame($before['client_secret'], $after['client_secret']);
        self::assertSame($before['refresh_token'], $after['refresh_token']);
        self::assertSame($before['cron_token'], $after['cron_token']);
        self::assertSame('client-secret-value', $this->repository->find(1)['client_secret']);
        self::assertSame('refresh-token-value', $this->repository->find(1)['refresh_token']);
        self::assertSame('cron-token-value', $this->repository->find(1)['cron_token']);
        self::assertSame('new-owner@example.com', $this->repository->find(1)['google_email']);
    }

    public function testInitialSaveGeneratesAnEncryptedHighEntropyCronToken(): void
    {
        $this->repository->save(1, [
            'client_id' => 'client-id-1',
            'client_secret' => 'client-secret-value',
        ]);

        $stored = $this->rows[1];
        $loaded = $this->repository->find(1);
        self::assertRegExp('/^[A-Za-z0-9_-]{43}$/', $loaded['cron_token']);
        self::assertNotSame($loaded['cron_token'], $stored['cron_token']);
        self::assertStringNotContainsString($loaded['cron_token'], json_encode($stored));
    }

    /**
     * @dataProvider invalidRequiredFieldProvider
     *
     * @param mixed $invalidValue
     */
    public function testExplicitInvalidRequiredFieldIsRejectedBeforeDatabaseAccess(
        string $field,
        $invalidValue
    ): void {
        $this->repository->save(1, [
            'client_id' => 'client-id-1',
            'client_secret' => 'client-secret-value',
            'refresh_token' => 'refresh-token-value',
            'cron_token' => 'cron-token-value',
        ]);
        $before = $this->rows;
        $this->resetDatabaseCalls();

        try {
            $this->repository->save(1, [$field => $invalidValue]);
            self::fail('An explicitly invalid required field must be rejected.');
        } catch (InvalidArgumentException $exception) {
            self::assertSame($before, $this->rows);
            self::assertSame(0, $this->readCalls);
            self::assertSame(0, $this->writeCalls);
            self::assertSame(0, $this->deleteCalls);
        }
    }

    public function invalidRequiredFieldProvider(): array
    {
        return [
            'null client ID' => ['client_id', null],
            'empty client ID' => ['client_id', ''],
            'blank client ID' => ['client_id', " \t"],
            'null client secret' => ['client_secret', null],
            'empty client secret' => ['client_secret', ''],
            'blank client secret' => ['client_secret', "\n"],
            'null cron token' => ['cron_token', null],
            'empty cron token' => ['cron_token', ''],
            'blank cron token' => ['cron_token', '   '],
            'non-string client ID' => ['client_id', 123],
        ];
    }

    /**
     * @dataProvider reportedReadErrorProvider
     */
    public function testFalseReadWithDatabaseErrorIsNotTreatedAsAbsence(
        int $errorNumber,
        string $errorMessage
    ): void
    {
        $this->readErrorNumber = $errorNumber;
        $this->readErrorMessage = $errorMessage;

        try {
            $this->repository->find(1);
            self::fail('A failed read must not be treated as a missing row.');
        } catch (RuntimeException $exception) {
            self::assertSame('Unable to read the Google connection.', $exception->getMessage());
            self::assertNull($exception->getPrevious());
            self::assertStringNotContainsString('SELECT', $exception->getMessage());
            self::assertStringNotContainsString('client-secret-value', $exception->getMessage());
        }
    }

    public function reportedReadErrorProvider(): array
    {
        return [
            'driver error number' => [2006, ''],
            'driver error message' => [0, 'SELECT failed near client-secret-value'],
        ];
    }

    public function testReadExceptionIsSanitizedAndUnchained(): void
    {
        $this->readException = new RuntimeException('SELECT failed near client-secret-value');

        try {
            $this->repository->find(1);
            self::fail('A thrown database read must be sanitized.');
        } catch (RuntimeException $exception) {
            self::assertSame('Unable to read the Google connection.', $exception->getMessage());
            self::assertNull($exception->getPrevious());
        }
    }

    public function testSaveStopsOnReadFailureWithoutMutatingPersistedData(): void
    {
        $this->repository->save(1, [
            'client_id' => 'client-id-1',
            'client_secret' => 'client-secret-value',
            'cron_token' => 'cron-token-value',
        ]);
        $before = $this->rows;
        $this->readErrorNumber = 2006;
        $this->readErrorMessage = 'database unavailable';
        $this->resetDatabaseCalls();

        try {
            $this->repository->save(1, ['google_email' => 'new-owner@example.com']);
            self::fail('A save must stop when its existing-row read fails.');
        } catch (RuntimeException $exception) {
            self::assertSame('Unable to read the Google connection.', $exception->getMessage());
            self::assertSame($before, $this->rows);
            self::assertSame(1, $this->readCalls);
            self::assertSame(0, $this->writeCalls);
        }
    }

    /**
     * @dataProvider invalidShopOperationProvider
     */
    public function testCredentialOperationsRejectNonPositiveShopIdsBeforeDatabaseAccess(
        string $operation,
        int $shopId
    ): void {
        $this->resetDatabaseCalls();

        try {
            if ('save' === $operation) {
                $this->repository->save($shopId, [
                    'client_id' => 'client-id-1',
                    'client_secret' => 'client-secret-value',
                ]);
            } elseif ('find' === $operation) {
                $this->repository->find($shopId);
            } else {
                $this->repository->delete($shopId);
            }
            self::fail('Credential operations require a positive shop ID.');
        } catch (InvalidArgumentException $exception) {
            self::assertSame([], $this->rows);
            self::assertSame(0, $this->readCalls);
            self::assertSame(0, $this->writeCalls);
            self::assertSame(0, $this->deleteCalls);
        }
    }

    public function invalidShopOperationProvider(): array
    {
        return [
            'save zero' => ['save', 0],
            'save negative' => ['save', -1],
            'find zero' => ['find', 0],
            'find negative' => ['find', -1],
            'delete zero' => ['delete', 0],
            'delete negative' => ['delete', -1],
        ];
    }

    private function resetDatabaseCalls(): void
    {
        $this->readCalls = 0;
        $this->writeCalls = 0;
        $this->deleteCalls = 0;
    }
}
