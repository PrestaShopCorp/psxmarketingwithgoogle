<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use RuntimeException;

final class CatalogOfferNotFoundException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('The snapshotted catalog offer no longer exists.');
    }
}
