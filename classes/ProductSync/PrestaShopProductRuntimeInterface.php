<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

interface PrestaShopProductRuntimeInterface
{
    /** @return object */
    public function product(int $productId, int $languageId, int $shopId, $context);

    /** @return object */
    public function combination(int $attributeId, int $languageId, int $shopId);

    public function price(int $productId, int $attributeId, $context): ?float;

    public function quantity(int $productId, int $attributeId, int $shopId): int;

    public function coverImageId(int $productId, $context): ?int;
}
