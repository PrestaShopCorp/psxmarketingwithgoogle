<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CatalogProduct;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\MerchantProductMapper;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\ProductValidationException;

class MerchantProductMapperTest extends TestCase
{
    /** @var MerchantProductMapper */
    private $mapper;

    protected function setUp(): void
    {
        $this->mapper = new MerchantProductMapper();
    }

    public function testMapsRequiredMerchantFieldsAndPriceMicros(): void
    {
        $product = new CatalogProduct(
            '42-7',
            'Silk Lamp',
            'Hand-finished lamp',
            'https://thetinylux.com/lamp',
            'https://thetinylux.com/img/lamp.jpg',
            true,
            '449.99',
            'EUR',
            'Tiny Lux',
            '5060123456789',
            'TL-LAMP-42'
        );

        self::assertSame([
            'offerId' => '42-7',
            'contentLanguage' => 'en',
            'feedLabel' => 'GB',
            'productAttributes' => [
                'title' => 'Silk Lamp',
                'description' => 'Hand-finished lamp',
                'link' => 'https://thetinylux.com/lamp',
                'imageLink' => 'https://thetinylux.com/img/lamp.jpg',
                'availability' => 'IN_STOCK',
                'condition' => 'NEW',
                'price' => ['amountMicros' => '449990000', 'currencyCode' => 'EUR'],
                'brand' => 'Tiny Lux',
                'gtins' => ['5060123456789'],
                'mpn' => 'TL-LAMP-42',
            ],
        ], $this->mapper->map($product, 'en', 'GB'));
    }

    public function testMapsOutOfStockAndNormalizesHtmlAndWhitespace(): void
    {
        $product = $this->product([
            'title' => "  <b>Silk</b>\n &amp;\t<i>Lamp</i>  ",
            'description' => "<p>Hand-finished</p>\r\n   lamp",
            'inStock' => false,
        ]);

        $attributes = $this->mapper->map($product, 'en', 'GB')['productAttributes'];

        self::assertSame('Silk & Lamp', $attributes['title']);
        self::assertSame('Hand-finished lamp', $attributes['description']);
        self::assertSame('OUT_OF_STOCK', $attributes['availability']);
    }

    public function testPreservesWordBoundariesBetweenHtmlBlocksBeforeTruncation(): void
    {
        $mapped = $this->mapper->map($this->product([
            'description' => '<p>First</p><p>Second</p><div>Third</div>',
        ]), 'en', 'GB');

        self::assertSame('First Second Third', $mapped['productAttributes']['description']);
    }

    public function testAcceptsMerchantV1MaximumTitleAndUrlLengthsInUnicodeCharacters(): void
    {
        $urlPrefix = 'https://example.com/';
        $link = $urlPrefix . str_repeat("\u{00E9}", 2000 - mb_strlen($urlPrefix, 'UTF-8'));
        $feedLabel = str_repeat('A', 17) . '_GB';

        $mapped = $this->mapper->map($this->product([
            'title' => str_repeat("\u{706F}", 150),
            'link' => $link,
            'imageLink' => $link,
        ]), 'en', $feedLabel);

        self::assertSame(150, mb_strlen($mapped['productAttributes']['title'], 'UTF-8'));
        self::assertSame(2000, mb_strlen($mapped['productAttributes']['link'], 'UTF-8'));
        self::assertSame(2000, mb_strlen($mapped['productAttributes']['imageLink'], 'UTF-8'));
        self::assertSame($feedLabel, $mapped['feedLabel']);
    }

    public function testTruncatesDescriptionToFiveThousandUnicodeCharacters(): void
    {
        $description = str_repeat("\u{1F4A1}", 5000) . "\u{1F6AB}";

        $mapped = $this->mapper->map($this->product(['description' => $description]), 'en', 'GB');

        self::assertSame(5000, mb_strlen($mapped['productAttributes']['description'], 'UTF-8'));
        self::assertSame(str_repeat("\u{1F4A1}", 5000), $mapped['productAttributes']['description']);
    }

