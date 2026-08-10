<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\OAuth;

use DateTimeImmutable;
use DateTimeZone;
use Db;
use InvalidArgumentException;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use RuntimeException;
use UnexpectedValueException;

final class OAuthStateRepository
{
    /** @var Db */
    private $db;

    public function __construct(Db $db)
    {
        $this->db = $db;
    }

    public function issue(int $shopId, int $employeeId, DateTimeImmutable $expiresAt): string
    {
        $this->assertPositiveId($shopId, 'Shop');
        $this->assertPositiveId($employeeId, 'Employee');

        $rawState = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
        $stateHash = hash('sha256', $rawState);
        $expiresAtUtc = $expiresAt->setTimezone(new DateTimeZone('UTC'));

        $created = $this->db->insert(
            Config::OAUTH_STATE_TABLE,
            [
                'state_hash' => $stateHash,
                'id_shop' => $shopId,
                'id_employee' => $employeeId,
                'expires_at' => $expiresAtUtc->format('Y-m-d H:i:s'),
                'consumed_at' => null,
            ],
            true
        );
        if (!$created) {
            throw new RuntimeException('Unable to persist OAuth state.');
        }

        return $rawState;
    }

    public function consume(string $rawState, int $shopId): array
    {
        $this->assertPositiveId($shopId, 'Shop');

        $stateHash = hash('sha256', $rawState);
        $table = _DB_PREFIX_ . Config::OAUTH_STATE_TABLE;
        $identity = "state_hash = '" . pSQL($stateHash) . "' AND id_shop = " . (int) $shopId;
        $row = $this->db->getRow(
            'SELECT id_shop, id_employee, expires_at'
            . ' FROM `' . bqSQL($table) . '`'
            . ' WHERE ' . $identity
        );
        if (!is_array($row)) {
            throw new UnexpectedValueException('OAuth state is invalid.');
        }

        $consumed = $this->db->execute(
            'UPDATE `' . bqSQL($table) . '`'
            . ' SET consumed_at = UTC_TIMESTAMP()'
            . ' WHERE ' . $identity
            . ' AND consumed_at IS NULL'
            . ' AND expires_at >= UTC_TIMESTAMP()'
        );
        if (!$consumed) {
            throw new RuntimeException('Unable to consume OAuth state.');
        }
        if (1 !== (int) $this->db->Affected_Rows()) {
            throw new UnexpectedValueException('OAuth state is expired or has already been consumed.');
        }

        $row['id_shop'] = (int) $row['id_shop'];
        $row['id_employee'] = (int) $row['id_employee'];

        return $row;
    }

    /**
     * Resolve only the pending shop and employee context for a hashed state.
     * The caller must still invoke consume(); that atomic shop-bound update is
     * the authority and race gate.
     *
     * @return array{id_shop: int, id_employee: int}
     */
    public function findPendingContext(string $rawState): array
    {
        $stateHash = hash('sha256', $rawState);
        $table = _DB_PREFIX_ . Config::OAUTH_STATE_TABLE;
        $row = $this->db->getRow(
            'SELECT id_shop, id_employee'
            . ' FROM `' . bqSQL($table) . '`'
            . " WHERE state_hash = '" . pSQL($stateHash) . "'"
            . ' AND consumed_at IS NULL'
            . ' AND expires_at >= UTC_TIMESTAMP()'
        );
        if (!is_array($row)) {
            throw new UnexpectedValueException('OAuth state is invalid or expired.');
        }

        $shopId = (int) ($row['id_shop'] ?? 0);
        $employeeId = (int) ($row['id_employee'] ?? 0);
        if (0 >= $shopId || 0 >= $employeeId) {
            throw new UnexpectedValueException('OAuth state context is invalid.');
        }

        return ['id_shop' => $shopId, 'id_employee' => $employeeId];
    }

    private function assertPositiveId(int $id, string $name): void
    {
        if (0 >= $id) {
            throw new InvalidArgumentException($name . ' ID must be positive.');
        }
    }
}
