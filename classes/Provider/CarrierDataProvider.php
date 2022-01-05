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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Provider;

use Carrier;
use Currency;
use Language;
use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\Builder\CarrierBuilder;
use PrestaShop\Module\PsxMarketingWithGoogle\DTO\Carrier as DTOCarrier;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CarrierRepository;
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

        $carriers = Carrier::getCarriers($language->id, false, false, false, null, Carrier::ALL_CARRIERS);

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
