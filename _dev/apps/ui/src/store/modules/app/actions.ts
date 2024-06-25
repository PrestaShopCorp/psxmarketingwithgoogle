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
import {fetchShop} from 'mktg-with-google-common/api/shopClient';
import semver from 'semver';
import MutationsTypes from './mutations-types';
import ActionsTypes from './actions-types';
import {FullState} from '@/store/types';
import {State} from './state';

type Context = ActionContext<State, FullState>;

export default {
  async [ActionsTypes.REQUEST_DOC_AND_FAQ]({commit}: Context) {
    try {
      commit(MutationsTypes.SAVE_DOC_AND_FAQ,
        await fetchShop('retrieveFaq'),
      );
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.REQUEST_DEBUG_DATA]({commit}: Context) {
    try {
      commit(MutationsTypes.SAVE_DEBUG_DATA,
        await fetchShop('getDebugData'),
      );
    } catch (error) {
      console.error(error);
    }
  },
  async [ActionsTypes.CHECK_FOR_AD_BLOCKER](
    {
      commit,
      rootState,
      dispatch,
    }: Context,
  ) {
    try {
      await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/ads-accounts/check-adblocker`,
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
  async [ActionsTypes.GET_API_HEALTHCHECK]({rootState}: Context) {
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
  // eslint-disable-next-line no-empty-pattern
  async [ActionsTypes.GET_MODULES_VERSIONS]({}: Context, moduleName: string) {
    try {
      return await fetchShop('getModuleStatus', {moduleName});
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  // eslint-disable-next-line no-empty-pattern
  async [ActionsTypes.TRIGGER_REGISTER_HOOK]({}: Context, hookName: string) {
    return fetchShop('registerHook', {hookName});
  },

  async [ActionsTypes.TRIGGER_REGISTER_HOOKS]({dispatch}: Context) {
    const getModulesStatus = await dispatch(ActionsTypes.GET_MODULES_VERSIONS, 'psxmarketingwithgoogle');

    if (getModulesStatus?.hooks) {
      Object.entries(getModulesStatus.hooks)
        .forEach(([key, value]) => {
          if (value === false) {
            dispatch(ActionsTypes.TRIGGER_REGISTER_HOOK, key);
          }
        });
    }
  },
};
