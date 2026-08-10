<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\OAuth;

use Db;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleCredentialRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Security\SecretBox;

class GoogleCredentialRepositoryTest extends TestCase
{
    /** @var array<int, array<string, mixed>> */
    private $rows = [];

    /** @var Db&MockObject */
    private $db;

    /** @var GoogleCredentialRepository */
    private $repository;

    protected function setUp(): void
    {
        $this->rows = [];
        $this->db = $this->createMock(Db::class);
        $this->db->method('insert')->willReturnCallback(function (
            string $table,
            array $row,
            bool $nullValues,
            bool $useCache,
            int $type
        ): bool {
            self::assertSame('psxmarketingwithgoogle_connection', $table);
            self::assertTrue($nullValues);
            self::assertSame(Db::ON_DUPLICATE_KEY, $type);
            $this->rows[(int) $row['id_shop']] = $row;

            return true;
        });
        $this->db->method('getRow')->willReturnCallback(function ($query) {
            self::assertSame(1, preg_match('/id_shop = ([0-9]+)/', (string) $query, $match));

            return $this->rows[(int) $match[1]] ?? false;
        });
        $this->db->method('delete')->willReturnCallback(function (string $table, string $where): bool {
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
}
