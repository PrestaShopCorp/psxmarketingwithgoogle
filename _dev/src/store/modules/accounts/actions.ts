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

import {content_v2_1 as contentApi} from '@googleapis/content/v2.1';
import MutationsTypes from './mutations-types';
import ActionsTypes from './actions-types';
import HttpClientError from '../../../utils/HttpClientError';

export default {
  async [ActionsTypes.TRIGGER_ONBOARD_TO_GOOGLE_ACCOUNT](
    {commit, rootState, state},
    webhookUrl: String,
  ) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/account/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${state.tokenPsAccounts}`,
        },
        body: JSON.stringify(webhookUrl),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      commit(MutationsTypes.SET_GOOGLE_ACCOUNT, json);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.SAVE_SELECTED_GOOGLE_ACCOUNT](
    {commit, rootState, dispatch, state},
    selectedAccount,
  ) {
    try {
      const route = `${rootState.app.psGoogleShoppingApiUrl}/merchant-accounts/${selectedAccount.id}/link`;
      const response = await fetch(route, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${state.tokenPsAccounts}`,
        },
      });
      const json = await response.json();

      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }

      commit(MutationsTypes.SAVE_MCA_ACCOUNT, selectedAccount);
      dispatch(ActionsTypes.REQUEST_WEBSITE_CLAIMING_STATUS);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  // Comment to delete : launch toast Google account connected ONCE after connected
  [ActionsTypes.SAVE_GOOGLE_CONNECTION_ONCE](
    {commit},
  ) {
    commit(MutationsTypes.SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE, true);
  },

  async [ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH]({commit, state, rootState}) {
    const urlState = btoa(JSON.stringify({
      redirectUri: rootState.app.psGoogleShoppingAdminUrl,
      shopId: state.shopIdPsAccounts,
      shopUrl: rootState.app.psGoogleShoppingShopUrl,
    }));
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/oauth/authorized-url?state=${urlState}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${state.tokenPsAccounts}`,
        },
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_GOOGLE_AUTHENTICATION_URL, json.authorizedUrl);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS]({
    commit, state, rootState, dispatch,
  }) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/oauth`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${state.tokenPsAccounts}`,
        },
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SAVE_GOOGLE_ACCOUNT_TOKEN, json);
      commit(MutationsTypes.SET_GOOGLE_ACCOUNT, json);
      return json;
    } catch (error) {
      if (error instanceof HttpClientError && (error.code === 404 || error.code === 412)) {
        // This is likely caused by a missing Google account, so let's retrieve the URL
        dispatch(ActionsTypes.DISSOCIATE_GOOGLE_ACCOUNT);
        return null;
      }
      console.error(error);
    }
    return null;
  },

  async [ActionsTypes.REQUEST_GOOGLE_ACCOUNT_GMC_LIST]({
    commit, state, rootState,
  }) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/merchant-accounts`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${state.tokenPsAccounts}`,
        },
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SAVE_GOOGLE_ACCOUNT_MCA_LIST, json);
    } catch (error) {
      console.error(error);
    }
  },

  [ActionsTypes.DISSOCIATE_GOOGLE_ACCOUNT]({commit, dispatch}) {
    dispatch(ActionsTypes.DISSOCIATE_MERCHANT_CENTER_ACCOUNT);
    // ToDo: Add API calls if needed
    commit(MutationsTypes.REMOVE_GOOGLE_ACCOUNT);
    commit(MutationsTypes.SET_GOOGLE_ACCOUNT, null);
    dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
  },

  [ActionsTypes.DISSOCIATE_MERCHANT_CENTER_ACCOUNT]({commit}) {
    // ToDo: Add API calls if needed
    commit(MutationsTypes.REMOVE_MCA_ACCOUNT);
  },

  /** Merchant Center Account - Website Claiming */
  async [ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_PROCESS]({dispatch, state}) {
    const correlationId = `${state.shopIdPsAccounts}-${Math.floor(Date.now() / 1000)}`;
    try {
      // 1- Get site vrification token from Nest
      const token = await dispatch(ActionsTypes.REQUEST_SITE_VERIFICATION_TOKEN, correlationId);
      // 2- Store token in shop
      await dispatch(ActionsTypes.TOGGLE_WEBSITE_CLAIMING_SNIPPET, token);
      // 3- Request verification to Google via Nest
      await dispatch(ActionsTypes.REQUEST_GOOGLE_TO_VERIFY_WEBSITE, correlationId);
      // 4- Retrieve verification results
      let isVerified = false;
      for (let i = 0; i < 5 && !isVerified; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const result = await dispatch(ActionsTypes.REQUEST_WEBSITE_CLAIMING_STATUS, correlationId);
        isVerified = result.isVerified;
        // Wait before checking again
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, (1000 + i * 1000)));
      }
      if (!isVerified) {
        throw new Error('Website was not verified by Google');
      }
      // 5- Remove token from shop
      await dispatch(ActionsTypes.TOGGLE_WEBSITE_CLAIMING_SNIPPET, false);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.REQUEST_SITE_VERIFICATION_TOKEN]({rootState, state}, correlationId: string) {
    const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/shopping-websites/site-verification/token`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.tokenPsAccounts}`,
        'x-correlation-id': correlationId,
      },
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    return response.json();
  },

  async [ActionsTypes.TOGGLE_WEBSITE_CLAIMING_SNIPPET]({rootState}, token: string|false) {
    const response = await fetch(`${rootState.app.psGoogleShoppingAdminUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'toggleWebsiteClaim',
        websiteClaim: token,
      }),
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    return response;
  },

  async [ActionsTypes.REQUEST_GOOGLE_TO_VERIFY_WEBSITE](
    {rootState, state},
    correlationId: string,
  ) {
    const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/shopping-websites/site-verification/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${state.tokenPsAccounts}`,
        'x-correlation-id': correlationId,
      },
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    return response.json();
  },

  async [ActionsTypes.REQUEST_WEBSITE_CLAIMING_STATUS](
    {rootState, state, commit},
    correlationId: string,
  ) {
    const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/shopping-websites/site-verification/status`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.tokenPsAccounts}`,
        'x-correlation-id': correlationId,
      },
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const json = response.json();
    commit(MutationsTypes.SAVE_WEBSITE_CLAIMING_STATUS, json);
    return json;
  },
};
