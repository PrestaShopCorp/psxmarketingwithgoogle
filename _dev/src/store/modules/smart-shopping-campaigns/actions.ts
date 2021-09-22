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
import {CampaignObject} from './state';

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
        // TO REMOVE WHEN API WORKS
      commit(MutationsTypes.SAVE_NEW_SSC, payload);
      if (!resp.ok) {
        throw new HttpClientError(resp.statusText, resp.status);
      }
      const json = await resp.json();
      commit(MutationsTypes.SAVE_NEW_SSC, payload);
    } catch (error) {
      console.error(error);
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
    commit(MutationsTypes.TOGGLE_STATUS_REMARKETING_TRACKING_TAG, result.tagAlreadyExists);
  },

  async [ActionsTypes.UPDATE_ALL_REPORTING_DATA](
    {dispatch, commit},
  ) {
    commit('RESET_REPORTING_CAMPAIGNS_PERFORMANCES');

    dispatch('GET_REMARKETING_TRACKING_TAG_STATUS_MODULE');
    dispatch('GET_REPORTING_KPIS');
    dispatch('GET_REPORTING_DAILY_RESULTS');
    dispatch('GET_REPORTING_CAMPAIGNS_PERFORMANCES');
    dispatch('GET_REPORTING_PRODUCTS_PERFORMANCES');
    dispatch('GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES');
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
      endDate: dayjs().format('YYYY-MM-DD'),
    });

    dispatch('UPDATE_ALL_REPORTING_DATA');
  },

  async [ActionsTypes.GET_REPORTING_KPIS](
    {commit, rootState, state},
  ) {
    /*
    const query = new URLSearchParams(state.reporting.dateRange);
    const response =
      await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-reporting/kpis?${query}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
      });

    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    */

    // temp mocked
    // const result = await response.json();
    const result = {
      impressions: 32,
      clicks: 750,
      conversions: 658,
      averageCostPerClick: 0.2,
      costs: 321,
      sales: 18,
    };

    commit(MutationsTypes.SET_REPORTING_KPIS, result);
  },

  async [ActionsTypes.GET_REPORTING_DAILY_RESULTS](
    {commit, rootState, state},
  ) {
    /*
    const query = new URLSearchParams({
      startDate: state.reporting.dateRange.startDate,
      endDate: state.reporting.dateRange.endDate,
      type: state.reporting.request.dailyResultType,
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
      throw new HttpClientError(response.statusText, response.status);
    }
    */

    // temp mocked
    // const result = await response.json();
    const result = {
      dailyResultList: [
        {
          impressions: 56,
          clicks: 256,
          conversions: 154,
          averageCostPerClick: 145,
          costs: 897,
          sales: 5668,
          date: '2020-10-22',
        },
        {
          impressions: 56,
          clicks: 256,
          conversions: 154,
          averageCostPerClick: 145,
          costs: 897,
          sales: 5668,
          date: '2020-10-23',
        },
        {
          impressions: 56,
          clicks: 256,
          conversions: 154,
          averageCostPerClick: 145,
          costs: 897,
          sales: 5668,
          date: '2020-10-24',
        },
        {
          impressions: 56,
          clicks: 256,
          conversions: 154,
          averageCostPerClick: 145,
          costs: 897,
          sales: 5668,
          date: '2020-10-25',
        },
        {
          impressions: 56,
          clicks: 256,
          conversions: 154,
          averageCostPerClick: 145,
          costs: 897,
          sales: 5668,
          date: '2020-10-26',
        },
        {
          impressions: 56,
          clicks: 256,
          conversions: 154,
          averageCostPerClick: 145,
          costs: 897,
          sales: 5668,
          date: '2020-10-27',
        },
      ],
    };

    commit(MutationsTypes.SET_REPORTING_DAILY_RESULTS, result);
  },

  async [ActionsTypes.GET_REPORTING_CAMPAIGNS_PERFORMANCES](
    {commit, rootState, state},
  ) {
    /*
    const query = new URLSearchParams({
      startDate: state.reporting.dateRange.startDate,
      endDate: state.reporting.dateRange.endDate,
      nextPageToken: state.reporting.campaignsPerformancesSection.nextPageToken,
      order: state.reporting.request.ordering.campaignsPerformances,
    });
    // add order in array format
    query.append('order["click"]', payload);

    const response =
      await fetch(
        `${rootState.app.psxMktgWithGoogleApiUrl}/ads-reporting/campaigns-performances?${query}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
        }
      );

    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    */

    // temp mocked
    // const result = await response.json();
    const result = {
      campaignsPerformanceList: [
        {
          name: 'Promotion 1',
          budget: 125,
          status: 'ELIGIBLE',
          impressions: 25,
          clicks: 1,
          adSpend: 0,
          conversions: 0,
          sales: 0,
        },
        {
          name: 'Promotion 2',
          budget: 10,
          status: 'ELIGIBLE',
          impressions: 198,
          clicks: 2,
          adSpend: 35,
          conversions: 8,
          sales: 2700,
        },
        {
          name: 'Promotion 3',
          budget: 125,
          status: 'ENDED',
          impressions: 178998,
          clicks: 3,
          adSpend: 125,
          conversions: 178,
          sales: 178000,
        },
        {
          name: 'Promotion 4',
          budget: 2000,
          status: 'PAUSED',
          impressions: 17899800,
          clicks: 4,
          adSpend: 12500,
          conversions: 150000,
          sales: 27815580,
        },
        {
          name: 'Promotion 5',
          budget: 2,
          status: 'PENDING',
          impressions: 5,
          clicks: 5,
          adSpend: 0,
          conversions: 0,
          sales: 0,
        },
        {
          name: 'Promotion 6',
          budget: 125,
          status: 'PENDING',
          impressions: 178998,
          clicks: 6,
          adSpend: 125,
          conversions: 178,
          sales: 178000,
        },
        {
          name: 'Promotion 7',
          budget: 125,
          status: 'ELIGIBLE',
          impressions: 0,
          clicks: 0,
          adSpend: 0,
          conversions: 0,
          sales: 0,
        },
        {
          name: 'Promotion 8',
          budget: 125,
          status: 'ELIGIBLE',
          impressions: 0,
          clicks: 8,
          adSpend: 0,
          conversions: 0,
          sales: 0,
        },
        {
          name: 'Promotion 9',
          budget: 125,
          status: 'PENDING',
          impressions: 0,
          clicks: 9,
          adSpend: 0,
          conversions: 0,
          sales: 0,
        },
        {
          name: 'Promotion 10',
          budget: 125,
          status: 'ELIGIBLE',
          impressions: 0,
          clicks: 10,
          adSpend: 0,
          conversions: 0,
          sales: 0,
        },
      ],
      nextPageToken: 'test-de-token',
    };

    // for testing only
    if (
      state.reporting.request.ordering.campaignsPerformances.clicks
      === QueryOrderDirection.ASCENDING
    ) {
      result.campaignsPerformanceList = [
        ...result.campaignsPerformanceList,
      ].reverse();
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
    /*
    const query = new URLSearchParams({
      startDate: state.reporting.dateRange.startDate,
      endDate: state.reporting.dateRange.endDate,
      order: state.reporting.request.ordering.productsPerformances,
    });
    // add order in array format
    query.append('order["click"]', payload);

    const response =
      await fetch(
        `${rootState.app.psxMktgWithGoogleApiUrl}/ads-reporting/products-performances?${query}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
        }
      );

    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    */

    // temp mocked
    // const result = await response.json();
    const result = {
      productsPerformanceList: [
        {
          id: 'test 1',
          name: 'test 1',
          clicks: 1,
          costs: 65874,
          averageCostPerClick: 1487,
          conversions: 174478,
          conversionsRate: 45,
          sales: 155,
        },
        {
          id: 'test 2',
          name: 'test 2',
          clicks: 2,
          costs: 658484,
          averageCostPerClick: 87,
          conversions: 178,
          conversionsRate: 4,
          sales: 15,
        },
        {
          id: 'test 3',
          name: 'test 3',
          clicks: 3,
          costs: 65874,
          averageCostPerClick: 1487,
          conversions: 174478,
          conversionsRate: 45,
          sales: 155,
        },
        {
          id: 'test 4',
          name: 'test 4',
          clicks: 4,
          costs: 658484,
          averageCostPerClick: 87,
          conversions: 178,
          conversionsRate: 4,
          sales: 15,
        },
        {
          id: 'test 5',
          name: 'test 5',
          clicks: 5,
          costs: 65874,
          averageCostPerClick: 1487,
          conversions: 174478,
          conversionsRate: 45,
          sales: 155,
        },
        {
          id: 'test 6',
          name: 'test 6',
          clicks: 6,
          costs: 658484,
          averageCostPerClick: 87,
          conversions: 178,
          conversionsRate: 4,
          sales: 15,
        },
        {
          id: 'test 7',
          name: 'test 7',
          clicks: 7,
          costs: 658484,
          averageCostPerClick: 87,
          conversions: 178,
          conversionsRate: 4,
          sales: 15,
        },
        {
          id: 'test 8',
          name: 'test 8',
          clicks: 8,
          costs: 658484,
          averageCostPerClick: 87,
          conversions: 178,
          conversionsRate: 4,
          sales: 15,
        },
        {
          id: 'test 9',
          name: 'test 9',
          clicks: 9,
          costs: 658484,
          averageCostPerClick: 87,
          conversions: 178,
          conversionsRate: 4,
          sales: 15,
        },
        {
          id: 'test 10',
          name: 'test 10',
          clicks: 10,
          costs: 658484,
          averageCostPerClick: 87,
          conversions: 178,
          conversionsRate: 4,
          sales: 15,
        },
      ],
    };

    // for testing only
    if (
      state.reporting.request.ordering.productsPerformances.clicks
      === QueryOrderDirection.ASCENDING
    ) {
      result.productsPerformanceList = [
        ...result.productsPerformanceList,
      ].reverse();
    }

    commit(MutationsTypes.SET_REPORTING_PRODUCTS_PERFORMANCES, result);
  },

  async [ActionsTypes.GET_REPORTING_PRODUCTS_PARTITIONS_PERFORMANCES](
    {commit, rootState, state}, payload: QueryOrderDirection,
  ) {
    /*
    const query = new URLSearchParams({
      startDate: state.reporting.dateRange.startDate,
      endDate: state.reporting.dateRange.endDate,
      order: state.reporting.request.ordering.productsPartitionsPerformances,
    });
    // add order in array format
    query.append('order["click"]', payload);

    const response =
      await fetch(
        `${rootState.app.psxMktgWithGoogleApiUrl}
        /ads-reporting/products-partitions-performances?${query}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
        }
      );

    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    */

    // temp mocked
    // const result = await response.json();
    const result = {
      productsPartitionsPerformanceList: [
        {
          campaignName: 'test',
          dimension: 'test',
          dimensionValue: 'test',
          clicks: 458,
          costs: 78,
          averageCostPerClick: 12,
          conversions: 18874,
          conversionsRate: 25,
          sales: 324,
        },
        {
          campaignName: 'test 2',
          dimension: 'test 2',
          dimensionValue: 'test 2',
          clicks: 872,
          costs: 16,
          averageCostPerClick: 78,
          conversions: 6978,
          conversionsRate: 256,
          sales: 4,
        },
      ],
    };

    // for testing only
    if (
      state.reporting.request.ordering.productsPartitionsPerformances.clicks
      === QueryOrderDirection.ASCENDING
    ) {
      result.productsPartitionsPerformanceList = [
        ...result.productsPartitionsPerformanceList,
      ].reverse();
    }

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
      console.log('json', json);
    } catch (error) {
      console.error(error);
    }
  },
};
