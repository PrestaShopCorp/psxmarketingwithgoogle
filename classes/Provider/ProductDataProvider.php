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
use Product;
use PrestaShop\Module\PsxMarketingWithGoogle\DTO\Remarketing\ProductData;

class ProductDataProvider
{
    /**
     * @var Context
     */
    protected $context;

    /**
     * @var CategoryProvider
     */
    protected $categoryProvider;

    public function __construct(Context $context, CategoryProvider $categoryProvider)
    {
        $this->context = $context;
        $this->categoryProvider = $categoryProvider;
    }

    public function getProductDataByProductArray(array $product): ProductData
    {
        $productData = new ProductData();

        $productData->setId(implode(
            '-',
            [
                (int) $product['id_product'],
                (int) $product['id_product_attribute']
            ]
        ));

        $productData->setName(\Tools::replaceAccentedChars($product['product_name']));
        $productData->setBrand((new \Manufacturer($product['id_manufacturer']))->name);
        $productData->setCategory($this->categoryProvider->getCategoryPaths(
            $product['id_category_default'],
            $this->context->language->id,
            $this->context->shop->id
        )['category_path']);
        $productData->setPrice((string) $product['product_price']);
        $productData->setQuantity($product['product_quantity']);

        $productData->setVariant(
            $this->getCustomAttributeData(
                $product['id_product'],
                $product['product_attribute_id']
            )
        );
        

        return $productData;
    }


    private function getCustomAttributeData($productId, $attributeIds)
    {
        $attributes = [];
        foreach(Product::getAttributesParams($productId, $attributeIds) as $attribute) {
            $attributes[] = $attribute['group'] . ': ' . $attribute['name'];
        }

        return implode(' - ', $attributes);
    }
}