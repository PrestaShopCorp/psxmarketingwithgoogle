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
  WARMUP_STORE = 'WARMUP_STORE',

  // Remarketing - Tag
  SAVE_STATUS_REMARKETING_TRACKING_TAG = 'SAVE_STATUS_REMARKETING_TRACKING_TAG',
  GET_REMARKETING_TRACKING_TAG_STATUS_MODULE = 'GET_REMARKETING_TRACKING_TAG_STATUS_MODULE',
  GET_REMARKETING_TRACKING_TAG_STATUS_IF_ALREADY_EXISTS = 'GET_REMARKETING_TRACKING_TAG_STATUS_IF_ALREADY_EXISTS',
  // Remarketing - Conversion Actions
  CREATE_REMARKETING_DEFAULT_CONVERSION_ACTIONS = 'CREATE_REMARKETING_DEFAULT_CONVERSION_ACTIONS',
  SAVE_REMARKETING_CONVERSION_ACTION_ON_SHOP = 'SAVE_REMARKETING_CONVERSION_ACTION_ON_SHOP',
  GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED = 'GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED',
  // Reporting - Controls
  UPDATE_ALL_REPORTING_DATA = 'UPDATE_ALL_REPORTING_DATA',
  SET_REPORTING_DATES_RANGE = 'SET_REPORTING_DATES_RANGE',
  CHANGE_REPORTING_DATES = 'CHANGE_REPORTING_DATES',
  ADD_REPORTING_DAILY_RESULTS_TYPE = 'ADD_REPORTING_DAILY_RESULTS_TYPE',
  REMOVE_REPORTING_DAILY_RESULTS_TYPE = 'REMOVE_REPORTING_DAILY_RESULTS_TYPE',
  // Reporting - Loading of data
  GET_REPORTING_KPIS = 'GET_REPORTING_KPIS',
  GET_REPORTING_DAILY_RESULTS = 'GET_REPORTING_DAILY_RESULTS',
  // Campaign management
  SAVE_NEW_CAMPAIGN = 'SAVE_NEW_CAMPAIGN',
  CHECK_CAMPAIGN_NAME_ALREADY_EXISTS = 'CHECK_CAMPAIGN_NAME_ALREADY_EXISTS',
  GET_CAMPAIGNS_LIST = 'GET_CAMPAIGNS_LIST',
  CHANGE_STATUS_OF_CAMPAIGN = 'CHANGE_STATUS_OF_CAMPAIGN',
  UPDATE_CAMPAIGN = 'UPDATE_CAMPAIGN',
  GET_DIMENSIONS_FILTERS = 'GET_DIMENSIONS_FILTERS',
  GET_RECOMMENDED_BUDGET = 'GET_RECOMMENDED_BUDGET',
}

export {ActionsTypes as default};
