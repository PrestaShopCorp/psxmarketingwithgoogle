<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

interface PrestaShopCatalogGatewayInterface
{
    /** @return array<string, mixed> */
    public function context(): array;

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

    /** @return array<string, mixed> */
    public function offer(int $productId, int $attributeId, int $shopId, int $languageId): array;
}
