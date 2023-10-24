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
        $addressMock->phone = '';
        $addressMock->phone_mobile = '';

        /** @var UserDataProvider */
        $provider = $this->getMockBuilder(UserDataProvider::class)
            ->onlyMethods(['getAddressFromCart'])
            ->setConstructorArgs([$customerMock, $cartMock])
            ->getMock();
        $provider->method('getAddressFromCart')->willReturn($addressMock);

        $userData = $provider->getUserData();
        $expected = [
            'email' => 'doge@prestashop.com',
            'address' => [
                'first_name' => 'Doge',
                'last_name' => 'The Dog',
                'street' => '198 Avenue de France',
                'city' => 'Paris',
                'postal_code' => '75013',
                'country' => 'France',
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
            ->onlyMethods(['getAddressFromCart'])
            ->setConstructorArgs([$customerMock, $cartMock])
            ->getMock();
        $provider->method('getAddressFromCart')->willReturn(null);

        $userData = $provider->getUserData();
        $expected = [
            'email' => 'doge@prestashop.com',
            'address' => [
                'first_name' => 'Doge',
                'last_name' => 'The Dog',
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
            ->onlyMethods(['getAddressFromCart'])
            ->setConstructorArgs([$customerMock, $cartMock])
            ->getMock();
        $provider->method('getAddressFromCart')->willReturn(null);

        $userData = $provider->getUserData();
        $expected = [];

        $this->assertTrue($userData->isEmpty());
        $this->assertEquals(
            $expected,
            json_decode(json_encode($userData), true)
        );
    }
}
