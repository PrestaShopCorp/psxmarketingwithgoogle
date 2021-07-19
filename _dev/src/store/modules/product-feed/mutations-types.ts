/**
 * 2007-2021 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2021 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */

enum MutationsTypes {
    /** PRODUCT FEED SETTINGS CARD */
    SET_LAST_SYNCHRONISATION = 'SET_LAST_SYNCHRONISATION',
    SET_SELECTED_PRODUCT_FEED_SETTINGS = 'SET_SELECTED_PRODUCT_FEED_SETTINGS',
    SET_SELECTED_PRODUCT_FEED_STATUS = 'SET_SELECTED_PRODUCT_FEED_STATUS',
    TOGGLE_CONFIGURATION_FINISHED = 'TOGGLE_CONFIGURATION_FINISHED',
    SAVE_CONFIGURATION_CONNECTED_ONCE = 'SAVE_CONFIGURATION_CONNECTED_ONCE',
    SET_ACTIVE_CONFIGURATION_STEP = 'SET_ACTIVE_CONFIGURATION_STEP',
    TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_SELL_APPAREL =
    'TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_SELL_APPAREL',
    TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_REFURBISHED =
    'TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_REFURBISHED',
    SAVE_AUTO_IMPORT_SHIPPING_INFORMATIONS = 'SAVE_AUTO_IMPORT_SHIPPING_INFORMATIONS',
    SET_VALIDATION_SUMMARY = 'SET_VALIDATION_SUMMARY',
    SAVE_TOTAL_PRODUCTS = 'SAVE_TOTAL_PRODUCTS',
    API_ERROR = 'API_ERROR',

}

export {MutationsTypes as default};
