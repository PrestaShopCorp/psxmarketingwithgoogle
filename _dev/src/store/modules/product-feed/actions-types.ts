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

enum ActionsTypes {
  GET_VALIDATION_LIST = 'GET_VALIDATION_LIST',
  GET_SUMMARY_VALIDATION = 'GET_SUMMARY_VALIDATION',
  SEND_FREE_LISTING_STATEMENT = 'SEND_FREE_LISTING_STATEMENT',
  GET_LAST_SYNCHRONISATION = 'GET_LAST_SYNCHRONISATION',
  REGISTER_SYNCHRONISATION = 'REGISTER_SYNCHRONISATION',
  TOGGLE_SYNCHRONIZATION = 'TOGGLE_SYNCHRONIZATION',
  /** PRODUCT FEED SETTINGS CARD */
  GET_PRODUCT_FEED_SETTINGS = 'GET_PRODUCT_FEED_SETTINGS',
  SEND_PRODUCT_FEED_SETTINGS = 'SEND_PRODUCT_FEED_SETTINGS',
  GET_SHIPPING_SETTINGS = 'GET_SHIPPING_SETTINGS',
}

export {ActionsTypes as default};
