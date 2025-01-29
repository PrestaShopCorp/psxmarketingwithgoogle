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
use PrestaShop\Module\PsxMarketingWithGoogle\Http\HttpClient;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\FilterApplication\ProductEnumerator;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Options\OptionsProviderInterface;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Options\Resolver;
use PrestaShop\Module\PsxMarketingWithGoogle\Provider\CarrierDataProvider;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\AttributesRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CountryRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CurrencyRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\ModuleRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\ProductRepository;

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
                $this->render(json_encode(['success' => false, 'message' => $this->module->l('Action is missing or incorrect.')]), 400);
        }
    }

    private function setWebsiteVerificationMeta(array $inputs)
    {
        if (!isset($inputs['websiteVerificationMeta'])) {
            $this->render(json_encode([
                'success' => false,
                'message' => 'Missing Meta key',
            ]), 400);
        }
        $websiteVerificationMeta = $inputs['websiteVerificationMeta'];
        $this->configurationAdapter->deleteByName(Config::PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META);

        if ($websiteVerificationMeta === false) {
            $this->render(json_encode(['success' => true, 'method' => 'delete']), 200);
        } else {
            // base64 encoded to avoid prestashop sanitization
            $this->configurationAdapter->updateValue(
                Config::PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META,
                base64_encode($websiteVerificationMeta)
            );
            $this->render(json_encode(['success' => true, 'method' => 'insert']), 200);
        }
    }

    private function setGMCInformations(array $inputs)
    {
        if (!isset($inputs['gmcInformations'])) {
            $this->render(json_encode([
                'success' => false,
                'message' => 'missing gmc informations',
            ]), 400);
        }

        $informations = $inputs['gmcInformations'];
        $this->configurationAdapter->updateValue(
            Config::REMARKETING_CONVERSION_MERCHANT_GMC_ID,
            $informations['id']
        );

        $this->render(json_encode(['success' => true]), 200);
    }

    private function getProductsReadyToSync(array $inputs)
    {
        $this->render(json_encode([
            'total' => $this->productRepository->getProductsTotal(
                $this->context->shop->id,
                ['onlyActive' => true]
            ),
        ]), 200);
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

        $this->render(json_encode($data), 200);
    }

    private function getCarrierValues()
    {
        /** @var CarrierDataProvider $carrierDataProvider */
        $carrierDataProvider = $this->module->getService(CarrierDataProvider::class);

        $carrierLines = $carrierDataProvider->getFormattedData();

        $this->render(json_encode($carrierLines), 200);
    }

    private function getWebsiteRequirementStatus()
    {
        $requirements = json_decode($this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_WEBSITE_REQUIREMENTS_STATUS))
            ?: [];

        $this->render(json_encode([
            'requirements' => $requirements,
        ]), 200);
    }

    private function setWebsiteRequirementStatus(array $inputs)
    {
        if (!isset($inputs['requirements']) || !is_array($inputs['requirements'])) {
            $this->render(json_encode([
                'success' => false,
                'message' => 'Missing requirements key or value must be an array',
            ]), 400);
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
                $this->render(json_encode([
                    'success' => false,
                    'message' => 'Unknown requirement key ' . $value,
                ]), 400);
            }
        }

        $this->configurationAdapter->updateValue(
            Config::PSX_MKTG_WITH_GOOGLE_WEBSITE_REQUIREMENTS_STATUS,
            json_encode($requirements)
        );

        $this->render(json_encode(['success' => true]), 200);
    }

    public function getShopConfigurationForAds()
    {
        $defaultTimeZone = date_default_timezone_get();
        $timeZone = new DateTime('now', new DateTimeZone($defaultTimeZone));

        $this->render(json_encode([
            'timezone' => [
                'offset' => $timeZone->format('P'),
                'text' => $defaultTimeZone,
            ],
            'currency' => $this->currencyRepository->getShopCurrency()['isoCode'],
        ]), 200);
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

        $this->render(json_encode([
            'remarketingTagsStatus' => (bool) $this->configurationAdapter->get(Config::PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS),
            'enhancedConversionStatus' => $enhancedConversionStatus !== null ? (bool) $enhancedConversionStatus : null,
        ]), 200);
    }

    private function toggleRemarketingTags(array $inputs)
    {
        if (!isset($inputs['isRemarketingEnabled']) || !isset($inputs['tagSnippet'])) {
            $this->render(json_encode([
                'success' => false,
                'message' => 'Missing isRemarketingEnabled or tagSnippet key',
            ]), 400);
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
        $this->render(json_encode(['success' => true]), 200);
    }

    private function setEnhancedConversions(array $inputs)
    {
        if (!isset($inputs['enable'])) {
            $this->render(json_encode([
                'success' => false,
                'message' => 'Missing enable key',
            ]), 400);
        }
        /** @var EnhancedConversionToggle $enhancedConversionToggle */
        $enhancedConversionToggle = $this->module->getService(EnhancedConversionToggle::class);

        if ($inputs['enable']) {
            $success = $enhancedConversionToggle->enable();
        } else {
            $success = $enhancedConversionToggle->disable();
        }

        $this->render(json_encode([
            'success' => $success,
        ]), 200);
    }

    private function setConversionActionLabel(array $inputs)
    {
        if (!isset($inputs['conversionActions'])) {
            $this->render(json_encode([
                'success' => false,
                'message' => 'Missing conversionActions key',
            ]), 400);
        }

        $newTags = [];

        foreach ($inputs['conversionActions'] as $index => $conversionAction) {
            if (!isset($conversionAction['category']) || !isset($conversionAction['tag'])) {
                $this->render(json_encode([
                    'success' => false,
                    'message' => 'Missing category or tag key at index ' . $index,
                ]), 400);
            }

            if (!in_array($conversionAction['category'], Config::REMARKETING_CONVERSION_LABELS)) {
                $this->render(json_encode([
                    'success' => false,
                    'message' => 'Unhandled conversion category at index ' . $index,
                ]), 400);
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
        $this->render(json_encode(['success' => true]), 200);
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
        $this->render(json_encode([
            'conversionActionLabels' => $labels,
        ]), 200);
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

        $this->render(json_encode([
            'urlEventBusHealthCheck' => $this->context->link->getModuleLink(
                'ps_eventbus',
                'apiHealthCheck'
            ),
            'typesOfSync' => $typesOfSync,
        ]), 200);
    }

    public function getShopAttributes()
    {
        $this->render(
            json_encode(
                $this->attributesRepository->getAllAttributes()
            ),
            200
        );
    }

    /*******************
     * Product filters *
     *******************/

    public function getProductFilterOptions(array $inputs)
    {
        if (!isset($inputs['kind'])) {
            $this->render(json_encode([
                'success' => false,
                'message' => 'Missing kind key',
            ]), 400);
        }

        $attributeKind = $inputs['kind'];

        try {
            /** @var Resolver $providerResolver */
            $providerResolver = $this->module->getService(Resolver::class);
            $providerName = $providerResolver->getProvider($attributeKind);

            /** @var OptionsProviderInterface $optionsProvider */
            $optionsProvider = $this->module->getService($providerName);

            $this->render(
                json_encode(
                    $optionsProvider->getOptions()
                ),
                200
            );
        } catch (InvalidArgumentException $e) {
            $this->render(json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]), 400);
        }
    }

    public function countMatchingProductsFromFilters(array $inputs)
    {
        if (!isset($inputs['filters'])) {
            $this->render(json_encode([
                'success' => false,
                'message' => 'Missing filters key',
            ]), 400);
        }

        $filters = $inputs['filters'];

        /** @var ProductEnumerator $productEnumerator */
        $productEnumerator = $this->module->getService(ProductEnumerator::class);

        $this->render(
            json_encode([
                'numberOfProducts' => $productEnumerator->countProductsMatchingFilters($filters),
            ]),
            200
        );
    }

    public function listMatchingProductsFromFilters(array $inputs)
    {
        if (!isset($inputs['filters'])) {
            $this->render(json_encode([
                'success' => false,
                'message' => 'Missing filters key',
            ]), 400);
        }

        $filters = $inputs['filters'];

        /** @var ProductEnumerator $productEnumerator */
        $productEnumerator = $this->module->getService(ProductEnumerator::class);

        $this->render(
            json_encode($productEnumerator->listProductsMatchingFilters($filters, [])),
            200
        );
    }

    private function getModuleStatus(array $inputs)
    {
        if (!isset($inputs['moduleName'])) {
            $this->render(json_encode([
                'success' => false,
                'message' => 'Missing moduleName key',
            ]), 400);
        }

        $this->render(
            json_encode(
                (new ModuleRepository($inputs['moduleName']))->getInformationsAboutModule()
            ),
            200
        );
    }

    /**
     * Retrieve the faq
     */
    public function retrieveFaq()
    {
        $faq = [
            'categories' => [],
        ];

        $request = new HttpClient('https://api.addons.prestashop.com');
        $result = $request->get('/request/faq/' . $this->module->module_key . '/' . _PS_VERSION_ . '/' . $this->context->language->iso_code, []);

        if ($result->getStatusCode() === 200) {
            $faq['categories'] = json_decode($result->getBody(), true);
        }

        $this->render(
            json_encode(
                [
                    'faq' => $faq['categories'],
                    'doc' => $this->getUserDocumentation(),
                    'contactUs' => 'support-google@prestashop.com',
                ]
            ),
            200
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
            $this->render(json_encode([
                'success' => false,
                'message' => 'Missing hookName key',
            ]), 400);
        }

        $this->render(
            json_encode([
                'success' => $this->module->registerHook($inputs['hookName']),
            ]),
            200
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

    /**
     * {@inheritdoc}
     */
    private function render($response, $code)
    {
        header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/json;charset=utf-8');
        header("HTTP/1.1 $code");

        if ((bool) version_compare(_PS_VERSION_, '9.0.0', '>=')) {
            parent::ajaxRender($response);
            exit;
        }

        parent::ajaxDie($response, null, null);
    }
}
