<?php

namespace PrestaShop\AccountsAuth\Tests\Unit\Repository\ConfigurationRespository;

use PrestaShop\AccountsAuth\Adapter\Configuration;
use PrestaShop\AccountsAuth\Repository\ConfigurationRepository;
use PrestaShop\AccountsAuth\Tests\TestCase;

class setShopIdTest extends TestCase
{
    /**
     * @test
     */
    public function it_should_pass_shop_id_calling_get()
    {
        $shopId = $this->faker->randomNumber();

        $configMock = $this->getMockBuilder(Configuration::class)
            ->setMethods(['getRaw'])
            ->getMock();

        $configMock->expects($this->once())
            ->method('getRaw')
            ->with(Configuration::PS_ACCOUNTS_FIREBASE_EMAIL, null, null, $shopId, false);

        $configuration = new ConfigurationRepository($configMock);
        $configuration->setShopId($shopId);

        $configuration->getFirebaseEmail();
    }

    /**
     * @test
     */
    public function it_should_pass_shop_id_calling_update()
    {
        $shopId = $this->faker->randomNumber();

        $email = $this->faker->safeEmail;
        $configMock = $this->getMockBuilder(Configuration::class)
            ->setMethods(['setRaw', 'get'])
            ->getMock();

        $configMock->expects($this->once())
            ->method('get')
            ->with(Configuration::PS_PSX_FIREBASE_EMAIL);
        $configMock->expects($this->once())
            ->method('setRaw')
            ->with(Configuration::PS_ACCOUNTS_FIREBASE_EMAIL, $email, false, null, $shopId);
        $configuration = new ConfigurationRepository($configMock);
        $configuration->setShopId($shopId);

        $configuration->updateFirebaseEmail($email);
    }
}
