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
use PrestaShop\AccountsAuth\DependencyInjection\PsAccountsServiceProvider;
use PrestaShop\AccountsAuth\Environment\Env;
use PrestaShop\AccountsAuth\Exception\ServiceNotFoundException;
use PrestaShop\AccountsAuth\Handler\Response\ResponseApiHandler;

/**
 * Construct the client used to make call to maasland.
 */
abstract class GenericClient
{
    /**
     * If set to false, you will not be able to catch the error
     * guzzle will show a different error message.
     *
     * @var bool
     */
    protected $catchExceptions = false;
    /**
     * Guzzle Client.
     *
     * @var Client
     */
    protected $client;

    /**
     * Class Link in order to generate module link.
     *
     * @var \Link
     */
    protected $link;

    /**
     * Api route.
     *
     * @var string
     */
    protected $route;

    /**
     * Set how long guzzle will wait a response before end it up.
     *
     * @var int
     */
    protected $timeout = 10;

    /**
     * GenericClient constructor.
     *
     * @throws ServiceNotFoundException
     */
    public function __construct()
    {
        // FIXME : should not be called here
        PsAccountsServiceProvider::getInstance()->get(Env::class);
    }

    /**
     * Getter for client.
     *
     * @return Client
     */
    protected function getClient()
    {
        return $this->client;
    }

    /**
     * Getter for exceptions mode.
     *
     * @return bool
     */
    protected function getExceptionsMode()
    {
        return $this->catchExceptions;
    }

    /**
     * Getter for Link.
     *
     * @return \Link
     */
    protected function getLink()
    {
        return $this->link;
    }

    /**
     * Getter for route.
     *
     * @return string
     */
    protected function getRoute()
    {
        return $this->route;
    }

    /**
     * Getter for timeout.
     *
     * @return int
     */
    protected function getTimeout()
    {
        return $this->timeout;
    }

    /**
     * Wrapper of method post from guzzle client.
     *
     * @param array $options payload
     *
     * @return array return response or false if no response
     */
    protected function post(array $options = [])
    {
        $response = $this->getClient()->post($this->getRoute(), $options);
        $responseHandler = new ResponseApiHandler();
        $response = $responseHandler->handleResponse($response);
        // If response is not successful only
        if (\Configuration::get('PS_ACCOUNTS_DEBUG_LOGS_ENABLED') && !$response['status']) {
            /**
             * @var \Ps_accounts
             */
            $module = \Module::getInstanceByName('ps_accounts');
            $logger = $module->getLogger();
            $logger->debug('route ' . $this->getRoute());
            $logger->debug('options ' . var_export($options, true));
            $logger->debug('response ' . var_export($response, true));
        }

        return $response;
    }

    /**
     * Wrapper of method patch from guzzle client.
     *
     * @param array $options payload
     *
     * @return array return response or false if no response
     */
    protected function patch(array $options = [])
    {
        $response = $this->getClient()->patch($this->getRoute(), $options);
        $responseHandler = new ResponseApiHandler();
        $response = $responseHandler->handleResponse($response);
        // If response is not successful only
        if (\Configuration::get('PS_ACCOUNTS_DEBUG_LOGS_ENABLED') && !$response['status']) {
            /**
             * @var \Ps_accounts
             */
            $module = \Module::getInstanceByName('ps_accounts');
            $logger = $module->getLogger();
            $logger->debug('route ' . $this->getRoute());
            $logger->debug('options ' . var_export($options, true));
            $logger->debug('response ' . var_export($response, true));
        }

        return $response;
    }

    /**
     * Wrapper of method delete from guzzle client.
     *
     * @param array $options payload
     *
     * @return array return response array
     */
    protected function transitionalDelete(array $options = [])
    {
        $response = $this->getClient()->delete($this->getRoute(), $options);
        $responseHandler = new ResponseApiHandler();
        $response = $responseHandler->handleResponse($response);
        // If response is not successful only
        if (\Configuration::get('PS_ACCOUNTS_DEBUG_LOGS_ENABLED') && !$response['status']) {
            /**
             * @var \Ps_accounts
             */
            $module = \Module::getInstanceByName('ps_accounts');
            $logger = $module->getLogger();
            $logger->debug('route ' . $this->getRoute());
            $logger->debug('options ' . var_export($options, true));
            $logger->debug('response ' . var_export($response, true));
        }

        return $response;
    }

    /**
     * Wrapper of method post from guzzle client.
     *
     * @param array $options payload
     *
     * @return array return response or false if no response
     */
    protected function get(array $options = [])
    {
        $response = $this->getClient()->get($this->getRoute(), $options);
        $responseHandler = new ResponseApiHandler();
        $response = $responseHandler->handleResponse($response);
        // If response is not successful only
        if (\Configuration::get('PS_ACCOUNTS_DEBUG_LOGS_ENABLED') && !$response['status']) {
            /**
             * @var \Ps_accounts
             */
            $module = \Module::getInstanceByName('ps_accounts');
            $logger = $module->getLogger();
            $logger->debug('route ' . $this->getRoute());
            $logger->debug('options ' . var_export($options, true));
            $logger->debug('response ' . var_export($response, true));
        }

        return $response;
    }

    /**
     * Setter for client.
     *
     * @return void
     */
    protected function setClient(Client $client)
    {
        $this->client = $client;
    }

    /**
     * Setter for exceptions mode.
     *
     * @param bool $bool
     *
     * @return void
     */
    protected function setExceptionsMode($bool)
    {
        $this->catchExceptions = $bool;
    }

    /**
     * Setter for link.
     *
     * @return void
     */
    protected function setLink(\Link $link)
    {
        $this->link = $link;
    }

    /**
     * Setter for route.
     *
     * @param string $route
     *
     * @return void
     */
    protected function setRoute($route)
    {
        $this->route = $route;
    }

    /**
     * Setter for timeout.
     *
     * @param int $timeout
     *
     * @return void
     */
    protected function setTimeout($timeout)
    {
        $this->timeout = $timeout;
    }
}
