<?php

namespace Carrier;

use Carrier;
use PrestaShop\Module\PrestashopGoogleShopping\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PrestashopGoogleShopping\Builder\CarrierBuilder;
use PrestaShop\Module\PrestashopGoogleShopping\DTO\CarrierDetail;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\CarrierRepository;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\CountryRepository;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\StateRepository;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\TaxRepository;
use RangePrice;

class CarrierBuilderTest extends \PHPUnit_Framework_TestCase
{
    public function testBuildCarriers()
    {
    }

    /**
     * @dataProvider buildCarrierDataProvider
     *
     * @param Carrier $carrier
     * @param string $currency
     * @param string $weightUnit
     * @param float $freeShippintAtPrice
     * @param float $freeShippingAtWeight
     * @param $mockedDeliveryBy
     * @param $mockedCountryIsoCode
     * @param $mockedStateIsoCode
     * @param $mockedCarrierTaxesByZone
     * @param $mockedCarrierRange
     * @param array $expected
     *
     * @throws \PrestaShopDatabaseException
     * @throws \PrestaShopException
     */
    public function testBuildCarrier(
        Carrier $carrier,
        string $currency,
        string $weightUnit,
        float $freeShippintAtPrice,
        float $freeShippingAtWeight,
        $mockedDeliveryBy,
        $mockedCountryIsoCode,
        $mockedStateIsoCode,
        $mockedCarrierTaxesByZone,
        $mockedCarrierRange,
        array $expected
    ) {
        $carrierRepo = $this->createCarrierRepositoryMock($mockedDeliveryBy, $mockedCarrierRange);

        $countryRepo = $this->createCountryRepositoryMock($mockedCountryIsoCode);

        $stateRepo = $this->createStateRepositoryMock($mockedStateIsoCode);

        $taxRepository = $this->createTaxRepositoryMock($mockedCarrierTaxesByZone);

        $configurationAdapter = $this->createConfigurationAdapterMock($freeShippintAtPrice, $freeShippingAtWeight);

        $carrierBuilder = new CarrierBuilder($carrierRepo, $countryRepo, $stateRepo, $taxRepository, $configurationAdapter);
        $carrierLine = $carrierBuilder->buildCarrier($carrier, $currency, $weightUnit);

        $this->assertEquals($expected, $carrierLine->jsonSerialize());
    }

