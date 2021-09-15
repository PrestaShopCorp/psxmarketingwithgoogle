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

import MutationsTypes from './mutations-types';
import ActionsTypes from './actions-types';
import HttpClientError from '../../../utils/HttpClientError';
import DailyResultType from '../../../enums/DailyResultType';
import QueryOrderDirection from '../../../enums/QueryOrderDirection';

export default {
  async [ActionsTypes.SAVE_NEW_SSC]({commit, state, rootState}, payload) {
    try {
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
          body: JSON.stringify({
            payload,
          }),
        });
      if (!resp.ok) {
        throw new HttpClientError(resp.statusText, resp.status);
      }
      const json = await resp.json();
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
      console.error('Remarketing snippet missing');
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

  async [ActionsTypes.GET_REPORTING_METRICS_KPIS](
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

    commit(MutationsTypes.SET_REPORTING_METRICS_KPIS, result);
  },

  async [ActionsTypes.GET_REPORTING_METRICS_DAILY_RESULTS](
    {commit, rootState, state}, payload: DailyResultType,
  ) {
    /*
    const query = new URLSearchParams({
      startDate: state.reporting.dateRange.startDate,
      endDate: state.reporting.dateRange.endDate,
      type: payload,
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
      type: DailyResultType.IMPRESSIONS,
      dailyResultList: [
        {
          value: 0,
          date: '2020-10-22',
        },
        {
          value: 20,
          date: '2020-10-23',
        },
        {
          value: 56,
          date: '2020-10-24',
        },
        {
          value: 159,
          date: '2020-10-25',
        },
        {
          value: 310,
          date: '2020-10-26',
        },
        {
          value: 587,
          date: '2020-10-27',
        },
      ],
    };

    commit(MutationsTypes.SET_REPORTING_DAILY_RESULTS, result);
  },

  async [ActionsTypes.GET_REPORTING_METRICS_CAMPAIGNS_PERFORMANCES](
    {commit, rootState, state}, payload: QueryOrderDirection,
  ) {
    /*
    const query = new URLSearchParams({
      startDate: state.reporting.dateRange.startDate,
      endDate: state.reporting.dateRange.endDate,
      nextPageToken: state.reporting.campaignsPerformancesSection.nextPageToken,
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
          name: 'test',
          budget: 50,
          status: 'test',
          impressions: 320,
          clicks: 120,
          adSpend: 156,
          conversions: 3612,
          sales: 259,
        },
      ],
      nextPageToken: 'test-de-token',
    };

    commit(MutationsTypes.SET_REPORTING_METRICS_CAMPAIGNS_PERFORMANCES, result);
  },

  async [ActionsTypes.GET_REPORTING_METRICS_PRODUCTS_PERFORMANCES](
    {commit, rootState, state}, payload: QueryOrderDirection,
  ) {
    /*
    const query = new URLSearchParams({
      startDate: state.reporting.dateRange.startDate,
      endDate: state.reporting.dateRange.endDate,
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
      productsPartitionsPerformanceList: [
        {
          id: 'test',
          name: 'test',
          clicks: 45,
          costs: 65874,
          averageCostPerClick: 1487,
          conversions: 174478,
          conversionsRate: 45,
          sales: 155,
        },
      ],
    };

    commit(MutationsTypes.SET_REPORTING_METRICS_PRODUCTS_PERFORMANCES, result);
  },

  async [ActionsTypes.GET_REPORTING_METRICS_PRODUCTS_PARTITIONS_PERFORMANCES](
    {commit, rootState, state}, payload: QueryOrderDirection,
  ) {
    /*
    const query = new URLSearchParams({
      startDate: state.reporting.dateRange.startDate,
      endDate: state.reporting.dateRange.endDate,
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
      ],
    };

    commit(MutationsTypes.SET_REPORTING_METRICS_PRODUCTS_PARTITIONS_PERFORMANCES, result);
  },
};
