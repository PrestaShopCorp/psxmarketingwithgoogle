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

class Carrier implements JsonSerializable
{
    /**
     * @var string
     */
    private $collection = 'carriers';

    /**
     * @var int
     */
    private $idCarrier;

    /**
     * @var int
     */
    private $idReference;

    /**
     * @var int
     */
    private $taxesRatesGroupId;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $url;

    /**
     * @var bool
     */
    private $active;

    /**
     * @var bool
     */
    private $deleted;

    /**
     * @var float
     */
    private $shippingHandling = 0;

    /**
     * @var float
     */
    private $freeShippingStartsAtPrice;

    /**
     * @var float
     */
    private $freeShippingStartsAtWeight;

    /**
     * @var bool
     */
    private $disableCarrierWhenOutOfRange;

    /**
     * @var bool
     */
    private $isModule;

    /**
     * @var bool
     */
    private $isFree;

    /**
     * @var bool
     */
    private $shippingExternal;

    /**
     * @var bool
     */
    private $needRange;

    /**
     * @var string
     */
    private $externalModuleName;

    /**
     * @var float
     */
    private $maxWidth;

    /**
     * @var float
     */
    private $maxHeight;

    /**
     * @var float
     */
    private $maxDepth;

    /**
     * @var float
     */
    private $maxWeight;

    /**
     * @var int
     */
    private $grade;

    /**
     * @var string
     */
    private $delay;

    /**
     * @var string
     */
    private $currency;

    /**
     * @var string
     */
    private $weightUnit;

    /**
     * @var array
     */
    private $countryIsoCodes;

    /**
     * @var CarrierDetail[]
     */
    private $carrierDetails = [];

    /**
     * @var CarrierTax[]
     */
    private $carrierTaxes = [];

    public function getCollection(): string
    {
        return $this->collection;
    }

    public function setCollection(string $collection): Carrier
    {
        $this->collection = $collection;

        return $this;
    }

    public function getIdCarrier(): int
    {
        return $this->idCarrier;
    }

    public function setIdCarrier(int $idCarrier): Carrier
    {
        $this->idCarrier = $idCarrier;

        return $this;
    }

    public function getIdReference(): int
    {
        return $this->idReference;
    }

    public function setIdReference(int $idReference): Carrier
    {
        $this->idReference = $idReference;

        return $this;
    }

    public function getTaxesRatesGroupId(): int
    {
        return $this->taxesRatesGroupId;
    }

    public function setTaxesRatesGroupId(int $taxesRatesGroupId): Carrier
    {
        $this->taxesRatesGroupId = $taxesRatesGroupId;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): Carrier
    {
        $this->name = $name;

        return $this;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function setUrl(string $url): Carrier
    {
        $this->url = $url;

        return $this;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): Carrier
    {
        $this->active = $active;

        return $this;
    }

    public function isDeleted(): bool
    {
        return $this->deleted;
    }

    public function setDeleted(bool $deleted): Carrier
    {
        $this->deleted = $deleted;

        return $this;
    }

    public function getShippingHandling(): float
    {
        return $this->shippingHandling;
    }

    public function setShippingHandling(float $shippingHandling): Carrier
    {
        $this->shippingHandling = $shippingHandling;

        return $this;
    }

    public function getFreeShippingStartsAtPrice(): float
    {
        return $this->freeShippingStartsAtPrice;
    }

    public function setFreeShippingStartsAtPrice(float $freeShippingStartsAtPrice): Carrier
    {
        $this->freeShippingStartsAtPrice = $freeShippingStartsAtPrice;

        return $this;
    }

    public function getFreeShippingStartsAtWeight(): float
    {
        return $this->freeShippingStartsAtWeight;
    }

    public function setFreeShippingStartsAtWeight(float $freeShippingStartsAtWeight): Carrier
    {
        $this->freeShippingStartsAtWeight = $freeShippingStartsAtWeight;

        return $this;
    }

    public function isDisableCarrierWhenOutOfRange(): bool
    {
        return $this->disableCarrierWhenOutOfRange;
    }

    public function setDisableCarrierWhenOutOfRange(bool $disableCarrierWhenOutOfRange): Carrier
    {
        $this->disableCarrierWhenOutOfRange = $disableCarrierWhenOutOfRange;

        return $this;
    }

    public function isModule(): bool
    {
        return $this->isModule;
    }

    public function setIsModule(bool $isModule): Carrier
    {
        $this->isModule = $isModule;

        return $this;
    }

    public function isFree(): bool
    {
        return $this->isFree;
    }

    public function setIsFree(bool $isFree): Carrier
    {
        $this->isFree = $isFree;

        return $this;
    }

    public function isShippingExternal(): bool
    {
        return $this->shippingExternal;
    }

    public function setShippingExternal(bool $shippingExternal): Carrier
    {
        $this->shippingExternal = $shippingExternal;

        return $this;
    }

    public function isNeedRange(): bool
    {
        return $this->needRange;
    }

    public function setNeedRange(bool $needRange): Carrier
    {
        $this->needRange = $needRange;

        return $this;
    }

    public function getExternalModuleName(): string
    {
        return $this->externalModuleName;
    }

    public function setExternalModuleName(string $externalModuleName): Carrier
    {
        $this->externalModuleName = $externalModuleName;

        return $this;
    }

    public function getMaxWidth(): float
    {
        return $this->maxWidth;
    }

    public function setMaxWidth(float $maxWidth): Carrier
    {
        $this->maxWidth = $maxWidth;

        return $this;
    }

    public function getMaxHeight(): float
    {
        return $this->maxHeight;
    }

    public function setMaxHeight(float $maxHeight): Carrier
    {
        $this->maxHeight = $maxHeight;

        return $this;
    }

    public function getMaxDepth(): float
    {
        return $this->maxDepth;
    }

    public function setMaxDepth(float $maxDepth): Carrier
    {
        $this->maxDepth = $maxDepth;

        return $this;
    }

    public function getMaxWeight(): float
    {
        return $this->maxWeight;
    }

    public function setMaxWeight(float $maxWeight): Carrier
    {
        $this->maxWeight = $maxWeight;

        return $this;
    }

    public function getGrade(): int
    {
        return $this->grade;
    }

    public function setGrade(int $grade): Carrier
    {
        $this->grade = $grade;

        return $this;
    }

    public function getDelay(): string
    {
        return $this->delay;
    }

    public function setDelay(string $delay): Carrier
    {
        $this->delay = $delay;

        return $this;
    }

    public function getCurrency(): string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): Carrier
    {
        $this->currency = $currency;

        return $this;
    }

