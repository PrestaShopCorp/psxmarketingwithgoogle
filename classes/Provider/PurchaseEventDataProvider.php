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

use Order;

class PurchaseEventDataProvider
{
    /**
     * @var ProductDataProvider
     */
    protected $productDataProvider;

    public function __construct(ProductDataProvider $productDataProvider)
    {
        $this->productDataProvider = $productDataProvider;
    }

    /**
     * Return the items concerned by the transaction
     */
    public function getEventData(Order $order): array
    {
        // https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#action-data
        /*
            {
                "transaction_id": "24.031608523954162",
                "affiliation": "Google online store",
                "value": 23.07,
                "currency": "USD",
                "tax": 1.24,
                "shipping": 0,
                "items": [
                    {
                        "id": "P12345",
                        "name": "Android Warhol T-Shirt",
                        "list_name": "Search Results",
                        "brand": "Google",
                        "category": "Apparel/T-Shirts",
                        "variant": "Black",
                        "list_position": 1,
                        "quantity": 2,
                        "price": "2.0"
                    },
                    {
                        "id": "P67890",
                        "name": "Flame challenge TShirt",
                        "list_name": "Search Results",
                        "brand": "MyBrand",
                        "category": "Apparel/T-Shirts",
                        "variant": "Red",
                        "list_position": 2,
                        "quantity": 1,
                        "price": "3.0"
                    }
                ]
            }
        */
        $items = [];
        foreach ($order->getCartProducts() as $product) {
            $items[] = $this->productDataProvider->getProductDataByProductArray($product);
        }

        return [
            'items' => $items,
        ];
    }
}
