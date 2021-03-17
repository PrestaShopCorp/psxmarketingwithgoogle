<?php

class AdminPsgoogleshoppingModuleController extends ModuleAdminController
{
    /** @var Ps_googleshopping */
    public $module;

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
        self::testAccessTokenCreate();
    }

    //** We need to call this logic in our API call where we hold client id and secret
    // https://developers.google.com/identity/protocols/oauth2/web-server */
    public function testAccessTokenCreate()
    {
        $link = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount';
        $responseType = 'code';
        $redirect_uri = 'http://margud.eu.ngrok.io/google/admin1/index.php?controller=AdminAjaxPsgoogleshopping';
        $scope = 'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontent';
        $access_type = 'offline';
        $flowName = 'GeneralOAuthFlow';
        $clientId = '1000722766520-po71n2uteu42u0e60s3e7paqc8030ckl.apps.googleusercontent.com';

        Tools::redirectLink("{$link}?response_type={$responseType}&redirect_uri={$redirect_uri}&scope={$scope}&access_type={$access_type}&flowName={$flowName}&client_id={$clientId}");
//        Tools::redirectLink('https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=http://margud.eu.ngrok.io/google/admin1/index.php?controller=AdminAjaxPsgoogleshopping&client_id=1000722766520-po71n2uteu42u0e60s3e7paqc8030ckl.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontent&access_type=online&flowName=GeneralOAuthFlow');
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
        if (isset($_GET['code'])) {
            $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
            $client->setAccessToken($token);
        }
        $client->setAccessToken('ya29.a0AfH6SMAtL40CuanTowypL_0VBJNWcoqOkiRVn1hJVQcnq0TepsWk3ExSmwQ7Q0xU21JCVBpP4dYdLSbnjP6mWgAOEQIFGWVeOQY988rYq9oqeM9k0eho60ZAo0uIjMEn3lG_9bqqgX4Gs2ttRIzo0_b0PQMk');
        $shipping = new Google_Service_ShoppingContent_ShippingSettings();
        $context = Context::getContext();
        $carriers = Carrier::getCarriers($context->language->id);

        $shippingCarriers = [];
        foreach ($carriers as $carrier) {
            $shippingCarriers[] = $this->createShipping($carrier);
        }
        $shipping->setServices(
            $shippingCarriers
        );
        $shipping->setAccountId('352543826');
        $service = new Google_Service_ShoppingContent($client);
        $results = $service->shippingsettings->update('343942372', '352543826', $shipping);

        return true;
    }

    private function createShipping($carrier)
    {
        $carrierRates = new Google_Service_ShoppingContent_CarrierRate();
        $carrierRates->setName('carrier rate');
        $carrierRates->setCarrierName('FedEx');
        $carrierRates->setCarrierService('test');
        $carrierRates->setOriginPostalCode('12345');

        $price = new Google_Service_ShoppingContent_Price();
        $price->setCurrency('EUR');
        $price->setValue('10');
        $price2 = new Google_Service_ShoppingContent_Price();
        $price2->setCurrency('EUR');
        $price2->setValue('infinity');

        $rowHeaders = new Google_Service_ShoppingContent_Headers();
        $rowHeaders->setPrices([$price, $price2]);

        $contentValue = new Google_Service_ShoppingContent_Value();
        $contentValue->setPricePercentage('10');

        $rows = new Google_Service_ShoppingContent_Row();
        $rows->setCells($contentValue);

        $table = new Google_Service_ShoppingContent_Table();
        $table->setName('test');
        $table->setRowHeaders($rowHeaders);
        $table->setRows([$rows, $rows]);


        $flatRate = new Google_Service_ShoppingContent_Price();
        $flatRate->setValue('10');
        $flatRate->setCurrency('EUR');

        $rateGroups = new Google_Service_ShoppingContent_RateGroup();
        $rateGroups->setName('normal');
        $rateGroups->setApplicableShippingLabels('normal test');
        $rateGroups->setMainTable($table);

        $deliveryTime = new Google_Service_ShoppingContent_DeliveryTime();

        $shippingService = new Google_Service_ShoppingContent_Service();
        $shippingService->setName($carrier['name']);
        $shippingService->setCurrency('EUR');
        $shippingService->setActive(true);
        $shippingService->setDeliveryCountry('FR');
        $shippingService->setRateGroups($rateGroups);
        $shippingService->setDeliveryTime($deliveryTime);

        return $shippingService;
    }
}
