<?php
/**
 * 2007-2020 PrestaShop and Contributors.
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2020 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */

namespace PrestaShop\AccountsAuth\Tests\Unit\Service\PsAccountsService;

use Lcobucci\JWT\Builder;
use PrestaShop\AccountsAuth\Adapter\Configuration;
use PrestaShop\AccountsAuth\Api\Client\FirebaseClient;
use PrestaShop\AccountsAuth\Repository\ConfigurationRepository;
use PrestaShop\AccountsAuth\Service\PsAccountsService;
use PrestaShop\AccountsAuth\Tests\TestCase;

class RefreshTokenTest extends TestCase
{
    public function __construct()
    {
        define('_PS_ROOT_DIR_', '');
    }

    /**
     * @test
     *
     * @throws \Exception
     */
    public function it_should_handle_response_success()
    {
        $idToken = (new Builder())
            ->expiresAt($this->faker->dateTimeBetween('now', '+2 hours')->getTimestamp())
            //->withClaim('uid', $this->faker->uuid)
            ->getToken();

        $idTokenRefreshed = (new Builder())
            ->expiresAt($this->faker->dateTimeBetween('+2 hours', '+4 hours')->getTimestamp())
            //->withClaim('uid', $this->faker->uuid)
            ->getToken();

        $refreshToken = (new Builder())->getToken();

        /** @var FirebaseClient $firebaseClient */
        $firebaseClient = $this->createMock(FirebaseClient::class);

        $firebaseClient->method('exchangeRefreshTokenForIdToken')
            ->willReturn([
                'status' => true,
                'body' => [
                    'id_token' => $idTokenRefreshed,
                    'refresh_token' => $refreshToken,
                ],
            ]);

        /** @var Configuration $configMock */
        $configMock = $this->getConfigurationMock([
            [Configuration::PS_ACCOUNTS_FIREBASE_ID_TOKEN, false, (string) $idToken],
            [Configuration::PS_ACCOUNTS_FIREBASE_REFRESH_TOKEN, false, (string) $refreshToken],
        ]);

        $this->container->singleton(Configuration::class, $configMock);
        $this->container->singleton(FirebaseClient::class, $firebaseClient);

        $configuration = $this->container->get(ConfigurationRepository::class);

        $service = new PsAccountsService();

        $this->assertTrue($service->refreshToken());

        $this->assertEquals((string) $idTokenRefreshed, $configuration->getFirebaseIdToken());

        $this->assertEquals((string) $refreshToken, $configuration->getFirebaseRefreshToken());
    }

    /**
     * @test
     *
     * @throws \Exception
     */
    public function it_should_handle_response_error()
    {
        $idToken = (new Builder())
            ->expiresAt($this->faker->dateTimeBetween('now', '+2 hours')->getTimestamp())
            //->withClaim('uid', $this->faker->uuid)
            ->getToken();

        $refreshToken = (new Builder())->getToken();

        /** @var FirebaseClient $firebaseClient */
        $firebaseClient = $this->createMock(FirebaseClient::class);

        $firebaseClient->method('exchangeRefreshTokenForIdToken')
            ->willReturn([
                'status' => false,
            ]);

        /** @var Configuration $configMock */
        $configMock = $this->getConfigurationMock([
            [Configuration::PS_ACCOUNTS_FIREBASE_ID_TOKEN, false, (string) $idToken],
            [Configuration::PS_ACCOUNTS_FIREBASE_REFRESH_TOKEN, false, (string) $refreshToken],
        ]);

        $configuration = new ConfigurationRepository($configMock);

        $this->container->singleton(Configuration::class, $configMock);
        $this->container->singleton(FirebaseClient::class, $firebaseClient);

        $configuration = $this->container->get(ConfigurationRepository::class);

        $service = new PsAccountsService();

        $this->assertFalse($service->refreshToken());

        $this->assertEquals((string) $idToken, $configuration->getFirebaseIdToken());

        $this->assertEquals((string) $refreshToken, $configuration->getFirebaseRefreshToken());
    }
}
