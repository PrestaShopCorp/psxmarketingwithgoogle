<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

interface CatalogFilterSettingsInterface
{
    /** @return array<int, array<string, mixed>> */
    public function filtersForShop(int $shopId): array;

    /** @param array<int, array<string, mixed>> $filters */
    public function replaceForShop(int $shopId, array $filters): void;
}
