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
import MutationsTypes from './mutations-types';
import ActionsTypes from './actions-types';
import HttpClientError from '@/utils/HttpClientError';
import ReportingPeriod from '@/enums/reporting/ReportingPeriod';
import {
  CampaignObject, CampaignStatusPayload, ConversionAction, Dimension,
} from './state';
import {deepUpdateDimensionVisibility} from '@/utils/SSCFilters';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  async [ActionsTypes.SAVE_NEW_SSC]({commit, rootState}, payload : CampaignObject) {
    try {
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-campaigns/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
          body: JSON.stringify(payload),
        });

      if (!resp.ok) {
        throw new HttpClientError(resp.statusText, resp.status);
      }
      const json = await resp.json();
      commit(MutationsTypes.SAVE_NEW_SSC, payload);
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

  async [ActionsTypes.CHECK_CAMPAIGN_NAME_ALREADY_EXISTS]({rootState, commit},
    payload : {name: string, id: string},
  ) {
    try {
      commit(MutationsTypes.SET_ERROR_CAMPAIGN_NAME_EXISTS, false);
      const campaignFinalName = btoa(payload.name);
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-campaigns?campaign_name=${campaignFinalName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
        });

      if (!resp.ok) {
        throw new HttpClientError(resp.statusText, resp.status);
      }
      const json = await resp.json();

      if (json && json.campaignName && payload.id !== json.id) {
        commit(MutationsTypes.SET_ERROR_CAMPAIGN_NAME_EXISTS, true);
      }
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.SAVE_STATUS_REMARKETING_TRACKING_TAG](
    {commit, rootState}, payload: boolean,
  ) {
    const remarketingSnippet = rootState.googleAds.accountChosen?.remarketingSnippet;
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'toggleRemarketingTags',
        isRemarketingEnabled: payload,
        tagSnippet: remarketingSnippet,
      }),
    });

    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const result = await response.json();
    commit(MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG, payload);
  },

  async [ActionsTypes.GET_REMARKETING_TRACKING_TAG_STATUS_MODULE](
    {commit, dispatch, rootState}, payload: boolean,
  ) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'getRemarketingTagsStatus',
      }),
    });

    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const result = await response.json();
    commit(MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG, result.remarketingTagsStatus);
  },

  async [ActionsTypes.GET_REMARKETING_TRACKING_TAG_STATUS_IF_ALREADY_EXISTS](
    {commit, rootState}, payload: boolean,
  ) {
    const regex = new RegExp('AW-[0-9]+');
    const remarketingSnippet = rootState.googleAds.accountChosen?.remarketingSnippet;
    const idTag = regex.exec(remarketingSnippet);

    if (!idTag || !idTag.length) {
      return;
    }
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'checkRemarketingTagExists',
        tag: idTag[0],
      }),
    });

    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const result = await response.json();
    commit(MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG_ALREADY_EXIST,
      result.tagAlreadyExists);
  },
  async [ActionsTypes.GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED](
    {commit, dispatch, rootState}, payload: boolean,
  ) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'getConversionActionLabels',
      }),
    });

    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const result = await response.json();
    commit(
      MutationsTypes.SET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED,
      result.conversionActionLabels,
    );
  },

  async [ActionsTypes.CREATE_REMARKETING_DEFAULT_CONVERSION_ACTIONS](
    {dispatch, rootState},
  ) {
    try {
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/conversion-actions`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
        });

      if (!resp.ok) {
        throw new HttpClientError(resp.statusText, resp.status);
      }
      dispatch(ActionsTypes.SAVE_REMARKETING_CONVERSION_ACTION_ON_SHOP, await resp.json());
    } catch (error) {
      // commit(...);
      console.error(error);
    }
  },

  async [ActionsTypes.SAVE_REMARKETING_CONVERSION_ACTION_ON_SHOP](
    {dispatch, rootState}, conversionActions: ConversionAction[],
  ) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'setConversionActionLabel',
        conversionActions,
      }),
    });

    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    await response.json();
    dispatch(ActionsTypes.GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED);
  },

  async [ActionsTypes.UPDATE_ALL_REPORTING_DATA](
    {dispatch, commit},
  ) {
    dispatch('GET_REPORTING_CAMPAIGNS_PERFORMANCES', {isNewRequest: true});
    dispatch('GET_REPORTING_KPIS');
    dispatch('GET_REPORTING_DAILY_RESULTS');
    dispatch('GET_REPORTING_PRODUCTS_PERFORMANCES');
    // temporary disable, waiting final table design
    dispatch('GET_REPORTING_FILTERS_PERFORMANCES');
  },
  [ActionsTypes.SET_REPORTING_DATES_RANGE](
    {commit, state},
  ) {
    const {periodSelected} = state.reporting.request.dateRange;
    const substractType = {type: 'day', value: 0};

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
    {commit, dispatch}, payload: ReportingPeriod,
  ) {
    commit(MutationsTypes.SET_REPORTING_PERIOD_SELECTED, payload);
    await dispatch('SET_REPORTING_DATES_RANGE');
    dispatch('UPDATE_ALL_REPORTING_DATA');
  },

  async [ActionsTypes.GET_REPORTING_KPIS](
    {commit, rootState, state},
  ) {
    const query = new URLSearchParams({
      startDate: state.reporting.request.dateRange.startDate,
      endDate: state.reporting.request.dateRange.endDate,
    });

    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-reporting/kpis?${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
      },
    });

    if (!response.ok) {
      commit(MutationsTypes.SET_REPORTING_KPIS_ERROR, true);
      throw new HttpClientError(response.statusText, response.status);
    }

    const result = await response.json();

    commit(MutationsTypes.SET_REPORTING_KPIS_ERROR, false);
    commit(MutationsTypes.SET_REPORTING_KPIS, result);
  },

  async [ActionsTypes.GET_REPORTING_DAILY_RESULTS](
    {commit, rootState, state},
  ) {
    const query = new URLSearchParams({
      startDate: state.reporting.request.dateRange.startDate,
      endDate: state.reporting.request.dateRange.endDate,
    });
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-reporting/daily-results?${query}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
      },
    });

    if (!response.ok) {
      commit(MutationsTypes.SET_REPORTING_KPIS_ERROR, true);
      throw new HttpClientError(response.statusText, response.status);
    }
    const result = await response.json();
    commit(MutationsTypes.SET_REPORTING_KPIS_ERROR, false);
    commit(MutationsTypes.SET_REPORTING_DAILY_RESULTS, result);
  },

  async [ActionsTypes.GET_REPORTING_CAMPAIGNS_PERFORMANCES](
    {commit, rootState, state},
  ) {
    const limit = state.reporting.results.campaignsPerformancesSection.limitCampaignPerformanceList;
    const offset = ((state.reporting.results.campaignsPerformancesSection.activePage - 1)
    * limit).toString();
    const query = new URLSearchParams({
      startDate: state.reporting.request.dateRange.startDate,
      endDate: state.reporting.request.dateRange.endDate,
    });

    // add order in array format
    query.append('order[clicks]', state.reporting.request.ordering.campaignsPerformances.clicks);
    query.append('limit', limit);
    query.append('offset', offset);

    const response = await fetch(
      `${rootState.app.psxMktgWithGoogleApiUrl}/ads-reporting/campaigns-performances?${query}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
      },
    );

    if (!response.ok) {
      commit(MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_SECTION_ERROR, true);
      throw new HttpClientError(response.statusText, response.status);
    }

    const result = await response.json();
    commit(MutationsTypes.RESET_REPORTING_CAMPAIGNS_PERFORMANCES);
    commit(
      MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_SECTION_ERROR,
      false,
    );
    commit(
      MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_RESULTS,
      result.campaignsPerformanceList,
    );
    commit(
      MutationsTypes.SET_TOTAL_CAMPAIGNS_PERFORMANCES_RESULTS,
      result.totalCampaigns,
    );
  },

  async [ActionsTypes.GET_REPORTING_PRODUCTS_PERFORMANCES](
    {commit, rootState, state},
  ) {
    const query = new URLSearchParams({
      startDate: state.reporting.request.dateRange.startDate,
      endDate: state.reporting.request.dateRange.endDate,
    });

    // add order in array format
    query.append('order[clicks]', state.reporting.request.ordering.productsPerformances.clicks);

    const response = await fetch(
      `${rootState.app.psxMktgWithGoogleApiUrl}/ads-reporting/products-performances?${query}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
      },
    );

    if (!response.ok) {
      commit(MutationsTypes.SET_REPORTING_PRODUCTS_PERFORMANCES_SECTION_ERROR, true);
      throw new HttpClientError(response.statusText, response.status);
    }

    const result = await response.json();

    commit(MutationsTypes.SET_REPORTING_PRODUCTS_PERFORMANCES_SECTION_ERROR, false);
    commit(MutationsTypes.SET_REPORTING_PRODUCTS_PERFORMANCES, result);
  },

  async [ActionsTypes.GET_REPORTING_FILTERS_PERFORMANCES](
    {commit, rootState, state},
  ) {
    const query = new URLSearchParams({
      startDate: state.reporting.request.dateRange.startDate,
      endDate: state.reporting.request.dateRange.endDate,
      lang: window.i18nSettings.languageLocale.split('-')[0],
    });

    // add order in array format
    query.append('order[clicks]', state.reporting.request.ordering.filtersPerformances.clicks);

    const response = await fetch(
      `${rootState.app.psxMktgWithGoogleApiUrl}/ads-reporting/products-partitions-performances?${query}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
      },
    );

    if (!response.ok) {
      commit(MutationsTypes.SET_REPORTING_FILTERS_PERFORMANCES_SECTION_ERROR, true);
      throw new HttpClientError(response.statusText, response.status);
    }

    const result = await response.json();
    commit(MutationsTypes.SET_REPORTING_FILTERS_PERFORMANCES_SECTION_ERROR, false);
    commit(MutationsTypes.SET_REPORTING_FILTERS_PERFORMANCES,
      result);
  },
  async [ActionsTypes.GET_SSC_LIST]({commit, state, rootState}, {
    isNewRequest = true,
    typeChosen = CampaignTypes,
  }) {
    const query = new URLSearchParams();

    if (state.campaignsOrdering && state.campaignsOrdering.duration) {
      query.append('order[startDate]', state.campaignsOrdering.duration);
    }
    if (state.campaignsOrdering && state.campaignsOrdering.name) {
      query.append('filter[campaignName]', state.campaignsOrdering.name);
    }
    if (!isNewRequest && state.tokenNextPageCampaignList) {
      query.append('nextPageToken', state.tokenNextPageCampaignList);
    }
    try {
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-campaigns/list?${query}&type=${typeChosen}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
        });

      if (!resp.ok) {
        throw new HttpClientError(resp.statusText, resp.status);
      }
      const json = await resp.json();

      if (isNewRequest) {
        commit(MutationsTypes.RESET_SSC_LIST);
      }
      commit(MutationsTypes.SAVE_SSC_LIST, json.campaigns);
      commit(MutationsTypes.SAVE_NEXT_PAGE_TOKEN_CAMPAIGN_LIST, json.nextPageToken);
    } catch (error) {
      console.error(error);
    }
  },
  async [ActionsTypes.CHANGE_STATUS_OF_SSC]({commit, rootState}, payload: CampaignStatusPayload) {
    const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-campaigns/${payload.id}/status`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
        body: JSON.stringify({
          status: payload.status,
        }),
      });

    if (!resp.ok) {
      throw new HttpClientError(resp.statusText, resp.status);
    }
    const json = await resp.json();
    commit(MutationsTypes.UPDATE_SSC_STATUS, payload);
    return json;
  },
  async [ActionsTypes.UPDATE_SSC]({commit, rootState, state}, payload: CampaignObject) {
    const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-campaigns/${payload.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
        body: JSON.stringify(payload),
      });

    if (!resp.ok) {
      throw new HttpClientError(resp.statusText, resp.status);
    }
    const json = await resp.json();
    commit(MutationsTypes.UPDATE_SSC, payload);
    return json;
  },
  async [ActionsTypes.GET_DIMENSIONS_FILTERS]({commit, rootState, state}, search?: string) {
    if (!search && state.sscAvailableFilters.length) {
      deepUpdateDimensionVisibility(state.dimensionChosen, true);
      return;
    }

    const query = new URLSearchParams({
      language_code: window.i18nSettings.isoCode,
      country_code: rootState.app.psxMtgWithGoogleDefaultShopCountry,
    });

    if (search) {
      query.append('search_query', search);
    }

    const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-campaigns/dimensions/filters?${query}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
      });

    if (resp.status > 299) {
      commit(MutationsTypes.SET_SSC_DIMENSIONS_AND_FILTERS, {list: [], error: true});
      return;
    }
    if (!resp.ok) {
      throw new HttpClientError(resp.statusText, resp.status);
    }
    const json = await resp.json();

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
};
