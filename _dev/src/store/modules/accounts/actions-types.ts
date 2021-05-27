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
  TRIGGER_ONBOARD_TO_GOOGLE_ACCOUNT = 'TRIGGER_ONBOARD_TO_GOOGLE_ACCOUNT',
  SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT = 'SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT',
  SAVE_GOOGLE_CONNECTION_ONCE = 'SAVE_GOOGLE_CONNECTION_ONCE',
  TOGGLE_GOOGLE_ACCOUNT_IS_REGISTERED = 'TOGGLE_GOOGLE_ACCOUNT_IS_REGISTERED',
  REQUEST_ROUTE_TO_GOOGLE_AUTH = 'REQUEST_ROUTE_TO_GOOGLE_AUTH',
  REQUEST_GOOGLE_ACCOUNT_DETAILS = 'REQUEST_GOOGLE_ACCOUNT_DETAILS',
  REQUEST_GMC_DETAILS = 'REQUEST_GMC_DETAILS',
  REQUEST_GMC_LIST = 'REQUEST_GMC_LIST',
  DISSOCIATE_GOOGLE_ACCOUNT = 'DISSOCIATE_GOOGLE_ACCOUNT',
  DISSOCIATE_GMC = 'DISSOCIATE_GMC',
  TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS = 'TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS',
  /** Merchant Center Account - Website verification */
  TRIGGER_WEBSITE_VERIFICATION_PROCESS = 'TRIGGER_WEBSITE_VERIFICATION_PROCESS',
  /** Merchant Center Account - Website claiming */
  TRIGGER_WEBSITE_CLAIMING_PROCESS = 'TRIGGER_WEBSITE_CLAIMING_PROCESS',
  REQUEST_SITE_VERIFICATION_TOKEN = 'REQUEST_SITE_VERIFICATION_TOKEN',
  SAVE_WEBSITE_VERIFICATION_META = 'SAVE_WEBSITE_VERIFICATION_META',
  REQUEST_GOOGLE_TO_VERIFY_WEBSITE = 'REQUEST_GOOGLE_TO_VERIFY_WEBSITE',
  /** */
  REQUEST_WEBSITE_CLAIMING_STATUS = 'REQUEST_WEBSITE_CLAIMING_STATUS',
  REQUEST_TO_OVERRIDE_CLAIM = 'REQUEST_TO_OVERRIDE_CLAIM',
  SAVE_MCA_CONNECTION_ONCE = 'SAVE_MCA_CONNECTION_ONCE',
}

export {ActionsTypes as default};
