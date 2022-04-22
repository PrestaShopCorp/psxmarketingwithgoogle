<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License version 3.0
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\Provider;

use Context;
use PrestaShop\Module\PsxMarketingWithGoogle\DTO\Remarketing\ProductData;

class ProductDataProvider
{
    /**
     * @var Context
     */
    protected $context;

    public function __construct(Context $context)
    {
        $this->context = $context;
    }

    public function getProductDataByProductArray(array $product): ProductData
    {
        $productData = new ProductData();

        $productData->setId(implode(
            '-',
            [
                (int) $product['id_product'],
                (int) $product['id_product_attribute'],
            ]
        ));
        $productData->setPrice((float) $product['product_price_wt']);
        $productData->setQuantity((int) $product['product_quantity']);

        return $productData;
    }

    public function getProductDataByProductObject(array $params): ProductData
    {
        $product = $params['product'];
        $productData = new ProductData();

        $productData->setId(implode(
            '-',
            [
                (int) $product->id,
                (int) $params['id_product_attribute'],
            ]
        ));

        $productData->setPrice($product->price);
        $productData->setQuantity($params['quantity']);

        return $productData;
    }
}
