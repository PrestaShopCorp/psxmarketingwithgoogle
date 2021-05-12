<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\DTO;

use JsonSerializable;

class CarrierDetail implements JsonSerializable
{
    const RANGE_BY_WEIGHT = 0;

    const RANGE_BY_PRICE = 1;

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
    private $CarrierDetailId;

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

    /**
     * @return string
     */
    public function getCollection(): string
    {
        return $this->collection;
    }

    /**
     * @param string $collection
     *
     * @return CarrierDetail
     */
    public function setCollection(string $collection): CarrierDetail
    {
        $this->collection = $collection;

        return $this;
    }

    /**
     * @return string
     */
    public function getShippingMethod(): string
    {
        return $this->shippingMethod;
    }

    /**
     * @param string $shippingMethod
     *
     * @return CarrierDetail
     */
    public function setShippingMethod(string $shippingMethod): CarrierDetail
    {
        $this->shippingMethod = $shippingMethod;

        return $this;
    }

    /**
     * @return int
     */
    public function getCarrierReference(): int
    {
        return $this->carrierReference;
    }

    /**
     * @param int $carrierReference
     *
     * @return CarrierDetail
     */
    public function setCarrierReference(int $carrierReference): CarrierDetail
    {
        $this->carrierReference = $carrierReference;

        return $this;
    }

    /**
     * @return int
     */
    public function getCarrierDetailId(): int
    {
        return $this->CarrierDetailId;
    }

    /**
     * @param int $CarrierDetailId
     *
     * @return CarrierDetail
     */
    public function setCarrierDetailId(int $CarrierDetailId): CarrierDetail
    {
        $this->CarrierDetailId = $CarrierDetailId;

        return $this;
    }

    /**
     * @return int
     */
    public function getZoneId(): int
    {
        return $this->zoneId;
    }

    /**
     * @param int $zoneId
     *
     * @return CarrierDetail
     */
    public function setZoneId(int $zoneId): CarrierDetail
    {
        $this->zoneId = $zoneId;

        return $this;
    }

    /**
     * @return int
     */
    public function getRangeId(): int
    {
        return $this->rangeId;
    }

    /**
     * @param int $rangeId
     *
     * @return CarrierDetail
     */
    public function setRangeId(int $rangeId): CarrierDetail
    {
        $this->rangeId = $rangeId;

        return $this;
    }

    /**
     * @return float
     */
    public function getDelimiter1(): float
    {
        return $this->delimiter1;
    }

    /**
     * @param float $delimiter1
     *
     * @return CarrierDetail
     */
    public function setDelimiter1(float $delimiter1): CarrierDetail
    {
        $this->delimiter1 = $delimiter1;

        return $this;
    }

    /**
     * @return float
     */
    public function getDelimiter2(): float
    {
        return $this->delimiter2;
    }

    /**
     * @param float $delimiter2
     *
     * @return CarrierDetail
     */
    public function setDelimiter2(float $delimiter2): CarrierDetail
    {
        $this->delimiter2 = $delimiter2;

        return $this;
    }

    /**
     * @return array
     */
    public function getCountryIsoCodes(): array
    {
        return $this->countryIsoCodes;
    }

    /**
     * @param array $countryIsoCodes
     *
     * @return CarrierDetail
     */
    public function setCountryIsoCodes(array $countryIsoCodes): CarrierDetail
    {
        $this->countryIsoCodes = $countryIsoCodes;

        return $this;
    }

    /**
     * @return array
     */
    public function getStateIsoCodes(): array
    {
        return $this->stateIsoCodes;
    }

    /**
     * @param array $stateIsoCodes
     *
     * @return CarrierDetail
     */
    public function setStateIsoCodes(array $stateIsoCodes): CarrierDetail
    {
        $this->stateIsoCodes = $stateIsoCodes;

        return $this;
    }

    /**
     * @return float
     */
    public function getPrice(): float
    {
        return $this->price;
    }

    /**
     * @param float $price
     *
     * @return CarrierDetail
     */
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
