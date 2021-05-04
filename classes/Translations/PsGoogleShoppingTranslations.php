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
                        'footer' => $this->module->l('You can create a new [Merchant Center account](//google.com){:target="_blank"} or link an existing account. Note that you’ll need to meet the Merchant Center eligibility requirements in order to connect your store.', 'PsGoogleShoppingTranslations'),
                    ],
                    'content2' => [
                        'title' => $this->module->l('Reach online shoppers with free listings', 'PsGoogleShoppingTranslations'),
                        'text' => $this->module->l('Free listings drive traffic by showcasing your products to customers who are actively looking for what you sell. Your products will appear on the Google Shopping tab, and can also appear on Google Search, Google Images, and Gmail depending on regional availability.', 'PsGoogleShoppingTranslations'),
                        'footer' => $this->module->l('[Learn more about free listings](//google.com){:target="_blank"}', 'PsGoogleShoppingTranslations'),
                    ],
                    'content3' => [
                        'title' => $this->module->l('Boost store traffic and sales with Google Ads', 'PsGoogleShoppingTranslations'),
                        'text' => $this->module->l('Smart Shopping campaigns help you reach even more customers and grow your business by promoting your products across Google Search, Shopping, YouTube, Gmail, and the Display Network. They use Google’s technology to optimize your ads and automatically show your products to customers who are more likely to buy and spend more.', 'PsGoogleShoppingTranslations'),
                        'footer' => $this->module->l('[Learn more about Smart Shopping campaigns](//google.com){:target="_blank"}', 'PsGoogleShoppingTranslations'),
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
                'productFeedNotice' => $this->module->l('Google’s retail solutions can help you welcome more customers to your site or your store. After you get set up, you’ll have access to reports so you can see how well your ads are doing.', 'PsGoogleShoppingTranslations'),
            ],
            'psAccountCard' => [
                'disonboardedText' => $this->module->l('Authorize your account to manage your shop’s services', 'PsGoogleShoppingTranslations'),
                'onboardedText' => $this->module->l('Your shop is associated to the PrestaShop account of', 'PsGoogleShoppingTranslations'),
            ],
            'googleAccountCard' => [
                'title' => $this->module->l('Google accounts', 'PsGoogleShoppingTranslations'),
                'introDisabled' => $this->module->l('When you are done connecting your PrestaShop account you will be able to connect your Google accounts.', 'PsGoogleShoppingTranslations'),
                'introEnabled' => $this->module->l('A Google Account lets you access your Google Merchant Center and Google Ads accounts', 'PsGoogleShoppingTranslations'),
                'footerDissociating' => $this->module->l('Dissociating your Google account will disconnect your Google Merchant Center and your Google Ads accounts.', 'PsGoogleShoppingTranslations'),
            ],
            'mcaCard' => [
                'title' => $this->module->l('Merchant Center account', 'PsGoogleShoppingTranslations'),
                'introDisabled' => $this->module->l('Once connected your Google account you will be able to associate your Merchant Center account.', 'PsGoogleShoppingTranslations'),
                'introEnabled' => $this->module->l('[Google Merchant Center](//google.com){:target="_blank"} helps you get your store and product info into Google and make it available to shoppers across Google.', 'PsGoogleShoppingTranslations'),
                'labelSelect' => $this->module->l('Connect an existing Merchant Center account', 'PsGoogleShoppingTranslations'),
                'claimCollides' => $this->module->l('Your current website claim collides with an existing claim', 'PsGoogleShoppingTranslations'),
                'claimOverwrite' => $this->module->l('To finalize your Google Merchant Center account creation, you need to overwrite the existing claim.', 'PsGoogleShoppingTranslations'),
                'footerEU' => $this->module->l('If you are in the European Economic Area or Switzerland your Merchant Center account must be associated with a [Comparison Shopping Service (CSS)](//google.com){:target=\"_blank\"} \n If you create a new Merchant Center account through this application, it will be associated with Google Shopping, Google’s CSS, by default. You can change the CSS associated with your account at any time. [Find your CSS Partners](//google.com){:target=\"_blank\"} \n Once you have set up your Merchant Center account you can use our onboarding tool regardless of which CSS you use.', 'PsGoogleShoppingTranslations'),
            ],
            'productFeedCard' => [
                'title' => $this->module->l('Product feed', 'PsGoogleShoppingTranslations'),
                'introDisabled' => $this->module->l('Allows you to display your products either free on Google Shopping tab and/or paid Smart Shopping campaigns', 'PsGoogleShoppingTranslations'),
            ],
            'productFeedSettings' => [
                'breadcrumb' => $this->module->l('Product feed settings', 'PsGoogleShoppingTranslations'),
                'steps' => [
                  'shippingSettings' => $this->module->l('Shipping settings', 'PsGoogleShoppingTranslations'),
                  'exportRules' => $this->module->l('Export rules', 'PsGoogleShoppingTranslations'),
                  'attributeMapping' => $this->module->l('Attribute mapping', 'PsGoogleShoppingTranslations'),
                  'categoryMapping' => $this->module->l('Category mapping', 'PsGoogleShoppingTranslations'),
                  'summary' => $this->module->l('Summary', 'PsGoogleShoppingTranslations'),
                ],
                'shipping' => [
                    'targetCountries' => $this->module->l('Target countries', 'PsGoogleShoppingTranslations'),
                    'ifMultipleCountries' => $this->module->l('If multiple countries are selected, each product price will automatically be converted to the correct currency in Google. Your store must support the appropriate shipping and tax rates for customers in each selected country.', 'PsGoogleShoppingTranslations'),
                    'productAvailaibleIn' => $this->module->l('Products available in', 'PsGoogleShoppingTranslations'),
                    'placeholderSelect' => $this->module->l('XXXXXXXXX', 'PsGoogleShoppingTranslations'),
                    'cantFindCountry' => $this->module->l('Can’t find a country? Only supported countries are listed.', 'PsGoogleShoppingTranslations'),
                    'shippingSettings' => $this->module->l('Shipping settings', 'PsGoogleShoppingTranslations'),
                    'autoImportShipping' => $this->module->l('Automatically import shipping settings', 'PsGoogleShoppingTranslations'),
                    'autoImportShippingDescription' => $this->module->l('PrestaShop will try to automatically import your shipping information from your store settings. You may need to provide additional information if we are unable to sync them automatically.', 'PsGoogleShoppingTranslations'),
                    'manualShipping' => $this->module->l('Manually set up shipping settings in Google Merchant Center', 'PsGoogleShoppingTranslations'),
                    'manualShippingDescription' => $this->module->l('You will go to Google Merchant Center and enter your product shipping information yourself. Your products won’t sync until you do this.', 'PsGoogleShoppingTranslations'),
                    'taxSettings' => $this->module->l('Tax settings', 'PsGoogleShoppingTranslations'),
                    'taxSettingsDescription' => $this->module->l('So that users understand the exact price that they’ll have to pay for a product, you must submit the taxes that you collect. Select how you want to set up tax settings.', 'PsGoogleShoppingTranslations'),
                    'autoImportTax' => $this->module->l('Automatically import tax settings', 'PsGoogleShoppingTranslations'),
                    'manualImportTax' => $this->module->l('Manually set up tax settings in Google Merchant Center', 'PsGoogleShoppingTranslations'),
                ],
                'export' => [
                    'synchronizationSchedule' => $this->module->l('Synchronization schedule', 'PsGoogleShoppingTranslations'),
                    'synchronizationTime' => $this->module->l('Synchronization time', 'PsGoogleShoppingTranslations'),
                    'timeZone' => $this->module->l('Time zone', 'PsGoogleShoppingTranslations'),
                    'exporMethod' => $this->module->l('Export method', 'PsGoogleShoppingTranslations'),
                    'allProducts' => $this->module->l('All products', 'PsGoogleShoppingTranslations'),
                    'brand' => $this->module->l('Brand', 'PsGoogleShoppingTranslations'),
                    'category' => $this->module->l('Category', 'PsGoogleShoppingTranslations'),
                    'excludeProducts' => $this->module->l('Exclude specific products', 'PsGoogleShoppingTranslations'),
                    'searchProducts' => $this->module->l('Search product', 'PsGoogleShoppingTranslations'),
                ],
            ],
            'freeListingCard' => [
                'title' => $this->module->l('Free listing for Google Shopping tab', 'PsGoogleShoppingTranslations'),
                'intro' => $this->module->l('Free listing for Google Shopping tabEnable the free listing of your products on the Google Shopping tab', 'PsGoogleShoppingTranslations'),
                'learnFreeListing' => $this->module->l('Learn more about free listing', 'PsGoogleShoppingTranslations'),
                'seeFreeListing' => $this->module->l('See my free listing in Merchant Center', 'PsGoogleShoppingTranslations'),
                'googleDelay' => $this->module->l('Google usually takes 3-5 business days to review products.', 'PsGoogleShoppingTranslations'),
                'freeListingActivationSuccess' => $this->module->l('You have successfully activated the free listing of your products for Google Shopping tab for free.', 'PsGoogleShoppingTranslations'),
            ],
            'googleAdsAccountCard' => [
                'title' => $this->module->l('Google Ads Account', 'PsGoogleShoppingTranslations'),
                'intro' => $this->module->l('Create adverstising campaigns for your products: find the right audience at the right time', 'PsGoogleShoppingTranslations'),
                'text' => $this->module->l('Once connected you may need to configure your billing settings in your Google Ads account.', 'PsGoogleShoppingTranslations'),
                'labelSelect' => $this->module->l('Connect an existing Google Ads account', 'PsGoogleShoppingTranslations'),
                'id' => $this->module->l('Google Ads account ID', 'PsGoogleShoppingTranslations'),
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
            'glass' => [
                'message' => $this->module->l('Can\'t see Google secured browser?  \nHit Continue to relaunch the window and finish configuration.\n\nYou may need to activate popups in your browser to continue.', 'PsGoogleShoppingTranslations'),
            ],
            'cta' => [
                'getStarted' => $this->module->l('Get started', 'PsGoogleShoppingTranslations'),
                'connect' => $this->module->l('Connect', 'PsGoogleShoppingTranslations'),
                'dissociate' => $this->module->l('Dissociate', 'PsGoogleShoppingTranslations'),
                'manageAccount' => $this->module->l('ManageAccount', 'PsGoogleShoppingTranslations'),
                'overwriteClaim' => $this->module->l('Overwrite claim', 'PsGoogleShoppingTranslations'),
                'switchAccount' => $this->module->l('Switch account', 'PsGoogleShoppingTranslations'),
                'continue' => $this->module->l('Continue', 'PsGoogleShoppingTranslations'),
                'disabled' => $this->module->l('Disabled', 'PsGoogleShoppingTranslations'),
                'enabled' => $this->module->l('Enabled', 'PsGoogleShoppingTranslations'),
                'enableFreeListing' => $this->module->l('Enable free listing', 'PsGoogleShoppingTranslations'),
                'connectAccount' => $this->module->l('Connect account', 'PsGoogleShoppingTranslations'),
                'connectingAccount' => $this->module->l('Connecting account...', 'PsGoogleShoppingTranslations'),
                'chooseExistingAccount' => $this->module->l('Choose existing account', 'PsGoogleShoppingTranslations'),
                'createNewMCA' => $this->module->l('Create new Merchant Center account', 'PsGoogleShoppingTranslations'),
                'learnAboutAccountSuspension' => $this->module->l('Learn about account suspension', 'PsGoogleShoppingTranslations'),
                'learnAboutSiteClaiming' => $this->module->l('Learn about site claiming', 'PsGoogleShoppingTranslations'),
                'learnAboutGoogleSolutions' => $this->module->l('Learn more about Google\'s retail solutions', 'PsGoogleShoppingTranslations'),
                'configureAndExportProductFeed' => $this->module->l('Configure and export product feed', 'PsGoogleShoppingTranslations'),
                'chooseAccount' => $this->module->l('Choose your account', 'PsGoogleShoppingTranslations'),
                'supportedCountries' => $this->module->l('Supported countries', 'PsGoogleShoppingTranslations'),
                'cancel' => $this->module->l('Cancel', 'PsGoogleShoppingTranslations'),
                'disconnectAccount' => $this->module->l('Disconnect account', 'PsGoogleShoppingTranslations'),
                'back' => $this->module->l('Back', 'PsGoogleShoppingTranslations'),
                'selectAccount' => $this->module->l('Select account', 'PsGoogleShoppingTranslations'),
                'createNewGoogleAdsAccount' => $this->module->l('Create new Google Ads account', 'PsGoogleShoppingTranslations'),
            ],
            'badge' => [
                'free' => $this->module->l('Free', 'PsGoogleShoppingTranslations'),
                'active' => $this->module->l('Active', 'PsGoogleShoppingTranslations'),
                'pending' => $this->module->l('Pending', 'PsGoogleShoppingTranslations'),
                'expiring' => $this->module->l('Expiring', 'PsGoogleShoppingTranslations'),
                'disapproved' => $this->module->l('Disapproved', 'PsGoogleShoppingTranslations'),
                'checkingSiteClaim' => $this->module->l('Checking your site claim...', 'PsGoogleShoppingTranslations'),
                'siteVerified' => $this->module->l('Site verified', 'PsGoogleShoppingTranslations'),
                'productFeed' => $this->module->l('Product feed', 'PsGoogleShoppingTranslations'),
                'productFeedSettings' => $this->module->l('Product feed settings', 'PsGoogleShoppingTranslations'),
                'mca' => $this->module->l('Merchant Center account', 'PsGoogleShoppingTranslations'),
                'googleAccount' => $this->module->l('Google account', 'PsGoogleShoppingTranslations'),
            ],
            'modal' => [
                'titleDisconnection' => $this->module->l('Confirm disconnection?', 'PsGoogleShoppingTranslations'),
                'titleOverwriteClaim' => $this->module->l('Overwrite existing claim', 'PsGoogleShoppingTranslations'),
                'textDisconnectGoogleAccount' => $this->module->l('YYou are about to disconnect Google account. This will remove access to Google, Google Merchant Center and Google Ads accounts.', 'PsGoogleShoppingTranslations'),
                'textDisconnectMCA' => $this->module->l('You are about to disconnect Google Merchant Center account. This will remove access to Google Merchant Center and Google Ads accounts.', 'PsGoogleShoppingTranslations'),
                'textOverwriteClaim' => $this->module->l('The existing claim will be overwritten. This action will impact the previous account to become inactive and the existing campaigns - free listings and Google Shopping campaigns - tied to that claim to be paused.  /nIf you are running a different Google Shopping campaign, we recommend pausing the campaign.', 'PsGoogleShoppingTranslations'),
            ],
            'tooltip' => [
                'googleAccountRequired' => $this->module->l('Requires Google account configured', 'PsGoogleShoppingTranslations'),
            ],
        ];

        return $translations;
    }
}
