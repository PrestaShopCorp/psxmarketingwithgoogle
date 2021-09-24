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
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import ReportingPeriod from '@/enums/reporting/ReportingPeriod';
import {CampaignObject, CampaignStatusPayload, ConversionAction} from './state';

export default {
  async [ActionsTypes.SAVE_NEW_SSC]({commit, state, rootState}, payload : CampaignObject) {
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

  async [ActionsTypes.CHECK_CAMPAIGN_NAME_ALREADY_EXISTS]({rootState, commit}, payload : string) {
    try {
      commit(MutationsTypes.SET_ERROR_CAMPAIGN_NAME_EXISTS, false);
      const campaignFinalName = btoa(payload);
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
      if (json && json.campaignName) {
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
    dispatch(ActionsTypes.GET_REMARKETING_TRACKING_TAG_STATUS_IF_ALREADY_EXISTS);
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
    dispatch('GET_REPORTING_CAMPAIGNS_PERFORMANCES');
    dispatch('GET_REPORTING_KPIS');
    dispatch('GET_REPORTING_DAILY_RESULTS');
    dispatch('GET_REPORTING_PRODUCTS_PERFORMANCES');
    // temporary disable, waiting final table design
    // dispatch('GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES');
  },

  [ActionsTypes.CHANGE_REPORTING_DATES](
    {commit, dispatch}, payload: ReportingPeriod,
  ) {
    commit(MutationsTypes.SET_REPORTING_PERIOD_SELECTED, payload);

    const substractType = {type: 'day', value: 0};

    switch (payload) {
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
    commit(MutationsTypes.SET_REPORTING_KPIS, result);
  },

  async [ActionsTypes.GET_REPORTING_DAILY_RESULTS](
    {commit, rootState, state},
  ) {
    /*
    const query = new URLSearchParams({
      startDate: state.reporting.request.dateRange.startDate,
      endDate: state.reporting.request.dateRange.endDate,
      type: state.reporting.request.request.dailyResultType,
    });
    const response =
      await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-reporting/daily-results?${query}`, {
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
    */

    // temp mocked
    // const result = await response.json();
    const result = {
      dailyResultList: [
        {
          impressions: 56,
          clicks: 37,
          conversions: 154,
          averageCostPerClick: 99,
          costs: 651,
          sales: 5668,
          date: '2020-10-22',
        },
        {
          impressions: 89,
          clicks: 77,
          conversions: 14,
          averageCostPerClick: 145,
          costs: 897,
          sales: 3243,
          date: '2020-10-23',
        },
        {
          impressions: 33,
          clicks: 47,
          conversions: 57,
          averageCostPerClick: 36,
          costs: 137,
          sales: 2567,
          date: '2020-10-24',
        },
        {
          impressions: 115,
          clicks: 123,
          conversions: 177,
          averageCostPerClick: 31,
          costs: 789,
          sales: 4678,
          date: '2020-10-25',
        },
        {
          impressions: 71,
          clicks: 187,
          conversions: 111,
          averageCostPerClick: 49,
          costs: 563,
          sales: 3975,
          date: '2020-10-26',
        },
        {
          impressions: 93,
          clicks: 154,
          conversions: 123,
          averageCostPerClick: 76,
          costs: 289,
          sales: 1077,
          date: '2020-10-28',
        },
      ],
    };

    commit(MutationsTypes.SET_REPORTING_DAILY_RESULTS, result);
  },

  async [ActionsTypes.GET_REPORTING_CAMPAIGNS_PERFORMANCES](
    {commit, rootState, state}, isNewRequest = true,
  ) {
    const query = new URLSearchParams({
      startDate: state.reporting.request.dateRange.startDate,
      endDate: state.reporting.request.dateRange.endDate,
    });

    // add order in array format
    query.append('order[clicks]', state.reporting.request.ordering.campaignsPerformances.clicks);

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

    if (isNewRequest) {
      commit('RESET_REPORTING_CAMPAIGNS_PERFORMANCES');
    }

    commit(
      MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_RESULTS,
      result.campaignsPerformanceList,
    );
    commit(
      MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_NEXT_PAGE_TOKEN,
      result.nextPageToken,
    );

    // for testing only
    if (state.reporting.results.campaignsPerformancesSection.campaignsPerformanceList.length > 10) {
      commit(
        MutationsTypes.SET_REPORTING_CAMPAIGNS_PERFORMANCES_NEXT_PAGE_TOKEN,
        null,
      );
    }
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
    commit(MutationsTypes.SET_REPORTING_PRODUCTS_PERFORMANCES, result);
  },

  async [ActionsTypes.GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES](
    {commit, rootState, state},
  ) {
    const query = new URLSearchParams({
      startDate: state.reporting.request.dateRange.startDate,
      endDate: state.reporting.request.dateRange.endDate,
    });

    // add order in array format
    query.append('order[clicks]', state.reporting.request.ordering.productsPartitionsPerformances.clicks);

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
      commit(MutationsTypes.SET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES_SECTION_ERROR, true);
      throw new HttpClientError(response.statusText, response.status);
    }

    const result = await response.json();

    commit(MutationsTypes.SET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES, result);
  },
  async [ActionsTypes.GET_SSC_LIST]({commit, rootState}) {
    try {
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-campaigns/list`,
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
      commit(MutationsTypes.SAVE_SSC_LIST, json);
    } catch (error) {
      console.error(error);
    }
  },
  async [ActionsTypes.CHANGE_STATUS_OF_SSC]({commit, rootState}, payload: CampaignStatusPayload) {
    try {
    // const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-campaigns/:ID`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
    //     },
    //     body: JSON.stringify({payload}),
    //   });
    // if (!resp.ok) {
    //   throw new HttpClientError(resp.statusText, resp.status);
    // }
    // const json = await resp.json();
      commit(MutationsTypes.UPDATE_SSC_STATUS, payload);
    } catch (error) {
      console.error(error);
    }
  },
};
