<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

use PrestaShop\Module\PsxMarketingWithGoogle\Api\LocalGoogleApi;
use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;

class AdminTinyLuxGoogleApiController extends ModuleAdminController
{
    private const MAX_REQUEST_BYTES = 65536;

    /** @var bool */
    private $requestAuthorized = false;

    /** @var PsxMarketingWithGoogle */
    public $module;

    public function __construct()
    {
        parent::__construct();
        $this->ajax = true;
        $this->bootstrap = false;
        $this->display_header = false;
        $this->display_footer = false;
    }

    public function checkAccess()
    {
        $this->requestAuthorized = false;
        if (!$this->hasAuthenticatedEmployee()) {
            $this->emitJsonAndTerminate($this->error(401, 'unauthorized'));

            return false;
        }
        if (!$this->checkToken() || !$this->viewAccess()) {
            $this->emitJsonAndTerminate($this->error(403, 'forbidden'));

            return false;
        }

        $this->requestAuthorized = true;

        return true;
    }

    /**
     * This JSON-only controller dispatches solely through its explicit route table.
     * Never allow AdminController to invoke ajaxProcess<Action>() from request data.
     */
    public function postProcess()
    {
    }

    public function displayAjax()
    {
        if (!$this->requestAuthorized) {
            $this->emitJsonAndTerminate($this->error(401, 'unauthorized'));

            return;
        }

        $rawBody = $this->readRequestBody(self::MAX_REQUEST_BYTES + 1);
        $response = $this->handleJsonRequest(
            isset($_SERVER['REQUEST_METHOD']) && is_string($_SERVER['REQUEST_METHOD'])
                ? $_SERVER['REQUEST_METHOD']
                : '',
            $rawBody
        );

        $this->emitJsonAndTerminate($response);
    }

    protected function readRequestBody(int $maximumBytes): string
    {
        $stream = @fopen('php://input', 'rb');
        if (false === $stream) {
            return '';
        }

        $body = '';
        try {
            while (!feof($stream) && strlen($body) < $maximumBytes) {
                $remaining = $maximumBytes - strlen($body);
                $chunk = fread($stream, min(8192, $remaining));
                if (false === $chunk || '' === $chunk) {
                    break;
                }
                $body .= $chunk;
            }
        } catch (Throwable $exception) {
            unset($exception);

            return '';
        } finally {
            fclose($stream);
        }

        return $body;
    }

    protected function emitJsonAndTerminate(Response $response): void
    {
        http_response_code($response->getStatusCode());
        foreach ($response->getHeaders() as $name => $value) {
            header($name . ': ' . $value);
        }

        parent::ajaxRender($response->getBody());
        exit;
    }

    public function handleJsonRequest(string $httpMethod, string $rawBody): Response
    {
        if ('POST' !== $httpMethod) {
            return $this->error(405, 'method_not_allowed');
        }
        if (self::MAX_REQUEST_BYTES < strlen($rawBody)) {
            return $this->error(413, 'request_too_large');
        }

        try {
            $object = json_decode($rawBody, false, 32, JSON_THROW_ON_ERROR);
            $payload = json_decode($rawBody, true, 32, JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            unset($exception);

            return $this->error(400, 'invalid_request');
        }
        if (!is_object($object) || !is_array($payload)
            || ['body', 'method', 'path'] !== $this->sortedKeys(get_object_vars($object))
            || !is_string($object->method) || '' === $object->method || 10 < strlen($object->method)
            || !is_string($object->path) || '' === $object->path || 256 < strlen($object->path)
            || (null !== $object->body && !is_object($object->body))
        ) {
            return $this->error(400, 'invalid_request');
        }

        $body = null === $object->body ? [] : $payload['body'];
        if (!is_array($body)) {
            return $this->error(400, 'invalid_request');
        }

        return $this->dispatchApi($object->method, $object->path, $body);
    }

    protected function hasAuthenticatedEmployee(): bool
    {
        try {
            // Legacy ModuleAdminController requests authenticate through the
            // back-office cookie and populate Context::employee. They do not
            // populate Symfony's user provider, so Employee::isLoggedBack()
            // incorrectly reports false here. Token and view permission are
            // enforced immediately after this context identity check.
            return isset($this->context->employee)
                && $this->context->employee instanceof Employee
                && 0 < (int) $this->context->employee->id;
        } catch (Throwable $exception) {
            unset($exception);

            return false;
        }
    }

    /** @param array<string, mixed> $body */
    protected function dispatchApi(string $method, string $path, array $body): Response
    {
        /** @var LocalGoogleApi $api */
        $api = $this->module->getService(LocalGoogleApi::class);

        return $api->dispatch($method, $path, $body);
    }

    /** @param array<string, mixed> $values
     *  @return string[]
     */
    private function sortedKeys(array $values): array
    {
        $keys = array_keys($values);
        sort($keys);

        return $keys;
    }

    private function error(int $statusCode, string $code): Response
    {
        return new Response($statusCode, '{"code":"' . $code . '"}', [
            'Content-Type' => 'application/json; charset=utf-8',
            'Cache-Control' => 'no-store',
        ]);
    }
}
