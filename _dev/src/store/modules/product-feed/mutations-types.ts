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
    SET_VALIDATION_LIST_STATEMENT = 'SET_VALIDATION_LIST_STATEMENT',
    SET_SUMMARY_VALIDATION = 'SET_SUMMARY_VALIDATION',
    SET_FREE_LISTING_STATUS = 'SET_FREE_LISTING_STATUS',
    SET_LAST_SYNCHRONISATION = 'SET_LAST_SYNCHRONISATION',
    SET_REGISTERED_DATA_SYNC = 'SET_REGISTERED_DATA_SYNC',
    SET_SUSPENDED_DATA_SYNC = 'SET_SUSPENDED_DATA_SYNC',
    /** PRODUCT FEED SETTINGS CARD */
    SET_SELECTED_SHIPPING_SETTINGS = 'SET_SELECTED_SHIPPING_SETTINGS',
    UPDATE_STEPPER = 'UPDATE_STEPPER',
}

export {MutationsTypes as default};
