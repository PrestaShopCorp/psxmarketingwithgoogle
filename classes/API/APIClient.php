<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\API;

use Exception;
use GuzzleHttp\Exception\ClientException;
use PrestaShop\Module\PrestashopGoogleShopping\Exception\ApiClientException;
use PrestaShop\Module\PrestashopGoogleShopping\Factory\ApiClientFactoryInterface;
use PrestaShop\Module\PrestashopGoogleShopping\Handler\ErrorHandler\ErrorHandler;

class APIClient
{
    private $client;

    /**
     * @var string
     */
    private $accessToken = '';

    /**
     * @var ErrorHandler
     */
    private $errorHandler;

    public function __construct(
        ApiClientFactoryInterface $apiClientFactory,
        ErrorHandler $errorHandler
    ) {
        $this->client = $apiClientFactory->createClient();
        $this->errorHandler = $errorHandler;
    }

    public function getOauthCallback()
    {
        return $this->get('account/oauth/callback');
    }

    public function getHealthCheck()
    {
        return $this->get('healthcheck');
    }

    public function getFeedValidationList()
    {
        return $this->get('mc/feed/validation/list');
    }

    public function getFeedValidationSummary()
    {
        return $this->get('mc/feed/validation/summary');
    }

    public function getLastStatus()
    {
        return $this->get('sync/last-status');
    }

    public function postAccountOnboard()
    {
        return $this->get('account/onboard');
    }

    /**
     * @param int|string $id
     * @param array $headers
     * @param array $body
     *
     * @return false|array
     */
    private function get($id, array $headers = [], array $body = [])
    {
        return $this->sendRequest($id, $headers, $body, 'GET');
    }

    /**
     * @param int|string $id
     * @param array $headers
     * @param array $body
     *
     * @return false|array
     */
    private function post($id, array $headers = [], array $body = [])
    {
        return $this->sendRequest($id, $headers, $body, 'POST');
    }

    /**
     * @param int|string $id
     * @param array $headers
     * @param array $body
     *
     * @return false|array
     */
    private function delete($id, array $headers = [], array $body = [])
    {
        return $this->sendRequest($id, $headers, $body, 'DELETE');
    }

    /**
     * @param int|string $id
     * @param array $headers
     * @param array $body
     * @param string $method
     *
     * @return false|array
     */
    private function sendRequest($id, array $headers, array $body, $method)
    {
        $options = [
            'headers' => $headers,
            'body' => array_merge(
                [
                    'access_token' => $this->accessToken,
                ],
                $body
            ),
        ];

        try {
            $request = $this->client->createRequest(
                $method,
                $this->client->getBaseUrl() . $id,
                $options
            );

            $response = $this->client->send($request);
        } catch (ClientException $e) {
            $exceptionContent = json_decode($e->getResponse()->getBody()->getContents(), true);
            $this->errorHandler->handle(
                new ApiClientException(
                    'Failed to send request.',
                    ApiClientException::REQUEST_EXCEPTION,
                    $e
                ),
                $e->getCode(),
                false,
                [
                    'extra' => $exceptionContent,
                ]
            );

            return false;
        } catch (Exception $e) {
            $this->errorHandler->handle(
                new ApiClientException(
                    'Failed to send request.',
                    ApiClientException::REQUEST_EXCEPTION,
                    $e
                ),
                $e->getCode(),
                false
            );

            return false;
        }

        return json_decode($response->getBody()->getContents(), true);
    }
}
