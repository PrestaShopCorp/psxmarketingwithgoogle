<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

interface CatalogOfferSourceInterface
{
    /** @return string[] */
    public function offerKeys(int $shopId, int $languageId): array;

    public function offer(string $offerKey, int $shopId, int $languageId): ?CatalogProduct;
}