    public function testOmitsAbsentOptionalIdentifiersInsteadOfEmittingEmptyValues(): void
    {
        $attributes = $this->mapper->map($this->product([
            'brand' => " \n ",
            'gtin' => '',
            'mpn' => null,
        ]), 'en', 'GB')['productAttributes'];

        self::assertArrayNotHasKey('brand', $attributes);
        self::assertArrayNotHasKey('gtins', $attributes);
        self::assertArrayNotHasKey('mpn', $attributes);
    }

    public function testPreservesStableVariantOfferIdentity(): void
    {
        self::assertSame('987654-321', $this->mapper->map(
            $this->product(['offerId' => '987654-321']),
            'en',
            'GB'
        )['offerId']);
    }

    /**
     * @dataProvider decimalMicrosProvider
     */
    public function testConvertsDecimalStringsToMicrosWithoutFloatMultiplication(string $price, string $micros): void
    {
        $mapped = $this->mapper->map($this->product(['price' => $price]), 'en', 'GB');

        self::assertSame($micros, $mapped['productAttributes']['price']['amountMicros']);
    }

    public function decimalMicrosProvider(): array
    {
        return [
            'zero' => ['0', '0'],
            'leading zeros' => ['000001.000001', '1000001'],
            'one cent' => ['0.01', '10000'],
            'six decimals' => ['12.345678', '12345678'],
            'signed int64 maximum' => ['9223372036854.775807', '9223372036854775807'],
        ];
    }

    public function testRejectsMicrosAboveSignedInt64Maximum(): void
    {
        try {
            $this->mapper->map($this->product(['price' => '9223372036854.775808']), 'en', 'GB');
            self::fail('An amount above the Merchant API int64 maximum must be rejected.');
        } catch (ProductValidationException $exception) {
            self::assertSame([['field' => 'price', 'code' => 'out_of_range']], $exception->errors());
        }
    }

    /**
     * @dataProvider invalidPriceProvider
     */
    public function testRejectsMalformedPriceWithStructuredFieldAndCode(string $price): void
    {
        try {
            $this->mapper->map($this->product(['price' => $price]), 'en', 'GB');
            self::fail('Malformed price must be rejected.');
        } catch (ProductValidationException $exception) {
            self::assertSame([['field' => 'price', 'code' => 'invalid_decimal']], $exception->errors());
        }
    }

    public function invalidPriceProvider(): array
    {
        return [
            'negative' => ['-0.01'],
            'scientific notation' => ['1e3'],
            'comma' => ['1,00'],
            'too many decimals' => ['1.0000001'],
            'leading decimal point' => ['.01'],
            'trailing decimal point' => ['1.'],
        ];
    }

    /**
     * @dataProvider invalidRequiredFieldProvider
     *
     * @param array<string, mixed> $overrides
     */
    public function testRejectsInvalidRequiredFieldsWithSanitizedErrors(
        array $overrides,
        string $contentLanguage,
        string $feedLabel,
        string $expectedField,
        string $expectedCode
    ): void {
        try {
            $this->mapper->map($this->product($overrides), $contentLanguage, $feedLabel);
            self::fail('Invalid Merchant product data must be rejected.');
        } catch (ProductValidationException $exception) {
            self::assertContains(
                ['field' => $expectedField, 'code' => $expectedCode],
                $exception->errors()
            );
            self::assertSame('Merchant product validation failed.', $exception->getMessage());
            self::assertStringNotContainsString('evil.example', $exception->getMessage());
        }
    }

