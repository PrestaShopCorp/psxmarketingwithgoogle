<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

final class LegacyPrestaShopProductRuntime implements PrestaShopProductRuntimeInterface
{
    /** @var DetachedCatalogContextFactory */
    private $contextFactory;

    /** @var PrestaShopProductCoreAdapterInterface */
    private $core;

    public function __construct(
        DetachedCatalogContextFactory $contextFactory,
        PrestaShopProductCoreAdapterInterface $core
    ) {
        $this->contextFactory = $contextFactory;
        $this->core = $core;
    }

    public function product(int $productId, int $languageId, int $shopId, $context)
    {
        return $this->core->product($productId, false, $languageId, $shopId, $context);
    }

    public function combination(int $attributeId, int $languageId, int $shopId)
    {
        return $this->core->combination($attributeId, $languageId, $shopId);
    }

    public function price(int $productId, int $attributeId, $context): ?float
    {
        $detachedContext = $this->contextFactory->create($context);

        return $this->core->price($productId, $attributeId, $detachedContext);
    }

    public function quantity(int $productId, int $attributeId, int $shopId): int
    {
        return $this->core->quantity($productId, $attributeId, $shopId);
    }

    public function coverImageId(int $productId, $context): ?int
    {
        return $this->core->coverImageId($productId, $context);
    }

    public function manufacturerName(int $manufacturerId): ?string
    {
        if (0 >= $manufacturerId) {
            return null;
        }

        return $this->core->manufacturerName($manufacturerId);
    }
}
