<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\DTO;

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
     * @var CarrierDetail[]
     */
    private $carrierDetails = [];

    /**
     * @var CarrierTax[]
     */
    private $carrierTaxes = [];

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
     * @return Carrier
     */
    public function setCollection(string $collection): Carrier
    {
        $this->collection = $collection;

        return $this;
    }

    /**
     * @return int
     */
    public function getIdCarrier(): int
    {
        return $this->idCarrier;
    }

    /**
     * @param int $idCarrier
     *
     * @return Carrier
     */
    public function setIdCarrier(int $idCarrier): Carrier
    {
        $this->idCarrier = $idCarrier;

        return $this;
    }

    /**
     * @return int
     */
    public function getIdReference(): int
    {
        return $this->idReference;
    }

    /**
     * @param int $idReference
     *
     * @return Carrier
     */
    public function setIdReference(int $idReference): Carrier
    {
        $this->idReference = $idReference;

        return $this;
    }

    /**
     * @return int
     */
    public function getTaxesRatesGroupId(): int
    {
        return $this->taxesRatesGroupId;
    }

    /**
     * @param int $taxesRatesGroupId
     *
     * @return Carrier
     */
    public function setTaxesRatesGroupId(int $taxesRatesGroupId): Carrier
    {
        $this->taxesRatesGroupId = $taxesRatesGroupId;

        return $this;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return Carrier
     */
    public function setName(string $name): Carrier
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getUrl(): string
    {
        return $this->url;
    }

    /**
     * @param string $url
     *
     * @return Carrier
     */
    public function setUrl(string $url): Carrier
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->active;
    }

    /**
     * @param bool $active
     *
     * @return Carrier
     */
    public function setActive(bool $active): Carrier
    {
        $this->active = $active;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDeleted(): bool
    {
        return $this->deleted;
    }

    /**
     * @param bool $deleted
     *
     * @return Carrier
     */
    public function setDeleted(bool $deleted): Carrier
    {
        $this->deleted = $deleted;

        return $this;
    }

    /**
     * @return float
     */
    public function getShippingHandling(): float
    {
        return $this->shippingHandling;
    }

    /**
     * @param float $shippingHandling
     *
     * @return Carrier
     */
    public function setShippingHandling(float $shippingHandling): Carrier
    {
        $this->shippingHandling = $shippingHandling;

        return $this;
    }

    /**
     * @return float
     */
    public function getFreeShippingStartsAtPrice(): float
    {
        return $this->freeShippingStartsAtPrice;
    }

    /**
     * @param float $freeShippingStartsAtPrice
     *
     * @return Carrier
     */
    public function setFreeShippingStartsAtPrice(float $freeShippingStartsAtPrice): Carrier
    {
        $this->freeShippingStartsAtPrice = $freeShippingStartsAtPrice;

        return $this;
    }

    /**
     * @return float
     */
    public function getFreeShippingStartsAtWeight(): float
    {
        return $this->freeShippingStartsAtWeight;
    }

    /**
     * @param float $freeShippingStartsAtWeight
     *
     * @return Carrier
     */
    public function setFreeShippingStartsAtWeight(float $freeShippingStartsAtWeight): Carrier
    {
        $this->freeShippingStartsAtWeight = $freeShippingStartsAtWeight;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDisableCarrierWhenOutOfRange(): bool
    {
        return $this->disableCarrierWhenOutOfRange;
    }

    /**
     * @param bool $disableCarrierWhenOutOfRange
     *
     * @return Carrier
     */
    public function setDisableCarrierWhenOutOfRange(bool $disableCarrierWhenOutOfRange): Carrier
    {
        $this->disableCarrierWhenOutOfRange = $disableCarrierWhenOutOfRange;

        return $this;
    }

    /**
     * @return bool
     */
    public function isModule(): bool
    {
        return $this->isModule;
    }

    /**
     * @param bool $isModule
     *
     * @return Carrier
     */
    public function setIsModule(bool $isModule): Carrier
    {
        $this->isModule = $isModule;

        return $this;
    }

    /**
     * @return bool
     */
    public function isFree(): bool
    {
        return $this->isFree;
    }

    /**
     * @param bool $isFree
     *
     * @return Carrier
     */
    public function setIsFree(bool $isFree): Carrier
    {
        $this->isFree = $isFree;

        return $this;
    }

    /**
     * @return bool
     */
    public function isShippingExternal(): bool
    {
        return $this->shippingExternal;
    }

    /**
     * @param bool $shippingExternal
     *
     * @return Carrier
     */
    public function setShippingExternal(bool $shippingExternal): Carrier
    {
        $this->shippingExternal = $shippingExternal;

        return $this;
    }

    /**
     * @return bool
     */
    public function isNeedRange(): bool
    {
        return $this->needRange;
    }

    /**
     * @param bool $needRange
     *
     * @return Carrier
     */
    public function setNeedRange(bool $needRange): Carrier
    {
        $this->needRange = $needRange;

        return $this;
    }

    /**
     * @return string
     */
    public function getExternalModuleName(): string
    {
        return $this->externalModuleName;
    }

    /**
     * @param string $externalModuleName
     *
     * @return Carrier
     */
    public function setExternalModuleName(string $externalModuleName): Carrier
    {
        $this->externalModuleName = $externalModuleName;

        return $this;
    }

    /**
     * @return float
     */
    public function getMaxWidth(): float
    {
        return $this->maxWidth;
    }

    /**
     * @param float $maxWidth
     *
     * @return Carrier
     */
    public function setMaxWidth(float $maxWidth): Carrier
    {
        $this->maxWidth = $maxWidth;

        return $this;
    }

    /**
     * @return float
     */
    public function getMaxHeight(): float
    {
        return $this->maxHeight;
    }

    /**
     * @param float $maxHeight
     *
     * @return Carrier
     */
    public function setMaxHeight(float $maxHeight): Carrier
    {
        $this->maxHeight = $maxHeight;

        return $this;
    }

    /**
     * @return float
     */
    public function getMaxDepth(): float
    {
        return $this->maxDepth;
    }

    /**
     * @param float $maxDepth
     *
     * @return Carrier
     */
    public function setMaxDepth(float $maxDepth): Carrier
    {
        $this->maxDepth = $maxDepth;

        return $this;
    }

    /**
     * @return float
     */
    public function getMaxWeight(): float
    {
        return $this->maxWeight;
    }

    /**
     * @param float $maxWeight
     *
     * @return Carrier
     */
    public function setMaxWeight(float $maxWeight): Carrier
    {
        $this->maxWeight = $maxWeight;

        return $this;
    }

    /**
     * @return int
     */
    public function getGrade(): int
    {
        return $this->grade;
    }

    /**
     * @param int $grade
     *
     * @return Carrier
     */
    public function setGrade(int $grade): Carrier
    {
        $this->grade = $grade;

        return $this;
    }

    /**
     * @return string
     */
    public function getDelay(): string
    {
        return $this->delay;
    }

    /**
     * @param string $delay
     *
     * @return Carrier
     */
    public function setDelay(string $delay): Carrier
    {
        $this->delay = $delay;

        return $this;
    }

    /**
     * @return string
     */
    public function getCurrency(): string
    {
        return $this->currency;
    }

    /**
     * @param string $currency
     *
     * @return Carrier
     */
    public function setCurrency(string $currency): Carrier
    {
        $this->currency = $currency;

        return $this;
    }

    /**
     * @return string
     */
    public function getWeightUnit(): string
    {
        return $this->weightUnit;
    }

    /**
     * @param string $weightUnit
     *
     * @return Carrier
     */
    public function setWeightUnit(string $weightUnit): Carrier
    {
        $this->weightUnit = $weightUnit;

        return $this;
    }

    /**
     * @return CarrierDetail[]
     */
    public function getCarrierDetails(): array
    {
        return $this->carrierDetails;
    }

    /**
     * @param CarrierDetail[] $carrierDetails
     *
     * @return Carrier
     */
    public function setCarrierDetails(array $carrierDetails): Carrier
    {
        $this->carrierDetails = $carrierDetails;

        return $this;
    }

    /**
     * @return CarrierTax[]
     */
    public function getCarrierTaxes(): array
    {
        return $this->carrierTaxes;
    }

    /**
     * @param CarrierTax[] $carrierTaxes
     *
     * @return Carrier
     */
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
