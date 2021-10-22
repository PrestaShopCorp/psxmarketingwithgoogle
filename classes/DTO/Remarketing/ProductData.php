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

namespace PrestaShop\Module\PsxMarketingWithGoogle\DTO\Remarketing;

use JsonSerializable;

class ProductData implements JsonSerializable
{
    /**
     * The product ID or SKU (e.g. P67890).
     *
     * @var string
     */
    protected $id;

    /**
     * The price of a product (e.g. 29.20).
     * Kept as a float
     *
     * @var float|null
     */
    protected $price;

    /**
     * The quantity of a product (e.g. 2).
     *
     * @var int|null
     */
    protected $quantity;

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'price' => $this->price,
        ];
    }

    /**
     * Set the product ID or SKU (e.g. P67890).
     *
     * @param string $id The product ID or SKU (e.g. P67890).
     *
     * @return self
     */
    public function setId(string $id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Set kept as a string to avoid float issues
     *
     * @param float|null $price Kept as a string to avoid float issues
     *
     * @return self
     */
    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * Set the quantity of a product (e.g. 2).
     *
     * @param int|null $quantity The quantity of a product (e.g. 2).
     *
     * @return self
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;

        return $this;
    }
}
