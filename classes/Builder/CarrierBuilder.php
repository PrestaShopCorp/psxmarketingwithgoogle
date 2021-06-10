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

namespace PrestaShop\Module\PrestashopGoogleShopping\Builder;

use Carrier;
use Currency;
use Language;
use PrestaShop\Module\PrestashopGoogleShopping\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PrestashopGoogleShopping\DTO\Carrier as DTOCarrier;
use PrestaShop\Module\PrestashopGoogleShopping\DTO\CarrierDetail;
use PrestaShop\Module\PrestashopGoogleShopping\DTO\CarrierTax;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\CarrierRepository;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\CountryRepository;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\StateRepository;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\TaxRepository;
use RangePrice;
use RangeWeight;

class CarrierBuilder
{
    /**
     * @var CarrierRepository
     */
    private $carrierRepository;

    /**
     * @var CountryRepository
     */
    private $countryRepository;

    /**
     * @var StateRepository
     */
    private $stateRepository;

    /**
     * @var TaxRepository
     */
    private $taxRepository;

    /**
     * @var ConfigurationAdapter
     */
    private $configurationAdapter;

    public function __construct(
        CarrierRepository $carrierRepository,
        CountryRepository $countryRepository,
        StateRepository $stateRepository,
        TaxRepository $taxRepository,
        ConfigurationAdapter $configurationAdapter
    ) {
        $this->carrierRepository = $carrierRepository;
        $this->countryRepository = $countryRepository;
        $this->stateRepository = $stateRepository;
        $this->taxRepository = $taxRepository;
        $this->configurationAdapter = $configurationAdapter;
    }

    public function buildCarriers(array $carriers, Language $lang, Currency $currency, string $weightUnit): array
    {
        $carrierLines = [];
        foreach ($carriers as $carrier) {
            $carrierLines[] = self::buildCarrier(
                new Carrier($carrier['id_carrier'], $lang->id),
                $currency->iso_code,
                $weightUnit
            );
        }

        $formattedCarriers = [];
        /** @var DTOCarrier $carrierLine */
        foreach ($carrierLines as $carrierLine) {
            $formattedCarriers = array_merge($formattedCarriers, $carrierLine->jsonSerialize());
        }

        return $formattedCarriers;
    }

    public function buildCarrier(Carrier $carrier, string $currencyIsoCode, string $weightUnit): DTOCarrier
    {
        $carrierLine = new DTOCarrier();
        $freeShippingStartsAtPrice = (float) $this->configurationAdapter->get('PS_SHIPPING_FREE_PRICE');
        $freeShippingStartsAtWeight = (float) $this->configurationAdapter->get('PS_SHIPPING_FREE_WEIGHT');
        $carrierLine->setFreeShippingStartsAtPrice($freeShippingStartsAtPrice);
        $carrierLine->setFreeShippingStartsAtWeight($freeShippingStartsAtWeight);

        $carrierLine->setShippingHandling($this->getShippingHandlePrice((bool) $carrier->shipping_handling));

        $carrierLine
            ->setIdCarrier((int) $carrier->id)
            ->setIdReference((int) $carrier->id_reference)
            ->setName($carrier->name)
            ->setTaxesRatesGroupId((int) $carrier->getIdTaxRulesGroup())
            ->setUrl($carrier->url)
            ->setActive($carrier->active)
            ->setDeleted($carrier->deleted)
            ->setDisableCarrierWhenOutOfRange((bool) $carrier->range_behavior)
            ->setIsModule($carrier->is_module)
            ->setIsFree($carrier->is_free)
            ->setShippingExternal($carrier->shipping_external)
            ->setNeedRange($carrier->need_range)
            ->setExternalModuleName($carrier->external_module_name)
            ->setMaxWidth($carrier->max_width)
            ->setMaxHeight($carrier->max_height)
            ->setMaxDepth($carrier->max_depth)
            ->setMaxWeight($carrier->max_weight)
            ->setGrade($carrier->grade)
            ->setDelay($carrier->delay)
            ->setCurrency($currencyIsoCode)
            ->setWeightUnit($weightUnit);

        $deliveryPriceByRanges = $this->carrierRepository->getDeliveryPriceByRange($carrier);

        if (!$deliveryPriceByRanges) {
            return $carrierLine;
        }

        $carrierDetails = [];
        $carrierTaxes = [];
        foreach ($deliveryPriceByRanges as $deliveryPriceByRange) {
            $range = $this->carrierRepository->getCarrierRange($deliveryPriceByRange);
            if (!$range) {
                continue;
            }
            foreach ($deliveryPriceByRange['zones'] as $zone) {
                $carrierDetail = $this->buildCarrierDetails($carrier, $range, $zone, $deliveryPriceByRange);
                if ($carrierDetail) {
                    $carrierDetails[] = $carrierDetail;
                }

                $carrierTax = $this->buildCarrierTaxes($carrier, $zone['id_zone']);
                if ($carrierTax) {
                    $carrierTaxes[] = $carrierTax;
                }
            }
        }

        $carrierLine->setCarrierDetails($carrierDetails);
        $carrierLine->setCarrierTaxes($carrierTaxes);

        return $carrierLine;
    }

