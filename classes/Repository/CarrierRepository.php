<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Repository;

use Carrier;
use Context;
use Db;
use RangePrice;
use RangeWeight;

class CarrierRepository
{
    /**
     * @var Db
     */
    private $db;

    /**
     * @var Context
     */
    private $context;

    public function __construct(Db $db, Context $context)
    {
        $this->db = $db;
        $this->context = $context;
    }

    public function getCarriers(int $langId): array
    {
        $carriers = Carrier::getCarriers($langId);

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
                return self::getCarrierByWeightRange($carrierObj, 'range_weight');
            case 'range_price':
                return self::getCarrierByPriceRange($carrierObj, 'range_price');
            default:
                return [];
        }
    }

    private function getCarrierByPriceRange(
        Carrier $carrierObj,
        string $rangeTable
    ): array {
        $deliveryPriceByRange = Carrier::getDeliveryPriceByRanges($rangeTable, (int) $carrierObj->id);

        $filteredRanges = [];
        foreach ($deliveryPriceByRange as $range) {
            $filteredRanges[$range['id_range_price']]['id_range_price'] = $range['id_range_price'];
            $filteredRanges[$range['id_range_price']]['id_carrier'] = $range['id_carrier'];
            $filteredRanges[$range['id_range_price']]['zones'][$range['id_zone']]['id_zone'] = $range['id_zone'];
            $filteredRanges[$range['id_range_price']]['zones'][$range['id_zone']]['price'] = $range['price'];
        }

        return $filteredRanges;
    }

    private function getCarrierByWeightRange(
        Carrier $carrierObj,
        string $rangeTable
    ): array {
        $deliveryPriceByRange = Carrier::getDeliveryPriceByRanges($rangeTable, (int) $carrierObj->id);

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
