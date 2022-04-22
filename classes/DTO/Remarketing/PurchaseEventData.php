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

use PrestaShop\Module\PsxMarketingWithGoogle\DTO\ConversionEventData;

class PurchaseEventData extends ConversionEventData
{
    /**
     * @var ProductData[]
     */
    protected $items;

    /**
     * @var int
     */
    protected $awMerchandId;

    /**
     * @var string
     */
    protected $awFeedCountry;

    /**
     * @var string
     */
    protected $awFeedLanguage;

    /**
     * @var float
     */
    protected $discount;

    public function jsonSerialize(): array
    {
        return array_merge(
            parent::jsonSerialize(),
            [
                'items' => $this->items,
                'discount' => $this->discount,
                'aw_merchant_id' => $this->awMerchandId,
                'aw_feed_country' => $this->awFeedCountry,
                'aw_feed_language' => $this->awFeedLanguage,
            ]
        );
    }

    /**
     * Set the value of awFeedLanguage
     *
     * @param string $awFeedLanguage
     *
     * @return self
     */
    public function setAwFeedLanguage(string $awFeedLanguage)
    {
        $this->awFeedLanguage = $awFeedLanguage;

        return $this;
    }

    /**
     * Set the value of awMerchandId
     *
     * @param int $awMerchandId
     *
     * @return self
     */
    public function setAwMerchandId(int $awMerchandId)
    {
        $this->awMerchandId = $awMerchandId;

        return $this;
    }

    /**
     * Set the value of awFeedCountry
     *
     * @param string $awFeedCountry
     *
     * @return self
     */
    public function setAwFeedCountry(string $awFeedCountry)
    {
        $this->awFeedCountry = $awFeedCountry;

        return $this;
    }

    /**
     * Set the value of items
     *
     * @param array $items
     *
     * @return self
     */
    public function setItems(array $items)
    {
        $this->items = $items;

        return $this;
    }

    /**
     * Set the value of discount
     *
     * @param float $discount
     *
     * @return self
     */
    public function setDiscount(float $discount)
    {
        $this->discount = $discount;

        return $this;
    }
}
