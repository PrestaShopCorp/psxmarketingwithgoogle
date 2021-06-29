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
                    'productFeed' => $this->module->l('Product Feed', 'PsGoogleShoppingTranslations'),
                    'paidMarketing' => $this->module->l('Paid Marketing', 'PsGoogleShoppingTranslations'),
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
                    'text' => $this->module->l('Show your products on Google and reach millions of shoppers actively looking for what you offer across Google network.', 'PsGoogleShoppingTranslations'),
                    'reinsurance' => $this->module->l("- Easy setup \n- Cancel anytime", 'PsGoogleShoppingTranslations'),
                ],
                'content' => [
                    'content1' => [
                        'title' => $this->module->l('Get your products found by interested shoppers', 'PsGoogleShoppingTranslations'),
                        'text' => $this->module->l('Free listings let you list your products for free in the Shopping tab and show them to potential customers at the exact moment when they are looking for what your store offers*.', 'PsGoogleShoppingTranslations'),
                        'footer' => $this->module->l('[Learn more about free listings]({0})[:target=\"_blank\"]', 'PsGoogleShoppingTranslations'),
                    ],
                    'content2' => [
                        'title' => $this->module->l('Always show accurate product information', 'PsGoogleShoppingTranslations'),
                        'text' => $this->module->l('Once you upload your store and products data to Google directly from PrestaShop these information will be available and automatically synced for free listings, Google Ads, and other Google services.', 'PsGoogleShoppingTranslations'),
                        'footer' => $this->module->l('Create a new [Merchant Center account]({0})[:target=\"_blank\"] or link an existing one.  \nTo show your products on Google you’ll need to meet the [eligibility requirements]({1})[:target=\"_blank\"]', 'PsGoogleShoppingTranslations'),
                    ],
                    'content3' => [
                        'title' => $this->module->l('Boost traffic and sales with Smart Shopping campaign', 'PsGoogleShoppingTranslations'),
                        'text' => $this->module->l('Reach even more customers with paid ads and grow your sale by promoting your products to the right customers across Google Search, Shopping, YouTube, Gmail, and the Display Network thanks to technology powering Smart Shopping campaigns**', 'PsGoogleShoppingTranslations'),
                        'footer' => $this->module->l('[Learn more about Smart Shopping campaigns]({0})[:target=\"_blank\"]', 'PsGoogleShoppingTranslations'),
                    ],
                    'notice' => $this->module->l("*depending on regional availability   \n **includes campaign optimization to show variety of ads of your products to customers most likely to buy them", 'PsGoogleShoppingTranslations'),
                ],
                'footer' => [
                    'text' => $this->module->l('Get your products found on Google with [Module Name]', 'PsGoogleShoppingTranslations'),
                ],
            ],
            'onboarding' => [
                'sectionTitle' => [
                    'psAccount' => $this->module->l('Connect your PrestaShop account', 'PsGoogleShoppingTranslations'),
                    'freeListing' => $this->module->l('Get your products on Google with free listings', 'PsGoogleShoppingTranslations'),
                    'smartShoppingCampaign' => $this->module->l('Reach more people with paid Smart Shopping campaign', 'PsGoogleShoppingTranslations'),
                ],
                'productFeedNotice' => $this->module->l('Help customers to find your products more easily on Google and list them for free with free listing. Free listing help reach more customers and get them to visit your site.', 'PsGoogleShoppingTranslations'),
                'warningMultistore' => $this->module->l("You can associate only one store to a PrestaShop account.   \n If you need to associate another store you will have to unlink the associated store.", 'PsGoogleShoppingTranslations'),
                'GMCAlreadyLinked' => $this->module->l('Your PrestaShop account is already linked to another store. You can associate only one store to a PrestaShop account. To associate this other store you have to unlink the associated one.', 'PsGoogleShoppingTranslations'),
            ],
            'psAccountCard' => [
                'disonboardedText' => $this->module->l('Authorize your account to manage your shop’s services', 'PsGoogleShoppingTranslations'),
                'onboardedText' => $this->module->l('Your shop is associated to the PrestaShop account of', 'PsGoogleShoppingTranslations'),
            ],
            'googleAccountCard' => [
                'title' => $this->module->l('Google account', 'PsGoogleShoppingTranslations'),
                'introDisabled' => $this->module->l('Connect your Google account and associated with it Google Merchant Center to unlock free listing.', 'PsGoogleShoppingTranslations'),
                'introEnabled' => $this->module->l('Access through PrestaShop module associated with your email account Google Merchant Center and Google Ads accounts.', 'PsGoogleShoppingTranslations'),
                'footerDissociating' => $this->module->l('PrestaShop uses this account to manage and sync Merchant Center and Google Ads accounts.', 'PsGoogleShoppingTranslations'),
                'alertCantConnect' => $this->module->l('You can\'t connect to your Google account right now. Try again later.', 'PsGoogleShoppingTranslations'),
                'alertTokenMissing' => $this->module->l('The account token is missing. Try again to connect to your Google Merchant Center account or switch to another one.', 'PsGoogleShoppingTranslations'),
                'stepIsMandatory' => $this->module->l('*This step is mandatory', 'PsGoogleShoppingTranslations'),
            ],
            'mcaCard' => [
                'title' => $this->module->l('Merchant Center account', 'PsGoogleShoppingTranslations'),
                'introDisabled' => $this->module->l('Associate your Merchant Center account with PrestaShop to ease synchronisation of your store and product data', 'PsGoogleShoppingTranslations'),
                'introEnabled' => $this->module->l('[Google Merchant Center]({0})[:target=\"_blank\"] helps you get your store and product info into Google and make it available to shoppers across Google.', 'PsGoogleShoppingTranslations'),
                'labelSelect' => $this->module->l('Connect an existing account', 'PsGoogleShoppingTranslations'),
                'claimCollides' => $this->module->l('Your website has been already claimed.', 'PsGoogleShoppingTranslations'),
                'claimOverwrite' => $this->module->l('To finish Merchant Center account creation, you need to overwrite the existing claim.', 'PsGoogleShoppingTranslations'),
                'footerEU' => $this->module->l("If you are in the European Economic Area or Switzerland your Merchant Center account must be associated with a [Comparison Shopping Service (CSS)]({0})[:target=\"_blank\"]  \nIf you create a new Merchant Center account through this application, it will be associated with Google Shopping, Google’s CSS, by default. You can change the CSS associated with your account at any time. [Find your CSS Partners]({1})[:target=\"_blank\"]  \nOnce you have set up your Merchant Center account you can use our onboarding tool regardless of which CSS you use.", 'PsGoogleShoppingTranslations'),
                'shopInfoMissing' => $this->module->l('Shop information is missing', 'PsGoogleShoppingTranslations'),
                'shopInfoMissingDescription' => $this->module->l('To check if it is a validity issue or if you are not following our rules, please log in to your account a', 'PsGoogleShoppingTranslations'),
                'userIsNotAdmin' => $this->module->l('You need Administrator access', 'PsGoogleShoppingTranslations'),
                'googleMCA' => $this->module->l('Google Merchant Center account', 'PsGoogleShoppingTranslations'),
                'toUseGmcNeedsAdminAccess' => $this->module->l('To use an existing Merchant Center account, you must have **Admin** access.', 'PsGoogleShoppingTranslations'),
                'linkingFailed' => $this->module->l('You can\'t connect to your Merchant Center account right now. Try again later.', 'PsGoogleShoppingTranslations'),
                'verifyOrClaimingFailed' => $this->module->l('Account validation failed', 'PsGoogleShoppingTranslations'),
                'tryAgainLater' => $this->module->l('We can’t verify or claim the current site. Try again later.', 'PsGoogleShoppingTranslations'),
                'alertSuspended' => $this->module->l('Go to your [Merchant Center account]({0})[:target=\"_blank\"] to see more details on the reason. Once resolved you will need to request a new review by filling out [this form]({1})[:target=\"_blank\"]', 'PsGoogleShoppingTranslations'),
                'notManaged' => $this->module->l('(not managed by PrestaShop)', 'PsGoogleShoppingTranslations'),
                'overwriteFailed' => $this->module->l('Website URL claim failed', 'PsGoogleShoppingTranslations'),
                'overwriteToBeDoneManually' => $this->module->l('Your website has been already claimed on another merchant center account. As we are not administrator of your account, we cannot overwrite this claim for you. Please go to your [Google Merchant Center]({0})[:target=\"_blank\"] , and change the Website URL with this one : {1}', 'PsGoogleShoppingTranslations'),
            ],
            'mcaRequirements' => [
                'steps' => [
                    'websiteRequirements' => $this->module->l('Online store requirements', 'PsGoogleShoppingTranslations'),
                    'shopInfo' => $this->module->l('Store information', 'PsGoogleShoppingTranslations'),
                ],
                'title' => $this->module->l('Create new Merchant Center account', 'PsGoogleShoppingTranslations'),
                'legend' => $this->module->l('To participate in free listing and advertise on Google you must acknowledge and comply with below requirements:', 'PsGoogleShoppingTranslations'),
                'legend2' => $this->module->l("Store's website URL needs to be verified and claimed before you can upload products data.  \nLearn how to verify and claim your website.", 'PsGoogleShoppingTranslations'),
                'footer' => $this->module->l('Read full version of Google store requirements', 'PsGoogleShoppingTranslations'),
                'shoppingAdsPolicies' => [
                  'title' => $this->module->l('Comply with Shopping ads policies', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Don’t promote prohibited content or use prohibited practice to advertise. Respect restricted content policy and quality standards for your ads and website.', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('Read Shopping ads policies', 'PsGoogleShoppingTranslations'),
                ],
                'accurateContactInformation' => [
                  'title' => $this->module->l('Provide accurate contact information', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Website needs to display sufficient - at least 2 out of 3 required - and accurate contact information (phone number, physical address and/or email)', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('Discover how to add contact information', 'PsGoogleShoppingTranslations'),
                ],
                'secureCheckoutProcess' => [
                  'title' => $this->module->l('Provide secure checkout & collection of personal data', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Do not misuse information about user, nor collect it for unclear purposes or without appropriate security measures.', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('Learn about irresponsible data collection & use', 'PsGoogleShoppingTranslations'),
                ],
                'returnPolicy' => [
                  'title' => $this->module->l('Provide clear return and refund policy', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Return and refund policy needs to be clear (include requirement and timelines) and easy to access on your website.', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('Learn how to set up return policies', 'PsGoogleShoppingTranslations'),
                ],
                'billingTerms' => [
                  'title' => $this->module->l('Provide billing terms and conditions', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Website needs to clearly and visibly disclose payment options and all expenses that user will bare, before and after purchase.', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('Read Merchant Center guidelines', 'PsGoogleShoppingTranslations'),
                ],
                'completeCheckoutProcess' => [
                  'title' => $this->module->l('Provide complete checkout process', 'PsGoogleShoppingTranslations'),
                  'description' => $this->module->l('Users need to be able to successully complete purchase process.', 'PsGoogleShoppingTranslations'),
                  'link' => $this->module->l('Learn about checkout requirements', 'PsGoogleShoppingTranslations'),
                ],
                'websiteURL' => $this->module->l('Website URL', 'PsGoogleShoppingTranslations'),
                'websiteURLDescription' => $this->module->l('The website used to create your Merchant Center account', 'PsGoogleShoppingTranslations'),
                'storeName' => $this->module->l('Store name', 'PsGoogleShoppingTranslations'),
                'storeNameDescription' => $this->module->l('This name will appear in your free listing and Shopping ads.', 'PsGoogleShoppingTranslations'),
                'businessLocation' => $this->module->l('Business location', 'PsGoogleShoppingTranslations'),
                'businessAddress' => $this->module->l('Business address', 'PsGoogleShoppingTranslations'),
                'businessPhone' => $this->module->l('Business phone number', 'PsGoogleShoppingTranslations'),
                'siteContainsAdultContent' => $this->module->l('My website contains adult content', 'PsGoogleShoppingTranslations'),
                'seePolicyAdultContent' => $this->module->l('See policy on adult-oriented content', 'PsGoogleShoppingTranslations'),
                'labelReadAndAgree' => $this->module->l('By purchasing Shopping ads, I have read and agree to comply with [Google\'s terms and policies]({0})[:target=\"_blank\"], including [Google’s Merchant Center terms of service]({1})[:target=\"_blank\"], [Shopping ads policies]({2})[:target=\"_blank\"], and [Google Ads Terms and Conditions]({3})[:target=\"_blank\"].', 'PsGoogleShoppingTranslations'),
                'alert' => $this->module->l('Your store will be reviewed so if one of these requirements is missing, your account will be suspended.', 'PsGoogleShoppingTranslations'),
            ],
            'productFeedCard' => [
                'title' => $this->module->l('Automatically sync your products data with Google', 'PsGoogleShoppingTranslations'),
                'intro' => $this->module->l('Submit your store and product data directly to Merchant Center and always keep them up to date for free listing and ads.', 'PsGoogleShoppingTranslations'),
                'introToConfigure' => $this->module->l('It\'s important to submit them in the correct format, as Google uses this data to make sure your products match the right queries.'),
                'nextSync' => $this->module->l('Next synchronization: {0}', 'PsGoogleShoppingTranslations'),
                'syncFailedAt' => $this->module->l('Synchronization failed {0} at {1}', 'PsGoogleShoppingTranslations'),
                'syncSuccess' => $this->module->l('{0} products synced {1} at {2}', 'PsGoogleShoppingTranslations'),
                'syncBusy' => $this->module->l('Sync progressing...', 'PsGoogleShoppingTranslations'),
                'syncCantPerform' => $this->module->l('Synchronization can\'t perform', 'PsGoogleShoppingTranslations'),
                'mappedCategories' => $this->module->l('{0}/{1} mapped categories', 'PsGoogleShoppingTranslations'),
                'alertSuccess' => $this->module->l('You have successfully synced your product data to Merchant Center. Once approved, they will be available for free listings and ads.', 'PsGoogleShoppingTranslations'),
                'alertFailed' => $this->module->l('The synchronization of your product feed failed. **[See possible reasons in Merchant Center]({0})[:target="_blank"]**', 'PsGoogleShoppingTranslations'),
                'alertShippingSettingsMissing' => $this->module->l('Shipping settings are missing. Once your shipping settings configured, you will be able to sync your product data. **[Add shipping settings]({0})[:target="_blank"]**', 'PsGoogleShoppingTranslations'),
                'alertProductFeedDeactivated' => $this->module->l('If the product sync is deactivated, there will be no new products pushed into the GMC. The account itself will continue to exist and the products will expire after 30 days. This stops the catalog items to show on both Free Listings and the ad campaigns.', 'PsGoogleShoppingTranslations'),
                'alertProductFeedExists' => $this->module->l("**A product feed already exists**  \n  <small>Your product feed already exists. You need to overwrite it to sync your PrestaShop product feed.</small>", 'PsGoogleShoppingTranslations'),
                'googleTaxonomyAssociation' => $this->module->l('Google Product taxonomy association', 'PsGoogleShoppingTranslations'),
                'optional' => $this->module->l('Optional', 'PsGoogleShoppingTranslations'),
                'attributeDescription' => $this->module->l('With these attributes, you can organize your advertising campaigns in Google Ads and override the category automatically assigned by Google in some cases.', 'PsGoogleShoppingTranslations'),
                'excludedProducts' => $this->module->l('Excluded products', 'PsGoogleShoppingTranslations'),
                'productsReadyToBeSynced' => $this->module->l('Products ready to be synced', 'PsGoogleShoppingTranslations'),
                'productsWithProblems' => $this->module->l('Products with problems', 'PsGoogleShoppingTranslations'),
                'alertGoogleIsReviewingProducts' => $this->module->l('You have successfully submitted your product data to Merchant Center. Once approved, they will be available for free listings and ads.', 'PsGoogleShoppingTranslations'),
            ],
            'productFeedSettings' => [
                'breadcrumb1' => $this->module->l('Product feed', 'PsGoogleShoppingTranslations'),
                'breadcrumb2' => $this->module->l('Product feed settings', 'PsGoogleShoppingTranslations'),
                'steps' => [
                  'shippingSettings' => $this->module->l('Targeting & shipping', 'PsGoogleShoppingTranslations'),
                  'syncRules' => $this->module->l('Feed sync set-up', 'PsGoogleShoppingTranslations'),
                  'attributeMapping' => $this->module->l('Product attributes', 'PsGoogleShoppingTranslations'),
                  'categoryMapping' => $this->module->l('Category mapping', 'PsGoogleShoppingTranslations'),
                  'summary' => $this->module->l('Summary', 'PsGoogleShoppingTranslations'),
                  'exportFeed' => $this->module->l('Export feed!', 'PsGoogleShoppingTranslations'),
                ],
                'noticeDataStored' => $this->module->l('Settings are saved at each step, will be submitted only at the final step.', 'PsGoogleShoppingTranslations'),
                'shipping' => [
                    'targetCountries' => $this->module->l('Target countries', 'PsGoogleShoppingTranslations'),
                    'ifMultipleCountries' => $this->module->l('If you target multiple countries, each product price will be automatically converted to the correct currency in Google. However your store must have configured shipping and tax rates for each selected country. Please respect [country-specific shopping policies]({0})[:target="_blank"] and [local regulation]({1})[:target="_blank"]', 'PsGoogleShoppingTranslations'),
                    'productAvailaibleIn' => $this->module->l('My products are available in', 'PsGoogleShoppingTranslations'),
                    'placeholderSelect' => $this->module->l('Select the countries where your products are available', 'PsGoogleShoppingTranslations'),
                    'cantFindCountry' => $this->module->l('Can’t find a country? Only supported countries are listed. [See list of supported countries]({0})[:target="_blank"]', 'PsGoogleShoppingTranslations'),
                    'shippingSettings' => $this->module->l('Shipping settings', 'PsGoogleShoppingTranslations'),
                    'autoImportShipping' => $this->module->l('Import automatically shipping settings', 'PsGoogleShoppingTranslations'),
                    'autoImportShippingDescription' => $this->module->l('PrestaShop will try to automatically import your shipping information from your store settings. However you may be asked to provide additional information if we are unable to sync them.', 'PsGoogleShoppingTranslations'),
                    'manualShipping' => $this->module->l('Set up manually shipping settings in Merchant Center', 'PsGoogleShoppingTranslations'),
                    'automatically' => $this->module->l('Automatically', 'PsGoogleShoppingTranslations'),
                    'manually' => $this->module->l('Manually', 'PsGoogleShoppingTranslations'),
                    'manualShippingDescription' => $this->module->l('You **need to** go to Merchant Center and enter your shipping information yourself. Your products won’t sync until you complete this step.', 'PsGoogleShoppingTranslations'),
                    'taxSettings' => $this->module->l('Tax settings', 'PsGoogleShoppingTranslations'),
                    'taxSettingsDescription' => $this->module->l('So that users understand the exact price that they’ll have to pay for a product, you must submit the taxes that you collect. Select how you want to set up tax settings.', 'PsGoogleShoppingTranslations'),
                    'autoImportTax' => $this->module->l('Automatically import tax settings', 'PsGoogleShoppingTranslations'),
                    'manualImportTax' => $this->module->l('Manually set up tax settings in Google Merchant Center', 'PsGoogleShoppingTranslations'),
                    'appliedOnlyForUsa' => $this->module->l('(applied only for the USA)', 'PsGoogleShoppingTranslations'),
                    'alertTaxes' => $this->module->l('You must submit the taxes that you collect, so that users understand the exact price that they’ll have to pay for your products.', 'PsGoogleShoppingTranslations'),
                ],
                'export' => [
                    'synchronizationSchedule' => $this->module->l('Export synchronization schedule', 'PsGoogleShoppingTranslations'),
                    'synchronizationTime' => $this->module->l('Sync time', 'PsGoogleShoppingTranslations'),
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
                    'prohibitedContentNotice' => $this->module->l('Please review the [prohibited content guidelines](//google.com)[:target="_blank"] to ensure that products in your feed don’t violate these policies.', 'PsGoogleShoppingTranslations'),
                    'frequency' => [
                        'daily' => $this->module->l('Daily', 'PsGoogleShoppingTranslations'),
                    ],
                    'teaser' => [
                        'title' => $this->module->l('Available in the next version', 'PsGoogleShoppingTranslations'),
                        'badge' => $this->module->l('Coming soon', 'PsGoogleShoppingTranslations'),
                        'syncScheduleCustomization' => $this->module->l('Customized sync schedule', 'PsGoogleShoppingTranslations'),
                        'exportOption' => $this->module->l('Export option', 'PsGoogleShoppingTranslations'),
                        'specificProductExclusion' => $this->module->l('Specific product exclusion', 'PsGoogleShoppingTranslations'),
                    ],
                ],
                'attributeMapping' => [
                    'intro' => $this->module->l('Products that are eligible for enhanced listings will appear in content-rich formats on the Shopping tab, which may boost traffic and drive sales.', 'PsGoogleShoppingTranslations'),
                    'learnAboutAttributeMapping' => $this->module->l('Learn more about product data attributes', 'PsGoogleShoppingTranslations'),
                    'introNotice' => $this->module->l('Describe your product data using attributes. Additionally to required minimum for standard free listing, you can add additional attributes required for enhanced listing. General rule is: the more attributes the better.', 'PsGoogleShoppingTranslations'),
                    'genericTitle' => $this->module->l('Generic', 'PsGoogleShoppingTranslations'),
                    'toDescribeProducts' => $this->module->l('Create title and description for my product attributes using:', 'PsGoogleShoppingTranslations'),
                    'googleAttribute' => $this->module->l('Google product attribute', 'PsGoogleShoppingTranslations'),
                    'prestashopAttribute' => $this->module->l('Your product value', 'PsGoogleShoppingTranslations'),
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
                    'footerNotice1' => $this->module->l('Attributes required for products for apparel items targeted to customers in Brazil, France, Germany, Japan, the UK, and the US.', 'PsGoogleShoppingTranslations'),
                    'footerNotice2' => $this->module->l('We encourage submitting as many applicable attributes as possible to ensure accurate and comprehensive data.', 'PsGoogleShoppingTranslations'),
                    'learnAboutShippingSettings' => $this->module->l('Learn more about shipping settings', 'PsGoogleShoppingTranslations'),
                    'learnHowToSetupShippingSettings' => $this->module->l('Learn how to set up shipping', 'PsGoogleShoppingTranslations'),
                    'learnRequirementsProductSpeficifacion' => $this->module->l('Learn more about product feed specification', 'PsGoogleShoppingTranslations'),
                    'weWillRecoverTheseAttributes' => $this->module->l('For your products we will recover these attributes:', 'PsGoogleShoppingTranslations'),
                ],
                'summary' => [
                    'title1' => $this->module->l('Next synchronisation', 'PsGoogleShoppingTranslations'),
                    'title2' => $this->module->l('Product feed summary', 'PsGoogleShoppingTranslations'),
                    'xItems' => $this->module->l('{0} items', 'PsGoogleShoppingTranslations'),
                    'productItems' => $this->module->l('Product items', 'PsGoogleShoppingTranslations'),
                    'tableHeader1' => $this->module->l('Google product <attribute></attribute>', 'PsGoogleShoppingTranslations'),
                    'tableHeader2' => $this->module->l('Your product value', 'PsGoogleShoppingTranslations'),
                    'totalProducts' => $this->module->l('Number of products', 'PsGoogleShoppingTranslations'),
                    'date' => $this->module->l('Date', 'PsGoogleShoppingTranslations'),
                    'time' => $this->module->l('Time', 'PsGoogleShoppingTranslations'),
                    'youSell' => $this->module->l('**You sell** {0}', 'PsGoogleShoppingTranslations'),
                    'dataSyncSetUp' => $this->module->l('Data sync set up', 'PsGoogleShoppingTranslations'),
                    'productAttributes' => $this->module->l('Product attributes', 'PsGoogleShoppingTranslations'),
                ],
            ],
            'freeListingCard' => [
                'title' => $this->module->l('Show your products with free listing ', 'PsGoogleShoppingTranslations'),
                'intro' => $this->module->l('Showcase your product for free in organically-ranked listing on Shopping tab.', 'PsGoogleShoppingTranslations'),
                'learnFreeListing' => $this->module->l('Learn more about free listing', 'PsGoogleShoppingTranslations'),
                'seeFreeListing' => $this->module->l('See my free listing in Merchant Center', 'PsGoogleShoppingTranslations'),
                'googleDelay' => $this->module->l('It takes 3-5 business days to review products', 'PsGoogleShoppingTranslations'),
                'alertActivationSuccess' => $this->module->l('You have successfully activated the free listing of your products for Google Shopping tab for free.', 'PsGoogleShoppingTranslations'),
                'alertEnableFreeListing' => $this->module->l('Enable free listing to display your products on Google Shopping tab for free.', 'PsGoogleShoppingTranslations'),
                'alertProductFeedDisabled' => $this->module->l('The synchronization of your product feed is disabled. Products are still visible on your free listing but they will not be updated anymore and they will disappear from your free listing after 30 days.', 'PsGoogleShoppingTranslations'),
                'alertEnableFreeListingAndProductFeed' => $this->module->l('Enable free listing to display your products on Google Shopping tab for free. This action will cause the reactivation of the product feed.', 'PsGoogleShoppingTranslations'),
            ],
            'googleAdsAccountCard' => [
                'title' => $this->module->l('Connect your Google Ads account', 'PsGoogleShoppingTranslations'),
                'intro' => $this->module->l('Launch an advertising campaign for your products and reach more users across four different Google networks.', 'PsGoogleShoppingTranslations'),
                'text' => $this->module->l('Once connected you may need to configure your billing settings in your Google Ads account.', 'PsGoogleShoppingTranslations'),
                'labelSelect' => $this->module->l('Connect an existing Google Ads account', 'PsGoogleShoppingTranslations'),
                'id' => $this->module->l('Google Ads account ID', 'PsGoogleShoppingTranslations'),
            ],
            'smartShoppingCampaignCard' => [
                'title' => $this->module->l('Reach more people with paid Smart Shopping campaign', 'PsGoogleShoppingTranslations'),
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
                  'alert' => $this->module->l('To solve the synchronization issue, go to Help tab or [contact the customer support service](//google.com)[:target="_blank"].', 'PsGoogleShoppingTranslations'),
                ],
                'productStatus' => [
                    'title' => $this->module->l('Product approval status', 'PsGoogleShoppingTranslations'),
                    'description' => $this->module->l('After submitting your product feed, your products will be reviewed and assigned one of 6 statuses', 'PsGoogleShoppingTranslations'),
                    'alert' => $this->module->l('It takes 3-5 business days to review products', 'PsGoogleShoppingTranslations'),
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
                'startConfiguring' => $this->module->l('Start configuring', 'PsGoogleShoppingTranslations'),
                'connect' => $this->module->l('Connect', 'PsGoogleShoppingTranslations'),
                'dissociate' => $this->module->l('Dissociate', 'PsGoogleShoppingTranslations'),
                'manageAccount' => $this->module->l('Manage account', 'PsGoogleShoppingTranslations'),
                'overwrite' => $this->module->l('Overwrite', 'PsGoogleShoppingTranslations'),
                'switchAccount' => $this->module->l('Switch account', 'PsGoogleShoppingTranslations'),
                'continue' => $this->module->l('Continue', 'PsGoogleShoppingTranslations'),
                'disabled' => $this->module->l('Disabled', 'PsGoogleShoppingTranslations'),
                'enabled' => $this->module->l('Enabled', 'PsGoogleShoppingTranslations'),
                'enableFreeListing' => $this->module->l('Enable free listing', 'PsGoogleShoppingTranslations'),
                'connectAccount' => $this->module->l('Connect account', 'PsGoogleShoppingTranslations'),
                'connectingAccount' => $this->module->l('Connecting account...', 'PsGoogleShoppingTranslations'),
                'chooseExistingAccount' => $this->module->l('Choose existing account', 'PsGoogleShoppingTranslations'),
                'createNewAccount' => $this->module->l('Create new account', 'PsGoogleShoppingTranslations'),
                'learnAboutAccountSuspension' => $this->module->l('Learn about account suspension', 'PsGoogleShoppingTranslations'),
                'learnAboutSiteClaiming' => $this->module->l('Learn about site claiming', 'PsGoogleShoppingTranslations'),
                'learnMoreAboutSmartShoppingCampaigns' => $this->module->l('Learn more about Smart Shopping campaigns', 'PsGoogleShoppingTranslations'),
                'configureAndExportProductFeed' => $this->module->l('Export feed', 'PsGoogleShoppingTranslations'),
                'chooseAccount' => $this->module->l('Choose your account', 'PsGoogleShoppingTranslations'),
                'supportedCountries' => $this->module->l('Supported countries', 'PsGoogleShoppingTranslations'),
                'cancel' => $this->module->l('Cancel', 'PsGoogleShoppingTranslations'),
                'disconnectAccount' => $this->module->l('Disconnect account', 'PsGoogleShoppingTranslations'),
                'back' => $this->module->l('Back', 'PsGoogleShoppingTranslations'),
                'selectAccount' => $this->module->l('Select account', 'PsGoogleShoppingTranslations'),
                'createNewGoogleAdsAccount' => $this->module->l('Create new Google Ads account', 'PsGoogleShoppingTranslations'),
                'addMapping' => $this->module->l('Add mapping', 'PsGoogleShoppingTranslations'),
                'modifyMapping' => $this->module->l('Modify mapping', 'PsGoogleShoppingTranslations'),
                'learnAboutProductConfiguration' => $this->module->l('Learn more about product data specification', 'PsGoogleShoppingTranslations'),
                'overwriteProductFeed' => $this->module->l('Overwrite product feed', 'PsGoogleShoppingTranslations'),
                'trackProductStatus' => $this->module->l('Track Product approval status', 'PsGoogleShoppingTranslations'),
                'whyDidntWork' => $this->module->l('Check out why it didn’t work', 'PsGoogleShoppingTranslations'),
                'aboutProductCategory' => $this->module->l('About Google product category', 'PsGoogleShoppingTranslations'),
                'editCountries' => $this->module->l('Edit countries', 'PsGoogleShoppingTranslations'),
                'editSettings' => $this->module->l('Edit settings', 'PsGoogleShoppingTranslations'),
                'editRules' => $this->module->l('Edit rules', 'PsGoogleShoppingTranslations'),
                'editProductAttributes' => $this->module->l('Edit product attributes', 'PsGoogleShoppingTranslations'),
                'forceSync' => $this->module->l('Force sync', 'PsGoogleShoppingTranslations'),
                'saveAndContinue' => $this->module->l('Save and continue', 'PsGoogleShoppingTranslations'),
                'yes' => $this->module->l('Yes', 'PsGoogleShoppingTranslations'),
                'no' => $this->module->l('No', 'PsGoogleShoppingTranslations'),
                'disableFreeListing' => $this->module->l('Disable free listing', 'PsGoogleShoppingTranslations'),
                'disableProductFeed' => $this->module->l('Disable product feed', 'PsGoogleShoppingTranslations'),
                'enableFreeListingAndProductFeed' => $this->module->l('Enable free listing and product feed', 'PsGoogleShoppingTranslations'),
                'checkRequirements' => $this->module->l('Check requirements', 'PsGoogleShoppingTranslations'),
                'storeMeetsRequirements' => $this->module->l('My store meets all requirements', 'PsGoogleShoppingTranslations'),
                'createAccount' => $this->module->l('Create account', 'PsGoogleShoppingTranslations'),
                'saveChange' => $this->module->l('Save change', 'PsGoogleShoppingTranslations'),
                'close' => $this->module->l('Close', 'PsGoogleShoppingTranslations'),
                'viewDetailedStatuses' => $this->module->l('View all detailed statuses', 'PsGoogleShoppingTranslations'),
                'setupTax' => $this->module->l('Set up taxes', 'PsGoogleShoppingTranslations'),
                'understandAndContinue' => $this->module->l('Understand and continue', 'PsGoogleShoppingTranslations'),
                'reviewProblems' => $this->module->l('Review problems', 'PsGoogleShoppingTranslations'),
                'saveAndExport' => $this->module->l('Save and export', 'PsGoogleShoppingTranslations'),
                'go' => $this->module->l('Go', 'PsGoogleShoppingTranslations'),
                'continueWithoutSave' => $this->module->l('Continue without save', 'PsGoogleShoppingTranslations'),
                'save' => $this->module->l('Save', 'PsGoogleShoppingTranslations'),
                'disconnect' => $this->module->l('Disconnect', 'PsGoogleShoppingTranslations'),
                'export' => $this->module->l('Export', 'PsGoogleShoppingTranslations'),
                'learnAboutFreeListing' => $this->module->l('Lean more about free listing', 'PsGoogleShoppingTranslations'),
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
                'suspended' => $this->module->l('Suspended', 'PsGoogleShoppingTranslations'),
            ],
            'modal' => [
                'titleDisconnectionMerchantCenter' => $this->module->l('Disconnect your Merchant Center?', 'PsGoogleShoppingTranslations'),
                'titleDisconnection' => $this->module->l('Confirm disconnection?', 'PsGoogleShoppingTranslations'),
                'titleoverwrite' => $this->module->l('Overwrite existing claim?', 'PsGoogleShoppingTranslations'),
                'textDisconnectGoogleAccount' => $this->module->l('You are about to disconnect Google account. This will remove access to Google, Google Merchant Center and Google Ads accounts.', 'PsGoogleShoppingTranslations'),
                'textDisconnectMCA' => $this->module->l('Disconnecting your Merchant Center will remove access to your Google Ads in this module and pause any running campaign. ', 'PsGoogleShoppingTranslations'),
                'textoverwrite' => $this->module->l('Overwriting existing claim will deactivate your previous account and pause existing campaigns tied to that account- free listings and Shopping campaigns.  /nIf you are running a different Shopping campaign, we recommend pausing it.', 'PsGoogleShoppingTranslations'),
                'titleDisableFreeListing' => $this->module->l('Disable free listing?', 'PsGoogleShoppingTranslations'),
                'textDisableFreeListing' => $this->module->l("By this action, your products will no longer be advertised on Google Shopping and your running campaigns will be paused.  \n  Your catalog export will be still running.", 'PsGoogleShoppingTranslations'),
                'titleDisableProductFeed' => $this->module->l('Disable product feed?', 'PsGoogleShoppingTranslations'),
                'textDisableProductFeed' => $this->module->l("Products will continue to show on Free Listings until the product feed has expired after 30 days.  \n  Smart shopping campaigns will remain active as long as there are still active products in the merchant center - you will need to pause your campaigns.", 'PsGoogleShoppingTranslations'),
                'titleEnableFreeListing' => $this->module->l('Enable free listing?', 'PsGoogleShoppingTranslations'),
                'textEnableFreeListing' => $this->module->l('This action will also cause the reactivation of the product feed.', 'PsGoogleShoppingTranslations'),
                'titleCancelWithoutSaving' => $this->module->l('Cancel without saving?', 'PsGoogleShoppingTranslations'),
                'textCancelProductFeed' => $this->module->l('You will lose all unsaved changes if you Continue. To successully submit your product data to Google, you need to complete all steps.', 'PsGoogleShoppingTranslations'),
                'titleQuitWithoutSaving' => $this->module->l('Quit without saving?', 'PsGoogleShoppingTranslations'),
                'titleOverwriteProductFeed' => $this->module->l('Overwrite existing product feed?', 'PsGoogleShoppingTranslations'),
                'textOverwriteProductFeed' => $this->module->l('Overwriting your existing product feed will delete it. You will need to configure new product feed.', 'PsGoogleShoppingTranslations'),
            ],
            'tooltip' => [
                'googleAccountRequired' => $this->module->l('Requires Google account configuration', 'PsGoogleShoppingTranslations'),
                'merchantCenterAccountRequired' => $this->module->l('Requires Merchant Center account configuration', 'PsGoogleShoppingTranslations'),
                'productFeedRequired' => $this->module->l('Requires product feed configuration', 'PsGoogleShoppingTranslations'),
                'googleAdsAccountRequired' => $this->module->l('Requires Google Ads account configured', 'PsGoogleShoppingTranslations'),
                'mustCheckAllRequirements' => $this->module->l('You must check all requirements.', 'PsGoogleShoppingTranslations'),
                'mustAgreeGoogleTerms' => $this->module->l('You must agree to the Google terms and conditions', 'PsGoogleShoppingTranslations'),
                'approvalStatusStatus' => $this->module->l('placeholder', 'PsGoogleShoppingTranslations'),
                'approvalStatusLang' => $this->module->l('placeholder', 'PsGoogleShoppingTranslations'),
                'approvalStatusIssues' => $this->module->l('placeholder', 'PsGoogleShoppingTranslations'),
                'attributeMapping' => [
                    'description' => $this->module->l('All product details relevant to your customers', 'PsGoogleShoppingTranslations'),
                    'condition' => $this->module->l('The condition of your product at time of sale (new, refurbished, used)', 'PsGoogleShoppingTranslations'),
                    'color' => $this->module->l('Your product\'s color', 'PsGoogleShoppingTranslations'),
                    'size' => $this->module->l('Your product\'s size', 'PsGoogleShoppingTranslations'),
                    'ageGroup' => $this->module->l('The demographic for which your product is intended', 'PsGoogleShoppingTranslations'),
                    'gender' => $this->module->l('The gender for which your product is intended', 'PsGoogleShoppingTranslations'),
                ],
            ],
            'toast' => [
                'googleAccountConnectedOnceSuccess' => $this->module->l('You have connected your Google account!', 'PsGoogleShoppingTranslations'),
                'MCAConnectedOnceSuccess' => $this->module->l('You have connected your Merchant Center account!', 'PsGoogleShoppingTranslations'),
                'attributesMapppingSuccess' => $this->module->l('Your product attributes have been successfully saved. Review summary then click "Export" to submit them to Google', 'PsGoogleShoppingTranslations'),
            ],
            'stepper' => [
                'nextStep' => $this->module->l('Next: {0}', 'PsGoogleShoppingTranslations'),
                'lastStep' => $this->module->l('Last step', 'PsGoogleShoppingTranslations'),
            ],
        ];

        return $translations;
    }
}
