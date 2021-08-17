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
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Env;
use PrestaShop\Module\PsxMarketingWithGoogle\Provider\MultishopDataProvider;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CountryRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CurrencyRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Translations\PsxMktgWithGoogleTranslations;
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
     * @var MultishopDataProvider
     */
    private $multishopDataProvider;

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

        $this->multishopDataProvider = $this->module->getService(MultishopDataProvider::class);
        $this->env = $this->module->getService(Env::class);
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
            'pathApp' => $this->module->getPathUri() . 'views/js/app.js',
            'psxMktgWithGoogleControllerLink' => $this->context->link->getAdminLink('AdminAjaxPsxMktgWithGoogle'),
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
            'translations' => (new PsxMktgWithGoogleTranslations($this->module))->getTranslations(),
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
            'psxMktgWithGoogleSegmentId' => $this->env->get('PSX_MKTG_WITH_GOOGLE_SEGMENT_API_KEY'),
            'psxMktgWithGoogleApiUrl' => $this->env->get('PSX_MKTG_WITH_GOOGLE_API_URL'),
            'psxMktgWithGoogleAdminUrl' => $this->context->link->getAdminLink('AdminPsxMktgWithGoogleModule'),
            'psxMktgWithGoogleAdminAjaxUrl' => $this->context->link->getAdminLink(
                'AdminAjaxPsxMktgWithGoogle',
                true,
                [],
                ['ajax' => 1],
            ),
            'psxMktgWithGoogleMaintenanceSettingsUrl' => Tools::getShopDomainSsl(true) . $this->context->link->getAdminLink(
                'AdminMaintenance'
            ),
            'isCountryMemberOfEuropeanUnion' => $this->countryRepository->isCompatibleForCSS(),
            'psxMktgWithGoogleShopUrl' => $this->context->link->getBaseLink($this->context->shop->id),
            'psxMktgWithGoogleActiveCountries' => $this->countryRepository->getActiveCountries(),
            'psxMtgWithGoogleActiveShopCountry' => $this->countryRepository->getShopDefaultCountry()['iso_code'],
            'psxMktgWithGoogleShopCurrency' => $this->currencyRepository->getShopCurrency(),
        ]);

        $this->content = $this->context->smarty->fetch($this->module->getLocalPath() . '/views/templates/admin/app.tpl');

        parent::initContent();
    }

    public function postProcess()
    {
    }
}
