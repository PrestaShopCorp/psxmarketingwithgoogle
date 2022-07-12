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

namespace PrestaShop\Module\PsxMarketingWithGoogle\DTO;

use JsonSerializable;

class CarrierDetail implements JsonSerializable
{
    public const RANGE_BY_WEIGHT = 0;

    public const RANGE_BY_PRICE = 1;

    /**
     * @var string
     */
    private $collection = 'carrier_details';

    /**
     * @var string
     */
    private $shippingMethod;

    /**
     * @var int
     */
    private $carrierReference;

    /**
     * @var int
     */
    private $carrierDetailId;

    /**
     * @var int
     */
    private $zoneId;

    /**
     * @var int
     */
    private $rangeId;

    /**
     * @var float
     */
    private $delimiter1;

    /**
     * @var float
     */
    private $delimiter2;

    /**
     * @var array
     */
    private $countryIsoCodes;

    /**
     * @var array
     */
    private $stateIsoCodes;

    /**
     * @var float
     */
    private $price;

    public function getCollection(): string
    {
        return $this->collection;
    }

    public function setCollection(string $collection): CarrierDetail
    {
        $this->collection = $collection;

        return $this;
    }

    public function getShippingMethod(): string
    {
        return $this->shippingMethod;
    }

    public function setShippingMethod(string $shippingMethod): CarrierDetail
    {
        $this->shippingMethod = $shippingMethod;

        return $this;
    }

    public function getCarrierReference(): int
    {
        return $this->carrierReference;
    }

    public function setCarrierReference(int $carrierReference): CarrierDetail
    {
        $this->carrierReference = $carrierReference;

        return $this;
    }

    public function getCarrierDetailId(): int
    {
        return $this->carrierDetailId;
    }

    public function setCarrierDetailId(int $carrierDetailId): CarrierDetail
    {
        $this->carrierDetailId = $carrierDetailId;

        return $this;
    }

    public function getZoneId(): int
    {
        return $this->zoneId;
    }

    public function setZoneId(int $zoneId): CarrierDetail
    {
        $this->zoneId = $zoneId;

        return $this;
    }

    public function getRangeId(): int
    {
        return $this->rangeId;
    }

    public function setRangeId(int $rangeId): CarrierDetail
    {
        $this->rangeId = $rangeId;

        return $this;
    }

    public function getDelimiter1(): float
    {
        return $this->delimiter1;
    }

    public function setDelimiter1(float $delimiter1): CarrierDetail
    {
        $this->delimiter1 = $delimiter1;

        return $this;
    }

    public function getDelimiter2(): float
    {
        return $this->delimiter2;
    }

    public function setDelimiter2(float $delimiter2): CarrierDetail
    {
        $this->delimiter2 = $delimiter2;

        return $this;
    }

    public function getCountryIsoCodes(): array
    {
        return $this->countryIsoCodes;
    }

    public function setCountryIsoCodes(array $countryIsoCodes): CarrierDetail
    {
        $this->countryIsoCodes = $countryIsoCodes;

        return $this;
    }

    public function getStateIsoCodes(): array
    {
        return $this->stateIsoCodes;
    }

    public function setStateIsoCodes(array $stateIsoCodes): CarrierDetail
    {
        $this->stateIsoCodes = $stateIsoCodes;

        return $this;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function setPrice(float $price): CarrierDetail
    {
        $this->price = $price;

        return $this;
    }

    public function jsonSerialize()
    {
        $countryIds = implode(',', $this->getCountryIsoCodes());
        $stateIds = implode(',', $this->getStateIsoCodes());
        $shippingMethod = $this->getShippingMethod() === 'range_weight' ? self::RANGE_BY_WEIGHT : self::RANGE_BY_PRICE;

        return [
            'collection' => $this->getCollection(),
            'id' => $this->getCarrierReference() . '-' . $this->getZoneId() . '-' . $shippingMethod . '-' . $this->getRangeId(),
            'properties' => [
                'id_reference' => (string) $this->getCarrierReference(),
                'id_carrier_detail' => (string) $this->getCarrierDetailId(),
                'shipping_method' => (string) $this->getShippingMethod(),
                'delimiter1' => (float) $this->getDelimiter1(),
                'delimiter2' => (float) $this->getDelimiter2(),
                'country_ids' => (string) $countryIds,
                'state_ids' => (string) $stateIds,
                'price' => (float) $this->getPrice(),
            ],
        ];
    }
}
