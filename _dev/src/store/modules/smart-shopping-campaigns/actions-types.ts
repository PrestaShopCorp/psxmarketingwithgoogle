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
  SAVE_NEW_SSC = 'SAVE_NEW_SSC',
  SAVE_STATUS_REMARKETING_TRACKING_TAG = 'SAVE_STATUS_REMARKETING_TRACKING_TAG',
  GET_REMARKETING_TRACKING_TAG_STATUS_MODULE = 'GET_REMARKETING_TRACKING_TAG_STATUS_MODULE',
  GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED = 'GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED',
  UPDATE_ALL_REPORTING_DATA = 'UPDATE_ALL_REPORTING_DATA',
  CHANGE_REPORTING_DATES = 'CHANGE_REPORTING_DATES',
  GET_REMARKETING_TRACKING_TAG_STATUS_IF_ALREADY_EXISTS = 'GET_REMARKETING_TRACKING_TAG_STATUS_IF_ALREADY_EXISTS',
  GET_REPORTING_KPIS = 'GET_REPORTING_KPIS',
  GET_REPORTING_DAILY_RESULTS = 'GET_REPORTING_DAILY_RESULTS',
  GET_REPORTING_CAMPAIGNS_PERFORMANCES = 'GET_REPORTING_CAMPAIGNS_PERFORMANCES',
  GET_REPORTING_PRODUCTS_PERFORMANCES = 'GET_REPORTING_PRODUCTS_PERFORMANCES',
  GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES = 'GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES',
  CHECK_CAMPAIGN_NAME_ALREADY_EXISTS = 'CHECK_CAMPAIGN_NAME_ALREADY_EXISTS',
  GET_SSC_LIST = 'GET_SSC_LIST',
}

export {ActionsTypes as default};
