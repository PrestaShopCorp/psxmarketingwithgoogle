// TODO WHEN API OK :
// Retrieve when error is Suspended / BillingSettingsMissing /NeedRefreshAfterBilling/ Cancelled

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
    const id = rootState.accounts.googleAccount.account_id;
    // try {
    //   const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts/${id}`,
    //     {
    //       method: 'GET',
    //       headers: {
    //         Accept: 'application/json',
    //         Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
    //       },
    //     });
    //   if (!resp.ok) {
    //     throw new HttpClientError(resp.statusText, resp.status);
    // commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect',
    // );
    //   }
    //   const json = await resp.json();
    //   commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, json);
    commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT,
      {
        id: '415-056-4875',
        name: 'Tutu Corpette',
        isAdmin: true,
        isTestAccount: true,
      },
    );
    dispatch(ActionsTypes.GET_GOOGLE_ADS_ACCOUNT_SHOP_INFORMATIONS);

    // } catch (error) {
    //   console.error(error);
    // }
  },
  async [ActionsTypes.GET_GOOGLE_ADS_ACCOUNT_SHOP_INFORMATIONS]({
    commit, rootState, dispatch, state,
  }) {
    // const id = rootState.googleAds.accountChosen.id;
    // try {
    //   const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts/shopInfos/${id}`,
    //     {
    //       method: 'GET',
    //       headers: {
    //         Accept: 'application/json',
    //         Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
    //       },
    //     });
    //   if (!resp.ok) {
    //     throw new HttpClientError(resp.statusText, resp.status);
    // commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect',
    // );
    //   }
    //   const json = await resp.json();
    commit(MutationsTypes.UPDATE_GOOGLE_ADS_SHOP_INFORMATIONS,
      {
        country: {
          // eslint-disable-next-line camelcase
          iso_code: 'FR',
          name: 'France',
        },
        currency: 'EUR',
        timeZone: {
          text: null,
          offset: null,
        },
      },
    );

    // } catch (error) {
    //   console.error(error);
    // }
  },

  async [ActionsTypes.SAVE_NEW_GOOGLE_ADS_ACCOUNT]({commit, rootState, dispatch}, payload: object) {
    // try {
    //   const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //         Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
    //       },
    //       body: JSON.stringify({
    //         payload,
    //       }),
    //     });
    //   if (!resp.ok) {
    //     throw new HttpClientError(resp.statusText, resp.status);
    //     // commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect')
    //   }
    // const json = await resp.json();
    const newUser = {
      id: '417-056-4875',
      name: 'TOUTOUTOUTOUTOU',
      isAdmin: true,
      isTestAccount: true,
    };
    commit(MutationsTypes.ADD_NEW_GOOGLE_ADS_ACCOUNT, newUser);
    commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, newUser);
    dispatch(ActionsTypes.GET_GOOGLE_ADS_ACCOUNT_SHOP_INFORMATIONS);
    // } catch (error) {
    //   console.error(error);
    // }
  },
  async [ActionsTypes.DISSOCIATE_GOOGLE_ADS_ACCOUNT]({commit, rootState, state},
    correlationId: string) {
    // eslint-disable-next-line no-param-reassign
    //     correlationId = `${state.shopIdPsAccounts}-${Math.floor(Date.now() / 1000)}`;
    //   const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts`, {
    //     method: 'DELETE',
    //     headers: {
    //       Accept: 'application/json',
    //       Authorization: `Bearer ${state.tokenPsAccounts}`,
    //       'x-correlation-id': correlationId,
    //     },
    //   });
    //   if (!response.ok) {
    //     console.log('dissociate failed');
    // commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, '',

    //     throw new HttpClientError(response.statusText, response.status);
    // }
    commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, null);
    return true;
  },

  async [ActionsTypes.SAVE_SELECTED_GOOGLE_ADS_ACCOUNT]({commit, dispatch}, payload: object) {
    // const id = payload.id
    // try {
    //   const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts/${id}`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json',
    //         Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
    //       },
    //       body: JSON.stringify({
    //         payload,
    //       }),
    //     });
    //   if (!resp.ok) {
    //     throw new HttpClientError(resp.statusText, resp.status);
    // commit(MutationsTypes.SET_GOOGLE_ADS_STATUS, 'CantConnect',

    //   }
    //   const json = await resp.json();
    //   commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, {
    //   id: json.id,
    //   name: json.name,
    //   isAdmin: json.isAdmin,
    // });
    commit(MutationsTypes.SET_GOOGLE_ADS_ACCOUNT, payload);
    dispatch(ActionsTypes.GET_GOOGLE_ADS_ACCOUNT_SHOP_INFORMATIONS);
    // } catch (error) {
    //   console.error(error);
    // }
  },

};
