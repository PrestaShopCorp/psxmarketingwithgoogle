<?php

namespace PrestaShop\AccountsAuth\Tests\Unit\Service\PsAccountsService;

use PrestaShop\AccountsAuth\Adapter\Configuration;
use PrestaShop\AccountsAuth\Exception\ServiceNotFoundException;
use PrestaShop\AccountsAuth\Repository\ConfigurationRepository;
use PrestaShop\AccountsAuth\Service\PsAccountsService;
use PrestaShop\AccountsAuth\Tests\TestCase;

class IsEmailValidatedTest extends TestCase
{
    /**
     * @test
     *
     * @throws ServiceNotFoundException
     * @throws \ReflectionException
     */
    public function it_should_return_true()
    {
        /** @var Configuration $configMock */
        $configMock = $this->getConfigurationMock([]);

        $this->container->singleton(Configuration::class, $configMock);

        $service = new PsAccountsService();

        /** @var ConfigurationRepository $configuration */
        $configuration = $this->container->get(ConfigurationRepository::class);

        $configuration->updateFirebaseEmailIsVerified(1);

        $this->assertTrue($service->isEmailValidated());
    }

    /**
     * @test
     *
     * @throws ServiceNotFoundException
     * @throws \ReflectionException
     */
    public function it_should_return_false()
    {
        /** @var Configuration $configMock */
        $configMock = $this->getConfigurationMock([]);

        $this->container->singleton(Configuration::class, $configMock);

        $service = new PsAccountsService();

        /** @var ConfigurationRepository $configuration */
        $configuration = $this->container->get(ConfigurationRepository::class);

        $configuration->updateFirebaseEmailIsVerified(0);

        $this->assertFalse($service->isEmailValidated());
    }
}
