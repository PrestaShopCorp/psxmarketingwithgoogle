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
    }

    public function initContent()
    {
        parent::initContent();
    }

    public function displayAjax()
    {
        $action = Tools::getValue('action');

        switch ($action) {
            case 'setWebsiteClaimHeader':
                $this->setWebsiteClaimHeader();
                break;
            case 'getCarrierValues':
                $this->getCarrierValues();
                break;
            case 'toggleWebsiteClaim':
                $this->toggleWebsiteClaim();
                break;
            case 'toggleGmcLinkRegistration':
                $this->toggleGmcLinkRegistration();
                break;
            default:
                $this->ajaxDie(json_encode(['success' => false, 'message' => $this->l('Action is missing or incorrect.')]));
        }
    }

    private function setWebsiteClaimHeader()
    {
        $websiteClaim = Tools::getValue('websiteClaim');

        $this->configurationAdapter->updateValue(Config::WEBSITE_CLAIM, $websiteClaim);
    }

    private function toggleWebsiteClaim()
    {
        $isEnabled = Tools::getValue('isWebsiteClaimEnabled');

        $this->configurationAdapter->updateValue(Config::IS_WEBSITE_CLAIM_ENABLED, $isEnabled);
    }

    /**
     * Registering the GMC link in the shop database allows us to know if there
     * will be a conflict with another shop using the same domain name.
     */
    private function toggleGmcLinkRegistration()
    {
        if ((bool) Tools::getValue('isGmcLinked')) {
            $this->configurationAdapter->updateValue(Config::PS_GOOGLE_SHOPPING_GMC_IS_LINKED, true);
        } else {
            $this->configurationAdapter->deleteByName(Config::PS_GOOGLE_SHOPPING_GMC_IS_LINKED);
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
}
