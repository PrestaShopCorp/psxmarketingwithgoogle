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

enum GettersTypes {
  GET_REPORTING_TAB_IS_ACTIVE = 'GET_REPORTING_TAB_IS_ACTIVE',
  GET_REMARKETING_TRACKING_TAG_IS_SET = 'GET_REMARKETING_TRACKING_TAG_IS_SET',
  GET_REMARKETING_TRACKING_TAG_ALREADY_EXIST_STATUS = 'GET_REMARKETING_TRACKING_TAG_ALREADY_EXIST_STATUS',
  GET_REMARKETING_TRACKING_TAG_STATUS = 'GET_REMARKETING_TRACKING_TAG_STATUS',
  GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED = 'GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED',
  GET_ERROR_CAMPAIGN_NAME = 'GET_ERROR_CAMPAIGN_NAME',
  GET_ALL_CAMPAIGNS = 'GET_ALL_CAMPAIGNS',
  GET_TOKEN_NEXT_PAGE_CAMPAIGN_LIST = 'GET_TOKEN_NEXT_PAGE_CAMPAIGN_LIST',
  GET_LIMIT_CAMPAIGN_PERFORMANCE_LIST = 'GET_LIMIT_CAMPAIGN_PERFORMANCE_LIST',
  GET_CAMPAIGNS_LIST_ORDERING = 'GET_CAMPAIGNS_LIST_ORDERING',
  GET_TOTAL_CAMPAIGNS_PERFORMANCES= 'GET_TOTAL_CAMPAIGNS_PERFORMANCES',
  GET_ACTIVE_PAGE_CAMPAIGNS_PERFORMANCES_TABLE= 'GET_ACTIVE_PAGE_CAMPAIGNS_PERFORMANCES_TABLE',
  GET_CAMPAIGN_FILTER_CHOSEN = 'GET_CAMPAIGN_FILTER_CHOSEN',

  // request getters
  GET_REPORTING_PERIOD_SELECTED = 'GET_REPORTING_PERIOD_SELECTED',
  GET_REPORTING_START_DATES = 'GET_REPORTING_START_DATES',
  GET_REPORTING_END_DATES = 'GET_REPORTING_END_DATES',
  GET_REPORTING_FORMATTED_START_DATES = 'GET_REPORTING_FORMATTED_START_DATES',
  GET_REPORTING_FORMATTED_END_DATES = 'GET_REPORTING_FORMATTED_END_DATES',
  GET_REPORTING_DAILY_RESULT_TYPE = 'GET_REPORTING_DAILY_RESULT_TYPE',
  GET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING = 'GET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING',
  GET_REPORTING_PRODUCTS_PERFORMANCES_ORDERING = 'GET_REPORTING_PRODUCTS_PERFORMANCES_ORDERING',
  GET_REPORTING_FILTERS_PERFORMANCES_ORDERING = 'GET_REPORTING_FILTERS_PERFORMANCES_ORDERING',
  GET_SSC_DIMENSIONS_AND_FILTERS = 'GET_SSC_DIMENSIONS_AND_FILTERS',

  // errors getters
  GET_REPORTING_KPIS_ERROR = 'GET_REPORTING_KPIS_ERROR',
  GET_REPORTING_CAMPAIGNS_PERFORMANCES_SECTION_ERROR = 'GET_REPORTING_CAMPAIGNS_PERFORMANCES_SECTION_ERROR',
  GET_REPORTING_PRODUCTS_PERFORMANCES_SECTION_ERROR= 'GET_REPORTING_PRODUCTS_PERFORMANCES_SECTION_ERROR',
  GET_REPORTING_FILTERS_PERFORMANCES_SECTION_ERROR = 'GET_REPORTING_FILTERS_PERFORMANCES_SECTION_ERROR',
  GET_ERROR_FETCHING_FILTERS_STATUS = 'GET_ERROR_FETCHING_FILTERS_STATUS',

  // result getters
  GET_REPORTING_KPIS = 'GET_REPORTING_KPIS',
  GET_REPORTING_DAILY_RESULT = 'GET_REPORTING_DAILY_RESULT',
  GET_REPORTING_CAMPAIGNS_PERFORMANCES_LIST = 'GET_REPORTING_CAMPAIGNS_PERFORMANCES_LIST',
  GET_REPORTING_CAMPAIGNS_PERFORMANCES_NEXT_PAGE_NUMBER = 'GET_REPORTING_CAMPAIGNS_PERFORMANCES_NEXT_PAGE_NUMBER',
  GET_REPORTING_PRODUCTS_PERFORMANCES = 'GET_REPORTING_PRODUCTS_PERFORMANCES',
  GET_REPORTING_FILTERS_PERFORMANCES = 'GET_REPORTING_FILTERS_PERFORMANCES',
}

export {GettersTypes as default};