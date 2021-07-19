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
            'id' => $this->getCarrierReference(),
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
