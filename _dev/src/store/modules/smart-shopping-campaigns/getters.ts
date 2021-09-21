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

import {
  Kpis,
  OrderByType,
  State as LocalState,
} from './state';
import GettersTypes from './getters-types';
import ReportingPeriod from '@/enums/reporting/ReportingPeriod';
import KpiType from '@/enums/reporting/KpiType';

export default {
  [GettersTypes.GET_REMARKETING_TRACKING_TAG_IS_SET](
    state: LocalState,
  ): boolean {
    return state.tracking !== null && state.tracking;
  },

  // request getters
  [GettersTypes.GET_REPORTING_PERIOD_SELECTED](
    state: LocalState,
  ): ReportingPeriod {
    return state.reporting.request.dateRange.periodSelected;
  },
  [GettersTypes.GET_REPORTING_DAILY_RESULT_TYPE](
    state: LocalState,
  ): KpiType {
    return state.reporting.request.dailyResultType;
  },
  [GettersTypes.GET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING](
    state: LocalState,
  ): OrderByType {
    return state.reporting.request.ordering.campaignsPerformances.order;
  },
  [GettersTypes.GET_REPORTING_PRODUCTS_PERFORMANCES_ORDERING](
    state: LocalState,
  ): OrderByType {
    return state.reporting.request.ordering.productsPerformances.order;
  },
  [GettersTypes.GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES_ORDERING](
    state: LocalState,
  ): OrderByType {
    return state.reporting.request.ordering.productsDimensionsPerformances.order;
  },

  // result getters
  [GettersTypes.GET_REPORTING_KPIS](
    state: LocalState,
  ): Kpis {
    return state.reporting.results.kpis;
  },
  [GettersTypes.GET_REPORTING_DAILY_RESULT](
    state: LocalState,
  ): Kpis[] {
    return state.reporting.results.dailyResultChart.dailyResultList;
  },
};
