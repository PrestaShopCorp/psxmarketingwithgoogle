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

    public function getCollection(): string
    {
        return $this->collection;
    }

    public function setCollection(string $collection): CarrierTax
    {
        $this->collection = $collection;

        return $this;
    }

    public function getCarrierReference(): int
    {
        return $this->carrierReference;
    }

    public function setCarrierReference(int $carrierReference): CarrierTax
    {
        $this->carrierReference = $carrierReference;

        return $this;
    }

    public function getTaxRulesGroupId(): int
    {
        return $this->taxRulesGroupId;
    }

    public function setTaxRulesGroupId(int $taxRulesGroupId): CarrierTax
    {
        $this->taxRulesGroupId = $taxRulesGroupId;

        return $this;
    }

    public function getZoneId(): int
    {
        return $this->zoneId;
    }

    public function setZoneId(int $zoneId): CarrierTax
    {
        $this->zoneId = $zoneId;

        return $this;
    }

    public function getCountryIsoCode(): string
    {
        return $this->countryIsoCode;
    }

    public function setCountryIsoCode(string $countryIsoCode): CarrierTax
    {
        $this->countryIsoCode = $countryIsoCode;

        return $this;
    }

    public function getStateIsoCodes(): string
    {
        return $this->stateIsoCodes;
    }

    public function setStateIsoCodes(string $stateIsoCodes): CarrierTax
    {
        $this->stateIsoCodes = $stateIsoCodes;

        return $this;
    }

    public function getTaxRate(): float
    {
        return $this->taxRate;
    }

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