    public function getWeightUnit(): string
    {
        return $this->weightUnit;
    }

    public function setWeightUnit(string $weightUnit): Carrier
    {
        $this->weightUnit = $weightUnit;

        return $this;
    }

    public function getCountryIsoCodes(): array
    {
        return $this->countryIsoCodes;
    }

    public function setCountryIsoCodes(array $countryIsoCodes): Carrier
    {
        $this->countryIsoCodes = $countryIsoCodes;

        return $this;
    }

    public function getCarrierDetails(): array
    {
        return $this->carrierDetails;
    }

    public function setCarrierDetails(array $carrierDetails): Carrier
    {
        $this->carrierDetails = $carrierDetails;

        return $this;
    }

    public function getCarrierTaxes(): array
    {
        return $this->carrierTaxes;
    }

    public function setCarrierTaxes(array $carrierTaxes): Carrier
    {
        $this->carrierTaxes = $carrierTaxes;

        return $this;
    }

    public function jsonSerialize()
    {
        $return = [];

        $return[] = [
            'collection' => $this->getCollection(),
            'id' => (string) $this->getIdReference(),
            'properties' => [
                'id_carrier' => (string) $this->getIdCarrier(),
                'id_reference' => (string) $this->getIdReference(),
                'name' => (string) $this->getName(),
                'carrier_taxes_rates_group_id' => (string) $this->getTaxesRatesGroupId(),
                'url' => (string) $this->getUrl(),
                'active' => (bool) $this->isActive(),
                'deleted' => (bool) $this->isDeleted(),
                'shipping_handling' => (float) $this->getShippingHandling(),
                'free_shipping_starts_at_price' => (float) $this->getFreeShippingStartsAtPrice(),
                'free_shipping_starts_at_weight' => (float) $this->getFreeShippingStartsAtWeight(),
                'disable_carrier_when_out_of_range' => (bool) $this->isDisableCarrierWhenOutOfRange(),
                'is_module' => (bool) $this->isModule(),
                'is_free' => (bool) $this->isFree(),
                'shipping_external' => (bool) $this->isShippingExternal(),
                'need_range' => (bool) $this->isNeedRange(),
                'external_module_name' => (string) $this->getExternalModuleName(),
                'max_width' => (float) $this->getMaxWidth(),
                'max_height' => (float) $this->getMaxHeight(),
                'max_depth' => (float) $this->getMaxDepth(),
                'max_weight' => (float) $this->getMaxWeight(),
                'grade' => (int) $this->getGrade(),
                'delay' => (string) $this->getDelay(),
                'currency' => (string) $this->getCurrency(),
                'weight_unit' => (string) $this->getWeightUnit(),
                'country_ids' => (string) implode(',', $this->getCountryIsoCodes()),
            ],
        ];

        $carrierDetails = [];
        foreach ($this->getCarrierDetails() as $carrierDetail) {
            $carrierDetails[] = $carrierDetail->jsonSerialize();
        }

        $carrierTaxRates = [];
        foreach ($this->getCarrierTaxes() as $carrierTax) {
            $carrierTaxRates[] = $carrierTax->jsonSerialize();
        }

        return array_merge($return, $carrierDetails, $carrierTaxRates);
    }
}
