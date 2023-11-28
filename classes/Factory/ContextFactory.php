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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Factory;

use Configuration;
use Context;
use Currency;

class ContextFactory
{
    public static function getContext()
    {
        return Context::getContext();
    }

    public static function getLanguage()
    {
        return Context::getContext()->language;
    }

    public static function getCart()
    {
        return Context::getContext()->cart;
    }

    /**
     * Return the currency present in the context, or the default one
     * when the context doesn't have a currency yet (i.e when user session is empty).
     *
     * @return Currency
     */
    public static function getCurrency()
    {
        if (Context::getContext()->currency !== null) {
            return Context::getContext()->currency;
        }

        return new Currency((int) Configuration::get('PS_CURRENCY_DEFAULT'));
    }

    public static function getCustomer()
    {
        return Context::getContext()->customer;
    }

    public static function getSmarty()
    {
        return Context::getContext()->smarty;
    }

    public static function getShop()
    {
        return Context::getContext()->shop;
    }

    public static function getController()
    {
        return Context::getContext()->controller;
    }

    public static function getCookie()
    {
        return Context::getContext()->cookie;
    }

    public static function getLink()
    {
        return Context::getContext()->link;
    }

    public static function getCountry()
    {
        return Context::getContext()->country;
    }
}
