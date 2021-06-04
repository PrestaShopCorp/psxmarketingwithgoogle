<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Adapter;

use Configuration;
use Shop;

class ConfigurationAdapter
{
    /**
     * @var Shop
     */
    private $shopId;

    public function __construct($shopId)
    {
        $this->shopId = $shopId;
    }

    public function get($key, $idLang = null, $idShopGroup = null, $idShop = null, $default = false)
    {
        if ($idShop === null) {
            $idShop = $this->shopId;
        }

        return Configuration::get($key, $idLang, $idShopGroup, $idShop, $default);
    }

    public function updateValue($key, $values, $html = false, $idShopGroup = null, $idShop = null)
    {
        if ($idShop === null) {
            $idShop = $this->shopId;
        }

        return Configuration::updateValue($key, $values, $html, $idShopGroup, $idShop);
    }

    public function deleteByName($key)
    {
        return Configuration::deleteByName($key);
    }
}
