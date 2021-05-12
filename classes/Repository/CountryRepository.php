<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Repository;

use Context;
use Db;
use DbQuery;
use mysqli_result;
use PDOStatement;
use PrestaShopDatabaseException;

class CountryRepository
{
    /**
     * @var Db
     */
    private $db;

    /**
     * @var Context
     */
    private $context;

    private $countryIsoCodeCache = [];

    private $country;

    public function __construct(Db $db, Context $context, \Country $country)
    {
        $this->db = $db;
        $this->context = $context;
        $this->country = $country;
    }

    /**
     * @return DbQuery
     */
    private function getBaseQuery()
    {
        $query = new DbQuery();

        $query->from('country', 'c')
            ->innerJoin('country_shop', 'cs', 'cs.id_country = c.id_country')
            ->innerJoin('country_lang', 'cl', 'cl.id_country = c.id_country')
            ->where('cs.id_shop = ' . (int) $this->context->shop->id)
            ->where('cl.id_lang = ' . (int) $this->context->language->id);

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
    public function getCountyIsoCodesByZoneId($zoneId, $active = true)
    {
        $cacheKey = $zoneId . '-' . (int) $active;

        if (!isset($this->countryIsoCodeCache[$cacheKey])) {
            $query = $this->getBaseQuery();

            $query->select('iso_code');
            $query->where('id_zone = ' . (int) $zoneId);
            $query->where('active = ' . (bool) $active);

            $isoCodes = [];
            foreach ($this->db->executeS($query) as $country) {
                $isoCodes[] = $country['iso_code'];
            }
            $this->countryIsoCodeCache[$cacheKey] = $isoCodes;
        }

        return $this->countryIsoCodeCache[$cacheKey];
    }

    /**
     * isCompatibleForCSS
     *
     * @return bool
     */
    public function isCompatibleForCSS()
    {
        $availableCountries = [
            'BG',
            'BE',
            'CZ',
            'DK',
            'CY',
            'LV',
            'LT',
            'LU',
            'ES',
            'FR',
            'HR',
            'IT',
            'PL',
            'PT',
            'RO',
            'SI',
            'HU',
            'MT',
            'NL',
            'AT',
            'IS',
            'LI',
            'NO',
            'SK',
            'FI',
            'SE',
            'DE',
            'IE',
            'EL',
            'CH',
            'GB',
        ];

        return in_array($this->country->iso_code, $availableCountries);
    }
}
