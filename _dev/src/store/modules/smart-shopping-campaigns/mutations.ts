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

import MutationsTypes from './mutations-types';
import {
  CampaignsPerformancesSection,
  DailyresultChart,
  Kpis,
  ProductsPartitionsPerformancesSection,
  ProductsPerformancesSection,
  State as LocalState,
} from './state';

export default {
  [MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG](state: LocalState, payload: boolean) {
    state.tracking = payload;
  },
  [MutationsTypes.SET_REPORTING_METRICS_KPIS](state: LocalState, payload: Kpis) {
    state.reporting.kpis = payload;
  },
  [MutationsTypes.SET_REPORTING_DAILY_RESULTS](state: LocalState, payload: DailyresultChart) {
    state.reporting.dailyResultChart = payload;
  },
  [MutationsTypes.SET_REPORTING_METRICS_CAMPAIGNS_PERFORMANCES](
    state: LocalState,
    payload: CampaignsPerformancesSection,
  ) {
    state.reporting.campaignsPerformancesSection = payload;
  },
  [MutationsTypes.SET_REPORTING_METRICS_PRODUCTS_PERFORMANCES](
    state: LocalState,
    payload: ProductsPerformancesSection,
  ) {
    state.reporting.productsPerformancesSection = payload;
  },
  [MutationsTypes.SET_REPORTING_METRICS_PRODUCTS_PARTITIONS_PERFORMANCES](
    state: LocalState,
    payload: ProductsPartitionsPerformancesSection,
  ) {
    state.reporting.productsPartitionsPerformancesSection = payload;
  },
};
