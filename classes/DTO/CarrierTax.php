<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\DTO;

use JsonSerializable;

class CarrierTax implements JsonSerializable
{
    /**
     * @var string
     */
    private $collection = 'carrier_taxes';

    /**
     * @var int
     */
    private $carrierReference;

    /**
     * @var int
     */
    private $taxRulesGroupId;

    /**
     * @var int
     */
    private $zoneId;

    /**
     * @var string
     */
    private $countryIsoCode;

    /**
     * @var string
     */
    private $stateIsoCodes;

    /**
     * @var float
     */
    private $taxRate;

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
     * @return CarrierTax
     */
    public function setCollection(string $collection): CarrierTax
    {
        $this->collection = $collection;

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
     * @return CarrierTax
     */
    public function setCarrierReference(int $carrierReference): CarrierTax
    {
        $this->carrierReference = $carrierReference;

        return $this;
    }

    /**
     * @return int
     */
    public function getTaxRulesGroupId(): int
    {
        return $this->taxRulesGroupId;
    }

    /**
     * @param int $taxRulesGroupId
     *
     * @return CarrierTax
     */
    public function setTaxRulesGroupId(int $taxRulesGroupId): CarrierTax
    {
        $this->taxRulesGroupId = $taxRulesGroupId;

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
     * @return CarrierTax
     */
    public function setZoneId(int $zoneId): CarrierTax
    {
        $this->zoneId = $zoneId;

        return $this;
    }

    /**
     * @return string
     */
    public function getCountryIsoCode(): string
    {
        return $this->countryIsoCode;
    }

    /**
     * @param string $countryIsoCode
     *
     * @return CarrierTax
     */
    public function setCountryIsoCode(string $countryIsoCode): CarrierTax
    {
        $this->countryIsoCode = $countryIsoCode;

        return $this;
    }

    /**
     * @return string
     */
    public function getStateIsoCodes(): string
    {
        return $this->stateIsoCodes;
    }

    /**
     * @param string $stateIsoCodes
     *
     * @return CarrierTax
     */
    public function setStateIsoCodes(string $stateIsoCodes): CarrierTax
    {
        $this->stateIsoCodes = $stateIsoCodes;

        return $this;
    }

    /**
     * @return float
     */
    public function getTaxRate(): float
    {
        return $this->taxRate;
    }

    /**
     * @param float $taxRate
     *
     * @return CarrierTax
     */
    public function setTaxRate(float $taxRate): CarrierTax
    {
        $this->taxRate = $taxRate;

        return $this;
    }

    public function jsonSerialize()
    {
        return [
            'collection' => $this->getCollection(),
            'id' => $this->getCarrierReference() . '-' . $this->getZoneId(),
            'properties' => [
                'id_reference' => (string) $this->getCarrierReference(),
                'id_carrier_tax' => (string) $this->getTaxRulesGroupId(),
                'country_id' => (string) $this->getCountryIsoCode(),
                'state_ids' => (string) $this->getStateIsoCodes(),
                'tax_rate' => (float) $this->getTaxRate(),
            ],
        ];
    }
}
