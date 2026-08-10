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
}
