<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Repository;

use Db;
use DbQuery;
use PrestaShop\Module\PrestashopGoogleShopping\Config\Config;

class ShopRepository
{
    public function getShopDomainsAndConfiguration()
    {
        $sql = new DbQuery();

        $sql->select('su.`id_shop`, `domain`, `domain_ssl`, c.`value` as acces_token_value');

        $sql->from('shop_url', 'su');
        $sql->leftJoin('configuration', 'c', 'su.id_shop = c.id_shop');

        $sql->where('c.name LIKE "' . Config::PS_GOOGLE_SHOPPING_GMC_IS_LINKED . '"');

        return Db::getInstance()->executeS($sql);
    }
}
