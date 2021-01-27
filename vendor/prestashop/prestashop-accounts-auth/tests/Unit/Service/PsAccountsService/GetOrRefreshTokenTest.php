<?php

namespace PrestaShop\AccountsAuth\Tests\Unit\Service\PsAccountsService;

use Lcobucci\JWT\Builder;
use PrestaShop\AccountsAuth\Adapter\Configuration;
use PrestaShop\AccountsAuth\Api\Client\FirebaseClient;
use PrestaShop\AccountsAuth\Service\PsAccountsService;
use PrestaShop\AccountsAuth\Tests\TestCase;

class GetOrRefreshTokenTest extends TestCase
{
    /**
     * @test
     *
     * @throws \Exception
     */
    public function it_should_return_valid_token()
    {
        //$date = (new \DateTime('tomorrow'));
        $date = $this->faker->dateTimeBetween('now', '+2 hours');

        $idToken = (new Builder())
            ->expiresAt($date->getTimestamp())
            //->withClaim('uid', $this->faker->uuid)
            ->getToken();

        $refreshToken = (new Builder())->getToken();

        /** @var Configuration $configMock */
        $configMock = $this->getConfigurationMock([
            [Configuration::PS_PSX_FIREBASE_REFRESH_DATE, false, $date->format('Y-m-d h:m:s')],
            [Configuration::PS_ACCOUNTS_FIREBASE_REFRESH_TOKEN, false, (string) $refreshToken],
            [Configuration::PS_ACCOUNTS_FIREBASE_ID_TOKEN, false, (string) $idToken],
        ]);

        $this->container->singleton(Configuration::class, $configMock);

        $service = new PsAccountsService();

        $this->assertEquals((string) $idToken, $service->getOrRefreshToken());
    }

    /**
     * @test
     *
     * @throws \Exception
     */
    public function it_should_refresh_expired_token()
    {
        $date = $this->faker->dateTime('now');

        $idToken = (new Builder())
            ->expiresAt($date->getTimestamp())
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
            [Configuration::PS_PSX_FIREBASE_REFRESH_DATE, false, $date->format('Y-m-d h:m:s')],
            [Configuration::PS_ACCOUNTS_FIREBASE_REFRESH_TOKEN, false, (string) $refreshToken],
            [Configuration::PS_ACCOUNTS_FIREBASE_ID_TOKEN, false, (string) $idToken],
        ]);

        $this->container->singleton(Configuration::class, $configMock);
        $this->container->singleton(FirebaseClient::class, $firebaseClient);

        $service = new PsAccountsService();

        $this->assertEquals((string) $idTokenRefreshed, $service->getOrRefreshToken());
    }
}
