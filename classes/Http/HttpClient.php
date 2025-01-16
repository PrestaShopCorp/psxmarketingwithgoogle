<?php

/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License version 3.0
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\Http;

use RuntimeException;

class HttpClient
{
    private $curl;
    /** @var array<int|string,string> */
    private $headers = [];
    /** @var array<int|string,bool|int> */
    private $options = [];
    /** @var string */
    private $baseUrl = '';

    /**
     * Constructor initializes cURL
     *
     * @param string $baseUrl Optional base URL for all requests
     *
     * @throws RuntimeException if cURL extension is not loaded
     */
    public function __construct(string $baseUrl = '')
    {
        if (!extension_loaded('curl')) {
            throw new RuntimeException('cURL extension is not loaded');
        }

        $this->baseUrl = rtrim($baseUrl, '/');
        $this->curl = curl_init();

        // Set default options
        $this->setDefaultOptions();
    }

    /**
     * Set default cURL options
     */
    private function setDefaultOptions(): void
    {
        $this->options = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 5,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        ];
    }

    /**
     * Set custom headers for the request
     *
     * @param array<int|string,string> $headers
     *
     * @return self
     */
    public function setHeaders(array $headers): self
    {
        $this->headers = $headers;

        return $this;
    }

    /**
     * Add a single header
     *
     * @param string $name
     * @param string $value
     *
     * @return self
     */
    public function addHeader(string $name, string $value): self
    {
        $this->headers[] = "$name: $value";

        return $this;
    }

    /**
     * Set custom cURL options
     *
     * @param array<string,bool|int> $options
     *
     * @return self
     */
    public function setOptions(array $options): self
    {
        $this->options = $options + $this->options;

        return $this;
    }

    /**
     * Execute HTTP request
     *
     * @param string $method HTTP method
     * @param string $url URL endpoint
     * @param array<string,string|bool|int>|string|null $data Request data
     *
     * @return Response
     *
     * @throws RuntimeException on cURL errors
     */
    public function request(string $method, string $url, $data = null)
    {
        $url = $this->baseUrl . '/' . ltrim($url, '/');

        $options = $this->options + [
            CURLOPT_URL => $url,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_HEADER => true,
            CURLOPT_HTTPHEADER => $this->headers,
        ];

        if ($data !== null) {
            if (is_array($data)) {
                $data = http_build_query($data);
            }

            if ($method === 'GET') {
                /* @phpstan-ignore-next-line */
                $options[CURLOPT_URL] .= '?' . $data;
            } else {
                $options[CURLOPT_POSTFIELDS] = $data;
            }
        }

        curl_setopt_array($this->curl, $options);

        $response = curl_exec($this->curl);

        if ($response === false) {
            throw new \RuntimeException(sprintf('cURL error (%s): %s', curl_errno($this->curl), curl_error($this->curl)));
        }

        $headerSize = curl_getinfo($this->curl, CURLINFO_HEADER_SIZE);
        $httpCode = curl_getinfo($this->curl, CURLINFO_HTTP_CODE);

        // Split response into headers and body
        $headerStr = substr((string) $response, 0, $headerSize);
        $body = substr((string) $response, $headerSize);
        $error = curl_error($this->curl);

        // Parse headers
        $headers = [];
        foreach (explode("\r\n", $headerStr) as $line) {
            if (preg_match('/^([^:]+):(.+)$/', $line, $matches)) {
                $headers[trim($matches[1])] = trim($matches[2]);
            }
        }

        return new Response(
            $httpCode,
            $body,
            $headers,
            $error
        );
    }

    /**
     * Convenience method for GET requests
     *
     * @param string $url
     * @param array<string, string> $params Query parameters
     *
     * @return Response
     */
    public function get(string $url, array $params = [])
    {
        return $this->request('GET', $url, $params);
    }

    /**
     * Convenience method for POST requests
     *
     * @param string $url
     * @param array<string, string>|string $data
     *
     * @return Response
     */
    public function post(string $url, $data = [])
    {
        return $this->request('POST', $url, $data);
    }

    /**
     * Convenience method for PUT requests
     *
     * @param string $url
     * @param array<string, string>|string $data
     *
     * @return Response
     */
    public function put(string $url, $data = [])
    {
        return $this->request('PUT', $url, $data);
    }

    /**
     * Convenience method for DELETE requests
     *
     * @param string $url
     * @param array<string, string> $params
     *
     * @return Response
     */
    public function delete(string $url, array $params = [])
    {
        return $this->request('DELETE', $url, $params);
    }

    /**
     * Destructor closes cURL connection
     */
    public function __destruct()
    {
        if ($this->curl) {
            curl_close($this->curl);
        }
    }
}
