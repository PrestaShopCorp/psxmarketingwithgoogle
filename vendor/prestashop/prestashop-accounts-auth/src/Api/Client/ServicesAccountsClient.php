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
use PrestaShop\AccountsAuth\Service\PsAccountsService;

/**
 * Handle call api Services
 */
class ServicesAccountsClient extends GenericClient
{
    /**
     * ServicesAccountsClient constructor.
     *
     * @param \Link $link
     * @param Client|null $client
     *
     * @throws \ReflectionException
     * @throws \Exception
     */
    public function __construct(\Link $link, Client $client = null)
    {
        parent::__construct();
        $psAccountsService = new PsAccountsService();
        $shopId = $psAccountsService->getCurrentShop()['id'];
        $token = $psAccountsService->getOrRefreshToken();
        $this->setLink($link);

        // Client can be provided for tests
        if (null === $client) {
            $client = new Client([
                'base_url' => $_ENV['ACCOUNTS_SVC_API_URL'],
                'defaults' => [
                    'timeout' => $this->timeout,
                    'exceptions' => $this->catchExceptions,
                    'headers' => [
                        // Commented, else does not work anymore with API.
                        //'Content-Type' => 'application/vnd.accounts.v1+json', // api version to use
                        'Accept' => 'application/json',
                        'Authorization' => 'Bearer ' . $token,
                        'Shop-Id' => $shopId,
                        'Module-Version' => \Ps_accounts::VERSION, // version of the module
                        'Prestashop-Version' => _PS_VERSION_, // prestashop version
                    ],
                ],
            ]);
        }

        $this->setClient($client);
    }

    /**
     * @param mixed $shopUuidV4
     * @param array $bodyHttp
     *
     * @return array | false
     */
    public function changeUrl($shopUuidV4, $bodyHttp)
    {
        $this->setRoute('/shops/' . $shopUuidV4 . '/url');

        return $this->patch([
            'body' => $bodyHttp,
        ]);
    }

    /**
     * @param string $shopUuidV4
     *
     * @return array
     */
    public function deleteShop($shopUuidV4)
    {
        $this->setRoute('/shop/' . $shopUuidV4);

        return $this->transitionalDelete();
    }
}
