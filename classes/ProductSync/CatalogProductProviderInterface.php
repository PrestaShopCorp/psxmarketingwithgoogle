<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

interface CatalogProductProviderInterface
{
    public function assertContext(int $shopId, int $languageId): void;

    /** @return array{total: int, active: int} */
    public function combinationCounts(int $productId, int $shopId): array;

    /** @return int[] */
    public function activeCombinationIds(
        int $productId,
        int $shopId,
        int $languageId,
        int $offset,
        int $limit
    ): array;

    public function product(int $productId, int $attributeId, int $shopId, int $languageId): CatalogProduct;
}
