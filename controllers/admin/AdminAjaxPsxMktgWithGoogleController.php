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
use PrestaShop\Module\PsxMarketingWithGoogle\Conversion\EnhancedConversionToggle;
use PrestaShop\Module\PsxMarketingWithGoogle\Handler\ErrorHandler;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\ProductEnumerator;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Options\OptionsProviderInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Options\Resolver;
use PrestaShop\Module\PsxMarketingWithGoogle\Provider\CarrierDataProvider;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\AttributesRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CountryRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CurrencyRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\ModuleRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\ProductRepository;
use PrestaShop\ModuleLibFaq\Faq;

class AdminAjaxPsxMktgWithGoogleController extends ModuleAdminController
{
    /** @var PsxMarketingWithGoogle */
    public $module;

    /**
     * @var ErrorHandler
     */
    private $errorHandler;
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
     * @var ProductRepository
     */
    protected $productRepository;

    /**
     * @var AttributesRepository
     */
    protected $attributesRepository;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = false;

        $this->errorHandler = $this->module->getService(ErrorHandler::class);
        $this->configurationAdapter = $this->module->getService(ConfigurationAdapter::class);
        $this->countryRepository = $this->module->getService(CountryRepository::class);
        $this->productRepository = $this->module->getService(ProductRepository::class);
        $this->attributesRepository = $this->module->getService(attributesRepository::class);
        $this->currencyRepository = $this->module->getService(CurrencyRepository::class);
        $this->ajax = true;
    }

    public function initContent()
    {
        parent::initContent();
    }

    public function displayAjax()
    {
        $inputs = json_decode(Tools::file_get_contents('php://input'), true);
        $action = isset($inputs['action']) ? $inputs['action'] : null;
        switch ($action) {
            case 'setWebsiteVerificationMeta':
                $this->setWebsiteVerificationMeta($inputs);
                break;
            case 'getCarrierValues':
                $this->getCarrierValues();
                break;
            case 'getProductsReadyToSync':
                $this->getProductsReadyToSync($inputs);
                break;
            case 'getShopConfigurationForGMC':
                $this->getShopConfigurationForGMC();
                break;
            case 'getWebsiteRequirementStatus':
                $this->getWebsiteRequirementStatus();
                break;
            case 'setWebsiteRequirementStatus':
                $this->setWebsiteRequirementStatus($inputs);
                break;
            case 'retrieveFaq':
                $this->retrieveFaq();
                break;
            case 'getShopConfigurationForAds':
                $this->getShopConfigurationForAds();
                break;
            case 'getRemarketingTagsStatus':
                $this->getRemarketingTagsStatus();
                break;
            case 'toggleRemarketingTags':
                $this->toggleRemarketingTags($inputs);
                break;
            case 'setEnhancedConversions':
                $this->setEnhancedConversions($inputs);
                break;
            case 'setConversionActionLabel':
                $this->setConversionActionLabel($inputs);
                break;
            case 'getConversionActionLabels':
                $this->getConversionActionLabels();
                break;
            case 'getDebugData':
                $this->getDebugData();
                break;
            case 'setGMCInformations':
                $this->setGMCInformations($inputs);
                break;
            case 'getShopAttributes':
                $this->getShopAttributes();
                break;
            case 'getModuleStatus':
                $this->getModuleStatus($inputs);
                break;
            case 'registerHook':
                $this->registerHook($inputs);
                break;
            case 'getProductFilterOptions':
                $this->getProductFilterOptions($inputs);
                break;
            case 'countMatchingProductsFromFilters':
                $this->countMatchingProductsFromFilters($inputs);
                break;
            case 'listMatchingProductsFromFilters':
                $this->listMatchingProductsFromFilters($inputs);
                break;
            default:
                http_response_code(400);
                $this->ajaxDie(json_encode(['success' => false, 'message' => $this->l('Action is missing or incorrect.')]));
        }
    }

    private function setWebsiteVerificationMeta(array $inputs)
    {
        if (!isset($inputs['websiteVerificationMeta'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing Meta key',
            ]));
        }
        $websiteVerificationMeta = $inputs['websiteVerificationMeta'];
        $this->configurationAdapter->deleteByName(Config::PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META);

        if ($websiteVerificationMeta === false) {
            $this->ajaxDie(json_encode(['success' => true, 'method' => 'delete']));
        } else {
            // base64 encoded to avoid prestashop sanitization
            $this->configurationAdapter->updateValue(
                Config::PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META,
                base64_encode($websiteVerificationMeta)
            );
            $this->ajaxDie(json_encode(['success' => true, 'method' => 'insert']));
        }
    }

    private function setGMCInformations(array $inputs)
    {
        if (!isset($inputs['gmcInformations'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'missing gmc informations',
            ]));
        }

        $informations = $inputs['gmcInformations'];
        $this->configurationAdapter->updateValue(
            Config::REMARKETING_CONVERSION_MERCHANT_GMC_ID,
            $informations['id']
        );

        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function getProductsReadyToSync(array $inputs)
    {
        $this->ajaxDie(json_encode([
            'total' => $this->productRepository->getProductsTotal(
                $this->context->shop->id,
                ['onlyActive' => true]
            ),
        ]));
    }

    private function getShopConfigurationForGMC()
    {
        $data = [
            'shop' => [
                'name' => $this->configurationAdapter->get('PS_SHOP_NAME'),
                'url' => $this->context->link->getBaseLink($this->context->shop->id),
            ],
            'store' => [
                /*
                 * Based on structure available on Google documentation
                 * @see https://developers.google.com/shopping-content/reference/rest/v2.1/accounts#AccountAddress
                 */
                'streetAddress' => trim($this->configurationAdapter->get('PS_SHOP_ADDR1')
                    . ' '
                    . $this->configurationAdapter->get('PS_SHOP_ADDR2')),
                'locality' => $this->configurationAdapter->get('PS_SHOP_CITY'),
                'postalCode' => $this->configurationAdapter->get('PS_SHOP_CODE'),
                'country' => $this->countryRepository->getShopContactCountry(),
                'phone' => $this->configurationAdapter->get('PS_SHOP_PHONE'),
            ],
        ];

        if ($this->countryRepository->countryNeedState((int) $this->configurationAdapter->get('PS_SHOP_COUNTRY_ID')) === true) {
            $data['store']['region'] = State::getNameById($this->configurationAdapter->get('PS_SHOP_STATE_ID'));
        }

        $this->ajaxDie(json_encode($data));
    }

    private function getCarrierValues()
    {
        /** @var CarrierDataProvider $carrierDataProvider */
        $carrierDataProvider = $this->module->getService(CarrierDataProvider::class);

        $carrierLines = $carrierDataProvider->getFormattedData();

        $this->ajaxDie(json_encode($carrierLines));
    }

    private function getWebsiteRequirementStatus()
    {
        $requirements = json_decode($this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_WEBSITE_REQUIREMENTS_STATUS))
            ?: [];

        $this->ajaxDie(json_encode([
            'requirements' => $requirements,
        ]));
    }

    private function setWebsiteRequirementStatus(array $inputs)
    {
        if (!isset($inputs['requirements']) || !is_array($inputs['requirements'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing requirements key or value must be an array',
            ]));
        }

        $requirements = $inputs['requirements'];

        $allowedKeys = [
            'shoppingAdsPolicies',
            'accurateContactInformation',
            'secureCheckoutProcess',
            'returnPolicy',
            'billingTerms',
            'completeCheckoutProcess',
        ];

        foreach ($requirements as $value) {
            if (!in_array($value, $allowedKeys)) {
                $this->ajaxDie(json_encode([
                    'success' => false,
                    'message' => 'Unknown requirement key ' . $value,
                ]));
            }
        }

        $this->configurationAdapter->updateValue(
            Config::PSX_MKTG_WITH_GOOGLE_WEBSITE_REQUIREMENTS_STATUS,
            json_encode($requirements)
        );

        $this->ajaxDie(json_encode(['success' => true]));
    }

    public function getShopConfigurationForAds()
    {
        $defaultTimeZone = date_default_timezone_get();
        $timeZone = new DateTime('now', new DateTimeZone($defaultTimeZone));

        $this->ajaxDie(json_encode([
            'timezone' => [
                'offset' => $timeZone->format('P'),
                'text' => $defaultTimeZone,
            ],
            'currency' => $this->currencyRepository->getShopCurrency()['isoCode'],
        ]));
    }

    private function getRemarketingTagsStatus()
    {
        $enhancedConversionStatus = $this->configurationAdapter->get(
            Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_ENHANCED_STATUS,
            null,
            null,
            null,
            null // Default value
        );

        $this->ajaxDie(json_encode([
            'remarketingTagsStatus' => (bool) $this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS),
            'enhancedConversionStatus' => $enhancedConversionStatus !== null ? (bool) $enhancedConversionStatus : null,
        ]));
    }

    private function toggleRemarketingTags(array $inputs)
    {
        if (!isset($inputs['isRemarketingEnabled']) || !isset($inputs['tagSnippet'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing isRemarketingEnabled or tagSnippet key',
            ]));
        }

        if ((bool) $inputs['isRemarketingEnabled']) {
            $this->configurationAdapter->updateValue(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS, true);
            $this->configurationAdapter->updateValue(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_TAG, base64_encode($inputs['tagSnippet']));

            if ($this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_ENHANCED_STATUS)) {
                /** @var EnhancedConversionToggle $enhancedConversionToggle */
                $enhancedConversionToggle = $this->module->getService(EnhancedConversionToggle::class);
                $enhancedConversionToggle->enable();
            }
        } else {
            $this->configurationAdapter->deleteByName(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS);
            $this->configurationAdapter->deleteByName(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_TAG);
        }
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function setEnhancedConversions(array $inputs)
    {
        if (!isset($inputs['enable'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing enable key',
            ]));
        }
        /** @var EnhancedConversionToggle $enhancedConversionToggle */
        $enhancedConversionToggle = $this->module->getService(EnhancedConversionToggle::class);

        if ($inputs['enable']) {
            $success = $enhancedConversionToggle->enable();
        } else {
            $success = $enhancedConversionToggle->disable();
        }

        $this->ajaxDie(json_encode([
            'success' => $success,
        ]));
    }

    private function setConversionActionLabel(array $inputs)
    {
        if (!isset($inputs['conversionActions'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing conversionActions key',
            ]));
        }

        $newTags = [];

        foreach ($inputs['conversionActions'] as $index => $conversionAction) {
            if (!isset($conversionAction['category']) || !isset($conversionAction['tag'])) {
                http_response_code(400);
                $this->ajaxDie(json_encode([
                    'success' => false,
                    'message' => 'Missing category or tag key at index ' . $index,
                ]));
            }

            if (!in_array($conversionAction['category'], Config::REMARKETING_CONVERSION_LABELS)) {
                http_response_code(400);
                $this->ajaxDie(json_encode([
                    'success' => false,
                    'message' => 'Unhandled conversion category at index ' . $index,
                ]));
            }
            $newTags[$conversionAction['category']] = $conversionAction['tag'];
        }

        $this->configurationAdapter->updateValue(
            Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_CONVERSION_LABELS,
            json_encode(
                array_merge(
                    json_decode($this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_CONVERSION_LABELS), true) ?: [],
                    $newTags
                )
            )
        );
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function getConversionActionLabels()
    {
        $labels = [];
        $labelsFromConfig = json_decode($this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_CONVERSION_LABELS), true) ?: [];
        foreach ($labelsFromConfig as $conversionCategory => $tag) {
            $labels[] = [
                'category' => $conversionCategory,
                'tag' => $tag,
            ];
        }
        $this->ajaxDie(json_encode([
            'conversionActionLabels' => $labels,
        ]));
    }

    private function getDebugData()
    {
        $typesOfSync = [];
        try {
            $sql = new DbQuery();
            $sql->select('ets.type, ets.lang_iso, ets.full_sync_finished, ets.last_sync_date');
            $sql->from('eventbus_type_sync', 'ets');
            $sql->where('ets.id_shop = ' . (int) $this->context->shop->id);
            $sql->orderBy('ets.last_sync_date DESC');
            $typesOfSync = \Db::getInstance()->executeS($sql);
        } catch (Exception $e) {
            $this->errorHandler->handle(
                $e,
                $e->getCode(),
                false
            );
        }

        $this->ajaxDie(json_encode([
            'urlEventBusHealthCheck' => $this->context->link->getModuleLink(
                'ps_eventbus',
                'apiHealthCheck'
            ),
            'typesOfSync' => $typesOfSync,
        ]));
    }

    public function getShopAttributes()
    {
        $this->ajaxDie(
            json_encode(
                $this->attributesRepository->getAllAttributes()
            )
        );
    }

    /*******************
     * Product filters *
     *******************/

    public function getProductFilterOptions(array $inputs)
    {
        if (!isset($inputs['kind'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing kind key',
            ]));
        }

        $attributeKind = $inputs['kind'];

        try {
            /** @var Resolver $providerResolver */
            $providerResolver = $this->module->getService(Resolver::class);
            $providerName = $providerResolver->getProvider($attributeKind);

            /** @var OptionsProviderInterface $optionsProvider */
            $optionsProvider = $this->module->getService($providerName);

            $this->ajaxDie(
                json_encode(
                    $optionsProvider->getOptions()
                )
            );
        } catch (InvalidArgumentException $e) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]));
        }
    }

    public function countMatchingProductsFromFilters(array $inputs)
    {
        if (!isset($inputs['filters'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing filters key',
            ]));
        }

        $filters = $inputs['filters'];

        /** @var ProductEnumerator $productEnumerator */
        $productEnumerator = $this->module->getService(ProductEnumerator::class);

        $this->ajaxDie(
            json_encode([
                'numberOfProducts' => $productEnumerator->countProductsMatchingFilters($filters),
            ])
        );
    }

    public function listMatchingProductsFromFilters(array $inputs)
    {
        if (!isset($inputs['filters'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing filters key',
            ]));
        }

        $filters = $inputs['filters'];

        /** @var ProductEnumerator $productEnumerator */
        $productEnumerator = $this->module->getService(ProductEnumerator::class);

        $this->ajaxDie(
            json_encode($productEnumerator->listProductsMatchingFilters($filters, []))
        );
    }

    private function getModuleStatus(array $inputs)
    {
        if (!isset($inputs['moduleName'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing moduleName key',
            ]));
        }

        $this->ajaxDie(
            json_encode(
                (new ModuleRepository($inputs['moduleName']))->getInformationsAboutModule()
            )
        );
    }

    /**
     * {@inheritdoc}
     */
    protected function ajaxDie($value = null, $controller = null, $method = null)
    {
        header('Content-Type: application/json');
        parent::ajaxDie($value, $controller, $method);
    }

    /**
     * Retrieve the faq
     */
    public function retrieveFaq()
    {
        $faq = new Faq($this->module->module_key, _PS_VERSION_, $this->context->language->iso_code);

        $this->ajaxDie(
            json_encode(
                [
                    'faq' => $faq->getFaq(),
                    'doc' => $this->getUserDocumentation(),
                    'contactUs' => 'support-google@prestashop.com',
                ]
            )
        );
    }

    /**
     * Get the documentation url depending on the current language
     *
     * @return string
     */
    private function getUserDocumentation()
    {
        $isoCode = $this->context->language->iso_code;
        $baseUrl = 'https://storage.googleapis.com/psessentials-documentation/' . $this->module->name;

        if (!$this->checkFileExist($baseUrl . '/user_guide_' . $isoCode . '.pdf')) {
            $isoCode = 'en';
        }

        return $baseUrl . '/user_guide_' . $isoCode . '.pdf';
    }

    private function registerHook(array $inputs)
    {
        if (!isset($inputs['hookName'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing hookName key',
            ]));
        }

        $this->ajaxDie(
            json_encode([
                'success' => $this->module->registerHook($inputs['hookName']),
            ])
        );
    }

    /**
     * Use cUrl to get HTTP headers and detect any HTTP 404
     *
     * @param string $docUrl
     *
     * @return bool
     */
    private function checkFileExist($docUrl)
    {
        $ch = curl_init($docUrl);

        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_exec($ch);
        $retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $retcode < 400;
    }
}
