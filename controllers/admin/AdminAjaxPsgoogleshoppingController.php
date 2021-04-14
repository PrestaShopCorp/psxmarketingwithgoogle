<?php

use PrestaShop\Module\PrestashopGoogleShopping\API\APIClient;

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
class AdminAjaxPsgoogleshoppingController extends ModuleAdminController
{
    /** @var Ps_googleshopping */
    public $module;

    /**
     * @var APIClient
     */
    private $apiClient;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = false;

        $this->apiClient = $this->module->getService(APIClient::class);
    }

    public function initContent()
    {
        parent::initContent();
    }

    public function displayAjax()
    {
        $action = Tools::getValue('action');

        switch ($action) {
            case 'getDefaultCountry':
                $this->getDefaultCountry();
                break;
            case 'getProductFeedSummary':
                $this->getProductFeedSummary();
            case 'getOauthCallback':
                $this->getOauthCallback();
                break;
            case 'getHealthCheck':
                $this->getHealthCheck();
                break;
            case 'getFeedValidationList':
                $this->getFeedValidationList();
                break;
            case 'getFeedValidationSummary':
                $this->getFeedValidationSummary();
                break;
            case 'getLastStatus':
                $this->getLastStatus();
                break;
            case 'postAccountOnboard':
                $this->postAccountOnboard();
                break;
            default:
                $this->ajaxDie(json_encode(['success' => false, 'message' => $this->l('Action is missing or incorrect.')]));
        }
    }

    private function getDefaultCountry()
    {
        $defaultCountryId = (int) Configuration::get('PS_COUNTRY_DEFAULT');
        $country = new Country($defaultCountryId);
        $this->ajaxDie(json_encode(
                [
                    'success' => true,
                    'country_id' => $country->id,
                    'country_iso_code' => $country->iso_code,
                ]
            )
        );
    }

    private function getOauthCallback()
    {
        $response = $this->apiClient->getOauthCallback();

        $this->ajaxDie(json_encode($response));
    }

    private function getHealthCheck()
    {
        $response = $this->apiClient->getHealthCheck();

        $this->ajaxDie(json_encode($response));
    }

    private function getFeedValidationList()
    {
        $response = $this->apiClient->getFeedValidationList();

        $this->ajaxDie(json_encode($response));
    }

    private function getFeedValidationSummary()
    {
        $response = $this->apiClient->getFeedValidationSummary();

        $this->ajaxDie(json_encode($response));
    }

    private function getLastStatus()
    {
        $response = $this->apiClient->getLastStatus();

        $this->ajaxDie(json_encode($response));
    }

    private function postAccountOnboard()
    {
        $response = $this->apiClient->postAccountOnboard();

        $this->ajaxDie(json_encode($response));
    }
}
