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
  CampaignStatusToggle,
} from '@/enums/reporting/CampaignStatus';
import MutationsTypes from './mutations-types';
import {
  DailyresultChart,
  Kpis,
  State as LocalState,
  CampaignObject,
  ConversionAction,
  CampaignStatusPayload,
  Dimension,
  DailyResultTypes,
  CampaignListOrdering,
  CampaignPerformanceObject,
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

  // errors mutations
  [MutationsTypes.SET_REPORTING_KPIS_ERROR](
    state: LocalState,
    payload: boolean,
  ) {
    state.reporting.errorsList.kpis = payload;
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
  [MutationsTypes.RESET_CAMPAIGNS_LIST](state: LocalState) {
    state.campaigns.results.campaigns = [];
  },
  [MutationsTypes.SET_CAMPAIGNS_LIST_ORDERING](
    state: LocalState,
    payload: CampaignListOrdering,
  ) {
    state.campaigns.request.ordering = payload;
  },
  [MutationsTypes.SET_CAMPAIGNS_LIST_ACTIVE_PAGE](
    state: LocalState,
    payload: number,
  ) {
    state.campaigns.request.activePage = payload;
  },
  [MutationsTypes.SET_CAMPAIGNS_LIST_PAGE_SIZE](
    state: LocalState,
    payload: number,
  ) {
    state.campaigns.request.numberOfCampaignsPerPage = payload;
  },
  [MutationsTypes.SET_CAMPAIGNS_LIST_TOTAL](
    state: LocalState,
    payload: number,
  ) {
    state.campaigns.results.totalCount = payload;
  },
  [MutationsTypes.SET_CAMPAIGNS_LIST_ERROR](
    state: LocalState,
    payload: boolean,
  ) {
    state.campaigns.results.error = payload;
  },
  [MutationsTypes.SAVE_NEW_CAMPAIGN](state: LocalState, payload: CampaignObject) {
    state.campaigns.results.campaigns.push(payload);
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
      campaigns: CampaignPerformanceObject[],
    },
  ) {
    state.campaigns.results.campaigns = payload.campaigns;
  },
  [MutationsTypes.UPDATE_CAMPAIGN_STATUS](
    state: LocalState,
    payload: CampaignStatusPayload,
  ) {
    const campaign = state.campaigns.results.campaigns.find((el) => el.id === payload.id);

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

    const findCampaign = state.campaigns.results.campaigns.findIndex(
      (el) => el.id === payload.id,
    );
    state.campaigns.results.campaigns.splice(findCampaign, 1, payload);
  },
};
