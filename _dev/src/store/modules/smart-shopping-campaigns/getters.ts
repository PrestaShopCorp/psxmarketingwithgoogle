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

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
<<<<<<< HEAD
  CampaignPerformances,
=======
  CampaignObject,
>>>>>>> 2f7b3f73 (change of route + base 64)
  Kpis,
  State as LocalState,
} from './state';
import GettersTypes from './getters-types';
import KpiType from '@/enums/reporting/KpiType';
import ReportingPeriod from '@/enums/reporting/ReportingPeriod';

// locales for dates
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';
import 'dayjs/locale/nl';
import 'dayjs/locale/pt';
import 'dayjs/locale/pl';
import 'dayjs/locale/ru';

dayjs.extend(localizedFormat);

export default {
  [GettersTypes.GET_REMARKETING_TRACKING_TAG_IS_SET](
    state: LocalState,
  ): boolean {
    return state.tracking !== null && state.tracking;
  },
  [GettersTypes.GET_ERROR_CAMPAIGN_NAME](state: LocalState): boolean|null {
    return state.errorCampaignNameExists;
  },
  [GettersTypes.GET_ALL_SSC](state: LocalState): Array<CampaignObject> {
    return state.campaigns;
  },

  // request getters
  [GettersTypes.GET_REPORTING_PERIOD_SELECTED](
    state: LocalState,
  ): ReportingPeriod {
    return state.reporting.request.dateRange.periodSelected;
  },
  [GettersTypes.GET_REPORTING_START_DATES](
    state: LocalState,
  ): string {
    return state.reporting.request.dateRange.startDate;
  },
  [GettersTypes.GET_REPORTING_END_DATES](
    state: LocalState,
  ): string {
    return state.reporting.request.dateRange.endDate;
  },
  [GettersTypes.GET_REPORTING_FORMATTED_START_DATES](
    state: LocalState,
  ): string {
    return dayjs(state.reporting.request.dateRange.startDate).locale(window.i18nSettings.isoCode).format('L');
  },
  [GettersTypes.GET_REPORTING_FORMATTED_END_DATES](
    state: LocalState,
  ): string {
    return dayjs(state.reporting.request.dateRange.endDate).locale(window.i18nSettings.isoCode).format('L');
  },
  [GettersTypes.GET_REPORTING_DAILY_RESULT_TYPE](
    state: LocalState,
  ): KpiType {
    return state.reporting.request.dailyResultType;
  },
  [GettersTypes.GET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING](
    state: LocalState,
  ): Object {
    return state.reporting.request.ordering.campaignsPerformances;
  },
  [GettersTypes.GET_REPORTING_PRODUCTS_PERFORMANCES_ORDERING](
    state: LocalState,
  ): Object {
    return state.reporting.request.ordering.productsPerformances;
  },
  [GettersTypes.GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES_ORDERING](
    state: LocalState,
  ): Object {
    return state.reporting.request.ordering.productsDimensionsPerformances;
  },

  // result getters
  [GettersTypes.GET_REPORTING_KPIS](
    state: LocalState,
  ): Kpis {
    return state.reporting.results.kpis;
  },
  [GettersTypes.GET_REPORTING_CAMPAIGNS_PERFORMANCES](
    state: LocalState,
  ): Array<CampaignPerformances> {
    return state.reporting.results.campaignsPerformancesSection.campaignsPerformanceList;
  },
  [GettersTypes.GET_REPORTING_CAMPAIGNS_PERFORMANCES_NEXT_PAGE_TOKEN](
    state: LocalState,
  ): string {
    return state.reporting.results.campaignsPerformancesSection.nextPageToken;
  },
  [GettersTypes.GET_ERROR_CAMPAIGN_NAME](
    state: LocalState,
  ): boolean|null {
    return state.errorCampaignNameExists;
  },

};
