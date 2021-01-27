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

namespace PrestaShop\AccountsAuth\Api\Client;

use GuzzleHttp\Client;

/**
 * Handle firebase signIn/signUp.
 */
class FirebaseClient extends GenericClient
{
    /**
     * Firebase api key.
     *
     * @var string
     */
    protected $apiKey;

    public function __construct()
    {
        parent::__construct();

        $client = new Client([
            'defaults' => [
                'timeout' => $this->timeout,
                'exceptions' => $this->catchExceptions,
                'allow_redirects' => false,
                'query' => [
                    //'key' => $_ENV['FIREBASE_API_KEY'],
                    'key' => getenv('FIREBASE_API_KEY'),
                ],
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ],
            ],
        ]);

        $this->setClient($client);
    }

    /**
     * @param string $customToken
     *
     * @return array response
     */
    public function signInWithCustomToken($customToken)
    {
        $this->setRoute('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken');

        return $this->post([
            'json' => [
                'token' => $customToken,
                'returnSecureToken' => true,
            ],
        ]);
    }

    /**
     * @see https://firebase.google.com/docs/reference/rest/auth#section-refresh-token Firebase documentation
     *
     * @param string $refreshToken
     *
     * @return array response
     */
    public function exchangeRefreshTokenForIdToken($refreshToken)
    {
        $this->setRoute('https://securetoken.googleapis.com/v1/token');

        return $this->post([
            'json' => [
                'grant_type' => 'refresh_token',
                'refresh_token' => $refreshToken,
            ],
        ]);
    }
}
