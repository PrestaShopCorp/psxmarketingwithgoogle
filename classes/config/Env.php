<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Config;

/**
 * This class allows to retrieve config data that can be overwritten by a .env file.
 * Otherwise it returns by default from the Config class.
 */
class Env
{
    /**
     * @param string $key
     *
     * @return string
     */
    public function get($key)
    {
        if (!empty($_ENV[$key])) {
            return $_ENV[$key];
        }

        return constant(Config::class . '::' . $key);
    }
}
