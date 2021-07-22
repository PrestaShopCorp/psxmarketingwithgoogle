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

use Db;
use DbQuery;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;

class ShopRepository
{
    public function getShopDomainsAndConfiguration()
    {
        $sql = new DbQuery();

        $sql->select('su.`id_shop`, `domain`, `domain_ssl`, c.`value` as acces_token_value');

        $sql->from('shop_url', 'su');
        $sql->leftJoin('configuration', 'c', 'su.id_shop = c.id_shop');

        $sql->where('c.name LIKE "' . Config::PSX_MKTG_WITH_GOOGLE_ACCOUNT_IS_LINKED . '"');

        return Db::getInstance()->executeS($sql);
    }
}
