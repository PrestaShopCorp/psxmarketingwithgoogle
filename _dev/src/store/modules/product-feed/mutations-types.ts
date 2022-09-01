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
    REMOVE_PRODUCT_FEED = 'REMOVE_PRODUCT_FEED',
    SAVE_CONFIGURATION_CONNECTED_ONCE = 'SAVE_CONFIGURATION_CONNECTED_ONCE',
    SET_ACTIVE_CONFIGURATION_STEP = 'SET_ACTIVE_CONFIGURATION_STEP',
    TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_SELL_APPAREL =
    'TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_SELL_APPAREL',
    TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_REFURBISHED =
    'TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_REFURBISHED',
    SAVE_AUTO_IMPORT_SHIPPING_INFORMATIONS = 'SAVE_AUTO_IMPORT_SHIPPING_INFORMATIONS',
    SAVE_SHIPPING_SETTINGS = 'SAVE_SHIPPING_SETTINGS',
    SET_VALIDATION_SUMMARY = 'SET_VALIDATION_SUMMARY',
    SAVE_TOTAL_PRODUCTS_READY_TO_SYNC = 'SAVE_TOTAL_PRODUCTS_READY_TO_SYNC',
    SET_SYNC_SUMMARY_LOADING = 'SET_SYNC_SUMMARY_LOADING',
    API_ERROR = 'API_ERROR',
    SAVE_ALL_PRODUCTS = 'SAVE_ALL_PRODUCTS',
    SAVE_ATTRIBUTES_SHOP = 'SAVE_ATTRIBUTES_SHOP',
    SET_ATTRIBUTE_MAPPING_SELECTION = 'SET_ATTRIBUTE_MAPPING_SELECTION',
    SET_ATTRIBUTES_MAPPED = 'SAVE_ATTRIBUTES_MAPPED',
    SET_MAPPING_FROM_STORAGE = 'SET_MAPPING_FROM_STORAGE',
    SET_SELECTED_PRODUCT_CATEGORIES = 'SET_SELECTED_PRODUCT_CATEGORIES',
    SET_SYNC_SCHEDULE = 'SET_SYNC_SCHEDULE',
    SET_PREVALIDATION_SUMMARY = 'SET_PREVALIDATION_SUMMARY',
    SET_PRESCAN_NEXT_PAGE = 'SET_PRESCAN_NEXT_PAGE',
    SET_PRESCAN_LIMIT_PAGE = 'SET_PRESCAN_LIMIT_PAGE',
    SET_PRESCAN_PRODUCTS = 'SET_PRESCAN_PRODUCTS',
    SET_PRESCAN_TOTAL_PRODUCT = 'SET_PRESCAN_TOTAL_PRODUCT',
    SET_PRESCAN_LANGUAGE_CHOSEN = 'SET_PRESCAN_LANGUAGE_CHOSEN',
    SAVE_ATTRIBUTE_MAPPING = 'SAVE_ATTRIBUTE_MAPPING',
    SET_SHIPPING_SETUP_SELECTED = 'SET_SHIPPING_SETUP_SELECTED',
}

export {MutationsTypes as default};
