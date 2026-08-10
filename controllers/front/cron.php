<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronRequestHandler;

class PsxmarketingwithgoogleCronModuleFrontController extends ModuleFrontController
{
    public function initContent()
    {
        parent::initContent();

        $this->emit($this->handleRequest($this->requestMethod(), $this->requestQuery()));
    }

    /** @param array<string, mixed> $query */
    public function handleRequest(string $httpMethod, array $query): Response
    {
        try {
            return $this->requestHandler()->handle($httpMethod, $query);
        } catch (Throwable $exception) {
            unset($exception);

            return new Response(500, '{"code":"sync_failed"}', [
                'Content-Type' => 'application/json; charset=utf-8',
                'Cache-Control' => 'no-store',
            ]);
        }
    }

    protected function requestHandler(): CronRequestHandler
    {
        if (!$this->module instanceof PsxMarketingWithGoogle) {
            throw new RuntimeException('Cron controller is unavailable.');
        }

        $handler = $this->module->getService(CronRequestHandler::class);
        if (!$handler instanceof CronRequestHandler) {
            throw new RuntimeException('Cron controller is unavailable.');
        }

        return $handler;
    }

    protected function requestMethod(): string
    {
        return isset($_SERVER['REQUEST_METHOD']) && is_string($_SERVER['REQUEST_METHOD'])
            ? $_SERVER['REQUEST_METHOD']
            : '';
    }

    /** @return array<string, mixed> */
    protected function requestQuery(): array
    {
        $query = [];
        foreach (['shop', 'token', 'limit'] as $key) {
            if (Tools::getIsset($key)) {
                $query[$key] = Tools::getValue($key);
            }
        }

        return $query;
    }

    protected function emit(Response $response): void
    {
        http_response_code($response->getStatusCode());
        foreach ($response->getHeaders() as $name => $value) {
            header($name . ': ' . $value);
        }

        echo $response->getBody();
        exit;
    }
}
