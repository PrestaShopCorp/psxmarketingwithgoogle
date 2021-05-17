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
  async [ActionsTypes.GET_VALIDATION_LIST]({commit, rootState}) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`);
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_VALIDATION_LIST_STATEMENT, json);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_SUMMARY_VALIDATION]({commit, rootState}) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`);
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_SUMMARY_VALIDATION, json);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.SEND_FREE_LISTING_STATEMENT]({commit, rootState}, payload: any) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_FREE_LISTING_STATUS, json);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_LAST_SYNCHRONISATION]({commit, rootState}) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`);
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, json);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.REGISTER_SYNCHRONISATION]({commit, rootState}, payload: any) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_REGISTERED_DATA_SYNC, json);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.SUSPEND_SYNCHRONISATION]({commit, rootState}, payload: any) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_SUSPENDED_DATA_SYNC, json);
    } catch (error) {
      console.error(error);
    }
  },
};
