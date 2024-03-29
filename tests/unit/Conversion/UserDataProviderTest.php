<?php

namespace Conversion;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Conversion\UserDataProvider;

class UserDataProviderTest extends TestCase
{
    public function testUserDataWithDataInSources()
    {
        $customerMock = $this->getMockBuilder('Customer')->getMock();
        $cartMock = $this->getMockBuilder('Cart')->getMock();
        $addressMock = $this->getMockBuilder('Address')->getMock();

        $cartMock->id = 3;
        $cartMock->id_address_delivery = 7;
        $cartMock->id_address_invoice = 7;

        $customerMock->id = 3;
        $customerMock->id_lang = 1;
        $customerMock->id_shop = 1;
        $customerMock->lastname = 'The Dog';
        $customerMock->firstname = 'Doge';
        $customerMock->birthday = '0000-00-00';
        $customerMock->email = 'doge@prestashop.com';

        $addressMock->id = 7;
        $addressMock->id_country = 8;
        $addressMock->id_state = 0;
        $addressMock->country = 'France';
        $addressMock->alias = 'Mon adresse';
        $addressMock->company = '';
        $addressMock->lastname = 'The Dog';
        $addressMock->firstname = 'Doge';
        $addressMock->address1 = '198 Avenue de France';
        $addressMock->address2 = '';
        $addressMock->postcode = '75013';
        $addressMock->city = 'Paris';
        $addressMock->other = '';
        $addressMock->phone = '0102030405';
        $addressMock->phone_mobile = '';

        /** @var UserDataProvider */
        $provider = $this->getMockBuilder(UserDataProvider::class)
            ->onlyMethods(['getAddressFromCart', 'getCountryIsoCodeFromAddress'])
            ->setConstructorArgs([$customerMock, $cartMock])
            ->getMock();
        $provider->method('getAddressFromCart')->willReturn($addressMock);
        $provider->method('getCountryIsoCodeFromAddress')->willReturn('FR');

        $userData = $provider->getUserData();
        $expected = [
            'sha256_email_address' => 'a1a4cfa5fa728041c785cc7dbee046bc297f1789a420abfca6670cbaea11fbdc',
            'sha256_phone_number' => '1bd8c50704a917ea5d3324456416c0c51482c25f61645283a3377d091a8ffac1',
            'address' => [
                'sha256_first_name' => 'c4e793c81ee40370d827d0cbe748d246cffca2cbe959383edf0976d041ece9e5',
                'sha256_last_name' => '296e32fbb6d681ba892f20692510bdf262b7875cec09481acc2b113d1a8264af',
                'street' => '198 avenue de france',
                'city' => 'paris',
                'postal_code' => '75013',
                'country' => 'france',
            ],
        ];

        $this->assertFalse($userData->isEmpty());
        $this->assertEquals(
            $expected,
            json_decode(json_encode($userData), true)
        );
    }

    public function testUserDataWithNoAddress()
    {
        $customerMock = $this->getMockBuilder('Customer')->getMock();
        $cartMock = $this->getMockBuilder('Cart')->getMock();

        $cartMock->id = 3;
        $cartMock->id_address_delivery = 7;
        $cartMock->id_address_invoice = 7;

        $customerMock->id = 3;
        $customerMock->id_lang = 1;
        $customerMock->id_shop = 1;
        $customerMock->lastname = 'The Dog';
        $customerMock->firstname = 'Doge';
        $customerMock->birthday = '0000-00-00';
        $customerMock->email = 'doge@prestashop.com';

        /** @var UserDataProvider */
        $provider = $this->getMockBuilder(UserDataProvider::class)
            ->onlyMethods(['getAddressFromCart', 'getCountryIsoCodeFromAddress'])
            ->setConstructorArgs([$customerMock, $cartMock])
            ->getMock();
        $provider->method('getAddressFromCart')->willReturn(null);
        $provider->method('getCountryIsoCodeFromAddress')->willReturn('FR');

        $userData = $provider->getUserData();
        $expected = [
            'sha256_email_address' => 'a1a4cfa5fa728041c785cc7dbee046bc297f1789a420abfca6670cbaea11fbdc',
            'address' => [
                'sha256_first_name' => 'c4e793c81ee40370d827d0cbe748d246cffca2cbe959383edf0976d041ece9e5',
                'sha256_last_name' => '296e32fbb6d681ba892f20692510bdf262b7875cec09481acc2b113d1a8264af',
            ],
        ];

        $this->assertFalse($userData->isEmpty());
        $this->assertEquals(
            $expected,
            json_decode(json_encode($userData), true)
        );
    }

    public function testUserDataWithGuest()
    {
        $customerMock = $this->getMockBuilder('Customer')->getMock();
        $cartMock = $this->getMockBuilder('Cart')->getMock();

        $cartMock->id = 3;
        $cartMock->id_address_delivery = 7;
        $cartMock->id_address_invoice = 7;

        $customerMock->id = 3;
        $customerMock->id_lang = 1;
        $customerMock->id_shop = 1;
        $customerMock->lastname = null;
        $customerMock->firstname = null;
        $customerMock->birthday = null;
        $customerMock->email = null;

        /** @var UserDataProvider */
        $provider = $this->getMockBuilder(UserDataProvider::class)
            ->onlyMethods(['getAddressFromCart', 'getCountryIsoCodeFromAddress'])
            ->setConstructorArgs([$customerMock, $cartMock])
            ->getMock();
        $provider->method('getAddressFromCart')->willReturn(null);
        $provider->method('getCountryIsoCodeFromAddress')->willReturn('FR');

        $userData = $provider->getUserData();
        $expected = [];

        $this->assertTrue($userData->isEmpty());
        $this->assertEquals(
            $expected,
            json_decode(json_encode($userData), true)
        );
    }
}
