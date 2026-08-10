<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use InvalidArgumentException;
use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\PrestaShopCatalogGatewayInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\PrestaShopCatalogProductProvider;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\ProductValidationException;

class PrestaShopCatalogProductProviderTest extends TestCase
{
    public function testBuildsStableOfferFromRawCatalogDataAndCanonicalTrustedUrls(): void
    {
        $gateway = new InMemoryPrestaShopCatalogGateway();
        $gateway->offer = [
            'title' => 'Silk Lamp',
            'description' => '<p>Hand-finished lamp</p>',
            'link' => 'http://shop.example/base/lamp?attribute=7&preview=&adtoken=server-secret#variant-7',
            'imageLink' => '//cdn.shop.example/42-large_default/lamp.jpg',
            'inStock' => true,
            'price' => '449.990000',
            'currency' => 'EUR',
            'brand' => 'Tiny Lux',
            'gtin' => '5060123456789',
            'mpn' => 'TL-LAMP-42',
        ];
        $provider = new PrestaShopCatalogProductProvider($gateway);

        $product = $provider->product(42, 7, 1, 2);

        self::assertSame('42-7', $product->offerId());
        self::assertSame('https://shop.example/base/lamp?attribute=7#variant-7', $product->link());
        self::assertSame('https://cdn.shop.example/42-large_default/lamp.jpg', $product->imageLink());
        self::assertSame('449.990000', $product->price());
        self::assertSame('5060123456789', $product->gtin());
        self::assertStringNotContainsString('server-secret', $product->link());
    }

    public function testResolvesGeneratedRelativeUrlsOnlyAgainstTheTrustedShopBase(): void
    {
        $gateway = new InMemoryPrestaShopCatalogGateway();
        $gateway->offer['link'] = 'products/42?attribute=0';
        $gateway->offer['imageLink'] = '/img/p/4/2/42-large_default.jpg';
        $provider = new PrestaShopCatalogProductProvider($gateway);

        $product = $provider->product(42, 0, 1, 2);

        self::assertSame('https://shop.example/base/products/42?attribute=0', $product->link());
        self::assertSame('https://shop.example/img/p/4/2/42-large_default.jpg', $product->imageLink());
    }

    public function testRejectsForeignOrCredentialedGeneratedUrlsWithSanitizedErrors(): void
    {
        $gateway = new InMemoryPrestaShopCatalogGateway();
        $gateway->offer['link'] = 'https://user:secret@evil.example/steal?token=raw-secret';
        $gateway->offer['imageLink'] = 'https://evil.example/image.jpg';
        $provider = new PrestaShopCatalogProductProvider($gateway);

        try {
            $provider->product(42, 0, 1, 2);
            self::fail('Foreign generated URLs must be rejected.');
        } catch (ProductValidationException $exception) {
            self::assertSame([
                ['field' => 'link', 'code' => 'invalid_url'],
                ['field' => 'imageLink', 'code' => 'invalid_url'],
            ], $exception->errors());
            self::assertSame('Merchant product validation failed.', $exception->getMessage());
            self::assertStringNotContainsString('raw-secret', $exception->getMessage());
            self::assertStringNotContainsString('evil.example', $exception->getMessage());
        }
    }

    public function testRejectsMalformedRawOfferDataWithoutIncludingItInTheFailure(): void
    {
        $gateway = new InMemoryPrestaShopCatalogGateway();
        $gateway->offer['title'] = ['<script>secret()</script>'];
        $provider = new PrestaShopCatalogProductProvider($gateway);

        try {
            $provider->product(42, 0, 1, 2);
            self::fail('Malformed catalog rows must be rejected.');
        } catch (ProductValidationException $exception) {
            self::assertSame([['field' => 'product', 'code' => 'invalid_catalog_data']], $exception->errors());
            self::assertStringNotContainsString('secret', $exception->getMessage());
        }
    }

    public function testValidatesTrustedShopAndLanguageBeforeGatewayCatalogReads(): void
    {
        $gateway = new InMemoryPrestaShopCatalogGateway();
        $provider = new PrestaShopCatalogProductProvider($gateway);

        try {
            $provider->assertContext(9, 2);
            self::fail('A different shop must not use the active context.');
        } catch (InvalidArgumentException $exception) {
            self::assertSame(0, $gateway->catalogReads);
        }

        try {
            $provider->assertContext(1, 9);
            self::fail('A different language must not use the active context.');
        } catch (InvalidArgumentException $exception) {
            self::assertSame(0, $gateway->catalogReads);
        }
    }

    public function testDelegatesDeterministicBoundedCombinationQueries(): void
    {
        $gateway = new InMemoryPrestaShopCatalogGateway();
        $gateway->counts = ['total' => 100, 'active' => 100];
        $gateway->combinationIds = [41, 42, 43];
        $provider = new PrestaShopCatalogProductProvider($gateway);

        self::assertSame(['total' => 100, 'active' => 100], $provider->combinationCounts(42, 1));
        self::assertSame([41, 42, 43], $provider->activeCombinationIds(42, 1, 2, 40, 3));
        self::assertSame([[42, 1, 2, 40, 3]], $gateway->combinationCalls);
    }
}

class InMemoryPrestaShopCatalogGateway implements PrestaShopCatalogGatewayInterface
{
    /** @var array<string, mixed> */
    public $offer = [
        'title' => 'Silk Lamp',
        'description' => 'Hand-finished lamp',
        'link' => 'https://shop.example/base/lamp',
        'imageLink' => 'https://shop.example/img/lamp.jpg',
        'inStock' => true,
        'price' => '449.99',
        'currency' => 'EUR',
        'brand' => null,
        'gtin' => null,
        'mpn' => null,
    ];

    /** @var array{total: int, active: int} */
    public $counts = ['total' => 0, 'active' => 0];

    /** @var int[] */
    public $combinationIds = [];

    /** @var array<int, array{0: int, 1: int, 2: int, 3: int, 4: int}> */
    public $combinationCalls = [];

    /** @var int */
    public $catalogReads = 0;

    public function context(): array
    {
        return [
            'shopId' => 1,
            'languageId' => 2,
            'trustedBaseUrl' => 'https://shop.example/base/',
            'trustedMediaHosts' => ['cdn.shop.example'],
        ];
    }

    public function combinationCounts(int $productId, int $shopId): array
    {
        ++$this->catalogReads;
        unset($productId, $shopId);

        return $this->counts;
    }

    public function activeCombinationIds(
        int $productId,
        int $shopId,
        int $languageId,
        int $offset,
        int $limit
    ): array {
        ++$this->catalogReads;
        $this->combinationCalls[] = [$productId, $shopId, $languageId, $offset, $limit];

        return $this->combinationIds;
    }

    public function offer(int $productId, int $attributeId, int $shopId, int $languageId): array
    {
        ++$this->catalogReads;
        unset($productId, $attributeId, $shopId, $languageId);

        return $this->offer;
    }
}
