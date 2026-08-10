<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\DetachedCatalogContextFactory;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\LegacyPrestaShopProductRuntime;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\PrestaShopProductCoreAdapterInterface;

class LegacyPrestaShopProductRuntimeTest extends TestCase
{
    public function testHydratesAProductWithoutTheExpensiveFullGraph(): void
    {
        $core = new RecordingPrestaShopProductCoreAdapter();
        $runtime = new LegacyPrestaShopProductRuntime(new DetachedCatalogContextFactory(), $core);
        $context = $this->context();

        $runtime->product(42, 2, 1, $context);

        self::assertSame([[42, false, 2, 1, $context]], $core->productCalls);
    }

    public function testPricesAgainstDetachedContextAndCartWithoutChangingLiveState(): void
    {
        $core = new RecordingPrestaShopProductCoreAdapter();
        $runtime = new LegacyPrestaShopProductRuntime(new DetachedCatalogContextFactory(), $core);
        $context = $this->context();
        $originalCart = $context->cart;
        $originalState = $context->cart->state;

        self::assertSame(19.95, $runtime->price(42, 7, $context));
        self::assertNotSame($context, $core->priceContext);
        self::assertNotSame($originalCart, $core->priceContext->cart);
        self::assertSame($originalState, $context->cart->state);
        self::assertSame($originalCart, $context->cart);
        self::assertSame('mutated-during-pricing', $core->priceContext->cart->state);
    }

    public function testLooksUpManufacturerNameExplicitly(): void
    {
        $core = new RecordingPrestaShopProductCoreAdapter();
        $runtime = new LegacyPrestaShopProductRuntime(new DetachedCatalogContextFactory(), $core);

        self::assertSame('Tiny Lux', $runtime->manufacturerName(5));
        self::assertSame([5], $core->manufacturerCalls);
        self::assertNull($runtime->manufacturerName(0));
        self::assertSame([5], $core->manufacturerCalls);
    }

    private function context(): \stdClass
    {
        $context = new \stdClass();
        $context->cart = new \stdClass();
        $context->cart->id = 99;
        $context->cart->state = 'live';
        $context->shop = new \stdClass();
        $context->shop->id = 1;

        return $context;
    }
}

class RecordingPrestaShopProductCoreAdapter implements PrestaShopProductCoreAdapterInterface
{
    /** @var array<int, array<int, mixed>> */
    public $productCalls = [];

    /** @var object|null */
    public $priceContext;

    /** @var int[] */
    public $manufacturerCalls = [];

    public function product(int $productId, bool $full, int $languageId, int $shopId, $context): object
    {
        $this->productCalls[] = [$productId, $full, $languageId, $shopId, $context];

        return new \stdClass();
    }

    public function combination(int $attributeId, int $languageId, int $shopId): object
    {
        unset($attributeId, $languageId, $shopId);

        return new \stdClass();
    }

    public function price(int $productId, int $attributeId, $context): ?float
    {
        unset($productId, $attributeId);
        $this->priceContext = $context;
        $context->cart->state = 'mutated-during-pricing';

        return 19.95;
    }

    public function quantity(int $productId, int $attributeId, int $shopId): int
    {
        unset($productId, $attributeId, $shopId);

        return 2;
    }

    public function coverImageId(int $productId, $context): ?int
    {
        unset($productId, $context);

        return 7;
    }

    public function manufacturerName(int $manufacturerId): ?string
    {
        $this->manufacturerCalls[] = $manufacturerId;

        return 'Tiny Lux';
    }
}
