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

import KpiType from '@/enums/reporting/KpiType';
import ReportingPeriod from '@/enums/reporting/ReportingPeriod';
import CampaignStatus, {
  CampaignStatusToggle, CampaignTypes,
} from '@/enums/reporting/CampaignStatus';
import MutationsTypes from './mutations-types';
import {
  CampaignPerformances,
  DailyresultChart,
  Kpis,
  OrderByType,
  FiltersPerformancesSection,
  State as LocalState,
  CampaignObject,
  ProductsPerformancesSection,
  ConversionAction,
  CampaignStatusPayload,
  Dimension,
  DailyResultTypes,
  CampaignListOrdering,
} from './state';
import {
  addPropertiesToDimension, deepUpdateDimensionVisibilityFromTree,
} from '@/utils/SSCFilters';

export default {
  [MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG](
    state: LocalState,
    payload: boolean,
  ) {
    state.tracking = payload;
  },
  [MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG_ALREADY_EXIST](
    state: LocalState,
    payload: boolean,
  ) {
    state.tagAlreadyExists = payload;
  },
  [MutationsTypes.SET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED](
    state: LocalState,
    payload: ConversionAction[],
  ) {
    state.conversionActions = payload;
  },

  // request mutations
  [MutationsTypes.SET_REPORTING_PERIOD_SELECTED](
    state: LocalState,
    payload: ReportingPeriod,
  ) {
    state.reporting.request.dateRange.periodSelected = payload;
  },
  [MutationsTypes.SET_REPORTING_DATES](
    state: LocalState,
    payload: Record<string, string>,
  ) {
    state.reporting.request.dateRange = {
      ...state.reporting.request.dateRange,
      ...payload,
    };
  },

  [MutationsTypes.SET_REPORTING_DAILY_RESULTS_TYPES](
    state: LocalState,
    payload: DailyResultTypes,
  ) {
    state.reporting.request.dailyResultTypes = payload;
  },
  [MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING](
    state: LocalState,
    payload: OrderByType,
  ) {
    state.reporting.request.ordering.campaignsPerformances = payload;
  },
  [MutationsTypes.SET_REPORTING_PRODUCT_PERFORMANCES_ORDERING](
    state: LocalState,
    payload: OrderByType,
  ) {
    state.reporting.request.ordering.productsPerformances = payload;
  },
  [MutationsTypes.SET_REPORTING_PRODUCT_PARTITIONS_PERFORMANCES_ORDERING](
    state: LocalState,
    payload: OrderByType,
  ) {
    state.reporting.request.ordering.filtersPerformances = payload;
  },

  // errors mutations
  [MutationsTypes.SET_REPORTING_KPIS_ERROR](
    state: LocalState,
    payload: boolean,
  ) {
    state.reporting.errorsList.kpis = payload;
  },
  [MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_SECTION_ERROR](
    state: LocalState,
    payload: boolean,
  ) {
    state.reporting.errorsList.campaignsPerformancesSection = payload;
  },
  [MutationsTypes.SET_REPORTING_PRODUCTS_PERFORMANCES_SECTION_ERROR](
    state: LocalState,
    payload: boolean,
  ) {
    state.reporting.errorsList.productsPerformancesSection = payload;
  },
  [MutationsTypes.SET_REPORTING_FILTERS_PERFORMANCES_SECTION_ERROR](
    state: LocalState,
    payload: boolean,
  ) {
    state.reporting.errorsList.filtersPerformancesSection = payload;
  },
  [MutationsTypes.SET_FILTERS_CHOSEN](state: LocalState, payload) {
    state.filtersChosen = payload;
  },
  [MutationsTypes.SET_SSC_DIMENSIONS_AND_FILTERS](
    state: LocalState,
    payload: { list: Dimension[], error: boolean },
  ) {
    state.errorFetchingFilters = payload.error;
    if (state.sscAvailableFilters.length) {
      state.sscAvailableFilters = [];
    }
    Object.keys(payload.list).forEach((dimensionName) => {
      // Do not display a dimension with no filter inside
      if (!payload.list[dimensionName].length) {
        return;
      }
      const resp: Dimension = {
        id: dimensionName,
        name: dimensionName,
        checked: false,
        indeterminate: false,
        children: addPropertiesToDimension(payload.list[dimensionName]),
      };

      state.sscAvailableFilters.push(resp);
    });
  },
  [MutationsTypes.SET_DIMENSION_CHOSEN](state: LocalState, payload: Dimension) {
    state.dimensionChosen = payload;
  },
  [MutationsTypes.SET_DIMENSION_CHOSEN_CHILDREN](state: LocalState, payload: Dimension[]) {
    deepUpdateDimensionVisibilityFromTree(state.dimensionChosen, payload);
  },
  // result mutations
  [MutationsTypes.SET_REPORTING_KPIS](state: LocalState, payload: Kpis) {
    state.reporting.results.kpis = payload;
  },
  [MutationsTypes.SET_REPORTING_DAILY_RESULTS](
    state: LocalState,
    payload: DailyresultChart,
  ) {
    state.reporting.results.dailyResultChart = payload;
  },
  [MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_RESULTS](
    state: LocalState,
    payload: CampaignPerformances[],
  ) {
    state.reporting.results.campaignsPerformancesSection.campaignsPerformanceList.push(
      ...payload,
    );
  },
  [MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_RESULTS](
    state: LocalState,
    payload: CampaignPerformances[],
  ) {
    state.reporting.results.campaignsPerformancesSection.campaignsPerformanceList.push(
      ...payload,
    );
  },
  [MutationsTypes.RESET_REPORTING_CAMPAIGNS_PERFORMANCES](state: LocalState) {
    state.reporting.results.campaignsPerformancesSection.campaignsPerformanceList = [];
  },
  [MutationsTypes.RESET_CAMPAIGNS_LIST](state: LocalState) {
    state.campaigns.results.campaigns = [];
  },
  [MutationsTypes.SET_CAMPAIGNS_LIST_ORDERING](
    state: LocalState,
    payload: CampaignListOrdering,
  ) {
    state.campaigns.request.ordering = payload;
  },
  [MutationsTypes.SET_REPORTING_PRODUCTS_PERFORMANCES](
    state: LocalState,
    payload: ProductsPerformancesSection,
  ) {
    state.reporting.results.productsPerformancesSection = payload;
  },
  [MutationsTypes.SET_REPORTING_FILTERS_PERFORMANCES](
    state: LocalState,
    payload: FiltersPerformancesSection,
  ) {
    state.reporting.results.filtersPerformancesSection = payload;
  },
  [MutationsTypes.SAVE_NEW_CAMPAIGN](state: LocalState, payload: CampaignObject) {
    state.campaigns.push(payload);
  },
  [MutationsTypes.SET_ERROR_CAMPAIGN_NAME_EXISTS](
    state: LocalState,
    payload: boolean,
  ) {
    state.errorCampaignNameExists = payload;
  },
  [MutationsTypes.SAVE_CAMPAIGNS_TO_LIST](
    state: LocalState,
    payload: {
      campaigns: CampaignObject[],
    },
  ) {
    state.campaigns.push(...payload.campaigns);
  },
  [MutationsTypes.SET_TOTAL_CAMPAIGNS_PERFORMANCES_RESULTS](
    state: LocalState,
    payload: number,
  ) {
    state.reporting.results.campaignsPerformancesSection.totalCampaigns = payload;
  },
  [MutationsTypes.SAVE_ACTIVE_PAGE_CAMPAIGN_PERFORMANCE_LIST](
    state: LocalState,
    payload: number,
  ) {
    state.reporting.results.campaignsPerformancesSection.activePage = payload;
  },
  [MutationsTypes.SAVE_LIMIT_CAMPAIGN_PERFORMANCE_LIST](
    state: LocalState,
    payload: number,
  ) {
    state.reporting.results.campaignsPerformancesSection.limitCampaignPerformanceList = payload;
  },
  [MutationsTypes.UPDATE_CAMPAIGN_STATUS](
    state: LocalState,
    payload: CampaignStatusPayload,
  ) {
    const campaign = state.campaigns.find((el) => el.id === payload.id);

    if (campaign !== undefined) {
      campaign.status = payload.status === CampaignStatusToggle.ENABLED
        ? CampaignStatus.ELIGIBLE
        : CampaignStatus.PAUSED;
    }
  },
  [MutationsTypes.UPDATE_CAMPAIGN](state: LocalState, payload: CampaignObject) {
    const requestedStatus = payload.status;
    payload.status = requestedStatus === CampaignStatusToggle.ENABLED
      ? CampaignStatus.ELIGIBLE
      : CampaignStatus.PAUSED;

    const findCampaign = state.campaigns.findIndex(
      (el) => el.id === payload.id,
    );
    state.campaigns.splice(findCampaign, 1, payload);
  },
};
