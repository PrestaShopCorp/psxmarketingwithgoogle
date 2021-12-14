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
  async [ActionsTypes.REQUEST_DOC_AND_FAQ](
    {
      commit,
      rootState,
    },
  ) {
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({
          action: 'retrieveFaq',
        }),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      commit(MutationsTypes.SAVE_DOC_AND_FAQ, await response.json());
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.REQUEST_DEBUG_DATA](
    {
      commit,
      rootState,
    },
  ) {
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({
          action: 'getDebugData',
        }),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      commit(MutationsTypes.SAVE_DEBUG_DATA, await response.json());
    } catch (error) {
      console.error(error);
    }
  },
  async [ActionsTypes.CHECK_FOR_AD_BLOCKER](
    {
      commit,
      rootState,
      dispatch,
    },
  ) {
    try {
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts/check-adblocker`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
        });
    } catch (error) {
      const healthcheck = await dispatch(ActionsTypes.GET_API_HEALTHCHECK);

      if (error instanceof TypeError
        && error.message === 'Failed to fetch'
        && healthcheck?.status === 'ok'
      ) {
        commit(MutationsTypes.AD_BLOCKER_EXISTS);
      }
    }
  },
  async [ActionsTypes.GET_API_HEALTHCHECK]({rootState}) {
    try {
      const resp = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/healthcheck`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
          },
        });
      return resp.json();
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  async [ActionsTypes.UPDATE_EVENTBUS_MODULE]({rootState}) {
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({
          action: 'getEventBusModuleStatus',
          version: rootState.app.eventbusVersion,
        }),
      });
      console.log('response', response);
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
