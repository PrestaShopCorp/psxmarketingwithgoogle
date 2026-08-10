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
use Throwable;

final class GoogleCredentialRepository
{
    private const REQUIRED_FIELDS = [
        'client_id',
        'client_secret',
        'cron_token',
    ];

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
     * @param array<string, mixed> $connection
     */
    public function save(int $shopId, array $connection): void
    {
        $this->assertPositiveShopId($shopId);
        $this->assertSuppliedRequiredFields($connection);

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
     * Replace the OAuth client and invalidate all Google-account selections.
     *
     * The existing encrypted cron token is intentionally omitted so save()
     * retains its exact ciphertext in the same ON DUPLICATE KEY write. A first
     * import still receives save()'s generated high-entropy cron token.
     */
    public function replaceClientCredentials(int $shopId, string $clientId, string $clientSecret): void
    {
        $this->save($shopId, [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'refresh_token' => null,
            'google_email' => null,
            'merchant_account' => null,
            'data_source' => null,
        ]);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function find(int $shopId): ?array
    {
        $this->assertPositiveShopId($shopId);

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
        $this->assertPositiveShopId($shopId);

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

        try {
            $row = $this->db->getRow(
                'SELECT id_shop, client_id, client_secret, refresh_token, google_email,'
                . ' merchant_account, data_source, cron_token, created_at, updated_at'
                . ' FROM `' . bqSQL($table) . '`'
                . ' WHERE id_shop = ' . (int) $shopId
            );
        } catch (Throwable $exception) {
            unset($exception);

            throw new RuntimeException('Unable to read the Google connection.');
        }

        if (false === $row) {
            try {
                $hasDatabaseError = 0 !== (int) $this->db->getNumberError()
                    || '' !== trim((string) $this->db->getMsgError());
            } catch (Throwable $exception) {
                unset($exception);

                throw new RuntimeException('Unable to read the Google connection.');
            }

            if ($hasDatabaseError) {
                throw new RuntimeException('Unable to read the Google connection.');
            }

            return false;
        }

        if (!is_array($row)) {
            throw new RuntimeException('Unable to read the Google connection.');
        }

        return $row;
    }

    /**
     * @param array<string, mixed> $connection
     * @param array<string, mixed>|false $existing
     */
    private function plainValue(array $connection, $existing, string $field): ?string
    {
        if (array_key_exists($field, $connection)) {
            $value = $connection[$field];
            if (null !== $value && !is_string($value)) {
                throw new InvalidArgumentException(sprintf('Connection field "%s" must be a string or null.', $field));
            }

            return null === $value ? null : pSQL($value);
        }

        return false === $existing ? null : $existing[$field];
    }

    /**
     * @param array<string, mixed> $connection
     * @param array<string, mixed>|false $existing
     */
    private function encryptedValue(array $connection, $existing, string $field): ?string
    {
        if (array_key_exists($field, $connection)) {
            $value = $connection[$field];
            if (null !== $value && !is_string($value)) {
                throw new InvalidArgumentException(sprintf('Connection field "%s" must be a string or null.', $field));
            }

            return null === $value ? null : $this->secretBox->encrypt($value);
        }

        return false === $existing ? null : $existing[$field];
    }

    /**
     * @param array<string, mixed> $connection
     */
    private function assertRequiredString(array $connection, string $field): void
    {
        if (!isset($connection[$field]) || !is_string($connection[$field]) || '' === trim($connection[$field])) {
            throw new InvalidArgumentException(sprintf('Connection field "%s" is required.', $field));
        }
    }

    /**
     * @param array<string, mixed> $connection
     */
    private function assertSuppliedRequiredFields(array $connection): void
    {
        foreach (self::REQUIRED_FIELDS as $field) {
            if (array_key_exists($field, $connection)) {
                $this->assertRequiredString($connection, $field);
            }
        }
    }

    private function assertPositiveShopId(int $shopId): void
    {
        if (0 >= $shopId) {
            throw new InvalidArgumentException('Shop ID must be positive.');
        }
    }
}
