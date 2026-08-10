<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

final class LegacyPrestaShopProductCoreAdapter implements PrestaShopProductCoreAdapterInterface
{
    public function product(int $productId, bool $full, int $languageId, int $shopId, $context)
    {
        return new \Product($productId, $full, $languageId, $shopId, $context);
    }

    public function combination(int $attributeId, int $languageId, int $shopId)
    {
        return new \Combination($attributeId, $languageId, $shopId);
    }

    public function price(int $productId, int $attributeId, $context): ?float
    {
        $specificPrice = null;

        return \Product::getPriceStatic(
            $productId,
            true,
            0 === $attributeId ? null : $attributeId,
            6,
            null,
            false,
            true,
            1,
            false,
            null,
            null,
            null,
            $specificPrice,
            true,
            true,
            $context
        );
    }

    public function quantity(int $productId, int $attributeId, int $shopId): int
    {
        return (int) \StockAvailable::getQuantityAvailableByProduct($productId, $attributeId, $shopId);
    }

    public function coverImageId(int $productId, $context): ?int
    {
        $cover = \Product::getCover($productId, $context);

        return is_array($cover) && isset($cover['id_image']) && 0 < (int) $cover['id_image']
            ? (int) $cover['id_image']
            : null;
    }

    public function manufacturerName(int $manufacturerId): ?string
    {
        $name = \Manufacturer::getNameById($manufacturerId);

        return is_string($name) && '' !== trim($name) ? $name : null;
    }
}
