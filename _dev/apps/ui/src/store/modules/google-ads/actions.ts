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
import HttpClientError from '@/api/HttpClientError';
import {runIf} from '../../../utils/Promise';
import {fetchShop} from '@/api/shopClient';

export default {
  async [ActionsTypes.WARMUP_STORE](
    {dispatch, state, getters},
  ) {
    if (state.warmedUp) {
      return;
    }
    state.warmedUp = true;

    await runIf(
      getters.GET_GOOGLE_ADS_LIST_OPTIONS === null,
      dispatch(ActionsTypes.GET_GOOGLE_ADS_LIST),
    ).then(() => runIf(
      getters.GET_GOOGLE_ADS_ACCOUNT_CHOSEN === null,
      dispatch(ActionsTypes.GET_GOOGLE_ADS_ACCOUNT),
    ));
  },
  async [ActionsTypes.GET_GOOGLE_ADS_LIST]({commit, rootState}) {
    try {
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts/list`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
        });

      if (!resp.ok) {
        commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect');
        throw new HttpClientError(resp.statusText, resp.status);
      }
      const json = await resp.json();
      commit(MutationsTypes.SET_GOOGLE_ADS_LIST, json);
    } catch (error) {
      console.error(error);
    }
  },
  async [ActionsTypes.GET_GOOGLE_ADS_ACCOUNT]({
    commit, rootState, state,
  }) {
    try {
      commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, '');
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts/status`,
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
      const customer = {
        ...json.customer,
        invitationLink: json.customer.invitationLink,
        billingSettings: json.billingSettings,
      };
      const accountIsActivated = state.list.filter((camp) => camp.id === json.customer.id);

      if (!accountIsActivated.length || json.customer.isAccountCancelled) {
        commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'Cancelled');
        commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, customer);
        return;
      }
      commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, customer);
      if (customer.invitationLink && !customer.isAdmin) {
        commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'NeedValidationFromEmail');
      } else if (!customer.billingSettings.isSet) {
        commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'BillingSettingsMissing');
      }
    } catch (error) {
      if (error instanceof HttpClientError && (error.code === 404 || error.code === 412)) {
        // This is likely caused by a missing Google Ads account
        return;
      }
      commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect');
      console.error(error);
    }
  },

  async [ActionsTypes.SAVE_NEW_GOOGLE_ADS_ACCOUNT](
    {commit, rootState}, payload,
  ) {
    const newUser = {
      name: payload.name,
      currencyCode: payload.currency,
      timeZone: payload.timeZone,
    };
    try {
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
          body: JSON.stringify(newUser),
        });

      if (!resp.ok) {
        commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect');
        throw new HttpClientError(resp.statusText, resp.status);
      }
      const json = await resp.json();
      const newUserBis = {
        id: json.adsAccountId,
        name: payload.name,
        billingSettings: {
          isSet: false,
        },
        invitationLink: json.invitationLink,
        country: payload.country,
        currencyCode: payload.currency,
        timeZone: payload.timeZone,
      };
      commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, newUserBis);
      commit(MutationsTypes.ADD_NEW_GOOGLE_ADS_ACCOUNT, newUserBis);
      commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'NeedValidationFromEmail');
    } catch (error) {
      console.error(error);
    }
  },
  async [ActionsTypes.DISSOCIATE_GOOGLE_ADS_ACCOUNT]({commit, rootState},
    correlationId: string) {
    commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, '');
    // eslint-disable-next-line no-param-reassign
    correlationId = `${rootState.accounts.shopIdPsAccounts}-${Math.floor(Date.now() / 1000)}`;
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        'x-correlation-id': correlationId,
      },
    });

    if (!response.ok) {
      console.log('dissociate failed');
      commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, null);
      throw new HttpClientError(response.statusText, response.status);
    }
    commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, null);
    return true;
  },

  async [ActionsTypes.SAVE_SELECTED_GOOGLE_ADS_ACCOUNT]({
    commit, rootState,
  }, payload) {
    try {
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts/${payload.id}/link`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
        });

      if (!resp.ok) {
        commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect');
        throw new HttpClientError(resp.statusText, resp.status);
      }
      await resp.json();
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_GOOGLE_ADS_SHOPINFORMATIONS_BILLING]({commit}) {
    const result = await fetchShop('getShopConfigurationForAds');

    const shopInfo = {
      currency: result.currency,
      timeZone: result.timezone.text,
    };
    commit(MutationsTypes.SET_BILLING_SHOP_INFORMATIONS, shopInfo);
    return result;
  },

};