    /**
     * @param Carrier $carrier
     * @param RangeWeight|RangePrice $range
     * @param array $zone
     * @param array $deliveryPriceByRange
     *
     * @return ?CarrierDetail
     */
    private function buildCarrierDetails(Carrier $carrier, $range, array $zone, array $deliveryPriceByRange)
    {
        $rangeTable = $carrier->getRangeTable();
        $carrierDetailId = isset($deliveryPriceByRange['id_range_weight']) ? $deliveryPriceByRange['id_range_weight'] : $deliveryPriceByRange['id_range_price'];
        $carrierDetail = new CarrierDetail();
        $carrierDetail->setShippingMethod($rangeTable);
        $carrierDetail->setCarrierDetailId($carrierDetailId);
        $carrierDetail->setDelimiter1($range->delimiter1);
        $carrierDetail->setDelimiter2($range->delimiter2);
        $carrierDetail->setPrice($zone['price']);
        $carrierDetail->setCarrierReference($carrier->id_reference);
        $carrierDetail->setZoneId($zone['id_zone']);
        $carrierDetail->setRangeId($range->id);

        $countryIsoCodes = $this->countryRepository->getCountyIsoCodesByZoneId($zone['id_zone']);
        if (!$countryIsoCodes) {
            return null;
        }
        $carrierDetail->setCountryIsoCodes($countryIsoCodes);

        $stateIsoCodes = $this->stateRepository->getStateIsoCodesByZoneId($zone['id_zone']);
        $carrierDetail->setStateIsoCodes($stateIsoCodes);

        return $carrierDetail;
    }

    private function buildCarrierTaxes(Carrier $carrier, int $zoneId): ?CarrierTax
    {
        $taxRulesGroupId = (int) $carrier->getIdTaxRulesGroup();
        $carrierTaxesByZone = $this->taxRepository->getCarrierTaxesByZone($zoneId, $taxRulesGroupId);

        if (!$carrierTaxesByZone[0]['country_iso_code']) {
            return null;
        }

        $carrierTaxesByZone = $carrierTaxesByZone[0];

        $carrierTax = new CarrierTax();
        $carrierTax->setCarrierReference($carrier->id_reference);
        $carrierTax->setTaxRulesGroupId($taxRulesGroupId);
        $carrierTax->setZoneId($zoneId);
        $carrierTax->setCountryIsoCode((string) $carrierTaxesByZone['country_iso_code']);
        $carrierTax->setStateIsoCodes((string) $carrierTaxesByZone['state_iso_code']);
        $carrierTax->setTaxRate($carrierTaxesByZone['rate']);

        return $carrierTax;
    }

    private function getShippingHandlePrice(bool $shippingHandling): float
    {
        if ($shippingHandling) {
            return (float) $this->configurationAdapter->get('PS_SHIPPING_HANDLING');
        }

        return 0.0;
    }
}
