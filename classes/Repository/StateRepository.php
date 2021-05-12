<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Repository;

use Context;
use Db;
use DbQuery;

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

    private function getBaseQuery(): DbQuery
    {
        $query = new DbQuery();

        $query->from('state', 's');

        return $query;
    }

    public function getStateIsoCodesByZoneId(int $zoneId, bool $active = true): array
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
