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
use PrestaShop\Module\PrestashopGoogleShopping\Config\Env;
use PrestaShop\Module\PrestashopGoogleShopping\Provider\MultishopDataProvider;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\CountryRepository;
use PrestaShop\Module\Ps_googleshopping\Translations\PsGoogleShoppingTranslations;
use PrestaShop\PsAccountsInstaller\Installer\Facade\PsAccounts;

class AdminPsgoogleshoppingModuleController extends ModuleAdminController
{
    /** @var Ps_googleshopping */
    public $module;

    /**
     * @var Env
     */
    private $env;

    /**
     * @var MultishopDataProvider
     */
    private $multishopDataProvider;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = false;

        $this->multishopDataProvider = $this->module->getService(MultishopDataProvider::class);
        $this->env = $this->module->getService(Env::class);
    }

    public function initContent()
    {
        // from google response
        if (Tools::getValue('message') !== false || Tools::getValue('from') !== false) {
            $this->ajax = true;
            $this->content = $this->context->smarty->fetch('module:ps_googleshopping/views/templates/admin/googlePopin.tpl');

            return;
        }

        $this->context->smarty->assign([
            'pathApp' => $this->module->getPathUri() . 'views/js/app.js',
            'psGoogleShoppingControllerLink' => $this->context->link->getAdminLink('AdminAjaxPsgoogleshopping'),
            'chunkVendor' => $this->module->getPathUri() . 'views/js/chunk-vendors.js',
        ]);

        try {
            $psAccountsService = $this->module->getService(PsAccounts::class)->getPsAccountsService();
            $shopIdPsAccounts = $psAccountsService->getShopUuidV4();
            $tokenPsAccounts = $psAccountsService->getOrRefreshToken();
        } catch (Exception $e) {
            $shopIdPsAccounts = null;
            $tokenPsAccounts = null;
        }

        Media::addJsDef([
            'contextPsAccounts' => (object) $this->module->getService(PsAccounts::class)
            ->getPsAccountsPresenter()
            ->present($this->module->name),
            'psAccountShopInConflict' => $this->multishopDataProvider->isCurrentShopInConflict($this->context->shop),
            'translations' => (new PsGoogleShoppingTranslations($this->module))->getTranslations(),
            'i18nSettings' => [
                'isoCode' => $this->context->language->iso_code,
                'languageLocale' => $this->context->language->language_code,
            ],
            'psGoogleRetrieveFaq' => $this->context->link->getAdminLink(
                'AdminAjaxPsgoogleshopping',
                true,
                [],
                [
                    'action' => 'RetrieveFaq',
                    'ajax' => 1,
                ]
            ),
            'psGoogleCallEventBus' => $this->context->link->getAdminLink(
                'AdminAjaxPsgoogleshopping',
                true,
                [],
                [
                    'ajax' => 1,
                ]
            ),
            'shopIdPsAccounts' => $shopIdPsAccounts,
            'tokenPsAccounts' => $tokenPsAccounts,
            'psGoogleShoppingApiUrl' => $this->env->get('PSX_GOOGLE_SHOPPING_API_URL'),
            'psGoogleShoppingAdminUrl' => $this->context->link->getAdminLink('AdminPsgoogleshoppingModule'),
            'psGoogleShoppingAdminAjaxUrl' => $this->context->link->getAdminLink(
                'AdminAjaxPsgoogleshopping',
                true,
                [],
                ['ajax' => 1],
            ),
            'isCountryMemberOfEuropeanUnion' => $this->module->getService(CountryRepository::class)->isCompatibleForCSS(),
            'psGoogleShoppingShopUrl' => $this->context->link->getBaseLink($this->context->shop->id),
        ]);

        $this->content = $this->context->smarty->fetch($this->module->getLocalPath() . '/views/templates/admin/app.tpl');

        parent::initContent();
    }

    public function postProcess()
    {
    }
}
