<?php

use Dotenv\Dotenv;
use PrestaShop\Module\PrestashopGoogleShopping\Config\Config;
use PrestaShop\Module\PrestashopGoogleShopping\Database\Installer;
use PrestaShop\Module\PrestashopGoogleShopping\Database\Uninstaller;
use PrestaShop\Module\PrestashopGoogleShopping\Handler\ErrorHandler\ErrorHandler;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\TabRepository;
use PrestaShop\Module\PrestashopGoogleShopping\Tracker\Segment;
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
        $this->tab = 'advertising_marketing';
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
        $this->ps_versions_compliancy = ['min' => '1.7.7.0', 'max' => _PS_VERSION_];

        if ($this->serviceContainer === null) {
            $this->serviceContainer = new ServiceContainer($this->name, $this->getLocalPath());
        }

        $this->loadEnv();
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

    public function install()
    {
        if (70300 > PHP_VERSION_ID) {
            $this->_errors[] = $this->l('This requires PHP 7.3 to work properly. Please upgrade your server configuration.');

            return false;
        }

        // We can't init the Uninstaller in CLI, as it has been declared in the admin container and PrestaShop
        // does not have the _PS_ADMIN_DIR_ in this environment.
        // prestashop/module-lib-service-container:1.3.1 is known as incompatible
        // $installer = $this->getService(Installer::class);

        if (!(new PrestaShop\PsAccountsInstaller\Installer\Installer('4'))->install()) {
            $this->_errors[] = $this->l('Unable to install ps accounts');

            return false;
        }

        $installer = new Installer(
            $this,
            $this->getService(Segment::class),
            $this->getService(ErrorHandler::class)
        );

        if (!$installer->install()) {
            $this->_errors = $installer->getErrors();

            return false;
        }

        if (!parent::install()) {
            $this->_errors[] = $this->l('Unable to install module');

            return false;
        }

        /* @phpstan-ignore-next-line */
        $this->registerHook(Config::HOOK_LIST);

        return true;
    }

    public function uninstall()
    {
        // We can't init the Uninstaller in CLI, as it has been declared in the admin container and PrestaShop
        // does not have the _PS_ADMIN_DIR_ in this environment.
        // prestashop/module-lib-service-container:1.3.1 is known as incompatible
        // $uninstaller = $this->getService(Uninstaller::class);

        $uninstaller = new Uninstaller(
            $this,
            $this->getService(TabRepository::class),
            $this->getService(Segment::class),
            $this->getService(ErrorHandler::class)
        );

        return $uninstaller->uninstall() &&
            parent::uninstall();
    }

    public function getContent()
    {
        // With the version prestashop/prestashop-accounts-auth:2.1.9, a successful login will redirect
        // to the module configuration page with extra parameters.
        // We filter the default parameters so the extra ones remain present on the controller we redirect to.
        unset($_GET['controller'], $_GET['configure'], $_GET['token'], $_GET['controllerUri']);

        Tools::redirectAdmin($this->context->link->getAdminLink('AdminPsgoogleshoppingModule') . '&' . http_build_query($_GET));
    }

    public function hookDisplayBackOfficeHeader()
    {
        $this->context->controller->addCSS($this->getPathUri() . 'views/css/admin/menu.css');
    }

    public function hookDisplayHeader()
    {
        $this->context->smarty->assign([
            'website_claim' => Configuration::get(Config::WEBSITE_CLAIM),
        ]);

        $this->display(__FILE__, 'header.tpl');
    }
  
    private function loadEnv()
    {
        if (file_exists(__DIR__ . '/.env')) {
            $dotenv = Dotenv::create(__DIR__);
            $dotenv->load();
        }
    }
}
