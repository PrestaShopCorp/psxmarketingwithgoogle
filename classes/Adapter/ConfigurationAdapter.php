<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Adapter;

use Configuration;

class ConfigurationAdapter
{
    /**
     * We wrap Configuration::get function in here to be able to mock static functions
     *
     * @param string $key
     *
     * @return bool|string
     */
    public function get($key)
    {
        return Configuration::get($key);
    }
}
