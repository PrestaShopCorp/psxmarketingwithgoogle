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

use Context;
use Country;
use Db;
use DbQuery;

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

    public function __construct(Db $db, Context $context, Country $country)
    {
        $this->db = $db;
        $this->context = $context;
        $this->country = $country;
    }

    private function getBaseQuery(): DbQuery
    {
        $query = new DbQuery();

        $query->from('country', 'c')
            ->innerJoin('country_shop', 'cs', 'cs.id_country = c.id_country')
            ->innerJoin('country_lang', 'cl', 'cl.id_country = c.id_country')
            ->where('cs.id_shop = ' . (int) $this->context->shop->id)
            ->where('cl.id_lang = ' . (int) $this->context->language->id);

        return $query;
    }

    public function getCountryIsoCodesByZoneId(int $zoneId, bool $active = true): array
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

    public function getActiveCountries(): array
    {
        $query = $this->getBaseQuery();

        $query->select('iso_code');
        $query->where('active = ' . true);

        $isoCodes = [];
        foreach ($this->db->executeS($query) as $country) {
            $isoCodes[] = $country['iso_code'];
        }

        return $isoCodes;
    }

    public function getShopDefaultCountry(): array
    {
        return [
            'name' => $this->country->name[$this->context->language->id],
            'iso_code' => $this->country->iso_code,
        ];
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