    public function buildCarrierDataProvider()
    {
        $carrierCollection = 'carriers';
        $carrierDetailsCollection = 'carrier_details';
        $carrierTaxesCollection = 'carrier_taxes';

        $externalModuleName = 'Carrier module';
        $carrierTaxesRatesGroupId = 1;
        $carrierUrl = '';
        $true = true;
        $false = false;
        $freeShippingHandle = 0.0;
        $shippingHandleFee = 10.0;

        $freeShippingStartsAtPriceRange = 5.0;
        $freeShippingStartsAtWeightRange = 5.0;

        $noSizeLimitation = 0.0;
        $maxWidth = 1.0;
        $maxHeight = 2.0;
        $maxDepth = 3.0;
        $maxWeight = 4.0;

        $priceFree = 0.0;

        $grade = 0;
        $currency = 'EUR';
        $weightUnit = 'kg';
        $countryIsoCode = 'FR';
        $taxRate = 21.0;

        $freeCarrierReference = 1;
        $freeCarrierId = 1;
        $freeCarrierName = 'free carrier';
        $freeCarrierDelay = 'Free shipping!';

        $carrierReference = 2;
        $carrierId = 3;
        $carrierName = 'basic carrier';
        $carrierDelay = 'delivery in one day!';
        $carrierShippingPrice = 5.0;
        $firstZoneId = 1;
        $secondZoneId = 2;
        $rangePriceId = 1;

        $freeShippingCarrier = $this->createMockedCarrierObject(
            $freeCarrierId,
            $freeCarrierReference,
            $freeCarrierName,
            $carrierTaxesRatesGroupId,
            $carrierUrl,
            $true,
            $false,
            $false,
            $false,
            $true,
            $false,
            $false,
            $externalModuleName,
            $noSizeLimitation,
            $noSizeLimitation,
            $noSizeLimitation,
            $noSizeLimitation,
            $grade,
            $freeCarrierDelay
        );

        $carrier = $this->createMockedCarrierObject(
            $carrierId,
            $carrierReference,
            $carrierName,
            $carrierTaxesRatesGroupId,
            $carrierUrl,
            $true,
            $false,
            $false,
            $false,
            $true,
            $false,
            $false,
            $externalModuleName,
            $noSizeLimitation,
            $noSizeLimitation,
            $noSizeLimitation,
            $noSizeLimitation,
            $grade,
            $carrierDelay
        );

        $priceRangeDelimiter1 = 0.0;
        $priceRangeDelimiter2 = 100.0;
        $rangePrice = $this->createMockedRangePrice($rangePriceId, $priceRangeDelimiter1, $priceRangeDelimiter2);

        return [
            'free shipping' => [
                'carrier' => $freeShippingCarrier,
                'currency' => $currency,
                'weightUnit' => $weightUnit,
                'mockedFreeShippingAtPrice' => $freeShippingStartsAtPriceRange,
                'mockedFreeShippingAtWeight' => $freeShippingStartsAtWeightRange,
                'mockedDeliveryBy' => $false,
                'mockedCountryIsoCodeByZone' => $countryIsoCode,
                'mockedStateIsoCodeByZone' => $false,
                'mockedCarrierTaxesByZone' => $priceFree,
                'mockedCarrierRange' => $rangePrice,
                'result' => [
                    [
                        'collection' => (string) $carrierCollection,
                        'id' => (string) $freeCarrierReference,
                        'properties' => [
                            'id_carrier' => (string) $freeCarrierId,
                            'id_reference' => (string) $freeCarrierReference,
                            'name' => $freeCarrierName,
                            'carrier_taxes_rates_group_id' => (string) $carrierTaxesRatesGroupId,
                            'url' => $carrierUrl,
                            'active' => $true,
                            'deleted' => $false,
                            'shipping_handling' => $freeShippingHandle,
                            'free_shipping_starts_at_price' => $freeShippingStartsAtPriceRange,
                            'free_shipping_starts_at_weight' => $freeShippingStartsAtWeightRange,
                            'disable_carrier_when_out_of_range' => $false,
                            'is_module' => $false,
                            'is_free' => $true,
                            'shipping_external' => $false,
                            'need_range' => $false,
                            'external_module_name' => '',
                            'max_width' => $noSizeLimitation,
                            'max_height' => $noSizeLimitation,
                            'max_depth' => $noSizeLimitation,
                            'max_weight' => $noSizeLimitation,
                            'grade' => $grade,
                            'delay' => $freeCarrierDelay,
                            'currency' => $currency,
                            'weight_unit' => $weightUnit,
                        ],
                    ],
                ],
            ],
            'carrier with price' => [
                'carrier' => $carrier,
                'currency' => $currency,
                'weightUnit' => $weightUnit,
                'mockedFreeShippingAtPrice' => $freeShippingStartsAtPriceRange,
                'mockedFreeShippingAtWeight' => $freeShippingStartsAtWeightRange,
                'mockedDeliveryBy' => [
                    [
                        'id_range_price' => $rangePriceId,
                        'id_carrier' => $carrierId,
                        'zones' => [
                            '1' => [
                                'id_zone' => $firstZoneId,
                                'price' => $carrierShippingPrice,
                            ],
                        ],
                    ],
                ],
                'mockedCountryIsoCodeByZone' => [$countryIsoCode],
                'mockedStateIsoCodeByZone' => [],
                'mockedCarrierTaxesByZone' => [
                    0 => [
                        'rate' => (string) $taxRate,
                        'country_iso_code' => $countryIsoCode,
                        'state_iso_code' => null,
                    ],
                ],
                'mockedCarrierRange' => $rangePrice,
                'result' => [
                    [
                        'collection' => (string) $carrierCollection,
                        'id' => (string) $carrierReference,
                        'properties' => [
                            'id_carrier' => (string) $carrierId,
                            'id_reference' => (string) $carrierReference,
                            'name' => $carrierName,
                            'carrier_taxes_rates_group_id' => (string) $carrierTaxesRatesGroupId,
                            'url' => $carrierUrl,
                            'active' => $true,
                            'deleted' => $false,
                            'shipping_handling' => $freeShippingHandle,
                            'free_shipping_starts_at_price' => $freeShippingStartsAtPriceRange,
                            'free_shipping_starts_at_weight' => $freeShippingStartsAtWeightRange,
                            'disable_carrier_when_out_of_range' => $false,
                            'is_module' => $false,
                            'is_free' => $true,
                            'shipping_external' => $false,
                            'need_range' => $false,
                            'external_module_name' => '',
                            'max_width' => $noSizeLimitation,
                            'max_height' => $noSizeLimitation,
                            'max_depth' => $noSizeLimitation,
                            'max_weight' => $noSizeLimitation,
                            'grade' => $grade,
                            'delay' => $carrierDelay,
                            'currency' => $currency,
                            'weight_unit' => $weightUnit,
                        ],
                    ],
                    [
                        'collection' => (string) $carrierDetailsCollection,
                        'id' => $carrierReference . '-' . $firstZoneId . '-' . CarrierDetail::RANGE_BY_PRICE . '-' . $rangePriceId,
                        'properties' => [
                            'id_reference' => (string) $carrierReference,
                            'id_carrier_detail' => (string) $rangePriceId,
                            'shipping_method' => 'range_price',
                            'delimiter1' => $priceRangeDelimiter1,
                            'delimiter2' => $priceRangeDelimiter2,
                            'country_ids' => $countryIsoCode,
                            'state_ids' => '',
                            'price' => $carrierShippingPrice,
                        ],
                    ],
                    [
                        'collection' => (string) $carrierTaxesCollection,
                        'id' => $carrierReference . '-' . $firstZoneId,
                        'properties' => [
                            'id_reference' => (string) $carrierReference,
                            'id_carrier_tax' => (string) $carrierTaxesRatesGroupId,
                            'country_id' => $countryIsoCode,
                            'state_ids' => '',
                            'tax_rate' => $taxRate,
                        ],
                    ],
                ],
            ],
        ];
    }