    public function invalidRequiredFieldProvider(): array
    {
        return [
            'unsafe offer ID' => [['offerId' => '42/7'], 'en', 'GB', 'offerId', 'invalid_format'],
            'overlong offer ID' => [['offerId' => str_repeat('1', 51)], 'en', 'GB', 'offerId', 'invalid_format'],
            'empty title after normalization' => [['title' => '<b> </b>'], 'en', 'GB', 'title', 'required'],
            'title over 150 Unicode characters' => [['title' => str_repeat("\u{706F}", 151)], 'en', 'GB', 'title', 'too_long'],
            'empty description after normalization' => [['description' => '<p> </p>'], 'en', 'GB', 'description', 'required'],
            'relative product URL' => [['link' => '/products/lamp'], 'en', 'GB', 'link', 'invalid_url'],
            'product URL over 2000 Unicode characters' => [['link' => 'https://example.com/' . str_repeat('a', 1981)], 'en', 'GB', 'link', 'invalid_url'],
            'image URL over 2000 Unicode characters' => [['imageLink' => 'https://example.com/' . str_repeat('a', 1981)], 'en', 'GB', 'imageLink', 'invalid_url'],
            'URL credentials' => [['link' => 'https://user:secret@evil.example/lamp'], 'en', 'GB', 'link', 'invalid_url'],
            'URL control character' => [['link' => "https://evil.example/lamp\nnext"], 'en', 'GB', 'link', 'invalid_url'],
            'non-http image URL' => [['imageLink' => 'ftp://evil.example/lamp.jpg'], 'en', 'GB', 'imageLink', 'invalid_url'],
            'lowercase currency' => [['currency' => 'eur'], 'en', 'GB', 'currencyCode', 'invalid_format'],
            'three-letter language' => [[], 'eng', 'GB', 'contentLanguage', 'invalid_format'],
            'regional language' => [[], 'en-GB', 'GB', 'contentLanguage', 'invalid_format'],
            'uppercase language' => [[], 'EN', 'GB', 'contentLanguage', 'invalid_format'],
            'invalid feed label' => [[], 'en', 'gb', 'feedLabel', 'invalid_format'],
            'feed label over 20 characters' => [[], 'en', str_repeat('A', 21), 'feedLabel', 'invalid_format'],
        ];
    }

    /**
     * @dataProvider invalidOptionalIdentifierProvider
     *
     * @param array<string, mixed> $overrides
     */
    public function testRejectsPresentButMalformedOptionalIdentifiers(
        array $overrides,
        string $expectedField
    ): void {
        try {
            $this->mapper->map($this->product($overrides), 'en', 'GB');
            self::fail('Malformed optional identifier must be rejected.');
        } catch (ProductValidationException $exception) {
            self::assertSame(
                [['field' => $expectedField, 'code' => 'invalid_format']],
                $exception->errors()
            );
        }
    }

    public function invalidOptionalIdentifierProvider(): array
    {
        return [
            'GTIN must contain 8, 12, 13, or 14 digits' => [['gtin' => '123-456'], 'gtin'],
            'MPN rejects controls' => [['mpn' => "TL-42\nsecret"], 'mpn'],
            'brand rejects overlong value' => [['brand' => str_repeat('b', 71)], 'brand'],
        ];
    }

    /**
     * @param array<string, mixed> $overrides
     */
    private function product(array $overrides = []): CatalogProduct
    {
        $values = array_merge([
            'offerId' => '42-0',
            'title' => 'Silk Lamp',
            'description' => 'Hand-finished lamp',
            'link' => 'https://thetinylux.com/lamp',
            'imageLink' => 'https://thetinylux.com/img/lamp.jpg',
            'inStock' => true,
            'price' => '449.99',
            'currency' => 'EUR',
            'brand' => 'Tiny Lux',
            'gtin' => '5060123456789',
            'mpn' => 'TL-LAMP-42',
        ], $overrides);

        return new CatalogProduct(
            $values['offerId'],
            $values['title'],
            $values['description'],
            $values['link'],
            $values['imageLink'],
            $values['inStock'],
            $values['price'],
            $values['currency'],
            $values['brand'],
            $values['gtin'],
            $values['mpn']
        );
    }
}
