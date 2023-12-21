import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
  Kpis,
  State as LocalState,
  ConversionAction,
  Dimension,
  FiltersChosen,
  DailyResultTypes,
  CampaignListOrdering,
  CampaignPerformanceObject,
} from './state';
import GettersTypes from './getters-types';
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
    return !!state.tracking;
  },
  [GettersTypes.GET_REMARKETING_TRACKING_TAG_ALREADY_EXIST_STATUS](
    state: LocalState,
  ): boolean {
    return state.tagAlreadyExists;
  },
  [GettersTypes.GET_REMARKETING_TRACKING_TAG_STATUS](
    state: LocalState,
    getters,
  ): boolean {
    return getters.GET_REMARKETING_TRACKING_TAG_ALREADY_EXIST_STATUS
      || getters.GET_REMARKETING_TRACKING_TAG_IS_SET;
  },
  [GettersTypes.GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED](
    state: LocalState,
  ): ConversionAction[] {
    return state.conversionActions;
  },
  [GettersTypes.GET_ERROR_CAMPAIGN_NAME](state: LocalState): boolean|null {
    return state.errorCampaignNameExists;
  },
  [GettersTypes.GET_CAMPAIGN_FILTER_CHOSEN](state: LocalState): FiltersChosen|null {
    return state.filtersChosen?.find((filter) => !!filter) || null;
  },

  // request getters
  [GettersTypes.GET_CAMPAIGNS_LIST_ORDERING](
    state: LocalState,
  ): CampaignListOrdering {
    return state.campaigns.request.ordering;
  },
  [GettersTypes.GET_CAMPAIGNS_LIST_LIMIT](
    state: LocalState,
  ): number {
    return state.campaigns.request.numberOfCampaignsPerPage;
  },
  [GettersTypes.GET_CAMPAIGNS_LIST_ACTIVE_PAGE](
    state: LocalState,
  ): number {
    return state.campaigns.request.activePage;
  },
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
  [GettersTypes.GET_REPORTING_DAILY_RESULT_TYPES](
    state: LocalState,
  ): DailyResultTypes {
    return state.reporting.request.dailyResultTypes;
  },
  [GettersTypes.GET_REPORTING_DAILY_RESULT_TYPES_AVAILABLE](
    state: LocalState,
  ): boolean {
    return !!Object
      .values(state.reporting.request.dailyResultTypes)
      .filter((value) => !value).length;
  },
  [GettersTypes.GET_REPORTING_CAMPAIGNS_PERFORMANCES_ORDERING](
    state: LocalState,
  ): Object {
    return state.reporting.request.ordering.campaignsPerformances;
  },
  [GettersTypes.GET_SSC_DIMENSIONS_AND_FILTERS](
    state: LocalState,
  ): Dimension[] {
    return state.sscAvailableFilters;
  },
  [GettersTypes.GET_ERROR_FETCHING_FILTERS_STATUS](
    state: LocalState,
  ): boolean {
    return !state.sscAvailableFilters.length && state.errorFetchingFilters;
  },

  // errors getters
  [GettersTypes.GET_CAMPAIGNS_LIST_ERROR](
    state: LocalState,
  ): boolean {
    return state.campaigns.results.error;
  },
  [GettersTypes.GET_REPORTING_KPIS_ERROR](
    state: LocalState,
  ): Boolean {
    return state.reporting.errorsList.kpis;
  },

  // result getters
  [GettersTypes.GET_CAMPAIGNS_LIST](state: LocalState): CampaignPerformanceObject[] {
    return state.campaigns.results.campaigns;
  },
  [GettersTypes.GET_CAMPAIGNS_TOTAL](
    state: LocalState,
  ): number {
    return state.campaigns.results.totalCount;
  },
  [GettersTypes.GET_ACCOUNT_HAS_AT_LEAST_ONE_CAMPAIGN](
    state: LocalState,
    getters,
  ): boolean {
    if (getters.GET_CAMPAIGNS_LIST_ERROR) {
      return !!getters.GET_REPORTING_DAILY_RESULT.length;
    }

    return !!getters.GET_CAMPAIGNS_TOTAL;
  },
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
