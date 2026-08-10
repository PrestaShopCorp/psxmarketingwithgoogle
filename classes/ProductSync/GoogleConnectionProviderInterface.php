<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

interface GoogleConnectionProviderInterface
{
    /** @return array{connected: bool, googleEmail: string|null, merchantAccount: string|null, dataSource: string|null} */
    public function status(int $shopId): array;

    public function accessToken(int $shopId): string;
}
