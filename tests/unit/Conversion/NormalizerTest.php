<?php

namespace Conversion;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Conversion\Normalizer;

class NormalizerTest extends TestCase
{
    /**
     * @dataProvider dataToNormalizeProvider
     */
    public function testDataIsNormalized($input, $type, $expected): void
    {
        $this->assertSame($expected, Normalizer::normalize($input, $type));
    }

    public function dataToNormalizeProvider(): array
    {
        return [
            ['coucou', null, 'coucou'],
            ['S12 Some street in a big city', null, 's12 some street in a big city'],
            ['s12 Some street in a big city', null, 's12 some street in a big city'],
            [' coucou ', null, 'coucou'],
            ['CoUcOu', null, 'coucou'],
            [' CoUcOu ', null, 'coucou'],
            [' 0 1 2 3 4 5 ', null, '0 1 2 3 4 5'],
            ['(+1)  -1 2 31 23 45 67 ', 'phone', '+11231234567'],
            ['+11231234567', 'phone', '+11231234567'],
            ['0011231234567', 'phone', '+11231234567'],
        ];
    }

    /**
     * @dataProvider phoneDataToNormalizeProvider
     */
    public function testPhoneDataIsNormalized($input, $countryCode, $expected): void
    {
        $this->assertSame($expected, Normalizer::normalizeInE164($input, $countryCode));
    }

    public function phoneDataToNormalizeProvider(): array
    {
        return [
            ['0102030405', 'FR', '+33102030405'],
            ['+44102030405', 'GB', '+44102030405'],
            ['+44 102030405', 'GB', '+44102030405'],
            ['+44 102030405', null, '+44102030405'],
            ['0102030405', null, '0102030405'],
        ];
    }
}
