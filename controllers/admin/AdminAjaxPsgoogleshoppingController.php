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

use PrestaShop\Module\PrestashopGoogleShopping\Adapter\ConfigurationAdapter;
use PrestaShop\Module\PrestashopGoogleShopping\Config\Config;
use PrestaShop\Module\PrestashopGoogleShopping\Provider\CarrierDataProvider;

class AdminAjaxPsgoogleshoppingController extends ModuleAdminController
{
    /** @var Ps_googleshopping */
    public $module;

    /**
     * @var ConfigurationAdapter
     */
    private $configurationAdapter;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = false;
        $this->configurationAdapter = $this->module->getService(ConfigurationAdapter::class);
        $this->ajax = true;
    }

    public function initContent()
    {
        parent::initContent();
    }

    public function displayAjax()
    {
        $inputs = json_decode(Tools::file_get_contents('php://input'), true);
        $action = isset($inputs['action']) ? $inputs['action'] : null;

        switch ($action) {
            case 'setWebsiteVerificationMeta':
                $this->setWebsiteVerificationMeta($inputs);
                break;
            case 'getCarrierValues':
                $this->getCarrierValues();
                break;
            case 'toggleGoogleAccountIsRegistered':
                $this->toggleGoogleAccountIsRegistered($inputs);
                break;
            default:
                http_response_code(400);
                $this->ajaxDie(json_encode(['success' => false, 'message' => $this->l('Action is missing or incorrect.')]));
        }
    }

    private function setWebsiteVerificationMeta(array $inputs)
    {
        if (!isset($inputs['websiteVerificationMeta'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing Meta key',
            ]));
        }
        $websiteVerificationMeta = $inputs['websiteVerificationMeta'];

        if ($websiteVerificationMeta === false) {
            $this->configurationAdapter->deleteByName(Config::PS_GOOGLE_SHOPPING_WEBSITE_VERIFICATION_META);
            $this->ajaxDie(json_encode(['success' => true, 'method' => 'delete']));
        } else {
            // base64 encoded to avoid prestashop sanitization
            $this->configurationAdapter->updateValue(
                Config::PS_GOOGLE_SHOPPING_WEBSITE_VERIFICATION_META,
                base64_encode($websiteVerificationMeta),
            );
            $this->ajaxDie(json_encode(['success' => true, 'method' => 'insert']));
        }
    }

    /**
     * Registering the GOOGLE ACCOUNT link in the shop database allows us to know if there
     * will be a conflict with another shop using the same domain name.
     */
    private function toggleGoogleAccountIsRegistered(array $inputs)
    {
        if (!isset($inputs['isGoogleAccountLinked'])) {
            http_response_code(400);
            $this->ajaxDie(json_encode([
                'success' => false,
                'message' => 'Missing isGoogleAccountLinked key',
            ]));
        }

        if ((bool) $inputs['isGoogleAccountLinked']) {
            $this->configurationAdapter->updateValue(Config::PS_GOOGLE_SHOPPING_ACCOUNT_IS_LINKED, true);
        } else {
            $this->configurationAdapter->deleteByName(Config::PS_GOOGLE_SHOPPING_ACCOUNT_IS_LINKED);
        }
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function getCarrierValues()
    {
        /** @var CarrierDataProvider $carrierDataProvider */
        $carrierDataProvider = $this->module->getService(CarrierDataProvider::class);

        $carrierLines = $carrierDataProvider->getFormattedData();

        $this->ajaxDie(json_encode($carrierLines));
    }

    /**
     * {@inheritdoc}
     */
    protected function ajaxDie($value = null, $controller = null, $method = null)
    {
        header('Content-Type: application/json');
        parent::ajaxDie($value, $controller, $method);
    }
}
