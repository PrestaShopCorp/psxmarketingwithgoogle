<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Provider;

use Carrier;
use Currency;
use Language;
use PrestaShop\Module\PrestashopGoogleShopping\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PrestashopGoogleShopping\Builder\CarrierBuilder;
use PrestaShop\Module\PrestashopGoogleShopping\DTO\Carrier as DTOCarrier;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\CarrierRepository;
use RangePrice;
use RangeWeight;

class CarrierDataProvider
{
    /**
     * @var ConfigurationAdapter
     */
    private $configurationAdapter;

    /**
     * @var CarrierBuilder
     */
    private $carrierBuilder;

    /**
     * @var CarrierRepository
     */
    private $carrierRepository;

    public function __construct(
        ConfigurationAdapter $configurationAdapter,
        CarrierBuilder $carrierBuilder,
        CarrierRepository $carrierRepository
    ) {
        $this->configurationAdapter = $configurationAdapter;
        $this->carrierBuilder = $carrierBuilder;
        $this->carrierRepository = $carrierRepository;
    }

    public function getFormattedData(): array
    {
        $language = new Language($this->configurationAdapter->get('PS_LANG_DEFAULT'));
        $currency = new Currency($this->configurationAdapter->get('PS_CURRENCY_DEFAULT'));

        $carriers = Carrier::getCarriers($language->id);

        /** @var DTOCarrier[] $carrierLines */
        $carrierLines = $this->carrierBuilder->buildCarriers(
            $carriers,
            $language,
            $currency,
            $this->configurationAdapter->get('PS_WEIGHT_UNIT')
        );

        return $carrierLines;
    }

    /**
     * @param array $deliveryPriceByRange
     *
     * @return false|RangeWeight|RangePrice
     *
     * @throws \PrestaShopDatabaseException
     * @throws \PrestaShopException
     */
    public function getCarrierRange(array $deliveryPriceByRange)
    {
        if (isset($deliveryPriceByRange['id_range_weight'])) {
            return new RangeWeight($deliveryPriceByRange['id_range_weight']);
        }
        if (isset($deliveryPriceByRange['id_range_price'])) {
            return new RangePrice($deliveryPriceByRange['id_range_price']);
        }

        return false;
    }
}
