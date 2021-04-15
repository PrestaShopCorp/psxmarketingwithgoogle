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
            'landingPage' => [
                'header' => [
                    'title' => $this->module->l('PrestaShop Google Shopping', 'PsGoogleShoppingTranslations'),
                    'text' => $this->module->l('PrestaShop Google Shopping makes it easy to connect your store with Google, so you can showcase your products to millions of shoppers across Google Search, Shopping, Gmail, YouTube, and the Display Network.', 'PsGoogleShoppingTranslations'),
                    'reinsurance' => $this->module->l("- Easy setup \n- Cancel anytime", 'PsGoogleShoppingTranslations'),
                ],
                'content' => [
                    'content1' => [
                        'title' => $this->module->l('Connect your store to Google Merchant Center', 'PsGoogleShoppingTranslations'),
                        'text' => $this->module->l('Connecting your store to Google Merchant Center allows you to upload store and product data to Google. Your products will automatically sync to make relevant information available for free listings, Google Ads, and other Google services.', 'PsGoogleShoppingTranslations'),
                        'footer' => $this->module->l("You can create a new [Merchant Center account](//tartiflette.com){:target=\"_blank\"} or link an existing account. Note that you’ll need to meet the Merchant Center eligibility requirements in order to connect your store.", 'PsGoogleShoppingTranslations'),
                    ],
                    'content2' => [
                        'title' => $this->module->l('Reach online shoppers with free listings', 'PsGoogleShoppingTranslations'),
                        'text' => $this->module->l('Free listings drive traffic by showcasing your products to customers who are actively looking for what you sell. Your products will appear on the Google Shopping tab, and can also appear on Google Search, Google Images, and Gmail depending on regional availability.', 'PsGoogleShoppingTranslations'),
                        'footer' => $this->module->l("[Learn more about free listings](//tartiflette.com){:target=\"_blank\"}", 'PsGoogleShoppingTranslations'),
                    ],
                    'content3' => [
                        'title' => $this->module->l('Boost store traffic and sales with Google Ads', 'PsGoogleShoppingTranslations'),
                        'text' => $this->module->l('Smart Shopping campaigns help you reach even more customers and grow your business by promoting your products across Google Search, Shopping, YouTube, Gmail, and the Display Network. They use Google’s technology to optimize your ads and automatically show your products to customers who are more likely to buy and spend more.', 'PsGoogleShoppingTranslations'),
                        'footer' => $this->module->l("[Learn more about Smart Shopping <campaigns></campaigns>](//tartiflette.com){:target=\"_blank\"}", 'PsGoogleShoppingTranslations'),
                    ],
                ],
                'footer' => [
                    'text' => $this->module->l('Make your first steps with PrestaShop Google Shopping!', 'PsGoogleShoppingTranslations'),
                ],
            ],
            'onboarding' => [
                'sectionTitle' => [
                    'psAccount' => $this->module->l('Your PrestaShop account', 'PsGoogleShoppingTranslations'),
                    'freeListing' => $this->module->l('Activate your free product listings', 'PsGoogleShoppingTranslations'),
                    'smartShoppingCampaign' => $this->module->l('Launch your paid Smart Shopping campaign', 'PsGoogleShoppingTranslations'),
                ],
                'psAccountCard' => [
                    'disonboardedText' => $this->module->l('Authorize your account to manage your shop’s services', 'PsGoogleShoppingTranslations'),
                    'onboardedText' => $this->module->l('Your shop is associated to the PrestaShop account of', 'PsGoogleShoppingTranslations'),
                ],
                'mcaCard' => [
                    'footerEU' => $this->module->l('If you are in the European Economic Area or Switzerland your Merchant Center account must be associated with a [Comparison Shopping Service (CSS)](//google.com){:target=\"_blank\"} \n If you create a new Merchant Center account through this application, it will be associated with Google Shopping, Google’s CSS, by default. You can change the CSS associated with your account at any time. [Find your CSS Partners](//google.com){:target=\"_blank\"} \n Once you have set up your Merchant Center account you can use our onboarding tool regardless of which CSS you use.', 'PsGoogleShoppingTranslations'),
                ],
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
            'cta' => [
                'getStarted' => $this->module->l('Get started', 'PsGoogleShoppingTranslations'),
                'connect' => $this->module->l('Connect', 'PsGoogleShoppingTranslations'),
                'dissociate' => $this->module->l('Dissociate', 'PsGoogleShoppingTranslations'),
                'manageAccount' => $this->module->l('ManageAccount', 'PsGoogleShoppingTranslations'),
            ]
        ];

        return $translations;
    }
}
