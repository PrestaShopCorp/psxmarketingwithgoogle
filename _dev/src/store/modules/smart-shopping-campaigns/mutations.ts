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
import CampaignStatus, {CampaignStatusToggle} from '@/enums/reporting/CampaignStatus';
import MutationsTypes from './mutations-types';
import i18n from '../../../lib/i18n';
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
} from './state';
import {
  addPropertiesToDimension,
  filterUncheckedSegments,
} from '@/utils/SSCFilters';

export default {
  [MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG](state: LocalState, payload: boolean) {
    state.tracking = payload;
  },
  [MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG_ALREADY_EXIST](
    state: LocalState, payload: boolean,
  ) {
    state.tagAlreadyExists = payload;
  },
  [MutationsTypes.SET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED](
    state: LocalState, payload: ConversionAction[],
  ) {
    state.conversionActions = payload;
  },

  // request mutations
  [MutationsTypes.SET_REPORTING_PERIOD_SELECTED](state: LocalState, payload: ReportingPeriod) {
    state.reporting.request.dateRange.periodSelected = payload;
  },
  [MutationsTypes.SET_REPORTING_DATES](state: LocalState, payload: Record<string, string>) {
    state.reporting.request.dateRange = {...state.reporting.request.dateRange, ...payload};
  },

  [MutationsTypes.SET_REPORTING_DAILY_RESULTS_TYPE](state: LocalState, payload: KpiType) {
    state.reporting.request.dailyResultType = payload;
  },
  [MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING](
    state: LocalState, payload: OrderByType,
  ) {
    state.reporting.request.ordering.campaignsPerformances = payload;
  },
  [MutationsTypes.SET_REPORTING_PRODUCT_PERFORMANCES_ORDERING](
    state: LocalState, payload: OrderByType,
  ) {
    state.reporting.request.ordering.productsPerformances = payload;
  },
  [MutationsTypes.SET_REPORTING_PRODUCT_PARTITIONS_PERFORMANCES_ORDERING](
    state: LocalState, payload: OrderByType,
  ) {
    state.reporting.request.ordering.filtersPerformances = payload;
  },

  // errors mutations
  [MutationsTypes.SET_REPORTING_KPIS_ERROR](
    state: LocalState, payload: boolean,
  ) {
    state.reporting.errorsList.kpis = payload;
  },
  [MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_SECTION_ERROR](
    state: LocalState, payload: boolean,
  ) {
    state.reporting.errorsList.campaignsPerformancesSection = payload;
  },
  [MutationsTypes.SET_REPORTING_PRODUCTS_PERFORMANCES_SECTION_ERROR](
    state: LocalState, payload: boolean,
  ) {
    state.reporting.errorsList.productsPerformancesSection = payload;
  },
  [MutationsTypes.SET_REPORTING_FILTERS_PERFORMANCES_SECTION_ERROR](
    state: LocalState, payload: boolean,
  ) {
    state.reporting.errorsList.filtersPerformancesSection = payload;
  },
  [MutationsTypes.SET_FILTERS_CHOSEN](
    state: LocalState, payload,
  ) {
    state.filtersChosen = payload;
  },
  [MutationsTypes.SET_SSC_DIMENSIONS_AND_FILTERS](
    state: LocalState, payload,
  ) {
    if (state.sscAvailableFilters.length) {
      state.sscAvailableFilters = [];
    }
    Object.keys(payload.list).forEach((dimensionName) => {
      // Do not display a dimension with no filter inside
      if (!payload.list[dimensionName].length) {
        return;
      }
      const resp = {
        name: i18n.t(`smartShoppingCampaignCreation.${dimensionName}`),
        subtitle: i18n.t(`smartShoppingCampaignCreation.${dimensionName}SubTitle`),
        id: dimensionName,
        checked: false,
        indeterminate: false,
        children: addPropertiesToDimension(payload.list[dimensionName]),
      };
      state.sscAvailableFilters.push(resp);
    });
    const findDimension = state.sscAvailableFilters
      .findIndex((el) => el?.id === state.dimensionChosen?.id);
    if (findDimension !== -1) {
      const checkedFilters = state.dimensionChosen.children.filter((fil) => fil.checked === true);
      state.dimensionChosen.children = checkedFilters
        .concat(state.sscAvailableFilters[findDimension].children);

      //  remove duplicate in case API sent all filters and user has some checked
      state.dimensionChosen.children = state.dimensionChosen.children.reduce((acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        }
        return acc;
      }, []);
    }
  },
  [MutationsTypes.SET_DIMENSION_CHOSEN](state: LocalState, payload) {
    state.dimensionChosen = payload;
  },
  // result mutations
  [MutationsTypes.SET_REPORTING_KPIS](state: LocalState, payload: Kpis) {
    state.reporting.results.kpis = payload;
  },
  [MutationsTypes.SET_REPORTING_DAILY_RESULTS](state: LocalState, payload: DailyresultChart) {
    state.reporting.results.dailyResultChart = payload;
  },
  [MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_RESULTS](
    state: LocalState,
    payload: Array<CampaignPerformances>,
  ) {
    state.reporting.results.campaignsPerformancesSection.campaignsPerformanceList.push(...payload);
  },
  [MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_RESULTS](
    state: LocalState,
    payload: Array<CampaignPerformances>,
  ) {
    state.reporting.results.campaignsPerformancesSection.campaignsPerformanceList.push(...payload);
  },
  [MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_NEXT_PAGE_TOKEN](
    state: LocalState,
    payload: string|null,
  ) {
    state.reporting.results.campaignsPerformancesSection.nextPageToken = payload;
  },
  [MutationsTypes.RESET_REPORTING_CAMPAIGNS_PERFORMANCES](
    state: LocalState,
  ) {
    state.reporting.results.campaignsPerformancesSection.campaignsPerformanceList = [];
  },
  [MutationsTypes.RESET_SSC_LIST](
    state: LocalState,
  ) {
    state.campaigns = [];
  },
  [MutationsTypes.SET_SSC_LIST_ORDERING](
    state: LocalState,
    payload : OrderByType,
  ) {
    state.campaignsOrdering = payload;
  },
  [MutationsTypes.SET_REPORTING_PRODUCTS_PERFORMANCES](
    state: LocalState,
    payload: ProductsPerformancesSection,
  ) {
    state.reporting.results.productsPerformancesSection = payload;
  },
  [MutationsTypes.SET_REPORTING_FILTERS_PERFORMANCES](
    state: LocalState,
    payload:FiltersPerformancesSection,
  ) {
    state.reporting.results.filtersPerformancesSection = payload;
  },
  [MutationsTypes.SAVE_NEW_SSC](state: LocalState, payload: CampaignObject) {
    state.campaigns.push(payload);
  },
  [MutationsTypes.SET_ERROR_CAMPAIGN_NAME_EXISTS](state: LocalState, payload: boolean) {
    state.errorCampaignNameExists = payload;
  },
  [MutationsTypes.SAVE_SSC_LIST](state: LocalState, payload: Array<CampaignObject>) {
    state.campaigns.push(...payload);
  },
  [MutationsTypes.SAVE_NEXT_PAGE_TOKEN_CAMPAIGN_LIST](state: LocalState, payload: string) {
    state.tokenNextPageCampaignList = payload;
  },
  [MutationsTypes.UPDATE_SSC_STATUS](state: LocalState, payload: CampaignStatusPayload) {
    const getScc = state.campaigns.find((el) => el.id === payload.id);
    if (getScc !== undefined) {
      getScc.status = payload.status === CampaignStatusToggle.ENABLED
        ? CampaignStatus.ELIGIBLE
        : CampaignStatus.PAUSED;
    }
  },
  [MutationsTypes.UPDATE_SSC](state: LocalState, payload: CampaignObject) {
    const requestedStatus = payload.status;
    payload.status = requestedStatus === CampaignStatusToggle.ENABLED
      ? CampaignStatus.ELIGIBLE
      : CampaignStatus.PAUSED;
    // it's works but there are no id now in SSC object
    const findCampaign = state.campaigns.findIndex((el) => el.id === payload.id);
    state.campaigns.splice(findCampaign, 1, payload);
  },
};
