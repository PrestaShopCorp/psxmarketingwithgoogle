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
  // async [ActionsTypes.GET_VALIDATION_LIST]({commit, rootState}) {
  //   try {
  //     const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`);
  //     if (!response.ok) {
  //       throw new HttpClientError(response.statusText, response.status);
  //     }
  //     const json = await response.json();
  //     commit(MutationsTypes.SET_VALIDATION_LIST_STATEMENT, json);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },

  // async [ActionsTypes.GET_SUMMARY_VALIDATION]({commit, rootState}) {
  //   try {
  //     const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`);
  //     if (!response.ok) {
  //       throw new HttpClientError(response.statusText, response.status);
  //     }
  //     const json = await response.json();
  //     commit(MutationsTypes.SET_SUMMARY_VALIDATION, json);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },

  async [ActionsTypes.GET_FREE_LISTING_STATUS]({commit, rootState}) {
    try {
      const resp = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/free-listings/settings`,
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
      commit(MutationsTypes.SET_FREE_LISTING_STATUS, json.enabled);
    } catch (error) {
      console.error(error);
    }
  },
  async [ActionsTypes.SEND_FREE_LISTING_STATUS]({commit, rootState}, enabled: boolean) {
    try {
      const resp = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/free-listings/toggle`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
          body: JSON.stringify({
            enabled,
          }),
        });
      if (!resp.ok) {
        commit(MutationsTypes.SET_ERROR_API, true);
        throw new HttpClientError(resp.statusText, resp.status);
      }

      const json = await resp.json();
      commit(MutationsTypes.SET_ERROR_API, false);
      // ! It looks like the API always sends back "true"
      //  ! So i don't use its response
      commit(MutationsTypes.SET_FREE_LISTING_STATUS, enabled);
    } catch (error) {
      console.error(error);
    }
  },

};
