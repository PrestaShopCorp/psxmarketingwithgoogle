<?php

use Dotenv\Dotenv;
use PrestaShop\ModuleLibServiceContainer\DependencyInjection\ServiceContainer;

if (!defined('_PS_VERSION_')) {
    exit;
}

require_once __DIR__ . '/vendor/autoload.php';

class Ps_googleshopping extends Module
{
    /**
     * @var ServiceContainer
     */
    private $serviceContainer;

    /**
     * @var string
     */
    public $controllerAdmin;

    /**
     * @var bool
     */
    public $psVersionIs17;

    /**
     * @var string
     */
    public $css_path;

    /**
     * @var string
     */
    public $docs_path;

    /**
     * @var string
     */
    public $js_path;

    public $front_controller = null;

    public function __construct()
    {
        $this->name = 'ps_googleshopping';
        $this->tab = 'social_networks';
        $this->version = '1.0.0';
        $this->author = 'PrestaShop';
        $this->need_instance = 0;
        $this->module_key = '';
        $this->controllerAdmin = 'AdminAjaxPsgoogleshopping';
        $this->bootstrap = false;

        parent::__construct();

        $this->displayName = $this->l('PS Google shopping');
        $this->description = $this->l('');
        $this->psVersionIs17 = (bool) version_compare(_PS_VERSION_, '1.7', '>=');
        $this->css_path = $this->_path . 'views/css/';
        $this->js_path = $this->_path . 'views/js/';
        $this->docs_path = $this->_path . 'docs/';
        $this->confirmUninstall = $this->l('Are you sure you want to uninstall this module?');
        $this->ps_versions_compliancy = ['min' => '1.7.0.0', 'max' => _PS_VERSION_];
        $this->front_controller = $this->context->link->getModuleLink(
            $this->name,
            'FrontAjaxPixel',
            [],
            true
        );

        if ($this->serviceContainer === null) {
            $this->serviceContainer = new ServiceContainer($this->name, $this->getLocalPath());
        }

        $this->loadEnv();
    }

    private function loadEnv()
    {
        if (file_exists(_PS_MODULE_DIR_ . 'ps_googleshopping/.env')) {
            $dotenv = Dotenv::create(_PS_MODULE_DIR_ . 'ps_googleshopping/');
            $dotenv->load();
        }
    }

    /**
     * @param string $serviceName
     *
     * @return mixed
     */
    public function getService($serviceName)
    {
        return $this->serviceContainer->getService($serviceName);
    }

    public function getContent()
    {
        // With the version prestashop/prestashop-accounts-auth:2.1.9, a successful login will redirect
        // to the module configuration page with extra parameters.
        // We filter the default parameters so the extra ones remain present on the controller we redirect to.
        unset($_GET['controller'], $_GET['configure'], $_GET['token'], $_GET['controllerUri']);

        Tools::redirectAdmin($this->context->link->getAdminLink('AdminPsgoogleshoppingModule') . '&' . http_build_query($_GET));
    }
}