    private function createMockedCarrierObject(
        $id,
        $reference,
        $name,
        $taxRuleId,
        $url,
        $isActive,
        $isDeleted,
        $rangeBehavior,
        $isModule,
        $isFree,
        $shippingExternal,
        $needRange,
        $externalModuleName,
        $maxWidth,
        $maxHeight,
        $maxDepth,
        $maxWeight,
        $grade,
        $delay
    ) {
        $carrier = $this->getMockBuilder(Carrier::class)
            ->disableOriginalConstructor()
            ->getMock();

        $carrier->id = $id;
        $carrier->id_reference = $reference;
        $carrier->name = $name;
        $carrier->expects($this->any())->method('getIdTaxRulesGroup')->willReturn($taxRuleId);
        $carrier->expects($this->any())->method('getRangeTable')->willReturn('range_price');
        $carrier->url = $url;
        $carrier->active = $isActive;
        $carrier->deleted = $isDeleted;
        $carrier->range_behavior = $rangeBehavior;
        $carrier->is_module = $isModule;
        $carrier->is_free = $isFree;
        $carrier->shipping_external = $shippingExternal;
        $carrier->need_range = $needRange;
        $carrier->external_module_name = $isModule ? $externalModuleName : '';
        $carrier->max_width = $maxWidth;
        $carrier->max_height = $maxHeight;
        $carrier->max_depth = $maxDepth;
        $carrier->max_weight = $maxWeight;
        $carrier->grade = $grade;
        $carrier->delay = $delay;

        return $carrier;
    }

    private function createMockedRangePrice($id, $delimiter1, $delimiter2)
    {
        $rangePrice = $this->getMockBuilder(RangePrice::class)
            ->disableOriginalConstructor()
            ->getMock();

        $rangePrice->id = $id;
        $rangePrice->delimiter1 = $delimiter1;
        $rangePrice->delimiter2 = $delimiter2;

        return $rangePrice;
    }

    /**
     * @param $mockedDeliveryBy
     * @param $mockedCarrierRange
     *
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    private function createCarrierRepositoryMock($mockedDeliveryBy, $mockedCarrierRange): \PHPUnit_Framework_MockObject_MockObject
    {
        $carrierRepo = $this->getMockBuilder(CarrierRepository::class)
            ->disableOriginalConstructor()
            ->getMock();
        $carrierRepo->expects($this->at(0))->method('getDeliveryPriceByRange')->willReturn($mockedDeliveryBy);
        $carrierRepo->expects($this->any())->method('getCarrierRange')->willReturn($mockedCarrierRange);

        return $carrierRepo;
    }

    /**
     * @param $mockedCountryIsoCode
     *
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    private function createCountryRepositoryMock($mockedCountryIsoCode): \PHPUnit_Framework_MockObject_MockObject
    {
        $countryRepo = $this->getMockBuilder(CountryRepository::class)
            ->disableOriginalConstructor()
            ->getMock();
        $countryRepo->expects($this->any())->method('getCountyIsoCodesByZoneId')->willReturn($mockedCountryIsoCode);

        return $countryRepo;
    }

    /**
     * @param $mockedStateIsoCode
     *
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    private function createStateRepositoryMock($mockedStateIsoCode): \PHPUnit_Framework_MockObject_MockObject
    {
        $stateRepo = $this->getMockBuilder(StateRepository::class)
            ->disableOriginalConstructor()
            ->getMock();
        $stateRepo->expects($this->any())->method('getStateIsoCodesByZoneId')->willReturn($mockedStateIsoCode);

        return $stateRepo;
    }

    /**
     * @param $mockedCarrierTaxesByZone
     *
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    private function createTaxRepositoryMock($mockedCarrierTaxesByZone): \PHPUnit_Framework_MockObject_MockObject
    {
        $taxRepository = $this->getMockBuilder(TaxRepository::class)
            ->disableOriginalConstructor()
            ->getMock();
        $taxRepository->expects($this->any())->method('getCarrierTaxesByZone')->willReturn($mockedCarrierTaxesByZone);

        return $taxRepository;
    }

    /**
     * @param float $freeShippintAtPrice
     * @param float $freeShippingAtWeight
     *
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    private function createConfigurationAdapterMock(float $freeShippintAtPrice, float $freeShippingAtWeight): \PHPUnit_Framework_MockObject_MockObject
    {
        $configurationAdapter = $this->getMockBuilder(ConfigurationAdapter::class)
            ->disableOriginalConstructor()
            ->getMock();
        $configurationAdapter->expects($this->at(0))->method('get')->willReturn($freeShippintAtPrice);
        $configurationAdapter->expects($this->at(1))->method('get')->willReturn($freeShippingAtWeight);

        return $configurationAdapter;
    }
}
