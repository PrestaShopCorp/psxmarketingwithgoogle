<?php

namespace PrestaShop\AccountsAuth\DependencyInjection;

use Context;
use Module;
use PrestaShop\AccountsAuth\Adapter\Configuration;
use PrestaShop\AccountsAuth\Adapter\LinkAdapter;
use PrestaShop\AccountsAuth\Api\Client\FirebaseClient;
use PrestaShop\AccountsAuth\Context\ShopContext;
use PrestaShop\AccountsAuth\Environment\Env;
use PrestaShop\AccountsAuth\Repository\ConfigurationRepository;

class PsAccountsServiceProvider extends ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->singleton(Env::class, static function () {
            return new Env();
        });

        $this->singleton(FirebaseClient::class, static function () {
            return new FirebaseClient();
        });

        $this->singleton(Module::class, static function () {
            return Module::getInstanceByName('ps_accounts');
        });

        $this->singleton(Context::class, static function () {
            return Context::getContext();
        });

        $this->singleton(ShopContext::class, static function () {
            return new ShopContext();
        });

        $this->singleton(LinkAdapter::class, function () {
            return new LinkAdapter($this->get(Context::class)->link);
        });

        $this->singleton(Configuration::class, function () {
            $configuration = new Configuration();
            $configuration->setIdShop((int) $this->get(Context::class)->shop->id);

            return $configuration;
        });

        $this->singleton(ConfigurationRepository::class, function () {
            return new ConfigurationRepository($this->get(Configuration::class));
        });
    }
}
