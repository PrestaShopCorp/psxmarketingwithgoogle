<?php

use PHPUnit\Framework\TestCase;

class ProductTest extends TestCase
{
    /**
     * @return bool
     *
     *
     * refresh token main: 1//04wpAm0UR3-tVCgYIARAAGAQSNwF-L9IrzAs49sbMKQzBjO1-D6jNyY6NdqrLBaB-dJaRndBUmFEr_g4UyeXq8wINDVyS62R0B1E
     *
     */
    public function testCreateProduct()
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
        $client->setAccessToken('ya29.a0AfH6SMBTbvRTcehzQ4_Xb6TXkzMC8ciQrnS-0I0N4oYAom4vHPgw4a9NaEnx1J0iMzSd-2PID9Cq9q3Op-6H0YnYYRTR7YKKbC3Oabsl8ZX4gMv-oPccQj-6EWVbYM3UmRBYLuVU2wUqMc4-8NIy65OetvX2');

        $service = new Google_Service_ShoppingContent($client);

        $productPrice = new Google_Service_ShoppingContent_Price();
        $productPrice->setValue('34.75');
        $productPrice->setCurrency('EUR');
        $product = new Google_Service_ShoppingContent_Product();
        $product->setOfferId('10005');
        $product->setContentLanguage('en');
        $product->setTargetCountry('FR');
        $product->setChannel('online');
        $product->setImageLink('http://margud.eu.ngrok.io/google/21-home_default/brown-bear-printed-sweater.jpg');
        $product->setDescription('Mug en céramique blanche, 325ml.');
        $product->setTitle('HUMMINGBIRD PRINTED SWEATER');
        $product->setLink('http://margud.eu.ngrok.io/google/en/women/2-9-brown-bear-printed-sweater.html#/1-size-s');
        $product->setPrice($productPrice);
        $product->setCondition('new');
        $product->setAvailability('in stock');
        $product->setBrand('test');
        $shipping = new Google_Service_ShoppingContent_ProductShipping();
        $shippingPrice = new Google_Service_ShoppingContent_Price();
        $shippingPrice->setValue(2);
        $shippingPrice->setCurrency('EUR');

        $shipping->setPrice($shippingPrice);
        $shipping->setCountry('FR');
        $product->setShipping($shipping);
        $product->setIncludedDestinations('Free listings');

        $product->setAgeGroup('adult');
        $product->setSizes('L');
        $product->setGender('male');
        $product->setColor('Red');
        $product->setIdentifierExists(false);

        $product->setShippingLabel('test shipping label');
        $results = $service->products->insert('352543826', $product);

