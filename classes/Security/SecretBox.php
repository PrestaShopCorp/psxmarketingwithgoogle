<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\Security;

use InvalidArgumentException;
use LogicException;
use RuntimeException;
use UnexpectedValueException;

final class SecretBox
{
    /** @var string */
    private $key;

    public function __construct(?string $key = null)
    {
        if (!function_exists('sodium_crypto_secretbox')) {
            throw new RuntimeException('Authenticated secret storage is unavailable.');
        }

        if (null === $key) {
            if (!defined('_COOKIE_KEY_')) {
                throw new LogicException('The PrestaShop cookie key is unavailable.');
            }

            $key = hash('sha256', _COOKIE_KEY_ . '|psxmarketingwithgoogle', true);
        }

        if (SODIUM_CRYPTO_SECRETBOX_KEYBYTES !== strlen($key)) {
            throw new InvalidArgumentException('SecretBox keys must contain exactly 32 bytes.');
        }

        $this->key = $key;
    }

    public function encrypt(string $plaintext): string
    {
        $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $ciphertext = sodium_crypto_secretbox($plaintext, $nonce, $this->key);

        return base64_encode($nonce . $ciphertext);
    }

    public function decrypt(string $encodedCiphertext): string
    {
        $payload = base64_decode($encodedCiphertext, true);
        if (
            false === $payload
            || strlen($payload) < SODIUM_CRYPTO_SECRETBOX_NONCEBYTES + SODIUM_CRYPTO_SECRETBOX_MACBYTES
        ) {
            throw new UnexpectedValueException('The encrypted value is invalid.');
        }

        $nonce = substr($payload, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $ciphertext = substr($payload, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $plaintext = sodium_crypto_secretbox_open($ciphertext, $nonce, $this->key);
        if (false === $plaintext) {
            throw new UnexpectedValueException('The encrypted value failed authentication.');
        }

        return $plaintext;
    }
}
