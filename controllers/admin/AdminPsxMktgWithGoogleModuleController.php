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
use PrestaShop\Module\PsxMarketingWithGoogle\Api\LocalGoogleApi;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CountryRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CurrencyRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\LanguageRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\ModuleRepository;

class AdminPsxMktgWithGoogleModuleController extends ModuleAdminController
{
    /** @var PsxMarketingWithGoogle */
    public $module;

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

    /**
     * @var LanguageRepository
     */
    private $languageRepository;

    /**
     * @var ModuleRepository
     */
    private $moduleRepository;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = false;

        $this->configurationAdapter = $this->module->getService(
            ConfigurationAdapter::class
        );
        $this->countryRepository = $this->module->getService(
            CountryRepository::class
        );
        $this->currencyRepository = $this->module->getService(
            CurrencyRepository::class
        );
        $this->languageRepository = $this->module->getService(
            LanguageRepository::class
        );
        $this->moduleRepository = new ModuleRepository($this->module->name);
    }

    public function initContent()
    {
        // from google response
        if (
            Tools::getValue('message') !== false ||
            Tools::getValue('from') !== false
        ) {
            $this->ajax = true;
            if (version_compare(_PS_VERSION_, '9.0.0', '>=')) {
                $this->content = $this->context->smarty->display(
                    $this->module->getLocalPath() .
                        '/views/templates/admin/googlePopin.tpl'
                );
            } else {
                $this->content = $this->context->smarty->fetch(
                    'module:psxmarketingwithgoogle/views/templates/admin/googlePopin.tpl'
                );
            }

            return;
        }

        $this->context->smarty->assign([
            'pathApp' => $this->module->getPathUri() . 'views/js/psxmarketingwithgoogle-ui.js',
        ]);

        $localApiUrl = $this->context->link->getAdminLink(
            'AdminTinyLuxGoogleApi',
            true,
            [],
            ['ajax' => 1]
        );
        $googleConnection = [
            'configured' => false,
            'clientIdSuffix' => '',
            'redirectUri' => '',
            'connected' => false,
            'googleEmail' => null,
            'merchantAccount' => null,
            'dataSource' => null,
        ];
        try {
            /** @var LocalGoogleApi $localApi */
            $localApi = $this->module->getService(LocalGoogleApi::class);
            $settings = json_decode($localApi->dispatch('GET', 'settings/status')->getBody(), true);
            $connection = json_decode($localApi->dispatch('GET', 'oauth')->getBody(), true);
            if (is_array($settings)) {
                $googleConnection = array_merge($googleConnection, $settings);
            }
            if (is_array($connection)) {
                $googleConnection = array_merge($googleConnection, $connection);
            }
        } catch (Throwable $exception) {
            unset($exception);
        }

        /************************************
         * PrestaShop Marketing with Google *
         ************************************/

        Media::addJsDef([
            'contextPsAccounts' => (object) [],
            'contextPsEventbus' => (object) [],
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
            'shopIdPsAccounts' => '',
            'tokenPsAccounts' => '',
            'psVersion' => _PS_VERSION_,
            'phpVersion' => phpversion(),
            'psxMktgWithGoogleModuleVersion' => $this->module->version,
            'psxMktgWithGoogleOnProductionEnvironment' => false,
            'psxMktgWithGoogleApiUrl' => $localApiUrl,
            'tinyLuxGoogleApiUrl' => $localApiUrl,
            'tinyLuxGoogleOAuthRedirectUri' => $googleConnection['redirectUri'],
            'tinyLuxGoogleConnection' => (object) $googleConnection,
            'psxMktgWithGoogleAdminUrl' => $this->context->link->getAdminLink(
                'AdminPsxMktgWithGoogleModule'
            ),
            'psxMktgWithGoogleAdminAjaxUrl' => $this->context->link->getAdminLink(
                'AdminAjaxPsxMktgWithGoogle',
                true,
                [],
                [
                    'ajax' => 1,
                ]
            ),
            'psxMktgWithGoogleMaintenanceSettingsUrl' => Tools::getShopDomainSsl(true) .
                $this->context->link->getAdminLink('AdminMaintenance'),
            'psxMktgWithGoogleCarriersUrl' => $this->context->link->getAdminLink(
                'AdminCarriers'
            ),
            'psxMktgWithGoogleAttributesUrl' => $this->context->link->getAdminLink(
                'AdminAttributesGroups'
            ),
            'psxMktgWithGoogleStoreSettingsUrl' => $this->context->link->getAdminLink(
                'AdminStores'
            ),
            'psxMktgWithGoogleProductsUrl' => $this->context->link->getAdminLink(
                'AdminProducts'
            ),
            'psxMktgWithGoogleCurrenciesUrl' => $this->context->link->getAdminLink(
                'AdminCurrencies'
            ),
            'psxMktgWithGoogleLanguagesUrl' => $this->context->link->getAdminLink(
                'AdminLanguages'
            ),
            'psxMktgWithGoogleProductDetailUrl' => $this->context->link->getAdminLink(
                'AdminProducts',
                true,
                ['id_product' => 1, 'updateproduct' => '1']
            ),
            'psxMktgWithGoogleEnableLink' => $this->moduleRepository->getEnableLink(),
            'psxMktgWithGoogleModuleIsEnabled' => $this->moduleRepository->moduleIsEnabled(),
            'isCountryMemberOfEuropeanUnion' => $this->countryRepository->isCompatibleForCSS(),
            'psxMktgWithGoogleShopUrl' => $this->context->link->getBaseLink(
                $this->context->shop->id
            ),
            'psxMktgWithGoogleActiveCountries' => $this->countryRepository->getActiveCountries(),
            'psxMktgWithGoogleActiveCurrencies' => $this->currencyRepository->getActiveCurrencies(),
            'psxMktgWithGoogleLanguages' => $this->languageRepository->getLanguages(),
            'psxMtgWithGoogleDefaultShopCountry' => $this->countryRepository->getShopDefaultCountry()[
                'iso_code'
            ],
            'psxMktgWithGoogleShopCurrency' => $this->currencyRepository->getShopCurrency(),
            'psxMktgWithGoogleRemarketingTagsStatus' => (bool) $this->configurationAdapter->get(
                Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS
            ),
        ]);

        $this->content = $this->context->smarty->fetch(
            $this->module->getLocalPath() . '/views/templates/admin/app.tpl'
        );

        parent::initContent();
    }

    public function postProcess()
    {
        return false;
    }
}