        if ($results instanceof Google_Service_ShoppingContent_Product) {
            return true;
        }
    }

    public function testGetProducts()
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
        $client->setAccessToken('ya29.a0AfH6SMDvOlDofYQrPujAXddxW186-1xjhmuEFRc7_DmS6T6mwi90kPbvtu8lyw9LoCjVLM2_BjutdWG_GJf4r5PkDMXCp7-qczPx0xc2R9dFUD_WDA91Ur0m1KzuppTeFB1doSm20xgBFReSUJ87MBeZoKngUg');

        $service = new Google_Service_ShoppingContent($client);

        $results = $service->products->listProducts('352543826');

        foreach ($results->getResources() as $item) {
            echo json_encode($item), "<br /> \n";
        }
    }

    public function testCreateAccount()
    {
        $client = new Google\Client();
        $client->getOAuth2Service();
        $client->addScope(
            [
                Google_Service_ShoppingContent::CONTENT
            ]
        );
        $client->setApplicationName("Client_Library_Examples");
//        $client->setDeveloperKey("AIzaSyDyoqQWOB_A0S9QzDPxUaIzs3xhMa0IUFM");
        $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
//        $client->setRedirectUri($redirect_uri);
        $client->setAuthConfig(__DIR__ . '/../../client_secret.json');
        $client->setAccessToken('ya29.a0AfH6SMDbhzKDhF9NRtdGC0U4O3e6_d0R0UOL4VswS7Upj8tk1c3p7JptY2hPko8-rrx4cT5g3xRmiqBsVv6xoQf8sl16bZ2W8Ot1c_ey7aZT5gKWByJA5dr4OFfsVdE26LlZ8t9J04GHKqAc3E3AfMQCuezU');
        $accountLinkRequest = new Google_Service_ShoppingContent_Account();
        $client->addScope(
            [
                Google_Service_ShoppingContent::CONTENT
            ]
        );
        $accountLinkRequest->setName('test1234');
        $accountLinkRequest->setWebsiteUrl('https://test3.com');

        $service = new Google_Service_ShoppingContent($client);
        $results = $service->accounts->insert('343942372', $accountLinkRequest);


    }

    public function testLinkAccount()
    {
        $client = new Google\Client();
        $client->getOAuth2Service();
        $client->addScope(
            [
                Google_Service_ShoppingContent::CONTENT
            ]
        );
        $client->setApplicationName("Client_Library_Examples");
//        $client->setDeveloperKey("AIzaSyDyoqQWOB_A0S9QzDPxUaIzs3xhMa0IUFM");
        $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
//        $client->setRedirectUri($redirect_uri);
        $client->setAuthConfig(__DIR__ . '/../../client_secret.json');
        $client->setAccessToken('ya29.a0AfH6SMAiXZq0Ov4OgT5IwRzDO2vvVwBC9Mae62LngugzIHQGywRd8siwXUYNCxkqNHhk-eH-gJURAi-d6KwII3Ed9hndb551oyi6Pl7-8pxvRrXqgeZJ4664atqcOboZ5bfmu7GthXMoE4em6lk7cgby47_3');
        $accountLinkRequest = new Google_Service_ShoppingContent_AccountsLinkRequest();
        $client->addScope(
            [
                Google_Service_ShoppingContent::CONTENT
            ]
        );
        $accountLinkRequest->setAction('request');
        $accountLinkRequest->setLinkedAccountId('375596169');
        $accountLinkRequest->setLinkType('eCommercePlatform');
        $accountLinkRequest->setServices('shoppingAdsProductManagement');

        $service = new Google_Service_ShoppingContent($client);
        $results = $service->accounts->link('343942437', '385593388', $accountLinkRequest);


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
        $shipping->setServices(
            [
                $this->createShipping($client, 'shippingName'),
                $this->createShipping($client, 'shippingName2')
            ]
        );

        $shipping->setAccountId('352543826');
        $service = new Google_Service_ShoppingContent($client);
        $results = $service->shippingsettings->update('343942372', '352543826', $shipping);

        return true;
    }

    private function createShipping($client, $name)
    {

        $shipping = new Google_Service_ShoppingContent_ShippingSettings();

        $shippingService = new Google_Service_ShoppingContent_Service();
        $shippingService->setName($name);
        $shippingService->setCurrency('EUR');
        $shippingService->setActive(true);
        $shippingService->setDeliveryCountry('FR');

        $rateGroups = new Google_Service_ShoppingContent_RateGroup();
        $rateGroups->setName('normal');

        $carrierRates = new Google_Service_ShoppingContent_CarrierRate();
        $carrierRates->setName('carrier rate');
        $carrierRates->setCarrierName('FedEx');
        $carrierRates->setCarrierService('test');
        $carrierRates->setOriginPostalCode('12345');
//        $rateGroups->setCarrierRates([$carrierRates]);

        $rateGroups->setApplicableShippingLabels('normal test');
        $table = new Google_Service_ShoppingContent_Table();
        $table->setName('test');
        $rowHeaders = new Google_Service_ShoppingContent_Headers();
        $price = new Google_Service_ShoppingContent_Price();
        $price->setCurrency('EUR');
        $price->setValue('10');
        $price2 = new Google_Service_ShoppingContent_Price();
        $price2->setCurrency('EUR');
        $price2->setValue('infinity');
        $rowHeaders->setPrices([$price, $price2]);
//        $rowHeaders->setNumberOfItems(3);
        $table->setRowHeaders($rowHeaders);
        $rows = new Google_Service_ShoppingContent_Row();
        $contentValue = new Google_Service_ShoppingContent_Value();
//        $contentValue->setCarrierRateName('DPD');
//        $contentValue->setSubtableName('DPD2');
//        $contentValue->setNoShipping(false);
        $flatRate = new Google_Service_ShoppingContent_Price();
        $flatRate->setValue('10');
        $flatRate->setCurrency('EUR');
//        $contentValue->setFlatRate($flatRate);
        $contentValue->setPricePercentage('10');

        $rows->setCells($contentValue);
        $table->setRows([$rows, $rows]);
        $rateGroups->setMainTable($table);
        $shippingService->setRateGroups($rateGroups);

        $deliveryTime = new Google_Service_ShoppingContent_DeliveryTime();
        $shippingService->setDeliveryTime($deliveryTime);


        return $shippingService;
    }

    public function testTax()
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
        $client->setAccessToken('ya29.a0AfH6SMDccfkVDViZ-Zfl5KaBLUyU_qvbrjhcvJ0uDRfyfTB4y2nuuQoDWoP-eHCX6IPh6sEfwh-B13C0D-LB5HH1Mp4FxHdkealZ0TxALCk9O5B7U84IVRU216RlgJkIvTCDUnHjF8wxG7knazeg1zTh7p5WwQ');
        $accountTax = new Google_Service_ShoppingContent_AccountTax();
        $accountTax->setRules(
            [
                $this->createTax(),
            ]
        );
        $accountTax->setAccountId('352543826');

        $service = new Google_Service_ShoppingContent($client);
        $results = $service->accounttax->update('343942372', '352543826', $accountTax);

        return true;
    }

    private function createTax()
    {
        $rule = new Google_Service_ShoppingContent_AccountTaxTaxRule();
        $rule->setCountry('US');
        $rule->setLocationId(21167);
        $rule->setUseGlobalRate(true);

        return $rule;
    }
}
