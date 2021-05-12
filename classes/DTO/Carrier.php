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
    public function getCollection()
    {
        return $this->collection;
    }

    /**
     * @param string $collection
     *
     * @return Carrier
     */
    public function setCollection($collection)
    {
        $this->collection = $collection;

        return $this;
    }

    /**
     * @return int
     */
    public function getIdCarrier()
    {
        return $this->idCarrier;
    }

    /**
     * @param int $idCarrier
     *
     * @return Carrier
     */
    public function setIdCarrier($idCarrier)
    {
        $this->idCarrier = $idCarrier;

        return $this;
    }

    /**
     * @return int
     */
    public function getIdReference()
    {
        return $this->idReference;
    }

    /**
     * @param int $idReference
     *
     * @return Carrier
     */
    public function setIdReference($idReference)
    {
        $this->idReference = $idReference;

        return $this;
    }

    /**
     * @return int
     */
    public function getTaxesRatesGroupId()
    {
        return $this->taxesRatesGroupId;
    }

    /**
     * @param int $taxesRatesGroupId
     *
     * @return Carrier
     */
    public function setTaxesRatesGroupId($taxesRatesGroupId)
    {
        $this->taxesRatesGroupId = $taxesRatesGroupId;

        return $this;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return Carrier
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @param string $url
     *
     * @return Carrier
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return bool
     */
    public function isActive()
    {
        return $this->active;
    }

    /**
     * @param bool $active
     *
     * @return Carrier
     */
    public function setActive($active)
    {
        $this->active = $active;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDeleted()
    {
        return $this->deleted;
    }

    /**
     * @param bool $deleted
     *
     * @return Carrier
     */
    public function setDeleted($deleted)
    {
        $this->deleted = $deleted;

        return $this;
    }

    /**
     * @return float
     */
    public function getShippingHandling()
    {
        return $this->shippingHandling;
    }

    /**
     * @param float $shippingHandling
     *
     * @return Carrier
     */
    public function setShippingHandling($shippingHandling)
    {
        $this->shippingHandling = $shippingHandling;

        return $this;
    }

    /**
     * @return float
     */
    public function getFreeShippingStartsAtPrice()
    {
        return $this->freeShippingStartsAtPrice;
    }

    /**
     * @param float $freeShippingStartsAtPrice
     *
     * @return Carrier
     */
    public function setFreeShippingStartsAtPrice($freeShippingStartsAtPrice)
    {
        $this->freeShippingStartsAtPrice = $freeShippingStartsAtPrice;

        return $this;
    }

    /**
     * @return float
     */
    public function getFreeShippingStartsAtWeight()
    {
        return $this->freeShippingStartsAtWeight;
    }

    /**
     * @param float $freeShippingStartsAtWeight
     *
     * @return Carrier
     */
    public function setFreeShippingStartsAtWeight($freeShippingStartsAtWeight)
    {
        $this->freeShippingStartsAtWeight = $freeShippingStartsAtWeight;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDisableCarrierWhenOutOfRange()
    {
        return $this->disableCarrierWhenOutOfRange;
    }

    /**
     * @param bool $disableCarrierWhenOutOfRange
     *
     * @return Carrier
     */
    public function setDisableCarrierWhenOutOfRange($disableCarrierWhenOutOfRange)
    {
        $this->disableCarrierWhenOutOfRange = $disableCarrierWhenOutOfRange;

        return $this;
    }

    /**
     * @return bool
     */
    public function isModule()
    {
        return $this->isModule;
    }

    /**
     * @param bool $isModule
     *
     * @return Carrier
     */
    public function setIsModule($isModule)
    {
        $this->isModule = $isModule;

        return $this;
    }

    /**
     * @return bool
     */
    public function isFree()
    {
        return $this->isFree;
    }

    /**
     * @param bool $isFree
     *
     * @return Carrier
     */
    public function setIsFree($isFree)
    {
        $this->isFree = $isFree;

        return $this;
    }

    /**
     * @return bool
     */
    public function isShippingExternal()
    {
        return $this->shippingExternal;
    }

    /**
     * @param bool $shippingExternal
     *
     * @return Carrier
     */
    public function setShippingExternal($shippingExternal)
    {
        $this->shippingExternal = $shippingExternal;

        return $this;
    }

    /**
     * @return bool
     */
    public function isNeedRange()
    {
        return $this->needRange;
    }

    /**
     * @param bool $needRange
     *
     * @return Carrier
     */
    public function setNeedRange($needRange)
    {
        $this->needRange = $needRange;

        return $this;
    }

    /**
     * @return string
     */
    public function getExternalModuleName()
    {
        return $this->externalModuleName;
    }

    /**
     * @param string $externalModuleName
     *
     * @return Carrier
     */
    public function setExternalModuleName($externalModuleName)
    {
        $this->externalModuleName = $externalModuleName;

        return $this;
    }

    /**
     * @return float
     */
    public function getMaxWidth()
    {
        return $this->maxWidth;
    }

    /**
     * @param float $maxWidth
     *
     * @return Carrier
     */
    public function setMaxWidth($maxWidth)
    {
        $this->maxWidth = $maxWidth;

        return $this;
    }

    /**
     * @return float
     */
    public function getMaxHeight()
    {
        return $this->maxHeight;
    }

    /**
     * @param float $maxHeight
     *
     * @return Carrier
     */
    public function setMaxHeight($maxHeight)
    {
        $this->maxHeight = $maxHeight;

        return $this;
    }

    /**
     * @return float
     */
    public function getMaxDepth()
    {
        return $this->maxDepth;
    }

    /**
     * @param float $maxDepth
     *
     * @return Carrier
     */
    public function setMaxDepth($maxDepth)
    {
        $this->maxDepth = $maxDepth;

        return $this;
    }

    /**
     * @return float
     */
    public function getMaxWeight()
    {
        return $this->maxWeight;
    }

    /**
     * @param float $maxWeight
     *
     * @return Carrier
     */
    public function setMaxWeight($maxWeight)
    {
        $this->maxWeight = $maxWeight;

        return $this;
    }

    /**
     * @return int
     */
    public function getGrade()
    {
        return $this->grade;
    }

    /**
     * @param int $grade
     *
     * @return Carrier
     */
    public function setGrade($grade)
    {
        $this->grade = $grade;

        return $this;
    }

    /**
     * @return string
     */
    public function getDelay()
    {
        return $this->delay;
    }

    /**
     * @param string $delay
     *
     * @return Carrier
     */
    public function setDelay($delay)
    {
        $this->delay = $delay;

        return $this;
    }

    /**
     * @return string
     */
    public function getCurrency()
    {
        return $this->currency;
    }

    /**
     * @param string $currency
     *
     * @return Carrier
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;

        return $this;
    }

    /**
     * @return string
     */
    public function getWeightUnit()
    {
        return $this->weightUnit;
    }

    /**
     * @param string $weightUnit
     *
     * @return Carrier
     */
    public function setWeightUnit($weightUnit)
    {
        $this->weightUnit = $weightUnit;

        return $this;
    }

    /**
     * @return CarrierDetail[]
     */
    public function getCarrierDetails()
    {
        return $this->carrierDetails;
    }

    /**
     * @param CarrierDetail[] $carrierDetails
     *
     * @return Carrier
     */
    public function setCarrierDetails($carrierDetails)
    {
        $this->carrierDetails = $carrierDetails;

        return $this;
    }

    /**
     * @return CarrierTax[]
     */
    public function getCarrierTaxes()
    {
        return $this->carrierTaxes;
    }

    /**
     * @param CarrierTax[] $carrierTaxes
     *
     * @return Carrier
     */
    public function setCarrierTaxes($carrierTaxes)
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
