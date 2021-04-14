<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Handler\ErrorHandler;

use Module;
use PrestaShop\Module\PrestashopGoogleShopping\Config\Env;
use Ps_googleshopping;
use Raven_Client;

/**
 * Handle Error.
 */
class ErrorHandler
{
    /**
     * @var Raven_Client
     */
    protected $client;

    /**
     * @var ErrorHandler
     */
    private static $instance;

    public function __construct()
    {
        /** @var Ps_googleshopping */
        $module = Module::getInstanceByName('ps_googleshopping');
        $env = $module->getService(Env::class);

        $this->client = new Raven_Client(
            $env->get('PSX_GOOGLE_SHOPPING_SENTRY_CREDENTIALS'),
            [
                'level' => 'warning',
                'tags' => [
                    'php_version' => phpversion(),
                    'ps_googleshopping_version' => $module->version,
                    'prestashop_version' => _PS_VERSION_,
                    'ps_googleshoping_is_enabled' => \Module::isEnabled('ps_googleshopping'),
                    'ps_googleshoping_is_installed' => \Module::isInstalled('ps_googleshopping'),
                ],
            ]
        );

        $this->client->install();
    }

    /**
     * @param \Exception $error
     * @param mixed $code
     * @param bool|null $throw
     * @param null $data
     *
     * @return void
     *
     * @throws \Exception
     */
    public function handle($error, $code = null, $throw = true, $data = null)
    {
        $this->client->captureException($error, $data);
        if ($code && true === $throw) {
            http_response_code($code);
            throw $error;
        }
    }

    /**
     * @return ErrorHandler
     */
    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new ErrorHandler();
        }

        return self::$instance;
    }

    /**
     * @return void
     */
    private function __clone()
    {
    }
}
