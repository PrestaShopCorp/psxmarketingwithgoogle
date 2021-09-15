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

/**
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#product-data
 */
class ProductData implements JsonSerializable
{
    /**
     * The product ID or SKU (e.g. P67890).
     * @var string
     */
    protected $id;

    /**
     * The name of the product (e.g. Android T-Shirt).
     * @var string
     */
    protected $name;

    /**
     * The brand associated with the product (e.g. Google).
     * @var string|null
     */
    protected $brand;

    /**
     * The category to which the product belongs (e.g. Apparel). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Apparel/Men/T-Shirts).
     * @var string|null
     */
    protected $category;

    /**
     * The variant of the product (e.g. Black).
     * @var string|null
     */
    protected $variant;

    /**
     * The price of a product (e.g. 29.20).
     * Kept as a string to avoid float issues
     * @var string|null
     */
    protected $price;

    /**
     * The quantity of a product (e.g. 2).
     * @var int|null
     */
    protected $quantity;

    /**
     * The coupon code associated with a product (e.g. SUMMER_SALE13).
     * @var string|null
     */
    protected $coupon;

    /**
     * The product's position in a list or collection (e.g. 2).
     * @var int|null
     */
    protected $list_position;

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'list_name' => $this->list_,
            'brand' => $this->brand,
            'category' => $this->category,
            'variant' => $this->variant,
            'list_position' => $this->list_position,
            'quantity' => $this->quantity,
            'price' => $this->price,
        ];
    }

    /**
     * Set the product ID or SKU (e.g. P67890).
     *
     * @param  string  $id  The product ID or SKU (e.g. P67890).
     *
     * @return  self
     */ 
    public function setId(string $id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Set the name of the product (e.g. Android T-Shirt).
     *
     * @param  string  $name  The name of the product (e.g. Android T-Shirt).
     *
     * @return  self
     */ 
    public function setName(string $name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Set the brand associated with the product (e.g. Google).
     *
     * @param  string|null  $brand  The brand associated with the product (e.g. Google).
     *
     * @return  self
     */ 
    public function setBrand($brand)
    {
        $this->brand = $brand;

        return $this;
    }

    /**
     * Set the category to which the product belongs (e.g. Apparel). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Apparel/Men/T-Shirts).
     *
     * @param  string|null  $category  The category to which the product belongs (e.g. Apparel). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Apparel/Men/T-Shirts).
     *
     * @return  self
     */ 
    public function setCategory($category)
    {
        $this->category = $category;

        return $this;
    }

    /**
     * Set the variant of the product (e.g. Black).
     *
     * @param  string|null  $variant  The variant of the product (e.g. Black).
     *
     * @return  self
     */ 
    public function setVariant($variant)
    {
        $this->variant = $variant;

        return $this;
    }

    /**
     * Set kept as a string to avoid float issues
     *
     * @param  string|null  $price  Kept as a string to avoid float issues
     *
     * @return  self
     */ 
    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * Set the quantity of a product (e.g. 2).
     *
     * @param  int|null  $quantity  The quantity of a product (e.g. 2).
     *
     * @return  self
     */ 
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;

        return $this;
    }

    /**
     * Set the coupon code associated with a product (e.g. SUMMER_SALE13).
     *
     * @param  string|null  $coupon  The coupon code associated with a product (e.g. SUMMER_SALE13).
     *
     * @return  self
     */ 
    public function setCoupon($coupon)
    {
        $this->coupon = $coupon;

        return $this;
    }

    /**
     * Set the product's position in a list or collection (e.g. 2).
     *
     * @param  int|null  $list_position  The product's position in a list or collection (e.g. 2).
     *
     * @return  self
     */ 
    public function setListPosition($list_position)
    {
        $this->list_position = $list_position;

        return $this;
    }
}
