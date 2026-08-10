<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\Security;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Security\SecretBox;
use UnexpectedValueException;

class SecretBoxTest extends TestCase
{
    public function testCiphertextRoundTripsAndTamperingFails(): void
    {
        $box = new SecretBox(str_repeat('k', 32));
        $ciphertext = $box->encrypt('refresh-token');

        self::assertNotSame('refresh-token', $ciphertext);
        self::assertSame('refresh-token', $box->decrypt($ciphertext));

        $tampered = substr($ciphertext, 0, -2) . 'AA';
        $this->expectException(UnexpectedValueException::class);
        $box->decrypt($tampered);
    }

    public function testMalformedCiphertextIsRejected(): void
    {
        $box = new SecretBox(str_repeat('k', 32));

        $this->expectException(UnexpectedValueException::class);
        $box->decrypt('not-valid-base64!');
    }

    public function testDefaultKeyUsesThePrestaShopCookieKeyAndModuleContext(): void
    {
        $productionBox = new SecretBox();
        $expectedBox = new SecretBox(hash('sha256', _COOKIE_KEY_ . '|psxmarketingwithgoogle', true));

        self::assertSame('protected-value', $expectedBox->decrypt($productionBox->encrypt('protected-value')));
    }
}
