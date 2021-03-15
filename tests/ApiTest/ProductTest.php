<?php

use PHPUnit\Framework\TestCase;

class ProductTest extends TestCase
{
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
        $client->setAccessToken('ya29.a0AfH6SMB4Ys1g4RCrqZmNZUtvbo_sBNOphAwIfkcoZqmLSsDXi1OEKmSLv7yzl7Bb6_9CZ_EY6ouFEVEJgHDkys8LQcLEd2qC9u2m8kl80wuStm6kPGBUC-oc5DMn5JCNM4tXHtFsDUabBC7Ve-p_USnOjDBv');

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
        $client->setAccessToken('ya29.A0AfH6SMAoCWCsY6k5if0FVobrLXYgdEh5varurasaxyW3RXk3h1D82GpyDdkO2LDe3T3Y1O6mA4qqbfjzB1D4H95V-kpD-NArmumTDN84cpRZw5WpG5k9uvX8epQm92gD9cSvgQVsASgjiwpRIH8lZbjEp_Pi');

        $service = new Google_Service_ShoppingContent($client);

        $results = $service->products->listProducts('352543826');

        foreach ($results->getResources() as $item) {
            echo json_encode($item), "<br /> \n";
        }
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
        $client->setDeveloperKey("AIzaSyDyoqQWOB_A0S9QzDPxUaIzs3xhMa0IUFM");
        $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
        $client->setRedirectUri($redirect_uri);
        if (isset($_GET['code'])) {
            $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
            $client->setAccessToken($token);
        }
        $client->setAccessToken('ya29.a0AfH6SMDkdcwvxuDBjlWYjUwOgnf4yahW-V_s0iGgajNraY8bbrj3ozx0oBVyxPBqpZ6cj1CnHqrS-J_bh4Piar03NC5se3jKQjmh4PyalFuU8jjra7VdpJhwT2uDxPn6Lx2f4IxtpDdax0CDJQ1v-Suy7mWb');

        $accountLinkRequest = new Google_Service_ShoppingContent_AccountsLinkRequest();

        $accountLinkRequest->setAction('approve');
        $accountLinkRequest->setLinkedAccountId('352543826');
        $accountLinkRequest->setLinkType('eCommercePlatform');
        $accountLinkRequest->setServices('shoppingAdsProductManagement');

        $service = new Google_Service_ShoppingContent($client);
        $results = $service->accounts->link('343942372', '352543826', $accountLinkRequest);

        foreach ($results->getResources() as $item) {
            echo json_encode($item), "<br /> \n";
        }
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
