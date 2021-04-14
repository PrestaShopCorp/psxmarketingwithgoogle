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
class AdminAjaxPsgoogleshoppingController extends ModuleAdminController
{
    /** @var Ps_googleshopping */
    public $module;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = false;
    }

    public function initContent()
    {
        parent::initContent();
    }

    public function displayAjax()
    {
        $action = Tools::getValue('action');

        switch ($action) {
            case 'getShippingSettings':
                $this->getShippingSettings();
                break;
            case 'saveShippingSettings':
                $this->saveShippingSettings();
                break;
            case 'getProductFeedSummary':
                $this->getProductFeedSummary();
                break;
            case 'getProductSyncNumber':
                $this->getProductSyncNumber();
                break;
            case 'getProductFeedbackStatuses':
                $this->getProductFeedbackStatuses();
                break;
            case 'getPrestashopCategories':
                $this->getPrestashopCategories();
                break;
            case 'getMappedCategories':
                $this->getMappedCategories();
                break;
            case 'getChildrenOfCategory':
                $this->getChildrenOfCategory();
                break;
            case 'updateCategoryMap':
                $this->updateCategoryMap();
                break;
            case 'removeCategoryMapping':
                $this->removeCategoryMapping();
                break;

            default:
                $this->ajaxDie(json_encode(['success' => false, 'message' => $this->l('Action is missing or incorrect.')]));
        }
    }

    private function getShippingSettings()
    {
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function saveShippingSettings()
    {
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function getProductFeedSummary()
    {
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function getProductSyncNumber()
    {
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function getProductFeedbackStatuses()
    {
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function getPrestashopCategories()
    {
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function getMappedCategories()
    {
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function getChildrenOfCategory()
    {
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function updateCategoryMap()
    {
        $this->ajaxDie(json_encode(['success' => true]));
    }

    private function removeCategoryMapping()
    {
        $this->ajaxDie(json_encode(['success' => true]));
    }
}
