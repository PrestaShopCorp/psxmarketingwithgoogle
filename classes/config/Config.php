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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Config;

class Config
{
    const PSX_MKTG_WITH_GOOGLE_API_URL = 'https://googleshopping-api.psessentials.net';

    const HOOK_LIST = [
        'displayBackOfficeHeader',
        'displayHeader',
        'displayOrderConfirmation',
        'displayTop',
        'actionCartUpdateQuantityBefore',
    ];

    const CONFIGURATION_LIST = [];

    const MODULE_ADMIN_CONTROLLERS = [
        'AdminAjaxPsgoogleshipping',
        'AdminPsgoogleshippingModule',
    ];

    const PSX_MKTG_WITH_GOOGLE_SENTRY_CREDENTIALS = 'https://446479f8bca645fa8838c1a5f99dceba@o298402.ingest.sentry.io/5949536';
    const PSX_MKTG_WITH_GOOGLE_SEGMENT_API_KEY = 'RqYiLJKyoWv13t9aKxBvza6vsCsRpPpC';

    const PSX_MKTG_WITH_GOOGLE_ACCOUNT_IS_LINKED = 'PSX_MKTG_WITH_GOOGLE_ACCOUNT_IS_LINKED';
    const PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META = 'PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META';
    const PSX_MKTG_WITH_GOOGLE_WEBSITE_REQUIREMENTS_STATUS = 'PSX_MKTG_WITH_GOOGLE_WEBSITE_REQUIREMENTS_STATUS';

    const PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS = 'PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS';
    const PSX_MKTG_WITH_GOOGLE_REMARKETING_TAG = 'PSX_MKTG_WITH_GOOGLE_REMARKETING_TAG';
    const PSX_MKTG_WITH_GOOGLE_REMARKETING_CONVERSION_LABELS = 'PSX_MKTG_WITH_GOOGLE_REMARKETING_CONVERSION_LABELS';
    const REMARKETING_CONVERSION_LABEL_PURCHASE = 'Purchase';    
    const REMARKETING_CONVERSION_LABEL_ADD_TO_CART = 'Add to basket';    
}
