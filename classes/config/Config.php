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
    ];

    const CONFIGURATION_LIST = [];

    const MODULE_ADMIN_CONTROLLERS = [
        'AdminAjaxPsgoogleshipping',
        'AdminPsgoogleshippingModule',
    ];

    const PSX_MKTG_WITH_GOOGLE_SENTRY_CREDENTIALS = 'https://205f0aa236aa46b8883ac8ded58f4839@o471790.ingest.sentry.io/5532403';
    const PSX_MKTG_WITH_GOOGLE_SEGMENT_API_KEY = 'RqYiLJKyoWv13t9aKxBvza6vsCsRpPpC';

    const PSX_MKTG_WITH_GOOGLE_ACCOUNT_IS_LINKED = 'PSX_MKTG_WITH_GOOGLE_ACCOUNT_IS_LINKED';
    const PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META = 'PSX_MKTG_WITH_GOOGLE_WEBSITE_VERIFICATION_META';
    const PSX_MKTG_WITH_GOOGLE_WEBSITE_REQUIREMENTS_STATUS = 'PSX_MKTG_WITH_GOOGLE_WEBSITE_REQUIREMENTS_STATUS';
}
