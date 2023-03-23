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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Repository;

use Carrier;
use RangePrice;
use RangeWeight;

class CarrierRepository
{
    public function getCarriers(int $langId): array
    {
        $carriers = Carrier::getCarriers($langId, false, false, false, null, Carrier::ALL_CARRIERS);

        $data = [];
        foreach ($carriers as $key => $carrier) {
            $carrierObj = new Carrier($carrier['id_carrier']);

            $data[$key]['collection'] = 'carriers';
            $data[$key]['id'] = $carrierObj->id;
            $data[$key]['properties'] = $carrier;

            $deliveryPriceByRanges = self::getDeliveryPriceByRange($carrierObj);
            foreach ($deliveryPriceByRanges as $deliveryPriceByRange) {
                $data[$key]['collection'] = 'carriers_details';
                $data[$key]['id'] = $deliveryPriceByRange['id_range_weight'];
                $data[$key]['properties'] = $deliveryPriceByRange;
            }
        }

        return $data;
    }

    public function getDeliveryPriceByRange(Carrier $carrierObj): array
    {
        $rangeTable = $carrierObj->getRangeTable();
        switch ($rangeTable) {
            case 'range_weight':
                return self::getCarrierByWeightRange($carrierObj);
            case 'range_price':
                return self::getCarrierByPriceRange($carrierObj);
            default:
                return [];
        }
    }

    private function getCarrierByPriceRange(Carrier $carrierObj): array
    {
        $deliveryPriceByRange = Carrier::getDeliveryPriceByRanges('range_price', (int) $carrierObj->id);

        $filteredRanges = [];
        foreach ($deliveryPriceByRange as $range) {
            $filteredRanges[$range['id_range_price']]['id_range_price'] = $range['id_range_price'];
            $filteredRanges[$range['id_range_price']]['id_carrier'] = $range['id_carrier'];
            $filteredRanges[$range['id_range_price']]['zones'][$range['id_zone']]['id_zone'] = $range['id_zone'];
            $filteredRanges[$range['id_range_price']]['zones'][$range['id_zone']]['price'] = $range['price'];
        }

        return $filteredRanges;
    }

    private function getCarrierByWeightRange(Carrier $carrierObj): array
    {
        $deliveryPriceByRange = Carrier::getDeliveryPriceByRanges('range_weight', (int) $carrierObj->id);

        $filteredRanges = [];
        foreach ($deliveryPriceByRange as $range) {
            $filteredRanges[$range['id_range_weight']]['id_range_weight'] = $range['id_range_weight'];
            $filteredRanges[$range['id_range_weight']]['id_carrier'] = $range['id_carrier'];
            $filteredRanges[$range['id_range_weight']]['zones'][$range['id_zone']]['id_zone'] = $range['id_zone'];
            $filteredRanges[$range['id_range_weight']]['zones'][$range['id_zone']]['price'] = $range['price'];
        }

        return $filteredRanges;
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
