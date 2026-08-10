<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\OAuth;

use Db;
use InvalidArgumentException;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\Security\SecretBox;
use RuntimeException;

final class GoogleCredentialRepository
{
    private const OPTIONAL_FIELDS = [
        'refresh_token',
        'google_email',
        'merchant_account',
        'data_source',
        'cron_token',
    ];

    /** @var Db */
    private $db;

    /** @var SecretBox */
    private $secretBox;

    public function __construct(Db $db, SecretBox $secretBox)
    {
        $this->db = $db;
        $this->secretBox = $secretBox;
    }

    /**
     * Insert or replace the supplied fields for one shop.
     *
     * Missing optional fields retain their existing value. A new record gets a
     * generated high-entropy cron token when one is not supplied.
     *
     * @param array<string, string|null> $connection
     */
    public function save(int $shopId, array $connection): void
    {
        $existing = $this->findEncrypted($shopId);
        if (false === $existing) {
            $this->assertRequiredString($connection, 'client_id');
            $this->assertRequiredString($connection, 'client_secret');
        }

        $now = gmdate('Y-m-d H:i:s');
        $row = [
            'id_shop' => $shopId,
            'client_id' => $this->plainValue($connection, $existing, 'client_id'),
            'client_secret' => $this->encryptedValue($connection, $existing, 'client_secret'),
            'created_at' => false === $existing ? $now : $existing['created_at'],
            'updated_at' => $now,
        ];

        foreach (self::OPTIONAL_FIELDS as $field) {
            if ('cron_token' === $field && !array_key_exists($field, $connection) && false === $existing) {
                $connection[$field] = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
            }

            if (in_array($field, ['refresh_token', 'cron_token'], true)) {
                $row[$field] = $this->encryptedValue($connection, $existing, $field);
            } else {
                $row[$field] = $this->plainValue($connection, $existing, $field);
            }
        }

        if (!$this->db->insert(Config::CONNECTION_TABLE, $row, true, false, Db::ON_DUPLICATE_KEY)) {
            throw new RuntimeException('Unable to persist the Google connection.');
        }
    }

    /**
     * @return array<string, mixed>|null
     */
    public function find(int $shopId): ?array
    {
        $row = $this->findEncrypted($shopId);
        if (false === $row) {
            return null;
        }

        $row['id_shop'] = (int) $row['id_shop'];
        $row['client_secret'] = $this->secretBox->decrypt($row['client_secret']);
        $row['refresh_token'] = null === $row['refresh_token'] ? null : $this->secretBox->decrypt($row['refresh_token']);
        $row['cron_token'] = $this->secretBox->decrypt($row['cron_token']);

        return $row;
    }

    public function delete(int $shopId): void
    {
        if (!$this->db->delete(Config::CONNECTION_TABLE, 'id_shop = ' . (int) $shopId)) {
            throw new RuntimeException('Unable to delete the Google connection.');
        }
    }

    /**
     * @return array<string, mixed>|false
     */
    private function findEncrypted(int $shopId)
    {
        $table = _DB_PREFIX_ . Config::CONNECTION_TABLE;

        return $this->db->getRow(
            'SELECT id_shop, client_id, client_secret, refresh_token, google_email,'
            . ' merchant_account, data_source, cron_token, created_at, updated_at'
            . ' FROM `' . bqSQL($table) . '`'
            . ' WHERE id_shop = ' . (int) $shopId
        );
    }

    /**
     * @param array<string, string|null> $connection
     * @param array<string, mixed>|false $existing
     */
    private function plainValue(array $connection, $existing, string $field): ?string
    {
        if (array_key_exists($field, $connection)) {
            $value = $connection[$field];

            return null === $value ? null : pSQL($value);
        }

        return false === $existing ? null : $existing[$field];
    }

    /**
     * @param array<string, string|null> $connection
     * @param array<string, mixed>|false $existing
     */
    private function encryptedValue(array $connection, $existing, string $field): ?string
    {
        if (array_key_exists($field, $connection)) {
            return null === $connection[$field] ? null : $this->secretBox->encrypt($connection[$field]);
        }

        return false === $existing ? null : $existing[$field];
    }

    /**
     * @param array<string, string|null> $connection
     */
    private function assertRequiredString(array $connection, string $field): void
    {
        if (!isset($connection[$field]) || '' === trim($connection[$field])) {
            throw new InvalidArgumentException(sprintf('Connection field "%s" is required.', $field));
        }
    }
}
