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
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#action-data
 */
class ActionData implements JsonSerializable
{
    /**
     * The transaction ID (e.g. T1234).
     * @var string
     */
    protected $id;

    /**
     * The store or affiliation from which this transaction occurred (e.g. Google Store). 
     * @var string
     */
    protected $affiliation;

    /**
     * Value (i.e. revenue) associated with the event.
     * @var string|null
     */
    protected $value;

    /**
     * The total tax associated with the transaction.
     * @var string|null
     */
    protected $tax;

    /**
     * The shipping cost associated with the transaction.
     * @var string|null
     */
    protected $shipping;

    /**
     * The array containing the associated products.
     * @var ProductData[]
     */
    protected $items;

    /**
     * A number representing a step in the checkout process.
     * @var int|null
     */
    protected $checkout_step;

    /**
     * Checkout option (i.e. selected payment method).
     * @var string|null
     */
    protected $checkout_option;

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'affiliation' => $this->affiliation,
            'value' => $this->value,
            'tax' => $this->tax,
            'shipping' => $this->shipping,
            'items' => $this->items,
            'checkout_step' => $this->checkout_step,
            'checkout_option' => $this->checkout_option,
        ];
    }

    /**
     * Set the transaction ID (e.g. T1234).
     *
     * @param  string  $id  The transaction ID (e.g. T1234).
     *
     * @return  self
     */ 
    public function setId(string $id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Set the store or affiliation from which this transaction occurred (e.g. Google Store).
     *
     * @param  string  $affiliation  The store or affiliation from which this transaction occurred (e.g. Google Store).
     *
     * @return  self
     */ 
    public function setAffiliation(string $affiliation)
    {
        $this->affiliation = $affiliation;

        return $this;
    }

    /**
     * Set value (i.e. revenue) associated with the event.
     *
     * @param  string|null  $value  Value (i.e. revenue) associated with the event.
     *
     * @return  self
     */ 
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Set the total tax associated with the transaction.
     *
     * @param  string|null  $tax  The total tax associated with the transaction.
     *
     * @return  self
     */ 
    public function setTax($tax)
    {
        $this->tax = $tax;

        return $this;
    }

    /**
     * Set the shipping cost associated with the transaction.
     *
     * @param  string|null  $shipping  The shipping cost associated with the transaction.
     *
     * @return  self
     */ 
    public function setShipping($shipping)
    {
        $this->shipping = $shipping;

        return $this;
    }

    /**
     * Set the array containing the associated products.
     *
     * @param  ProductData[]  $items  The array containing the associated products.
     *
     * @return  self
     */ 
    public function setItems(array $items)
    {
        $this->items = $items;

        return $this;
    }

    /**
     * Set a number representing a step in the checkout process.
     *
     * @param  int|null  $checkout_step  A number representing a step in the checkout process.
     *
     * @return  self
     */ 
    public function setCheckoutStep($checkout_step)
    {
        $this->checkout_step = $checkout_step;

        return $this;
    }

    /**
     * Set checkout option (i.e. selected payment method).
     *
     * @param  string|null  $checkout_option  Checkout option (i.e. selected payment method).
     *
     * @return  self
     */ 
    public function setCheckoutOption($checkout_option)
    {
        $this->checkout_option = $checkout_option;

        return $this;
    }
}
