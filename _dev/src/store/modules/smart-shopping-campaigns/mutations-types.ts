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
    TOGGLE_STATUS_REMARKETING_TRACKING_TAG = 'TOGGLE_STATUS_REMARKETING_TRACKING_TAG',

    // request mutations
    SET_REPORTING_PERIOD_SELECTED = 'SET_REPORTING_PERIOD_SELECTED',
    SET_REPORTING_DATES = 'SET_REPORTING_DATES',
    SET_REPORTING_DAILY_RESULTS_TYPE = 'SET_REPORTING_DAILY_RESULTS_TYPE',
    SET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING = 'SET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING',

    // result mutations
    SET_REPORTING_KPIS = 'SET_REPORTING_KPIS',
    SET_REPORTING_DAILY_RESULTS = 'SET_REPORTING_DAILY_RESULTS',
    SET_REPORTING_CAMPAIGNS_PERFORMANCES = 'SET_REPORTING_CAMPAIGNS_PERFORMANCES',
    SET_REPORTING_PRODUCTS_PERFORMANCES = 'SET_REPORTING_PRODUCTS_PERFORMANCES',
    SET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES = 'SET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES',
    SET_REPORTING_METRICS_CAMPAIGNS_PERFORMANCES = 'SET_REPORTING_METRICS_CAMPAIGNS_PERFORMANCES',
    SET_REPORTING_METRICS_PRODUCTS_PERFORMANCES = 'SET_REPORTING_METRICS_PRODUCTS_PERFORMANCES',
    SET_REPORTING_METRICS_PRODUCTS_PARTITIONS_PERFORMANCES = 'SET_REPORTING_METRICS_PRODUCTS_PARTITIONS_PERFORMANCES',
    SET_ERROR_CAMPAIGN_NAME_EXISTS = 'SET_ERROR_CAMPAIGN_NAME_EXISTS',
    SAVE_NEW_SSC = 'SAVE_NEW_SSC',
}

export {MutationsTypes as default};
