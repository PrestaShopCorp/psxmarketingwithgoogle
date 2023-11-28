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
import {fetchOnboarding, fetchShop, HttpClientError} from 'mktg-with-google-common';
import MutationsTypesCampaigns from '../campaigns/mutations-types';
import MutationsTypes from './mutations-types';
import ActionsTypes from './actions-types';
import {runIf} from '../../../utils/Promise';
import {FullState} from '@/store/types';
import {State} from './state';

type Context = ActionContext<State, FullState>;

export default {
  async [ActionsTypes.WARMUP_STORE](
    {dispatch, state, getters}: Context,
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
  async [ActionsTypes.GET_GOOGLE_ADS_LIST]({commit}: Context) {
    try {
      const json = await fetchOnboarding(
        'GET',
        'ads-accounts/list',
        {
          onResponse: async (response) => {
            if (!response.ok) {
              commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect');
              throw new HttpClientError(response.statusText, response.status);
            }
            return response.json();
          },
        },
      );
      commit(MutationsTypes.SET_GOOGLE_ADS_LIST, json);
    } catch (error) {
      console.error(error);
    }
  },
  async [ActionsTypes.GET_GOOGLE_ADS_ACCOUNT]({
    commit, state,
  }: Context) {
    try {
      commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, '');
      const json = await (await fetchOnboarding(
        'GET',
        'ads-accounts/status',
      )).json();
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
    {commit}: Context, payload,
  ) {
    const newUser = {
      name: payload.name,
      currencyCode: payload.currency,
      timeZone: payload.timeZone,
    };
    try {
      const json = await fetchOnboarding(
        'POST',
        'ads-accounts/create',
        {
          body: newUser,
          onResponse: async (response) => {
            if (!response.ok) {
              commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect');
              throw new HttpClientError(response.statusText, response.status);
            }
            return response.json();
          },
        },
      );
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
  async [ActionsTypes.DISSOCIATE_GOOGLE_ADS_ACCOUNT]({commit, rootState}: Context,
    correlationId: string) {
    commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, '');
    await fetchOnboarding(
      'DELETE',
      'ads-accounts',
      {
        correlationId: correlationId || `${rootState.accounts.shopIdPsAccounts}-${Math.floor(Date.now() / 1000)}`,
      },
    ).finally(() => {
      commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, null);
      commit(`campaigns/${MutationsTypesCampaigns.RESET_CAMPAIGNS_LIST}`, {root: true});
    });
    return true;
  },

  async [ActionsTypes.SAVE_SELECTED_GOOGLE_ADS_ACCOUNT]({
    commit,
  }: Context, payload) {
    try {
      await fetchOnboarding(
        'POST',
        `ads-accounts/${payload.id}/link`,
        {
          onResponse: async (response) => {
            if (!response.ok) {
              commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect');
              throw new HttpClientError(response.statusText, response.status);
            }
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_GOOGLE_ADS_SHOPINFORMATIONS_BILLING]({commit}: Context) {
    const result = await fetchShop('getShopConfigurationForAds');

    const shopInfo = {
      currency: result.currency,
      timeZone: result.timezone.text,
    };
    commit(MutationsTypes.SET_BILLING_SHOP_INFORMATIONS, shopInfo);
    return result;
  },

};
