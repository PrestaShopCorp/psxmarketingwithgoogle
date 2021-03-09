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

namespace PrestaShop\Module\Ps_googleshopping\Translations;

class PsGoogleShoppingTranslations
{
    /**
     * @var \Module
     */
    private $module;

    /**
     * __construct
     *
     * @param \Module $module
     *
     * @return void
     */
    public function __construct(\Module $module)
    {
        $this->module = $module;
    }

    /**
     * Create all translations for Dashboard App
     *
     * @return array
     */
    public function getTranslations()
    {
        $locale = \Context::getContext()->language->iso_code;

        $translations[$locale] = [
            'general' => [
                'tabs' => [
                    'configuration' => $this->module->l('Configure', 'PsGoogleShoppingTranslations'),
                    'catalog' => $this->module->l('Product catalog', 'PsGoogleShoppingTranslations'),
                    'help' => $this->module->l('Help', 'PsGoogleShoppingTranslations'),
                ],
            ],
            'configuration' => [
                'introduction' => $this->module->l('Configuration Page !', 'PsGoogleShoppingTranslations'),
            ],
            'help' => [
                'title' => $this->module->l('Help for PrestaShop Google', 'PsGoogleShoppingTranslations'),
                'allowsYouTo' => [
                    'title' => $this->module->l('This module allows you to:', 'PsGoogleShoppingTranslations'),
                    'business' => $this->module->l('Manage your business', 'PsGoogleShoppingTranslations'),
                    'account' => $this->module->l('Manage your ad account', 'PsGoogleShoppingTranslations'),
                    'traffic' => $this->module->l('Understand your traffic', 'PsGoogleShoppingTranslations'),
                    'inventory' => $this->module->l('Build and manage inventory', 'PsGoogleShoppingTranslations'),
                    'people' => $this->module->l('Reach more people', 'PsGoogleShoppingTranslations'),
                ],
                'help' => [
                    'needHelp' => $this->module->l('Need help? Find here the documentation of this module.', 'PsGoogleShoppingTranslations'),
                    'downloadPdf' => $this->module->l('Download PDF', 'PsGoogleShoppingTranslations'),
                    'couldntFindAnyAnswer' => $this->module->l('Couldn\'t find any answer to your question?', 'PsGoogleShoppingTranslations'),
                    'contactUs' => $this->module->l('Contact us', 'PsGoogleShoppingTranslations'),
                ],
            ],
            'faq' => [
                'title' => $this->module->l('FAQ', 'PsGoogleShoppingTranslations'),
                'noFaq' => $this->module->l('No FAQ available.', 'PsGoogleShoppingTranslations'),
            ],
        ];

        return $translations;
    }
}
