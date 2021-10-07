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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Handler;

use Exception;
use Module;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\PsAccountsInstaller\Installer\Facade\PsAccounts;
use PsxMarketingWithGoogle;

/**
 * Handle Error.
 */
class ErrorHandler
{
    /**
     * @var ModuleFilteredRavenClient
     */
    protected $client;

    /**
     * @var ErrorHandler
     */
    private static $instance;

    public function __construct()
    {
        /** @var PsxMarketingWithGoogle */
        $module = Module::getInstanceByName('psxmarketingwithgoogle');

        $this->client = new ModuleFilteredRavenClient(
            Config::PSX_MKTG_WITH_GOOGLE_SENTRY_CREDENTIALS_PHP,
            [
                'level' => 'warning',
                'tags' => [
                    'php_version' => phpversion(),
                    'psxmarketingwithgoogle_version' => $module->version,
                    'prestashop_version' => _PS_VERSION_,
                    'psxmarketingwithgoogle_is_enabled' => \Module::isEnabled('psxmarketingwithgoogle'),
                    'psxmarketingwithgoogle_is_installed' => \Module::isInstalled('psxmarketingwithgoogle'),
                ],
                'release' => "v{$module->version}",
            ]
        );

        try {
            $psAccountsService = $module->getService(PsAccounts::class)->getPsAccountsService();
            $this->client->user_context([
                'id' => $psAccountsService->getShopUuidV4(),
            ]);
        } catch (Exception $e) {
            // Do nothing
        }

        // We use realpath to get errors even if module is behind a symbolic link
        $this->client->setAppPath(realpath(_PS_MODULE_DIR_ . $module->name . '/'));
        // - Do no not add the shop root folder, it will exclude everything even if specified in the app path.
        // - Excluding vendor/ avoids errors comming from one of your libraries library when called by another module.
        $this->client->setExcludedAppPaths([
            realpath(_PS_MODULE_DIR_ . $module->name . '/vendor/'),
        ]);
        $this->client->setExcludedDomains(['127.0.0.1', 'localhost', '.local']);

        if (version_compare(phpversion(), '7.4.0', '>=') && version_compare(_PS_VERSION_, '1.7.8.0', '<')) {
            return;
        }

        $this->client->install();
    }

    /**
     * @param \Exception $error
     * @param mixed $code
     * @param bool|null $throw
     * @param array|null $data
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
