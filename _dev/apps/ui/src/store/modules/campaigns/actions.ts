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

import {ActionContext} from 'vuex';
import dayjs, {ManipulateType} from 'dayjs';
import {fetchShop, fetchOnboarding, HttpClientError} from 'mktg-with-google-common';
import MutationsTypes from './mutations-types';
import ActionsTypes from './actions-types';
import ReportingPeriod from '@/enums/reporting/ReportingPeriod';
import {
  CampaignObject, CampaignStatusPayload, ConversionAction,
  State,
} from './state';
import {deepUpdateDimensionVisibility} from '@/utils/SSCFilters';
import {runIf} from '../../../utils/Promise';
import {RecommendedBudget} from '@/utils/CampaignsBudget';
import KpiType from '@/enums/reporting/KpiType';
import {FullState, RequestState} from '@/store/types';
import appGetters from '@/store/modules/app/getters-types';

type Context = ActionContext<State, FullState>;

export default {
  async [ActionsTypes.WARMUP_STORE](
    {dispatch, state, getters}: Context,
  ) {
    if ([
      RequestState.PENDING,
      RequestState.SUCCESS,
    ].includes(state.warmedUp)) {
      return;
    }
    state.warmedUp = RequestState.PENDING;

    await dispatch(ActionsTypes.SET_REPORTING_DATES_RANGE);

    await Promise.allSettled([
      dispatch('googleAds/WARMUP_STORE', null, {root: true}),
      dispatch('productFeed/WARMUP_STORE', null, {root: true}),
      runIf(
        !getters.GET_CAMPAIGNS_LIST?.length,
        dispatch(ActionsTypes.GET_CAMPAIGNS_LIST),
      ),
      runIf(
        state.trackingFeature.basic === null,
        dispatch(ActionsTypes.GET_REMARKETING_TRACKING_TAG_STATUS_MODULE),
      ),
      runIf(
        !getters.GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED.length,
        dispatch(ActionsTypes.GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED),
      ),
      runIf(
        !getters.GET_REPORTING_DAILY_RESULT.length,
        dispatch(ActionsTypes.GET_REPORTING_DAILY_RESULTS),
      ),
      runIf(
        !(getters.GET_REPORTING_KPIS).impressions,
        dispatch(ActionsTypes.GET_REPORTING_KPIS),
      ),
    ]);
    state.warmedUp = RequestState.SUCCESS;
  },
  async [ActionsTypes.SAVE_NEW_CAMPAIGN]({commit}: Context, payload: CampaignObject) {
    try {
      const json = await (await fetchOnboarding(
        'POST',
        'shopping-campaigns/create',
        {body: payload},
      )).json();
      commit(MutationsTypes.SAVE_NEW_CAMPAIGN, payload);
      return {
        error: false,
        json,
      };
    } catch (error) {
      console.error(error);
      return {
        error: true,
      };
    }
  },

  async [ActionsTypes.CHECK_CAMPAIGN_NAME_ALREADY_EXISTS]({commit}: Context,
    payload : {name: string, id: string},
  ) {
    try {
      commit(MutationsTypes.SET_ERROR_CAMPAIGN_NAME_EXISTS, false);
      const campaignFinalName = btoa(payload.name);
      const json = await (await fetchOnboarding(
        'GET',
        `shopping-campaigns?campaign_name=${campaignFinalName}`,
      )).json();

      if (json && json.campaignName && payload.id !== json.id) {
        commit(MutationsTypes.SET_ERROR_CAMPAIGN_NAME_EXISTS, true);
      }
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.SAVE_STATUS_REMARKETING_TRACKING_TAG](
    {commit, rootState}: Context, payload: boolean,
  ) {
    const remarketingSnippet = rootState.googleAds.accountChosen?.remarketingSnippet;
    await fetchShop('toggleRemarketingTags', {
      isRemarketingEnabled: payload,
      tagSnippet: remarketingSnippet,
    });
    commit(MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG, payload);
  },

  async [ActionsTypes.GET_REMARKETING_TRACKING_TAG_STATUS_MODULE](
    {commit}: Context,
  ) {
    const result: {
      remarketingTagsStatus: boolean,
      enhancedConversionStatus: boolean,
    } = await fetchShop('getRemarketingTagsStatus');
    commit(MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG, result.remarketingTagsStatus);
    commit(MutationsTypes.TOGGLE_STATUS_ENHANCED_CONVERSIONS, result.enhancedConversionStatus);
  },

  async [ActionsTypes.GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED](
    {commit}: Context,
  ) {
    const result = await fetchShop('getConversionActionLabels');
    commit(
      MutationsTypes.SET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED,
      result.conversionActionLabels,
    );
  },

  async [ActionsTypes.GET_ENHANCED_CONVERSIONS_STATUS](
    {commit}: Context,
  ): Promise<void> {
    const result: {enabled: boolean} = await fetchShop('getEnhancedConversions');
    commit(MutationsTypes.TOGGLE_STATUS_ENHANCED_CONVERSIONS, result.enabled);
  },

  async [ActionsTypes.SAVE_ENHANCED_CONVERSIONS_STATUS](
    {commit}: Context,
    payload: boolean,
  ): Promise<void> {
    await fetchShop('setEnhancedConversions', {
      enable: payload,
    });
    commit(MutationsTypes.TOGGLE_STATUS_ENHANCED_CONVERSIONS, payload);
  },

  async [ActionsTypes.GET_ENHANCED_CONVERSIONS_INTRODUCTION_STATUS](): Promise<boolean> {
    const response: {introduced: boolean} = await (await fetchOnboarding(
      'GET',
      'conversion-actions/enhanced',
    )).json();

    return response.introduced;
  },
  async [ActionsTypes.SAVE_ENHANCED_CONVERSIONS_INTRODUCTION_STATUS](
    // eslint-disable-next-line no-empty-pattern
    {}: Context,
    payload: boolean,
  ): Promise<void> {
    await fetchOnboarding(
      'POST',
      'conversion-actions/enhanced',
      {body: {introduced: payload}},
    );
  },

  async [ActionsTypes.CREATE_REMARKETING_DEFAULT_CONVERSION_ACTIONS](
    {dispatch}: Context,
  ) {
    try {
      const json = await (await fetchOnboarding(
        'POST',
        'conversion-actions',
      )).json();
      dispatch(ActionsTypes.SAVE_REMARKETING_CONVERSION_ACTION_ON_SHOP, json);
    } catch (error) {
      // commit(...);
      console.error(error);
    }
  },

  async [ActionsTypes.SAVE_REMARKETING_CONVERSION_ACTION_ON_SHOP](
    {dispatch}: Context, conversionActions: ConversionAction[],
  ) {
    await fetchShop('setConversionActionLabel', {conversionActions});
    dispatch(ActionsTypes.GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED);
  },

  async [ActionsTypes.UPDATE_ALL_REPORTING_DATA](
    {dispatch}: Context,
  ) {
    dispatch('GET_REPORTING_KPIS');
    dispatch('GET_REPORTING_DAILY_RESULTS');
    dispatch('GET_CAMPAIGNS_LIST');
  },
  [ActionsTypes.SET_REPORTING_DATES_RANGE](
    {commit, state}: Context,
  ) {
    const {periodSelected} = state.reporting.request.dateRange;
    const substractType: {type: ManipulateType, value: number} = {type: 'day', value: 0};

    switch (periodSelected) {
      case ReportingPeriod.YESTERDAY:
        substractType.type = 'day';
        substractType.value = 1;
        break;
      case ReportingPeriod.LAST_SEVEN_DAYS:
        substractType.type = 'day';
        substractType.value = 7;
        break;
      case ReportingPeriod.LAST_THIRTY_DAY:
        substractType.type = 'day';
        substractType.value = 30;
        break;
      case ReportingPeriod.THREE_MONTH:
        substractType.type = 'month';
        substractType.value = 3;
        break;
      default:
        break;
    }

    commit(MutationsTypes.SET_REPORTING_DATES, {
      startDate: dayjs().subtract(substractType.value, substractType.type).format('YYYY-MM-DD'),
      endDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    });
  },
  async [ActionsTypes.CHANGE_REPORTING_DATES](
    {commit, dispatch}: Context, payload: ReportingPeriod,
  ) {
    commit(MutationsTypes.SET_REPORTING_PERIOD_SELECTED, payload);
    await dispatch('SET_REPORTING_DATES_RANGE');
    dispatch('UPDATE_ALL_REPORTING_DATA');
  },

  [ActionsTypes.ADD_REPORTING_DAILY_RESULTS_TYPE](
    {commit, state}: Context, payload: KpiType,
  ): boolean {
    const currentResultTypes = state.reporting.request.dailyResultTypes;
    const alreadyInObject = !!Object.keys(currentResultTypes)
      .find((color) => currentResultTypes[color] === payload);

    if (alreadyInObject) {
      return true;
    }

    const availableKey = Object.keys(currentResultTypes)
      .find((color) => currentResultTypes[color] === null);

    if (!availableKey) {
      return false;
    }

    commit(
      MutationsTypes.SET_REPORTING_DAILY_RESULTS_TYPES,
      {...currentResultTypes, [availableKey]: payload},
    );
    return true;
  },

  [ActionsTypes.REMOVE_REPORTING_DAILY_RESULTS_TYPE](
    {commit, state}: Context, payload: KpiType,
  ): void {
    const currentResultTypes = state.reporting.request.dailyResultTypes;
    const key = Object.keys(currentResultTypes)
      .find((color) => currentResultTypes[color] === payload);

    if (!key) {
      return;
    }

    commit(
      MutationsTypes.SET_REPORTING_DAILY_RESULTS_TYPES,
      {...currentResultTypes, [key]: null},
    );
  },

  async [ActionsTypes.GET_REPORTING_KPIS](
    {commit, state}: Context,
  ) {
    const query = new URLSearchParams({
      startDate: state.reporting.request.dateRange.startDate,
      endDate: state.reporting.request.dateRange.endDate,
    });
    const result = await fetchOnboarding(
      'GET',
      `ads-reporting/kpis?${query}`,
      {
        onResponse: async (response) => {
          if (!response.ok) {
            commit(MutationsTypes.SET_REPORTING_KPIS_ERROR, true);
            throw new HttpClientError(response.statusText, response.status);
          }
          return response.json();
        },
      },
    );

    commit(MutationsTypes.SET_REPORTING_KPIS_ERROR, false);
    commit(MutationsTypes.SET_REPORTING_KPIS, result);
  },

  async [ActionsTypes.GET_REPORTING_DAILY_RESULTS](
    {commit, state}: Context,
  ) {
    const query = new URLSearchParams({
      startDate: state.reporting.request.dateRange.startDate,
      endDate: state.reporting.request.dateRange.endDate,
    });
    const result = await fetchOnboarding(
      'GET',
      `ads-reporting/daily-results?${query}`,
      {
        onResponse: async (response) => {
          if (!response.ok) {
            commit(MutationsTypes.SET_REPORTING_KPIS_ERROR, true);
            throw new HttpClientError(response.statusText, response.status);
          }
          return response.json();
        },
      },
    );

    commit(MutationsTypes.SET_REPORTING_KPIS_ERROR, false);
    commit(MutationsTypes.SET_REPORTING_DAILY_RESULTS, result);
  },

  async [ActionsTypes.GET_CAMPAIGNS_LIST]({commit, state, rootState}: Context) {
    const query = new URLSearchParams();

    Object.keys(state.campaigns.request.ordering).forEach((ordering) => {
      query.append(`order[${ordering}]`, state.campaigns.request.ordering[ordering]);
    });

    query.append('offset', (state.campaigns.request.activePage - 1) * state.campaigns.request.numberOfCampaignsPerPage);
    query.append('limit', state.campaigns.request.numberOfCampaignsPerPage);
    query.append('startDate', state.reporting.request.dateRange.startDate);
    query.append('endDate', state.reporting.request.dateRange.endDate);
    query.append('currency_code', rootState.googleAds.accountChosen.currencyCode);

    try {
      const json = await (await fetchOnboarding(
        'GET',
        `shopping-campaigns/list?${query}`,
      )).json();
      commit(MutationsTypes.SAVE_CAMPAIGNS_TO_LIST, {
        campaigns: json.results,
      });
      commit(MutationsTypes.SET_CAMPAIGNS_LIST_TOTAL, json.total);
    } catch (error) {
      commit(MutationsTypes.SET_CAMPAIGNS_LIST_ERROR, true);
      console.error(error);
    }
  },
  async [ActionsTypes.CHANGE_STATUS_OF_CAMPAIGN]({
    commit,
  }: Context, payload: CampaignStatusPayload) {
    const json = await (await fetchOnboarding(
      'POST',
      `shopping-campaigns/${payload.id}/status`,
      {
        body: {status: payload.status},
      },
    )).json();
    commit(MutationsTypes.UPDATE_CAMPAIGN_STATUS, payload);
    return json;
  },
  async [ActionsTypes.UPDATE_CAMPAIGN]({commit}: Context, payload: CampaignObject) {
    const json = await (await fetchOnboarding(
      'POST',
      `shopping-campaigns/${payload.id}`,
      {body: payload},
    )).json();
    commit(MutationsTypes.UPDATE_CAMPAIGN, payload);
    return json;
  },
  async [ActionsTypes.GET_DIMENSIONS_FILTERS]({
    commit,
    rootState,
    rootGetters,
    state,
  }: Context, search?: string) {
    if (!search && state.sscAvailableFilters.length) {
      deepUpdateDimensionVisibility(state.dimensionChosen, true);
      return;
    }

    const query = new URLSearchParams({
      language_code: rootGetters[`app/${appGetters.GET_CURRENT_LANGUAGE}`],
      country_code: rootState.app.psxMtgWithGoogleDefaultShopCountry,
    });

    if (search) {
      query.append('search_query', search);
    }

    const json = await fetchOnboarding(
      'GET',
      `shopping-campaigns/dimensions/filters?${query}`,
      {
        onResponse: async (reponse) => {
          if (reponse.status > 299) {
            commit(MutationsTypes.SET_SSC_DIMENSIONS_AND_FILTERS, {list: [], error: true});
            return {};
          }
          if (!reponse.ok) {
            throw new HttpClientError(reponse.statusText, reponse.status);
          }
          return reponse.json();
        },
      },
    );

    if (!search) {
      // Basic mutation storing all possible dimensions and filters
      commit(MutationsTypes.SET_SSC_DIMENSIONS_AND_FILTERS, {list: json, error: false});
    }
    if (state.dimensionChosen?.id) {
      // If we called the API with a search query, we need to update the chosen dimension
      Object.keys(json).forEach((dimensionName) => {
        if (dimensionName === state.dimensionChosen.id) {
          commit(MutationsTypes.SET_DIMENSION_CHOSEN_CHILDREN, json[dimensionName]);
        }
      });
    }
  },
  async [ActionsTypes.GET_RECOMMENDED_BUDGET](
    {rootState}: Context, targetCountry: string,
  ): Promise<RecommendedBudget> {
    type RecommendedBudgetResponse = {
      budget: RecommendedBudget,
    };
    const query = new URLSearchParams({
      country_code: targetCountry,
      currency_code: rootState.googleAds.accountChosen.currencyCode,
    });
    const json: RecommendedBudgetResponse = await (await fetchOnboarding(
      'GET',
      `shopping-campaigns/recommended-budget?${query}`,
    )).json();

    return json.budget;
  },
};
