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
    public const CONNECTION_TABLE = 'psxmarketingwithgoogle_connection';
    public const OAUTH_STATE_TABLE = 'psxmarketingwithgoogle_oauth_state';
    public const SYNC_JOB_TABLE = 'psxmarketingwithgoogle_sync_job';
    public const SYNC_ITEM_TABLE = 'psxmarketingwithgoogle_sync_item';
    public const HOOK_LIST = [
        'displayBackOfficeHeader',
        'displayHeader',
        'displayOrderConfirmation',
        'displayTop',
        'actionCartUpdateQuantityBefore',
        'moduleRoutes',
    ];

    public const CONFIGURATION_LIST = [];

    public const MODULE_ADMIN_CONTROLLERS = [
        'AdminAjaxPsxMktgWithGoogle',
        'AdminPsxMktgWithGoogleModule',
        'AdminTinyLuxGoogleApi',
    ];

    public const PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META = 'PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META';
    public const PSX_MKTG_WITH_GOOGLE_WEBSITE_REQUIREMENTS_STATUS = 'PSX_MKTG_WITH_GOOGLE_WEBSITE_REQUIREMENTS_STATUS';

    public const PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS = 'PSX_MKTG_WITH_GOOGLE_REMARKETING_STATUS';
    public const PSX_MKTG_WITH_GOOGLE_REMARKETING_ENHANCED_STATUS = 'PSX_MKTG_WITH_GOOGLE_REMARKETING_ENHANCED_STATUS';
    public const PSX_MKTG_WITH_GOOGLE_REMARKETING_TAG = 'PSX_MKTG_WITH_GOOGLE_REMARKETING_TAG';
    public const PSX_MKTG_WITH_GOOGLE_REMARKETING_CONVERSION_LABELS = 'PSX_MKTG_WITH_GOOGLE_REMARKETING_CONVERSION_LABELS';

    public const REMARKETING_CONVERSION_LABEL_PURCHASE = 'PURCHASE';
    public const REMARKETING_CONVERSION_LABEL_ADD_TO_CART = 'ADD_TO_CART';
    public const REMARKETING_CONVERSION_LABEL_PAGE_VIEW = 'PAGE_VIEW';
    public const REMARKETING_CONVERSION_LABELS = [
        self::REMARKETING_CONVERSION_LABEL_PURCHASE,
        self::REMARKETING_CONVERSION_LABEL_ADD_TO_CART,
        self::REMARKETING_CONVERSION_LABEL_PAGE_VIEW,
    ];

    public const REMARKETING_CONVERSION_MERCHANT_GMC_ID = 'REMARKETING_CONVERSION_MERCHANT_GMC_ID';
}
