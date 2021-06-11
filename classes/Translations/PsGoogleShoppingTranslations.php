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
                'warningMultistore' => $this->module->l('You can associate only one shop to your Prestashop Account.', 'PsGoogleShoppingTranslations'),
                'GMCAlreadyLinked' => $this->module->l('Your PrestaShop account is already linked to another store. You can associate only one store to a PrestaShop account. To associate this other store you have to unlink the associated one.', 'PsGoogleShoppingTranslations'),
            ],
            'psAccountCard' => [
                'disonboardedText' => $this->module->l('Authorize your account to manage your shop’s services', 'PsGoogleShoppingTranslations'),
                'onboardedText' => $this->module->l('Your shop is associated to the PrestaShop account of', 'PsGoogleShoppingTranslations'),
            ],
            'googleAccountCard' => [
                'title' => $this->module->l('Google account', 'PsGoogleShoppingTranslations'),
                'introDisabled' => $this->module->l('When you are done connecting your PrestaShop account you will be able to connect your Google accounts.', 'PsGoogleShoppingTranslations'),
                'introEnabled' => $this->module->l('A Google Account lets you access your Google Merchant Center and Google Ads accounts', 'PsGoogleShoppingTranslations'),
                'footerDissociating' => $this->module->l('Dissociating your Google account will disconnect your Google Merchant Center and your Google Ads accounts.', 'PsGoogleShoppingTranslations'),
                'alertCantConnect' => $this->module->l('You can\'t connect to your Google account right now. Try again later.', 'PsGoogleShoppingTranslations'),
                'alertTokenMissing' => $this->module->l('The account token is missing. Try again to connect to your Google Merchant Center account or switch to another one.', 'PsGoogleShoppingTranslations'),
            ],
            'mcaCard' => [
                'title' => $this->module->l('Make your products available to shoppers accross Google', 'PsGoogleShoppingTranslations'),
                'introDisabled' => $this->module->l('Associate your Merchant Center account to get your store and products information into Google', 'PsGoogleShoppingTranslations'),
                'introEnabled' => $this->module->l('[Google Merchant Center](//google.com){:target="_blank"} helps you get your store and product info into Google and make it available to shoppers across Google.', 'PsGoogleShoppingTranslations'),
                'labelSelect' => $this->module->l('Connect an existing Merchant Center account', 'PsGoogleShoppingTranslations'),
                'claimCollides' => $this->module->l('Your current website claim collides with an existing claim', 'PsGoogleShoppingTranslations'),
                'claimOverwrite' => $this->module->l('To finalize your Google Merchant Center account creation, you need to overwrite the existing claim.', 'PsGoogleShoppingTranslations'),
                'footerEU' => $this->module->l("If you are in the European Economic Area or Switzerland your Merchant Center account must be associated with a [Comparison Shopping Service (CSS)](//google.com){:target=\"_blank\"}.  \n  If you create a new Merchant Center account through this application, it will be associated with Google Shopping, Google’s CSS, by default. You can change the CSS associated with your account at any time. [Find your CSS Partners](//google.com){:target=\"_blank\"}  \n  Once you have set up your Merchant Center account you can use our onboarding tool regardless of which CSS you use.", 'PsGoogleShoppingTranslations'),
                'shopInfoMissing' => $this->module->l('Shop information is missing', 'PsGoogleShoppingTranslations'),
                'shopInfoMissingDescription' => $this->module->l('To check if it is a validity issue or if you are not following our rules, please log in to your account a', 'PsGoogleShoppingTranslations'),
                'userIsNotAdmin' => $this->module->l('You need Administrator access', 'PsGoogleShoppingTranslations'),
                'googleMCA' => $this->module->l('Google Merchant Center account', 'PsGoogleShoppingTranslations'),
                'toUseGmcNeedsAdminAccess' => $this->module->l('To use an existing Google Merchant Center account, you must have Administrator access.', 'PsGoogleShoppingTranslations'),
                'linkingFailed' => $this->module->l('You can\'t connect to your Merchant Center account right now. Try again later.', 'PsGoogleShoppingTranslations'),
                'verifyOrClaimingFailed' => $this->module->l('Account validation failed', 'PsGoogleShoppingTranslations'),
                'tryAgainLater' => $this->module->l('We can’t verify or claim the current site. Try again later.', 'PsGoogleShoppingTranslations'),
            ],
            'mcaRequirements' => [
                'steps' => [
                    'websiteRequirements' => $this->module->l('Shopping website requirements', 'PsGoogleShoppingTranslations'),
                    'shopInfo' => $this->module->l('Shop information', 'PsGoogleShoppingTranslations'),
                ],
                'title' => $this->module->l('Create new Merchant Center account', 'PsGoogleShoppingTranslations'),
                'legend' => $this->module->l('To use Google Ads, you must acknowledge that you meet these requirements by checking these boxes.', 'PsGoogleShoppingTranslations'),
                'footer' => $this->module->l('Learn about shopping website requirements', 'PsGoogleShoppingTranslations'),
                'shoppingAdsPolicies' => [
                  'title' => $this->module->l('Shopping Ads policies', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Don’t promote prohibited content or use prohibited practice to advertise. Respect restricted content policy and quality standards for your ads and website.', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('See Shopping Ads policies', 'PsGoogleShoppingTranslations'),
                ],
                'accurateContactInformation' => [
                  'title' => $this->module->l('Accurate contact information', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('According to the policy provide users with the information that they need to make informed decisions (currently 2 out of 3: e-mail, phone number or physical address)', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('Discover how to provide relevant information', 'PsGoogleShoppingTranslations'),
                ],
                'secureCheckoutProcess' => [
                  'title' => $this->module->l('Secure checkout process and collection of personal data', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Do not misuse information about user, nor collect it for unclear purposes or without appropriate security measures.', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('Learn about irresponsible data collection & use', 'PsGoogleShoppingTranslations'),
                ],
                'returnPolicy' => [
                  'title' => $this->module->l('Return policy', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Provide users with the information that they need to make informed decisions.', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('Discover how to set up return policies', 'PsGoogleShoppingTranslations'),
                ],
                'billingTerms' => [
                  'title' => $this->module->l('Billing terms and conditions', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Provide users with the information that they need to make informed decisions.', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('See Merchant Center guidelines', 'PsGoogleShoppingTranslations'),
                ],
                'completeCheckoutProcess' => [
                  'title' => $this->module->l('Complete checkout process', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Avoid abuse', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('See checkout requirements', 'PsGoogleShoppingTranslations'),
                ],
                'websiteURL' => $this->module->l('Website URL', 'PsGoogleShoppingTranslations'),
                'websiteURLDescription' => $this->module->l('The website used to create your Merchant Center account', 'PsGoogleShoppingTranslations'),
                'storeName' => $this->module->l('Store name', 'PsGoogleShoppingTranslations'),
                'storeNameDescription' => $this->module->l('This name will appear in your Shopping ads.', 'PsGoogleShoppingTranslations'),
                'businessLocation' => $this->module->l('Business location', 'PsGoogleShoppingTranslations'),
                'businessAddress' => $this->module->l('Business address', 'PsGoogleShoppingTranslations'),
                'businessPhone' => $this->module->l('Business phone number', 'PsGoogleShoppingTranslations'),
                'siteContainsAdultContent' => $this->module->l('My site contains adult content', 'PsGoogleShoppingTranslations'),
                'seePolicyAdultContent' => $this->module->l('See policy on adult-oriented content', 'PsGoogleShoppingTranslations'),
                'labelReadAndAgree' => $this->module->l('By purchasing Shopping ads, I have read and agree to comply with [Google\'s terms and policies](//google.com){:target="_blank"}, including [Google’s Merchant Center terms of service](//google.com){:target="_blank"}, [Shopping ads policies](//google.com){:target="_blank"}, and [Google Ads Terms and Conditions](//google.com){:target="_blank"}.', 'PsGoogleShoppingTranslations'),
                'alert' => $this->module->l('If one of these requirements is missing, your Merchant Center account will be disapproved.', 'PsGoogleShoppingTranslations'),
            ],
            'productFeedCard' => [
                'title' => $this->module->l('Send your products data to Google', 'PsGoogleShoppingTranslations'),
                'intro' => $this->module->l('Display your products either free on Google Shopping tab and/or paid Smart Shopping campaigns with Product feed', 'PsGoogleShoppingTranslations'),
                'introToConfigure' => $this->module->l('Submitting your product data to Google in the correct format is important for creating successful ads and free listings for your products. We use this data to make sure that it\'s matched to the right queries.', 'PsGoogleShoppingTranslations'),
                'nextSync' => $this->module->l('Next synchronization: {0}', 'PsGoogleShoppingTranslations'),
                'syncFailedAt' => $this->module->l('Synchronization failed {0} at {1}', 'PsGoogleShoppingTranslations'),
                'syncSuccess' => $this->module->l('{0} products synced {1} at {2}', 'PsGoogleShoppingTranslations'),
                'syncBusy' => $this->module->l('Sync progressing...', 'PsGoogleShoppingTranslations'),
                'syncCantPerform' => $this->module->l('Synchronization can\'t perform', 'PsGoogleShoppingTranslations'),
                'mappedCategories' => $this->module->l('{0}/{1} mapped categories', 'PsGoogleShoppingTranslations'),
                'alertSuccess' => $this->module->l('You are successfully opted in. Once your products are approved, they can appear in Shopping tab search results.', 'PsGoogleShoppingTranslations'),
                'alertFailed' => $this->module->l('The synchronization of your product feed failed. **[See possible reasons in Merchant Center]({0}){:target="_blank"}**', 'PsGoogleShoppingTranslations'),
                'alertShippingSettingsMissing' => $this->module->l('Shipping settings are missing. Once your shipping settings configured, you will be able to sync your product data. **[Add shipping settings]({0}){:target="_blank"}**', 'PsGoogleShoppingTranslations'),
                'alertProductFeedDeactivated' => $this->module->l('If the product sync is deactivated, there will be no new products pushed into the GMC. The account itself will continue to exist and the products will expire after 30 days. This stops the catalog items to show on both Free Listings and the ad campaigns.', 'PsGoogleShoppingTranslations'),
                'alertProductFeedExists' => $this->module->l("**A product feed already exists**  \n  <small>To activate free listing feature, you need to overwrite the exisitng product feed.</small>", 'PsGoogleShoppingTranslations'),
                'googleTaxonomyAssociation' => $this->module->l('Google Product taxonomy association', 'PsGoogleShoppingTranslations'),
                'optional' => $this->module->l('Optional', 'PsGoogleShoppingTranslations'),
                'attributeDescription' => $this->module->l('With these attributes, you can organize your advertising campaigns in Google Ads and override the category automatically assigned by Google in some cases.', 'PsGoogleShoppingTranslations'),
                'excludedProducts' => $this->module->l('Excluded products', 'PsGoogleShoppingTranslations'),
                'productsReadyToBeSynced' => $this->module->l('Products ready to be synced', 'PsGoogleShoppingTranslations'),
                'productsWithProblems' => $this->module->l('Products with problems', 'PsGoogleShoppingTranslations'),
                'alertGoogleIsReviewingProducts' => $this->module->l("Google is currently reviewing your products.  \n\nOnce approved, your products can appear in Shopping tab search results.", 'PsGoogleShoppingTranslations'),
            ],
            'productFeedSettings' => [
                'breadcrumb1' => $this->module->l('Product feed', 'PsGoogleShoppingTranslations'),
                'breadcrumb2' => $this->module->l('Product feed settings', 'PsGoogleShoppingTranslations'),
                'steps' => [
                  'shippingSettings' => $this->module->l('Shipping settings', 'PsGoogleShoppingTranslations'),
                  'syncRules' => $this->module->l('Synchronization rules', 'PsGoogleShoppingTranslations'),
                  'attributeMapping' => $this->module->l('Attribute mapping', 'PsGoogleShoppingTranslations'),
                  'categoryMapping' => $this->module->l('Category mapping', 'PsGoogleShoppingTranslations'),
                  'summary' => $this->module->l('Summary', 'PsGoogleShoppingTranslations'),
                  'exportFeed' => $this->module->l('Export feed!', 'PsGoogleShoppingTranslations'),
                ],
                'noticeDataStored' => $this->module->l('Data are stored at each step but will be submitted only at the final step.', 'PsGoogleShoppingTranslations'),
                'shipping' => [
                    'targetCountries' => $this->module->l('Target countries', 'PsGoogleShoppingTranslations'),
                    'ifMultipleCountries' => $this->module->l('If multiple countries are selected, each product price will automatically be converted to the correct currency in Google. Your store must support the appropriate shipping and tax rates for customers in each selected country.', 'PsGoogleShoppingTranslations'),
                    'productAvailaibleIn' => $this->module->l('Products available in', 'PsGoogleShoppingTranslations'),
                    'placeholderSelect' => $this->module->l('XXXXXXXXX', 'PsGoogleShoppingTranslations'),
                    'cantFindCountry' => $this->module->l("Can’t find a country? Only supported countries are listed. [Supported countries](//google.com){:target=\"_blank\"}\n\n Your shipping services must be configured for the country you are targeting. Please respect [country-specific shopping policies](//google.com){:target=\"_blank\"} and [local regulation](//google.com){:target=\"_blank\"}", 'PsGoogleShoppingTranslations'),
                    'shippingSettings' => $this->module->l('Shipping settings', 'PsGoogleShoppingTranslations'),
                    'autoImportShipping' => $this->module->l('Automatically import shipping settings', 'PsGoogleShoppingTranslations'),
                    'autoImportShippingDescription' => $this->module->l('PrestaShop will try to automatically import your shipping information from your store settings. You may need to provide additional information if we are unable to sync them automatically.', 'PsGoogleShoppingTranslations'),
                    'manualShipping' => $this->module->l('Manually set up shipping settings in Google Merchant Center', 'PsGoogleShoppingTranslations'),
                    'manualShippingDescription' => $this->module->l('You will go to Google Merchant Center and enter your product shipping information yourself. Your products won’t sync until you do this.', 'PsGoogleShoppingTranslations'),
                    'taxSettings' => $this->module->l('Tax settings', 'PsGoogleShoppingTranslations'),
                    'taxSettingsDescription' => $this->module->l('So that users understand the exact price that they’ll have to pay for a product, you must submit the taxes that you collect. Select how you want to set up tax settings.', 'PsGoogleShoppingTranslations'),
                    'autoImportTax' => $this->module->l('Automatically import tax settings', 'PsGoogleShoppingTranslations'),
                    'manualImportTax' => $this->module->l('Manually set up tax settings in Google Merchant Center', 'PsGoogleShoppingTranslations'),
                    'appliedOnlyForUsa' => $this->module->l('(applied only for the USA)', 'PsGoogleShoppingTranslations'),
                    'alertTaxes' => $this->module->l('So that users understand the exact price that they’ll have to pay for a product, you must submit the taxes that you collect.', 'PsGoogleShoppingTranslations'),
                ],
                'export' => [
                    'synchronizationSchedule' => $this->module->l('Export synchronization schedule', 'PsGoogleShoppingTranslations'),
                    'synchronizationTime' => $this->module->l('Synchronization time', 'PsGoogleShoppingTranslations'),
                    'timeZone' => $this->module->l('Time zone', 'PsGoogleShoppingTranslations'),
                    'exporMethod' => $this->module->l('Export method', 'PsGoogleShoppingTranslations'),
                    'allProducts' => $this->module->l('All products', 'PsGoogleShoppingTranslations'),
                    'byBrand' => $this->module->l('Brand', 'PsGoogleShoppingTranslations'),
                    'byCategory' => $this->module->l('Category', 'PsGoogleShoppingTranslations'),
                    'labelExcludeProducts' => $this->module->l('Exclude specific products', 'PsGoogleShoppingTranslations'),
                    'placeholderExcludeProducts' => $this->module->l('Search product', 'PsGoogleShoppingTranslations'),
                    'selectCategoriesToExport' => $this->module->l('Select categories to export', 'PsGoogleShoppingTranslations'),
                    'allCategories' => $this->module->l('All categories', 'PsGoogleShoppingTranslations'),
                    'labelSelectBrand' => $this->module->l('Select brand', 'PsGoogleShoppingTranslations'),
                    'placeholderSelectBrand' => $this->module->l('Search brand', 'PsGoogleShoppingTranslations'),
                    'prohibitedContentNotice' => $this->module->l('Please review the [prohibited content guidelines](//google.com){:target=\"_blank\"} to ensure that products in your feed don’t violate these policies.', 'PsGoogleShoppingTranslations'),
                    'frequency' => [
                        'daily' => $this->module->l('Daily', 'PsGoogleShoppingTranslations'),
                    ],
                    'teaser' => [
                        'title' => $this->module->l('Available in the next version', 'PsGoogleShoppingTranslations'),
                        'badge' => $this->module->l('Coming soon', 'PsGoogleShoppingTranslations'),
                        'syncScheduleCustomization' => $this->module->l('Sync schedule customization', 'PsGoogleShoppingTranslations'),
                        'exportOption' => $this->module->l('Export option', 'PsGoogleShoppingTranslations'),
                        'specificProductExclusion' => $this->module->l('Specific product exclusion', 'PsGoogleShoppingTranslations'),
                    ],
                ],
                'attributeMapping' => [
                    'intro' => $this->module->l('Products that are eligible for enhanced listings will appear in content-rich formats on the Shopping tab, which may boost traffic and drive sales.', 'PsGoogleShoppingTranslations'),
                    'learnAboutAttributeMapping' => $this->module->l('Learn more about attribute mapping', 'PsGoogleShoppingTranslations'),
                    'introNotice' => $this->module->l('In addition to the attributes required for standard free listings, the following attributes are required to participate in enhanced listings. Performance may be limited unless you provide all attributes available in your region:', 'PsGoogleShoppingTranslations'),
                    'genericTitle' => $this->module->l('Generic', 'PsGoogleShoppingTranslations'),
                    'toDescribeProducts' => $this->module->l('To describe my product attributes, please use:', 'PsGoogleShoppingTranslations'),
                    'googleAttribute' => $this->module->l('Google product attribute', 'PsGoogleShoppingTranslations'),
                    'prestashopAttribute' => $this->module->l('PrestaShop product attribute', 'PsGoogleShoppingTranslations'),
                    'description' => $this->module->l('Description', 'PsGoogleShoppingTranslations'),
                    'longDescription' => $this->module->l('Long description', 'PsGoogleShoppingTranslations'),
                    'shortDescription' => $this->module->l('Short description', 'PsGoogleShoppingTranslations'),
                    'specificTitle' => $this->module->l('Specific', 'PsGoogleShoppingTranslations'),
                    'sellRefurbished' => $this->module->l('Do you sell refurbished products ?', 'PsGoogleShoppingTranslations'),
                    'sellApparel' => $this->module->l('Do you sell apparel and accessories ?', 'PsGoogleShoppingTranslations'),
                    'condition' => $this->module->l('Condition', 'PsGoogleShoppingTranslations'),
                    'color' => $this->module->l('Color', 'PsGoogleShoppingTranslations'),
                    'size' => $this->module->l('Size', 'PsGoogleShoppingTranslations'),
                    'ageGroup' => $this->module->l('Age group', 'PsGoogleShoppingTranslations'),
                    'gender' => $this->module->l('Gender', 'PsGoogleShoppingTranslations'),
                    'theXField' => $this->module->l('The "{0}" field', 'PsGoogleShoppingTranslations'),
                    'thisCustomField' => $this->module->l('This custom field', 'PsGoogleShoppingTranslations'),
                    'footerNotice1' => $this->module->l('These attributes are required for products for specific age group and apparel items for customers in Brazil, France, Germany, Japan, the UK, and the US.', 'PsGoogleShoppingTranslations'),
                    'footerNotice2' => $this->module->l('We encourage submitting as many applicable attributes as possible to ensure accurate and comprehensive data.', 'PsGoogleShoppingTranslations'),
                    'learnAboutShippingSettings' => $this->module->l('Learn more about shipping settings', 'PsGoogleShoppingTranslations'),
                    'learnHowToSetupShippingSettings' => $this->module->l('Learn how to set up shipping', 'PsGoogleShoppingTranslations'),
                    'learnRequirementsProductSpeficifacion' => $this->module->l('Learn more about requirements for the Shopping product data specification', 'PsGoogleShoppingTranslations'),
                    'weWillRecoverTheseAttributes' => $this->module->l('For your products we will recover these attributes:', 'PsGoogleShoppingTranslations'),
                ],
                'summary' => [
                    'title1' => $this->module->l('Next synchronisation', 'PsGoogleShoppingTranslations'),
                    'title2' => $this->module->l('Product feed settings summary', 'PsGoogleShoppingTranslations'),
                    'xItems' => $this->module->l('{0} items', 'PsGoogleShoppingTranslations'),
                    'productItems' => $this->module->l('Product items', 'PsGoogleShoppingTranslations'),
                    'tableHeader1' => $this->module->l('Google Merchant Center', 'PsGoogleShoppingTranslations'),
                    'tableHeader2' => $this->module->l('Prestashop', 'PsGoogleShoppingTranslations'),
                    'totalProducts' => $this->module->l('Total products', 'PsGoogleShoppingTranslations'),
                    'date' => $this->module->l('Date', 'PsGoogleShoppingTranslations'),
                    'time' => $this->module->l('Time', 'PsGoogleShoppingTranslations'),
                    'youSell' => $this->module->l('**You sell** {0}', 'PsGoogleShoppingTranslations'),
                ],
            ],
            'freeListingCard' => [
                'title' => $this->module->l('Free listing for Google Shopping tab', 'PsGoogleShoppingTranslations'),
                'intro' => $this->module->l('Free listing for Google Shopping tabEnable the free listing of your products on the Google Shopping tab', 'PsGoogleShoppingTranslations'),
                'learnFreeListing' => $this->module->l('Learn more about free listing', 'PsGoogleShoppingTranslations'),
                'seeFreeListing' => $this->module->l('See my free listing in Merchant Center', 'PsGoogleShoppingTranslations'),
                'googleDelay' => $this->module->l('Google usually takes 3-5 business days to review products.', 'PsGoogleShoppingTranslations'),
                'alertActivationSuccess' => $this->module->l('You have successfully activated the free listing of your products for Google Shopping tab for free.', 'PsGoogleShoppingTranslations'),
                'alertEnableFreeListing' => $this->module->l('Enable free listing to display your products on Google Shopping tab for free.', 'PsGoogleShoppingTranslations'),
                'alertProductFeedDisabled' => $this->module->l('The synchronization of your product feed is disabled. Products are still visible on your free listing but they will not be updated anymore and they will disappear from your free listing after 30 days.', 'PsGoogleShoppingTranslations'),
                'alertEnableFreeListingAndProductFeed' => $this->module->l('Enable free listing to display your products on Google Shopping tab for free. This action will cause the reactivation of the product feed.', 'PsGoogleShoppingTranslations'),
            ],
            'googleAdsAccountCard' => [
                'title' => $this->module->l('Connect your Google Ads account', 'PsGoogleShoppingTranslations'),
                'intro' => $this->module->l('Create adverstising campaigns for your products: find the right audience at the right time', 'PsGoogleShoppingTranslations'),
                'text' => $this->module->l('Once connected you may need to configure your billing settings in your Google Ads account.', 'PsGoogleShoppingTranslations'),
                'labelSelect' => $this->module->l('Connect an existing Google Ads account', 'PsGoogleShoppingTranslations'),
                'id' => $this->module->l('Google Ads account ID', 'PsGoogleShoppingTranslations'),
            ],
            'googsmartShoppingCampaignCardleAdsAccountCard' => [
                'title' => $this->module->l('Smart Shopping Campaign', 'PsGoogleShoppingTranslations'),
                'intro' => $this->module->l('Enable the paid listing of your products with Smart Shopping Campaigns', 'PsGoogleShoppingTranslations'),
            ],
            'productFeedPage' => [
                'syncStatus' => [
                  'title' => $this->module->l('Sync status', 'PsGoogleShoppingTranslations'),
                  'readyForExport' => $this->module->l('Product feed is ready for export', 'PsGoogleShoppingTranslations'),
                  'syncProcessed' => $this->module->l('Synchronization processed', 'PsGoogleShoppingTranslations'),
                  'syncFailed' => $this->module->l('Synchronization failed', 'PsGoogleShoppingTranslations'),
                  'lastSync' => $this->module->l('Last synchronization: {0}', 'PsGoogleShoppingTranslations'),
                  'nextSync' => $this->module->l('Next synchronization: {0}', 'PsGoogleShoppingTranslations'),
                  'prescanTitle' => $this->module->l('Coming up next synchronization', 'PsGoogleShoppingTranslations'),
                  'scheduleOn' => $this->module->l('Synchronization scheduled on {0}', 'PsGoogleShoppingTranslations'),
                  'alert' => $this->module->l('To solve the synchronization issue, go to Help tab or [contact the customer support service](//google.com){:target="_blank"}.', 'PsGoogleShoppingTranslations'),
                ],
                'productStatus' => [
                    'title' => $this->module->l('Product approval status', 'PsGoogleShoppingTranslations'),
                    'description' => $this->module->l('After submitting your product feed, your products will be reviewed and assigned one of 6 statuses', 'PsGoogleShoppingTranslations'),
                    'alert' => $this->module->l('Google usually takes 3-5 business days to review products.', 'PsGoogleShoppingTranslations'),
                    'approvedProducts' => $this->module->l('Approved products', 'PsGoogleShoppingTranslations'),
                    'pendingProducts' => $this->module->l('Pending products', 'PsGoogleShoppingTranslations'),
                    'disapprovedProducts' => $this->module->l('Not approved products', 'PsGoogleShoppingTranslations'),
                    'productsInGoogleCatalog' => $this->module->l('Products in Google catalog: {0}', 'PsGoogleShoppingTranslations'),
                    'approvalStatusList' => $this->module->l('Not synced, Active, Partially active, Expiring, Pending, Disapproved.', 'PsGoogleShoppingTranslations'),
                ],
                'approvalTable' => [
                    'description' => $this->module->l('Products with problems that couldn\'t be synced are listed below.', 'PsGoogleShoppingTranslations'),
                    'filterTitle' => $this->module->l('Display by Google validation status', 'PsGoogleShoppingTranslations'),
                    'filterAllStatus' => $this->module->l('All status', 'PsGoogleShoppingTranslations'),
                    'filterOnlyApproved' => $this->module->l('Only approved', 'PsGoogleShoppingTranslations'),
                    'filterOnlyPending' => $this->module->l('Only pending', 'PsGoogleShoppingTranslations'),
                    'filterOnlyNotApproved' => $this->module->l('Only not approved', 'PsGoogleShoppingTranslations'),
                    'tableHeaderID' => $this->module->l('ID', 'PsGoogleShoppingTranslations'),
                    'tableHeaderName' => $this->module->l('Name', 'PsGoogleShoppingTranslations'),
                    'tableHeaderGoogleValidation' => $this->module->l('Google validation', 'PsGoogleShoppingTranslations'),
                    'tableHeaderLanguage' => $this->module->l('Language', 'PsGoogleShoppingTranslations'),
                    'tableHeaderIssue' => $this->module->l('Issue', 'PsGoogleShoppingTranslations'),
                    'xResults' => $this->module->l('{0} results', 'PsGoogleShoppingTranslations'),
                    'perPageLabel' => $this->module->l('Show:', 'PsGoogleShoppingTranslations'),
                    'goToLabel' => $this->module->l('Go to page:', 'PsGoogleShoppingTranslations'),
                    'editX' => $this->module->l('Edit {0}', 'PsGoogleShoppingTranslations'),
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
            'glass' => [
                'message' => $this->module->l("Can't see Google secured browser?  \n  Hit Continue to relaunch the window and finish configuration.  \n  You may need to activate popups in your browser to continue.", 'PsGoogleShoppingTranslations'),
            ],
            'cta' => [
                'getStarted' => $this->module->l('Get started', 'PsGoogleShoppingTranslations'),
                'connect' => $this->module->l('Connect', 'PsGoogleShoppingTranslations'),
                'dissociate' => $this->module->l('Dissociate', 'PsGoogleShoppingTranslations'),
                'manageAccount' => $this->module->l('Manage account', 'PsGoogleShoppingTranslations'),
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
                'addMapping' => $this->module->l('Add mapping', 'PsGoogleShoppingTranslations'),
                'modifyMapping' => $this->module->l('Modify mapping', 'PsGoogleShoppingTranslations'),
                'learnAboutProductConfiguration' => $this->module->l('Learn more about product configuration', 'PsGoogleShoppingTranslations'),
                'overwriteProductFeed' => $this->module->l('Overwrite product feed', 'PsGoogleShoppingTranslations'),
                'trackProductStatus' => $this->module->l('Track Product approval status', 'PsGoogleShoppingTranslations'),
                'whyDidntWork' => $this->module->l('Check out why it didn’t work', 'PsGoogleShoppingTranslations'),
                'aboutProductCategory' => $this->module->l('About Google product category', 'PsGoogleShoppingTranslations'),
                'editCountries' => $this->module->l('Edit countries', 'PsGoogleShoppingTranslations'),
                'editSettings' => $this->module->l('Edit settings', 'PsGoogleShoppingTranslations'),
                'editRules' => $this->module->l('Edit rules', 'PsGoogleShoppingTranslations'),
                'editAttributeMapping' => $this->module->l('Edit attribute mapping', 'PsGoogleShoppingTranslations'),
                'forceSync' => $this->module->l('Force sync', 'PsGoogleShoppingTranslations'),
                'saveAndContinue' => $this->module->l('Save and continue', 'PsGoogleShoppingTranslations'),
                'yes' => $this->module->l('Yes', 'PsGoogleShoppingTranslations'),
                'no' => $this->module->l('No', 'PsGoogleShoppingTranslations'),
                'disableFreeListing' => $this->module->l('Disable free listing', 'PsGoogleShoppingTranslations'),
                'disableProductFeed' => $this->module->l('Disable product feed', 'PsGoogleShoppingTranslations'),
                'enableFreeListingAndProductFeed' => $this->module->l('Enable free listing and product feed', 'PsGoogleShoppingTranslations'),
                'checkRequirements' => $this->module->l('Check requirements', 'PsGoogleShoppingTranslations'),
                'iCheckedAllRequirements' => $this->module->l('I checked all requirements', 'PsGoogleShoppingTranslations'),
                'createAccount' => $this->module->l('Create account', 'PsGoogleShoppingTranslations'),
                'saveChange' => $this->module->l('Save change', 'PsGoogleShoppingTranslations'),
                'close' => $this->module->l('Close', 'PsGoogleShoppingTranslations'),
                'viewDetailedStatuses' => $this->module->l('View all detailed statuses', 'PsGoogleShoppingTranslations'),
                'setupTaxSettings' => $this->module->l('Set up tax settings', 'PsGoogleShoppingTranslations'),
                'understandAndContinue' => $this->module->l('Understand and continue', 'PsGoogleShoppingTranslations'),
                'reviewProblems' => $this->module->l('Review problems', 'PsGoogleShoppingTranslations'),
                'saveAndExport' => $this->module->l('Save and export', 'PsGoogleShoppingTranslations'),
                'go' => $this->module->l('Go', 'PsGoogleShoppingTranslations'),
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
                'merchantCenterAccount' => $this->module->l('Merchant Center account', 'PsGoogleShoppingTranslations'),
                'googleAccount' => $this->module->l('Google account', 'PsGoogleShoppingTranslations'),
                'paid' => $this->module->l('Paid', 'PsGoogleShoppingTranslations'),
                'googleAdsAccount' => $this->module->l('Google Ads account', 'PsGoogleShoppingTranslations'),
                'readyToSync' => $this->module->l('Ready-to-sync', 'PsGoogleShoppingTranslations'),
                'cantSync' => $this->module->l('Can’t be synced', 'PsGoogleShoppingTranslations'),
            ],
            'modal' => [
                'titleDisconnection' => $this->module->l('Confirm disconnection?', 'PsGoogleShoppingTranslations'),
                'titleOverwriteClaim' => $this->module->l('Overwrite existing claim', 'PsGoogleShoppingTranslations'),
                'textDisconnectGoogleAccount' => $this->module->l('You are about to disconnect Google account. This will remove access to Google, Google Merchant Center and Google Ads accounts.', 'PsGoogleShoppingTranslations'),
                'textDisconnectMCA' => $this->module->l('You are about to disconnect Google Merchant Center account. This will remove access to Google Merchant Center and Google Ads accounts.', 'PsGoogleShoppingTranslations'),
                'textOverwriteClaim' => $this->module->l('The existing claim will be overwritten. This action will impact the previous account to become inactive and the existing campaigns - free listings and Google Shopping campaigns - tied to that claim to be paused.  /nIf you are running a different Google Shopping campaign, we recommend pausing the campaign.', 'PsGoogleShoppingTranslations'),
                'titleDisableFreeListing' => $this->module->l('Disable free listing?', 'PsGoogleShoppingTranslations'),
                'textDisableFreeListing' => $this->module->l("By this action, your products will no longer be advertised on Google Shopping and your running campaigns will be paused.  \n  Your catalog export will be still running.", 'PsGoogleShoppingTranslations'),
                'titleDisableProductFeed' => $this->module->l('Disable product feed?', 'PsGoogleShoppingTranslations'),
                'textDisableProductFeed' => $this->module->l("Products will continue to show on Free Listings until the product feed has expired after 30 days.  \n  Smart shopping campaigns will remain active as long as there are still active products in the merchant center - you will need to pause your campaigns.", 'PsGoogleShoppingTranslations'),
                'titleEnableFreeListing' => $this->module->l('Enable free listing?', 'PsGoogleShoppingTranslations'),
                'textEnableFreeListing' => $this->module->l('This action will also cause the reactivation of the product feed.', 'PsGoogleShoppingTranslations'),
            ],
            'tooltip' => [
                'googleAccountRequired' => $this->module->l('Requires Google account configured', 'PsGoogleShoppingTranslations'),
                'merchantCenterAccountRequired' => $this->module->l('Requires Merchant center account configured', 'PsGoogleShoppingTranslations'),
                'productFeedRequired' => $this->module->l('Requires Product feed configured', 'PsGoogleShoppingTranslations'),
                'googleAdsAccountRequired' => $this->module->l('Requires Google Ads account configured', 'PsGoogleShoppingTranslations'),
                'mustCheckAllRequirements' => $this->module->l('You must check if all requirements met.', 'PsGoogleShoppingTranslations'),
                'mustAgreeGoogleTerms' => $this->module->l('You must agree the Google terms', 'PsGoogleShoppingTranslations'),
                'approvalStatusStatus' => $this->module->l('placeholder', 'PsGoogleShoppingTranslations'),
                'approvalStatusLang' => $this->module->l('placeholder', 'PsGoogleShoppingTranslations'),
                'approvalStatusIssues' => $this->module->l('placeholder', 'PsGoogleShoppingTranslations'),
            ],
            'toast' => [
                'googleAccountConnectedOnceSuccess' => $this->module->l('You have connected your Google account!', 'PsGoogleShoppingTranslations'),
            ],
            'stepper' => [
                'nextStep' => $this->module->l('Next: {0}', 'PsGoogleShoppingTranslations'),
                'lastStep' => $this->module->l('Last step', 'PsGoogleShoppingTranslations'),
            ],
        ];

        return $translations;
    }
}
