<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Repository;

use Context;
use Db;
use DbQuery;
use mysqli_result;
use PDOStatement;
use PrestaShopDatabaseException;

class StateRepository
{
    /**
     * @var Db
     */
    private $db;

    /**
     * @var Context
     */
    private $context;

    private $stateIsoCodeCache = [];

    public function __construct(Db $db, Context $context)
    {
        $this->db = $db;
        $this->context = $context;
    }

    /**
     * @return DbQuery
     */
    private function getBaseQuery()
    {
        $query = new DbQuery();

        $query->from('state', 's');

        return $query;
    }

    /**
     * @param int $zoneId
     * @param bool $active
     *
     * @return array|bool|mysqli_result|PDOStatement|resource|null
     *
     * @throws PrestaShopDatabaseException
     */
    public function getStateIsoCodesByZoneId($zoneId, $active = true)
    {
        $cacheKey = $zoneId . '-' . (int) $active;

        if (!isset($this->stateIsoCodeCache[$cacheKey])) {
            $query = $this->getBaseQuery();

            $query->select('s.iso_code');
            $query->innerJoin('country', 'c', 'c.id_country = s.id_country');
            $query->where('s.id_zone = ' . (int) $zoneId);
            $query->where('s.active = ' . (bool) $active);
            $query->where('c.active = ' . (bool) $active);

            $isoCodes = [];
            foreach ($this->db->executeS($query) as $state) {
                $isoCodes[] = $state['iso_code'];
            }
            $this->stateIsoCodeCache[$cacheKey] = $isoCodes;
        }

        return $this->stateIsoCodeCache[$cacheKey];
    }
}
