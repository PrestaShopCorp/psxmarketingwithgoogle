<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\PrestaShopCatalogGateway;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\PrestaShopProductRuntimeInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\ProductValidationException;

class PrestaShopCatalogGatewayTest extends TestCase
{
    public function testUsesTrustedActiveContextWithoutMutatingIt(): void
    {
        $context = GatewayContextFactory::context();
        $snapshot = clone $context;
        $gateway = new PrestaShopCatalogGateway(
            $context,
            new GatewayLinkFake(),
            new GatewayDatabaseFake(),
            new GatewayProductRuntimeFake(),
            'ps_'
        );

        self::assertSame([
            'shopId' => 1,
            'languageId' => 2,
            'trustedBaseUrl' => 'https://shop.example/base/virtual/',
            'trustedMediaHosts' => [],
        ], $gateway->context());
        self::assertEquals($snapshot, $context);
    }

    public function testPreservesAValidatedShopDomainPortInTheTrustedBaseUrl(): void
    {
        $context = GatewayContextFactory::context();
        $context->shop->domain_ssl = 'localhost:8080';
        $gateway = new PrestaShopCatalogGateway(
            $context,
            new GatewayLinkFake(),
            new GatewayDatabaseFake(),
            new GatewayProductRuntimeFake(),
            'ps_'
        );

        self::assertSame('https://localhost:8080/base/virtual/', $gateway->context()['trustedBaseUrl']);
    }

    /**
     * @dataProvider unsafeShopAuthorityProvider
     */
    public function testRejectsUnsafeShopDomainAuthorities(string $authority): void
    {
        $context = GatewayContextFactory::context();
        $context->shop->domain_ssl = $authority;
        $gateway = new PrestaShopCatalogGateway(
            $context,
            new GatewayLinkFake(),
            new GatewayDatabaseFake(),
            new GatewayProductRuntimeFake(),
            'ps_'
        );

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Active PrestaShop catalog context is invalid.');

        $gateway->context();
    }

    public function unsafeShopAuthorityProvider(): array
    {
        return [
            'zero port' => ['localhost:0'],
            'port above range' => ['localhost:65536'],
            'credentials' => ['user:secret@localhost:8080'],
            'path' => ['localhost:8080/admin'],
            'scheme' => ['https://localhost:8080'],
            'control' => ["localhost:8080\ntrusted.example"],
        ];
    }

    public function testCountsOnlyShopAssociatedCombinationsOfAnActiveProduct(): void
    {
        $database = new GatewayDatabaseFake();
        $database->value = '100';
        $gateway = new PrestaShopCatalogGateway(
            GatewayContextFactory::context(),
            new GatewayLinkFake(),
            $database,
            new GatewayProductRuntimeFake(),
            'ps_'
        );

        self::assertSame(['total' => 100, 'active' => 100], $gateway->combinationCounts(42, 1));
        self::assertStringContainsString('`ps_product_attribute_shop` pas', $database->valueSql);
        self::assertStringContainsString('pas.`id_shop` = 1', $database->valueSql);
        self::assertStringContainsString('`ps_product_shop` ps', $database->valueSql);
        self::assertStringContainsString('ps.`active` = 1', $database->valueSql);
        self::assertStringContainsString('pa.`id_product` = 42', $database->valueSql);
    }

    public function testFetchesOnlyTheRequestedDeterministicCombinationSlice(): void
    {
        $database = new GatewayDatabaseFake();
        $database->rows = [
            ['id_product_attribute' => '41'],
            ['id_product_attribute' => '42'],
            ['id_product_attribute' => '43'],
        ];
        $gateway = new PrestaShopCatalogGateway(
            GatewayContextFactory::context(),
            new GatewayLinkFake(),
            $database,
            new GatewayProductRuntimeFake(),
            'ps_'
        );

        self::assertSame([41, 42, 43], $gateway->activeCombinationIds(42, 1, 2, 40, 3));
        self::assertStringContainsString('ps.`active` = 1', $database->rowsSql);
        self::assertStringContainsString('ORDER BY pa.`id_product_attribute` ASC', $database->rowsSql);
        self::assertStringContainsString('LIMIT 40, 3', $database->rowsSql);
    }

    public function testHydratesVariantOfferWithCanonicalLinkInputsAndCustomerFacingValues(): void
    {
        $database = new GatewayDatabaseFake();
        $database->value = '77';
        $link = new GatewayLinkFake();
        $runtime = new GatewayProductRuntimeFake();
        $gateway = new PrestaShopCatalogGateway(
            GatewayContextFactory::context(),
            $link,
            $database,
            $runtime,
            'ps_'
        );

        $offer = $gateway->offer(42, 7, 1, 2);

        self::assertSame([
            'title' => 'Silk Lamp',
            'description' => '<p>Hand-finished lamp</p>',
            'link' => 'http://shop.example/base/lamp#variant-7',
            'imageLink' => '//shop.example/img/77-large_default.jpg',
            'inStock' => true,
            'price' => '449.99',
            'currency' => 'EUR',
            'brand' => 'Tiny Lux',
            'gtin' => '123456789012',
            'mpn' => 'VARIANT-MPN',
        ], $offer);
        self::assertSame(7, $link->productLinkArguments[6]);
        self::assertSame(2, $link->productLinkArguments[4]);
        self::assertSame(1, $link->productLinkArguments[5]);
        self::assertTrue($link->productLinkArguments[9]);
        self::assertSame(['preview' => ''], $link->productLinkArguments[10]);
        self::assertSame(['silk-lamp', 77, 'large_default'], $link->imageLinkArguments);
        self::assertSame([[42, 7]], $runtime->priceCalls);
        self::assertSame([[42, 7, 1]], $runtime->quantityCalls);
        self::assertSame([5], $runtime->manufacturerCalls);
        self::assertStringContainsString('pai.`id_product_attribute` = 7', $database->valueSql);
        self::assertStringContainsString('image_shop.`id_shop` = 1', $database->valueSql);
    }

