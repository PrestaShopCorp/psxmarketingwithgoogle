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

use Dotenv\Dotenv;
use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\Database\Installer;
use PrestaShop\Module\PsxMarketingWithGoogle\Database\Uninstaller;
use PrestaShop\Module\PsxMarketingWithGoogle\Handler\ErrorHandler;
use PrestaShop\Module\PsxMarketingWithGoogle\Handler\RemarketingHookHandler;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\TabRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Tracker\Segment;
use PrestaShop\ModuleLibServiceContainer\DependencyInjection\ServiceContainer;

if (!defined('_PS_VERSION_')) {
    exit;
}

class PsxMarketingWithGoogle extends Module
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
        $this->name = 'psxmarketingwithgoogle';
        $this->tab = 'advertising_marketing';
        $this->version = '1.29.0';
        $this->author = 'PrestaShop';
        $this->need_instance = 0;
        $this->module_key = '16b273e77e02c0cc36cd006463951593';
        $this->controllerAdmin = 'AdminAjaxPsxMktgWithGoogle';
        $this->bootstrap = false;

        parent::__construct();

        $this->displayName = $this->l('Marketing with Google');
        $this->description = $this->l('PrestaShop Marketing makes it easy to connect your store with Google and promote your products to millions of shoppers across multiple Google channels. Create Performance Max campaigns without leaving your PrestaShop dashboard and drive more traffic.');
        $this->psVersionIs17 = (bool) version_compare(_PS_VERSION_, '1.7', '>=');
        $this->css_path = $this->_path . 'views/css/';
        $this->js_path = $this->_path . 'views/js/';
        $this->docs_path = $this->_path . 'docs/';
        $this->confirmUninstall = $this->l('Are you sure you want to uninstall this module?');
        $this->ps_versions_compliancy = ['min' => '1.7.5.0', 'max' => _PS_VERSION_];

        // If PHP is not compliant, we will not load composer and the autoloader
        if (!$this->isPhpVersionCompliant()) {
            return;
        }

        require_once __DIR__ . '/vendor/autoload.php';

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
        if (!$this->isPhpVersionCompliant()) {
            $this->_errors[] = $this->l('This requires PHP 7.2 to work properly. Please upgrade your server configuration.');

            // We return true during the installation of PrestaShop to not stop the whole process,
            // Otherwise we warn properly the installation failed.
            return defined('PS_INSTALLATION_IN_PROGRESS');
        }

        // We can't init the Uninstaller in CLI, as it has been declared in the admin container and PrestaShop
        // does not have the _PS_ADMIN_DIR_ in this environment.
        // prestashop/module-lib-service-container:1.3.1 is known as incompatible
        // $installer = $this->getService(Installer::class);
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
        // If PHP is not compliant, we try our best to uninstall the module
        if (!$this->isPhpVersionCompliant()) {
            return parent::uninstall();
        }

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

        return $uninstaller->uninstall()
            && parent::uninstall();
    }

    public function getContent()
    {
        // With the version prestashop/prestashop-accounts-auth:2.1.9, a successful login will redirect
        // to the module configuration page with extra parameters.
        // We filter the default parameters so the extra ones remain present on the controller we redirect to.
        unset($_GET['controller'], $_GET['configure'], $_GET['token'], $_GET['controllerUri']);

        Tools::redirectAdmin($this->context->link->getAdminLink('AdminPsxMktgWithGoogleModule') . '&' . http_build_query($_GET));
    }

    public function hookDisplayBackOfficeHeader()
    {
        $getConfValue = Tools::getValue('conf');
        if (!empty($getConfValue) && $getConfValue === '4' && $this->context->controller->controller_name === 'AdminCarriers') {
            Media::addJsDef([
                'transitWarningMsg' => $this->l('You have updated one or many of your carriers, do not forget to update your shipping settings on your Google Module.'),
                'redirectMsg' => $this->l('Take me there.'),
                'moduleLink' => $this->context->link->getAdminLink('AdminPsxMktgWithGoogleModule'),
            ]);
            $this->context->controller->addJs($this->getPathUri() . 'views/js/hook/shippingWarning.js');
        }

        $this->context->controller->addCSS($this->getPathUri() . 'views/css/admin/menu.css');
    }

    public function hookDisplayHeader()
    {
        $configuration = $this->getService(ConfigurationAdapter::class);

        return base64_decode($configuration->get(Config::PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META))
            . $this->getService(RemarketingHookHandler::class)->handleHook(__FUNCTION__);
    }

    public function hookDisplayTop()
    {
        return $this->getService(RemarketingHookHandler::class)->handleHook(__FUNCTION__);
    }

    public function hookDisplayOrderConfirmation($params)
    {
        return $this->getService(RemarketingHookHandler::class)->handleHook(__FUNCTION__, $params);
    }

    public function hookActionCartUpdateQuantityBefore($params)
    {
        return $this->getService(RemarketingHookHandler::class)->handleHook(__FUNCTION__, $params);
    }

    /**
     * return __FILE__
     *
     * @return string
     */
    public function getFilePath()
    {
        return __FILE__;
    }

    private function loadEnv()
    {
        if (file_exists(__DIR__ . '/.env')) {
            $dotenv = Dotenv::create(__DIR__);
            $dotenv->load();
        }
    }

    private function isPhpVersionCompliant()
    {
        return 70200 <= PHP_VERSION_ID;
    }
}
