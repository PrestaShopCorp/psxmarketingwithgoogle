<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use InvalidArgumentException;

final class DetachedCatalogContextFactory
{
    /** @param mixed $context */
    public function create($context): object
    {
        if (!is_object($context)) {
            throw new InvalidArgumentException('Catalog pricing context is invalid.');
        }

        $detached = clone $context;
        if (isset($context->cart) && is_object($context->cart)) {
            $detached->cart = clone $context->cart;
        }

        return $detached;
    }
}
