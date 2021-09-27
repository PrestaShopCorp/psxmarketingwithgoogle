// TODO ERROR :  Cancelled / Suspended

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

export default {
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
    commit, rootState, dispatch, state,
  }) {
    try {
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
        billingSettings: json.billingSettings,
      };
      commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, customer);
      if (customer.isAccountCancelled === true) {
        commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'Cancelled');
      }
      if (customer.isAccountSuspended === true) {
        commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'Suspended');
      }

      if (!customer.billingSettings.isSet) {
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
    {commit, rootState, dispatch}, payload,
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
          link: json.invitationLink,
        },
        country: payload.country,
        currencyCode: payload.currency,
        timeZone: payload.timeZone,
      };
      commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, newUserBis);
      commit(MutationsTypes.ADD_NEW_GOOGLE_ADS_ACCOUNT, newUserBis);
      dispatch(ActionsTypes.SAVE_SELECTED_GOOGLE_ADS_ACCOUNT, newUserBis);
      if (!newUserBis.billingSettings.isSet) {
        commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'BillingSettingsMissing');
      }
    } catch (error) {
      console.error(error);
    }
  },
  async [ActionsTypes.DISSOCIATE_GOOGLE_ADS_ACCOUNT]({commit, rootState, state},
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
      throw new HttpClientError(response.statusText, response.status);
    }
    commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, null);
    return true;
  },

  async [ActionsTypes.SAVE_SELECTED_GOOGLE_ADS_ACCOUNT]({
    commit, rootState, dispatch,
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
      const json = await resp.json();
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_GOOGLE_ADS_SHOPINFORMATIONS_BILLING]({rootState, state, commit}) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'getShopConfigurationForAds',
      }),
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const result = await response.json();

    const shopInfo = {
      currency: result.currency,
      timeZone: result.timezone.text,
    };
    commit(MutationsTypes.SET_BILLING_SHOP_INFORMATIONS, shopInfo);
    return result;
  },

};
