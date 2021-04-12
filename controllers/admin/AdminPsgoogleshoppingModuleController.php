<?php

use Google\Service;

class AdminPsgoogleshoppingModuleController extends ModuleAdminController
{
    /** @var Ps_googleshopping */
    public $module;

    private $googleCarriers = [];

    /**
     * @return array
     */
    public function getGoogleCarriers()
    {
        return $this->googleCarriers;
    }

    /**
     * @param array $googleCarriers
     */
    public function setGoogleCarriers($googleCarriers)
    {
        $this->googleCarriers = $googleCarriers;
    }

    public function addGoogleCarrier($googleCarrier)
    {
        $this->googleCarriers[] = $googleCarrier;
    }

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = false;
    }

    public function initContent()
    {
        self::testing();
    }

    public function postProcess()
    {
    }

    private function testing()
    {
//        self::testAccessTokenCreate();
        self::generateTokenWithRefreshToken();
//                self::testAddShipping();
//self::claimWebsite();
        self::testCreateGoogleAccount();
    }

    //** We need to call this logic in our API call where we hold client id and secret
    // https://developers.google.com/identity/protocols/oauth2/web-server */
    public function testAccessTokenCreate()
    {
        $link = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount';
        $responseType = 'code';
        $redirect_uri = 'https://margud.eu.ngrok.io/google/admin1/index.php?controller=AdminAjaxPsgoogleshopping';
        $scope = 'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontent';
        $access_type = 'offline';
        $flowName = 'GeneralOAuthFlow';
        $clientId = '511840070660-fh4v9s0l7lhb9rnrq6a7hmsdomphmjpb.apps.googleusercontent.com';

        Tools::redirectLink("{$link}?response_type={$responseType}&redirect_uri={$redirect_uri}&scope={$scope}&access_type={$access_type}&flowName={$flowName}&client_id={$clientId}");
//        Tools::redirectLink('https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=http://margud.eu.ngrok.io/google/admin1/index.php?controller=AdminAjaxPsgoogleshopping&client_id=1000722766520-po71n2uteu42u0e60s3e7paqc8030ckl.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontent&access_type=online&flowName=GeneralOAuthFlow');

        $client = new Google\Client();

        $siteVerification = new Google_Service_SiteVerification($client);

        $resources = new Google_Service_SiteVerification_SiteVerificationWebResourceResource();
        $site = new Google_Service_SiteVerification_SiteVerificationWebResourceResourceSite();
        $site->setIdentifier('http://margud.eu.ngrok.io/google');
        $site->setType('SITE');
        $resources->setSite($site);
        $siteVerification->webResource->insert('FILE', $resources);
    }

    public function generateTokenWithRefreshToken()
    {
        $client = new Google\Client();
//        $client->setClientId('1000722766520-po71n2uteu42u0e60s3e7paqc8030ckl.apps.googleusercontent.com');
//        $client->setClientSecret('LoXOocivJ1oIpiN0QQftZyGd');
//        $client->setRedirectUri('http://margud.eu.ngrok.io/google/admin1/index.php?controller=AdminAjaxPsgoogleshopping');
        $client->setAuthConfig(__DIR__ . '/../../client_secret.json');

        $client->fetchAccessTokenWithRefreshToken(Configuration::get('GOOGLE_REFRESH_TOKEN'));
//        $client->fetchAccessTokenWithRefreshToken('1//04wpAm0UR3-tVCgYIARAAGAQSNwF-L9IrzAs49sbMKQzBjO1-D6jNyY6NdqrLBaB-dJaRndBUmFEr_g4UyeXq8wINDVyS62R0B1E');

        $access_token = $client->getAccessToken();

        Configuration::updateValue('GOOGLE_TOKEN', $access_token['access_token']);
        Configuration::updateValue('CLIENT_ID', $client->getClientId());
    }

    public function testCreateGoogleAccount()
    {
        $client = new Google\Client();
//        $client->setClientId('1000722766520-po71n2uteu42u0e60s3e7paqc8030ckl.apps.googleusercontent.com');
//        $client->setClientSecret('LoXOocivJ1oIpiN0QQftZyGd');
        $client->setAuthConfig(__DIR__ . '/../../client_secret.json');

        $client->addScope(
            [
                Google_Service_ShoppingContent::CONTENT
            ]
        );
        $client->setAccessToken(Configuration::get('GOOGLE_TOKEN'));

        $service = new Google_Service_ShoppingContent($client);

        $shoppingContentAccount = new Google_Service_ShoppingContent_Account();
        $shoppingContentAccount->setName('test2');
        $shoppingContentAccount->setWebsiteUrl('http://test1.com');
        $service->accounts->insert('343942437', $shoppingContentAccount);
    }

    public function testAddShipping()
    {
        $client = new Google\Client();
        $client->getOAuth2Service();
        $client->addScope(
            [
                Google_Service_ShoppingContent::CONTENT
            ]
        );
        $client->setApplicationName("Client_Library_Examples");
        $client->setDeveloperKey("AIzaSyDyoqQWOB_A0S9QzDPxUaIzs3xhMa0IUFM");
        $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
        $client->setRedirectUri($redirect_uri);
        $client->setAccessToken(Configuration::get('GOOGLE_TOKEN'));
        $shipping = new Google_Service_ShoppingContent_ShippingSettings();
        $context = Context::getContext();
        $carriers = Carrier::getCarriers($context->language->id);

        $shippingCarriers = [];
        foreach ($carriers as $carrier) {
            $this->createShipping($carrier);
        }
        $shipping->setServices(
            $this->getGoogleCarriers()
        );
        $shipping->setAccountId('352543826');
        $service = new Google_Service_ShoppingContent($client);
        $results = $service->shippingsettings->update('343942372', '352543826', $shipping);

        return true;
    }

    /**
     * Carrier zones can have different prices and thats not supported in google so we need to create separated google carriers
     *
     *
     * @param $carrier
     * @throws PrestaShopDatabaseException
     * @throws PrestaShopException
     */
    private function createShipping($carrier)
    {
        $shippingService = new Google_Service_ShoppingContent_Service();

        if ($carrier['is_free']) {
            $shippingService->setDeliveryCountry('FR');

            $carrierPrice = self::createFlatRate('0');

            $contentValue = new Google_Service_ShoppingContent_Value();
            $contentValue->setFlatRate($carrierPrice);

            $rateGroups = new Google_Service_ShoppingContent_RateGroup();
            $rateGroups->setSingleValue($contentValue);
            $rateGroups->setName('Shipping rules');

            $deliveryTime = new Google_Service_ShoppingContent_DeliveryTime();

            $shippingService->setName($carrier['name']);
            $shippingService->setCurrency('EUR');
            $shippingService->setActive(true);
            $shippingService->setRateGroups($rateGroups);
            $shippingService->setDeliveryTime($deliveryTime);
            $shippingService->setEligibility('All scenarios');

            $this->addGoogleCarrier($shippingService);
        } else {
            $carrierObj = new Carrier($carrier['id_carrier']);
            $deliveryPriceByRange = self::getCarrierRanges($carrierObj);

            foreach ($deliveryPriceByRange as $range) {
                foreach ($range['zone'] as $zones) {
                    $rangePrices = [];
                    $rows = [];
                    $shippingService = new Google_Service_ShoppingContent_Service();
                    if ($zones['id_zone'] == 2) {
                        $shippingService->setDeliveryCountry('FR');
                    } else {
                        $shippingService->setDeliveryCountry('LT');
                    }

                    $rangePrice = new RangePrice($range['id_range_price']);
                    $rangePrices[] = self::createFlatRate($rangePrice->delimiter2);
                    $rangePrices[] = self::createFlatRate('infinity');

                    $rows[] = $this->createRow($zones['price']);
                    $rows[] = $this->createRow(0);

                    $rowHeaders = new Google_Service_ShoppingContent_Headers();
                    $rowHeaders->setPrices($rangePrices);

                    $table = new Google_Service_ShoppingContent_Table();
                    $table->setName('mainTable');
                    $table->setRowHeaders($rowHeaders);
                    $table->setRows($rows);

                    $rateGroups = new Google_Service_ShoppingContent_RateGroup();
                    $rateGroups->setName('Shipping rules');
//                    $rateGroups->setApplicableShippingLabels('Shipping rules'); // add if need rules for specific products
                    $rateGroups->setMainTable($table);

                    $deliveryTime = new Google_Service_ShoppingContent_DeliveryTime();

                    $shippingService->setName($carrier['name']);
                    $shippingService->setCurrency('EUR');
                    $shippingService->setActive(true);
                    $shippingService->setRateGroups($rateGroups);
                    $shippingService->setDeliveryTime($deliveryTime);
                    $shippingService->setEligibility('All scenarios');

                    $this->addGoogleCarrier($shippingService);
                }
            }
        }
    }

    private function createFlatRate(
        $value = 0, $currency = 'EUR'
    ) {
        $price = new Google_Service_ShoppingContent_Price();
        $price->setValue($value);
        $price->setCurrency($currency);

        return $price;
    }

    private function getCarrierRanges(
        Carrier $carrierObj
    ) {
        $deliveryPriceByRange = Carrier::getDeliveryPriceByRanges($carrierObj->getRangeTable(), (int)$carrierObj->id);

        $filteredRanges = [];
        foreach ($deliveryPriceByRange as $range) {
            $filteredRanges[$range['id_range_price']]['id_range_price'] = $range['id_range_price'];
            $filteredRanges[$range['id_range_price']]['id_carrier'] = $range['id_carrier'];
            $filteredRanges[$range['id_range_price']]['zone'][$range['id_zone']]['id_zone'] = $range['id_zone'];
            $filteredRanges[$range['id_range_price']]['zone'][$range['id_zone']]['price'] = $range['price'];
        }

        return $filteredRanges;
    }

    private function createRow($price)
    {
        $contentValue = new Google_Service_ShoppingContent_Value();
        $carrierPrice = self::createFlatRate($price);
        $contentValue->setFlatRate($carrierPrice);
        $row = new Google_Service_ShoppingContent_Row();
        $row->setCells($contentValue);

        return $row;
    }

    private function createTaxRules($country, $vatPercentage)
    {
        $taxRules = new Google_Service_ShoppingContent_AccountTaxTaxRule();
        $taxRules->setCountry($country);
        $taxRules->setRatePercent($vatPercentage);

        return $taxRules;
    }

    private function claimWebsite()
    {
        $client = new Google\Client();
        $client->getOAuth2Service();
        $client->addScope(
            [
                Google_Service_ShoppingContent::CONTENT
            ]
        );
        $client->setAccessToken(Configuration::get('GOOGLE_TOKEN'));
        $service = new Google_Service_ShoppingContent($client);
        $params = [
            'overwrite' => false
        ];
        $service->accounts->claimwebsite('343942372', '352543826', $params);
    }
}
