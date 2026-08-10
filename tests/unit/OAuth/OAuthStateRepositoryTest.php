<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\OAuth;

use DateTimeImmutable;
use Db;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\OAuthStateRepository;
use UnexpectedValueException;

class OAuthStateRepositoryTest extends TestCase
{
    /** @var array<string, array<string, mixed>> */
    private $rows = [];

    /** @var int */
    private $affectedRows = 0;

    /** @var Db&MockObject */
    private $db;

    /** @var OAuthStateRepository */
    private $repository;

    protected function setUp(): void
    {
        $this->rows = [];
        $this->affectedRows = 0;
        $this->db = $this->createMock(Db::class);

        $this->db->method('insert')->willReturnCallback(function (string $table, array $row): bool {
            self::assertSame('psxmarketingwithgoogle_oauth_state', $table);
            $this->rows[$row['state_hash']] = $row;

            return true;
        });
        $this->db->method('getRow')->willReturnCallback(function ($query) {
            [$stateHash, $shopId] = $this->stateIdentityFromQuery((string) $query);
            if (!isset($this->rows[$stateHash]) || (int) $this->rows[$stateHash]['id_shop'] !== $shopId) {
                return false;
            }

            return $this->rows[$stateHash];
        });
        $this->db->method('execute')->willReturnCallback(function ($query): bool {
            $query = (string) $query;
            self::assertStringContainsString('consumed_at IS NULL', $query);
            self::assertStringContainsString('expires_at >= UTC_TIMESTAMP()', $query);

            [$stateHash, $shopId] = $this->stateIdentityFromQuery($query);
            $this->affectedRows = 0;
            if (!isset($this->rows[$stateHash])) {
                return true;
            }

            $row = &$this->rows[$stateHash];
            if (
                (int) $row['id_shop'] === $shopId
                && null === $row['consumed_at']
                && new DateTimeImmutable($row['expires_at'], new \DateTimeZone('UTC'))
                    >= new DateTimeImmutable('now', new \DateTimeZone('UTC'))
            ) {
                $row['consumed_at'] = gmdate('Y-m-d H:i:s');
                $this->affectedRows = 1;
            }

            return true;
        });
        $this->db->method('Affected_Rows')->willReturnCallback(function (): int {
            return $this->affectedRows;
        });

        $this->repository = new OAuthStateRepository($this->db);
    }

    public function testStateCanBeConsumedExactlyOnceWithinItsShop(): void
    {
        $rawState = $this->repository->issue(1, 7, new DateTimeImmutable('+5 minutes'));

        self::assertSame(7, $this->repository->consume($rawState, 1)['id_employee']);

        $this->expectException(UnexpectedValueException::class);
        $this->repository->consume($rawState, 1);
    }

    public function testStateIsPersistedOnlyAsItsHash(): void
    {
        $rawState = $this->repository->issue(1, 7, new DateTimeImmutable('+5 minutes'));
        $stored = reset($this->rows);

        self::assertIsArray($stored);
        self::assertSame(hash('sha256', $rawState), $stored['state_hash']);
        self::assertSame(64, strlen($stored['state_hash']));
        self::assertNotContains($rawState, $stored, true);
    }

    public function testExpiredStateCannotBeConsumed(): void
    {
        $rawState = $this->repository->issue(1, 7, new DateTimeImmutable('-1 second'));

        $this->expectException(UnexpectedValueException::class);
        $this->repository->consume($rawState, 1);
    }

    public function testCrossShopAttemptDoesNotConsumeState(): void
    {
        $rawState = $this->repository->issue(1, 7, new DateTimeImmutable('+5 minutes'));

        try {
            $this->repository->consume($rawState, 2);
            self::fail('A state issued for another shop must be rejected.');
        } catch (UnexpectedValueException $exception) {
            self::assertSame(7, $this->repository->consume($rawState, 1)['id_employee']);
        }
    }

    /**
     * @return array{0: string, 1: int}
     */
    private function stateIdentityFromQuery(string $query): array
    {
        self::assertSame(1, preg_match("/state_hash = '([a-f0-9]{64})'/", $query, $stateMatch));
        self::assertSame(1, preg_match('/id_shop = ([0-9]+)/', $query, $shopMatch));

        return [$stateMatch[1], (int) $shopMatch[1]];
    }
}
