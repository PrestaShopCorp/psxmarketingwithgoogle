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

use PrestaShop\Module\PsxMarketingWithGoogle\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Env;
use PrestaShop\Module\PsxMarketingWithGoogle\Handler\ErrorHandler;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CountryRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CurrencyRepository;
use PrestaShop\PsAccountsInstaller\Installer\Facade\PsAccounts;

class AdminPsxMktgWithGoogleModuleController extends ModuleAdminController
{
    /** @var PsxMarketingWithGoogle */
    public $module;

    /**
     * @var Env
     */
    private $env;

    /**
    /**
     * @var ConfigurationAdapter
     */
    private $configurationAdapter;

    /**
     * @var CountryRepository
     */
    private $countryRepository;

    /**
     * @var CurrencyRepository
     */
    private $currencyRepository;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = false;

        $this->module->getService(ErrorHandler::class);
        $this->env = $this->module->getService(Env::class);
        $this->configurationAdapter = $this->module->getService(ConfigurationAdapter::class);
        $this->countryRepository = $this->module->getService(CountryRepository::class);
        $this->currencyRepository = $this->module->getService(CurrencyRepository::class);
    }

    public function initContent()
    {
        // from google response
        if (Tools::getValue('message') !== false || Tools::getValue('from') !== false) {
            $this->ajax = true;
            $this->content = $this->context->smarty->fetch('module:psxmarketingwithgoogle/views/templates/admin/googlePopin.tpl');

            return;
        }

        $this->context->smarty->assign([
            'pathApp' => (bool) $this->env->get('USE_LOCAL_VUE_APP') ? $this->module->getPathUri() . 'views/js/app.js' : Config::PSX_MKTG_WITH_GOOGLE_CDN_URL . 'app.js',
            'chunkVendor' => (bool) $this->env->get('USE_LOCAL_VUE_APP') ? $this->module->getPathUri() . 'views/js/chunk-vendors.js' : Config::PSX_MKTG_WITH_GOOGLE_CDN_URL . 'chunk-vendors.js',
            'psxMktgWithGoogleControllerLink' => $this->context->link->getAdminLink('AdminAjaxPsxMktgWithGoogle'),
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
            'i18nSettings' => [
                'isoCode' => $this->context->language->iso_code,
                'languageLocale' => $this->context->language->language_code,
            ],
            'psGoogleRetrieveFaq' => $this->context->link->getAdminLink(
                'AdminAjaxPsxMktgWithGoogle',
                true,
                [],
                [
                    'action' => 'RetrieveFaq',
                    'ajax' => 1,
                ]
            ),
            'psGoogleCallEventBus' => $this->context->link->getAdminLink(
                'AdminAjaxPsxMktgWithGoogle',
                true,
                [],
                [
                    'ajax' => 1,
                ]
            ),
            'shopIdPsAccounts' => $shopIdPsAccounts,
            'tokenPsAccounts' => $tokenPsAccounts,
            'psVersion' => _PS_VERSION_,
            'psxMktgWithGoogleModuleVersion' => $this->module->version,
            'psxMktgWithGoogleOnProductionEnvironment' => $this->env->get('PSX_MKTG_WITH_GOOGLE_API_URL') === Config::PSX_MKTG_WITH_GOOGLE_API_URL,
            'psxMktgWithGoogleSegmentId' => $this->env->get('PSX_MKTG_WITH_GOOGLE_SEGMENT_API_KEY'),
            'psxMktgWithGoogleDsnSentry' => $this->env->get('PSX_MKTG_WITH_GOOGLE_SENTRY_CREDENTIALS_VUE'),
            'psxMktgWithGoogleApiUrl' => $this->env->get('PSX_MKTG_WITH_GOOGLE_API_URL'),
            'psxMktgWithGoogleAdminUrl' => $this->context->link->getAdminLink('AdminPsxMktgWithGoogleModule'),
            'psxMktgWithGoogleAdminAjaxUrl' => $this->context->link->getAdminLink(
                'AdminAjaxPsxMktgWithGoogle',
                true,
                [],
                [
                    'ajax' => 1,
                ]
            ),
            'psxMktgWithGoogleMaintenanceSettingsUrl' => Tools::getShopDomainSsl(true) . $this->context->link->getAdminLink(
                'AdminMaintenance'
            ),
            'psxMktgWithGoogleStoreSettingsUrl' => $this->context->link->getAdminLink('AdminStores'),
            'psxMktgWithGoogleProductDetailUrl' => $this->context->link->getAdminLink(
                'AdminProducts',
                true,
                ['id_product' => 1, 'updateproduct' => '1']
            ),
            'isCountryMemberOfEuropeanUnion' => $this->countryRepository->isCompatibleForCSS(),
            'psxMktgWithGoogleShopUrl' => $this->context->link->getBaseLink($this->context->shop->id),
            'psxMktgWithGoogleActiveCountries' => $this->countryRepository->getActiveCountries(),
            'psxMtgWithGoogleDefaultShopCountry' => $this->countryRepository->getShopDefaultCountry()['iso_code'],
            'psxMktgWithGoogleShopCurrency' => $this->currencyRepository->getShopCurrency(),
            'psxMktgWithGoogleRemarketingTagsStatus' => (bool) $this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS),
        ]);

        $this->content = $this->context->smarty->fetch($this->module->getLocalPath() . '/views/templates/admin/app.tpl');

        parent::initContent();
    }

    public function postProcess()
    {
    }
}
