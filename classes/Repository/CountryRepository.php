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

namespace PrestaShop\Module\PrestashopGoogleShopping\Repository;

class CountryRepository
{
    private $country;

    public function __construct(\Country $country)
    {
        $this->country = $country;
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