    public function testRejectsCrossProductCombinationWithSanitizedFailure(): void
    {
        $runtime = new GatewayProductRuntimeFake();
        $runtime->combination->id_product = 999;
        $gateway = new PrestaShopCatalogGateway(
            GatewayContextFactory::context(),
            new GatewayLinkFake(),
            new GatewayDatabaseFake(),
            $runtime,
            'ps_'
        );

        try {
            $gateway->offer(42, 7, 1, 2);
            self::fail('A combination from another product must be rejected.');
        } catch (ProductValidationException $exception) {
            self::assertSame([['field' => 'product', 'code' => 'invalid_catalog_data']], $exception->errors());
            self::assertSame('Merchant product validation failed.', $exception->getMessage());
            self::assertStringNotContainsString('999', $exception->getMessage());
        }
    }
}

class GatewayContextFactory
{
    public static function context(): \stdClass
    {
        $context = new \stdClass();
        $context->shop = new \stdClass();
        $context->shop->id = 1;
        $context->shop->domain_ssl = 'shop.example';
        $context->shop->physical_uri = '/base/';
        $context->shop->virtual_uri = 'virtual/';
        $context->language = new \stdClass();
        $context->language->id = 2;
        $context->currency = new \stdClass();
        $context->currency->iso_code = 'EUR';

        return $context;
    }
}

class GatewayDatabaseFake
{
    /** @var string */
    public $value = '0';

    /** @var array<int, array<string, string>> */
    public $rows = [];

    /** @var string */
    public $valueSql = '';

    /** @var string */
    public $rowsSql = '';

    public function getValue($sql)
    {
        $this->valueSql = $sql;

        return $this->value;
    }

    public function executeS($sql)
    {
        $this->rowsSql = $sql;

        return $this->rows;
    }
}

class GatewayLinkFake
{
    /** @var array<int, mixed> */
    public $productLinkArguments = [];

    /** @var array<int, mixed> */
    public $imageLinkArguments = [];

    public function getProductLink(...$arguments): string
    {
        $this->productLinkArguments = $arguments;

        return 'http://shop.example/base/lamp#variant-7';
    }

    public function getImageLink(...$arguments): string
    {
        $this->imageLinkArguments = $arguments;

        return '//shop.example/img/77-large_default.jpg';
    }
}

class GatewayProductRuntimeFake implements PrestaShopProductRuntimeInterface
{
    /** @var \stdClass */
    public $product;

    /** @var \stdClass */
    public $combination;

    /** @var array<int, array{0: int, 1: int}> */
    public $priceCalls = [];

    /** @var array<int, array{0: int, 1: int, 2: int}> */
    public $quantityCalls = [];

    /** @var int[] */
    public $manufacturerCalls = [];

    public function __construct()
    {
        $this->product = new \stdClass();
        $this->product->id = 42;
        $this->product->active = true;
        $this->product->name = 'Silk Lamp';
        $this->product->description = '<p>Hand-finished lamp</p>';
        $this->product->link_rewrite = 'silk-lamp';
        $this->product->ean13 = '5060123456789';
        $this->product->upc = '';
        $this->product->mpn = 'PRODUCT-MPN';
        $this->product->id_manufacturer = 5;

        $this->combination = new \stdClass();
        $this->combination->id = 7;
        $this->combination->id_product = 42;
        $this->combination->ean13 = '';
        $this->combination->upc = '123456789012';
        $this->combination->mpn = 'VARIANT-MPN';
    }

    public function product(int $productId, int $languageId, int $shopId, $context)
    {
        unset($productId, $languageId, $shopId, $context);

        return $this->product;
    }

    public function combination(int $attributeId, int $languageId, int $shopId)
    {
        unset($attributeId, $languageId, $shopId);

        return $this->combination;
    }

    public function price(int $productId, int $attributeId, $context): ?float
    {
        unset($context);
        $this->priceCalls[] = [$productId, $attributeId];

        return 449.99;
    }

    public function quantity(int $productId, int $attributeId, int $shopId): int
    {
        $this->quantityCalls[] = [$productId, $attributeId, $shopId];

        return 2;
    }

    public function coverImageId(int $productId, $context): ?int
    {
        unset($productId, $context);

        return 66;
    }

    public function manufacturerName(int $manufacturerId): ?string
    {
        $this->manufacturerCalls[] = $manufacturerId;

        return 'Tiny Lux';
    }
}
