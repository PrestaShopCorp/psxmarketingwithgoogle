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

import {WebsiteClaimErrorReason} from '@/store/modules/accounts/state';
import MutationsTypes from './mutations-types';
import MutationsTypesProductFeed from '../product-feed/mutations-types';
import ActionsTypes from './actions-types';
import HttpClientError from '../../../utils/HttpClientError';
import NeedOverwriteError from '../../../utils/NeedOverwriteError';
import CannotOverwriteError from '../../../utils/CannotOverwriteError';

export default {
  async [ActionsTypes.TRIGGER_ONBOARD_TO_GOOGLE_ACCOUNT](
    {
      commit,
      rootState,
      state,
    },
    webhookUrl: String,
  ) {
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/account/onboard`, {
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

  async [ActionsTypes.SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT](
    {
      commit,
      rootState,
      state,
    },
    payload,
  ) {
    const {selectedAccount, correlationId} = payload;
    const url = rootState.app.psxMktgWithGoogleApiUrl;
    const aggregator = selectedAccount.aggregatorId ? `?aggregator_id=${selectedAccount.aggregatorId}` : '';
    const route = `${url}/merchant-accounts/${selectedAccount.id}/link${aggregator}`;
    const response = await fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${state.tokenPsAccounts}`,
        'x-correlation-id': correlationId,
      },
    });
    if (!response.ok) {
      commit(
        MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
        WebsiteClaimErrorReason.LinkingFailed,
      );
      throw new HttpClientError(response.statusText, response.status);
    }

    const json = await response.json();
    commit(MutationsTypes.SAVE_GMC, selectedAccount);
  },

  async [ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS](
    {
      commit,
      dispatch,
      state,
    },
    correlationId: string,
  ) {
    commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, WebsiteClaimErrorReason.PendingCheck);

    let {isVerified, isClaimed} = await dispatch(
      ActionsTypes.REQUEST_WEBSITE_CLAIMING_STATUS,
      correlationId,
    );

    if (!isVerified || !isClaimed) {
      try {
        const result = await dispatch(
          ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_PROCESS,
          correlationId,
        );
        isVerified = result.isVerified;
        isClaimed = result.isClaimed;

        if (!result.isVerified) {
          return;
        }

        await dispatch(
          ActionsTypes.TRIGGER_WEBSITE_CLAIMING_PROCESS,
          {overwrite: false, correlationId},
        );
      } catch (error) {
        if (error instanceof NeedOverwriteError) {
          commit(
            MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
            WebsiteClaimErrorReason.OverwriteNeeded,
          );
        } else {
          commit(
            MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
            WebsiteClaimErrorReason.AccountValidationFailed,
          );
        }
      }
    } else {
      commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, null);
    }
  },

  async [ActionsTypes.TOGGLE_GOOGLE_ACCOUNT_IS_REGISTERED]({
    rootState,
  }, isGoogleAccountLinked: boolean) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'toggleGoogleAccountIsRegistered',
        isGoogleAccountLinked,
      }),
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const finished = await response.json();
    return finished;
  },

  async [ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH]({commit, state, rootState}) {
    const urlState = btoa(JSON.stringify({
      redirectUri: rootState.app.psxMktgWithGoogleAdminUrl,
      shopId: state.shopIdPsAccounts,
      shopUrl: rootState.app.psxMktgWithGoogleShopUrl,
    }));
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/oauth/authorized-url?state=${urlState}`, {
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
      commit(MutationsTypes.SET_GOOGLE_AUTHENTICATION_URL, error);
    }
  },

  async [ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS]({
    commit, state, rootState, dispatch,
  }) {
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/oauth`, {
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
      if (json.account_id) {
        commit(MutationsTypes.SAVE_GMC, {
          id: json.account_id,
        });
      }
      // If GMC is already linked, must start by requesting GMC list, then look after the link GMC.
      // Also needed if we didn't have linked the accounts yet, as the marchant has to pick one.
      dispatch(ActionsTypes.REQUEST_GMC_LIST);
      return json;
    } catch (error) {
      if (error instanceof HttpClientError && (error.code === 404 || error.code === 412)) {
        // This is likely caused by a missing Google account, so let's retrieve the URL
        dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
        return null;
      }
      console.error(error);
      commit(MutationsTypes.SAVE_GOOGLE_ACCOUNT_TOKEN, error);
    }
    return null;
  },

  async [ActionsTypes.REQUEST_GMC_LIST]({
    commit, state, rootState, dispatch,
  }) {
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/merchant-accounts`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${state.tokenPsAccounts}`,
        },
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();

      commit(MutationsTypes.SAVE_GMC_LIST, json);

      // Now we have the GMC merchant's list, if he already linked one, then must fill it now
      if (state.googleMerchantAccount.id) {
        const linkedGmc = json.find((gmc) => gmc.id === state.googleMerchantAccount.id);
        if (linkedGmc) {
          commit(MutationsTypes.SAVE_GMC, linkedGmc);
          dispatch(ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS);
        } else {
          console.log(`GMC ${state.googleMerchantAccount.id} not found, try to search again in 15s`);
          setTimeout(() => dispatch(ActionsTypes.REQUEST_GMC_LIST), 15000);
        }
      }
    } catch (error) {
      commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, WebsiteClaimErrorReason.LinkingFailed);
      console.error(error);
    }
  },

  async [ActionsTypes.DISSOCIATE_GOOGLE_ACCOUNT]({
    commit, rootState, state, dispatch,
  }) {
    const correlationId = `${state.shopIdPsAccounts}-${Math.floor(Date.now() / 1000)}`;
    await dispatch(ActionsTypes.DISSOCIATE_GMC, correlationId);
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/oauth`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.tokenPsAccounts}`,
        'x-correlation-id': correlationId,
      },
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    commit(MutationsTypes.REMOVE_GOOGLE_ACCOUNT);
    commit(MutationsTypes.SET_GOOGLE_ACCOUNT, null);
    dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
    dispatch(ActionsTypes.TOGGLE_GOOGLE_ACCOUNT_IS_REGISTERED, false);
    return true;
  },

  async [ActionsTypes.DISSOCIATE_GMC]({commit, rootState, state}, correlationId: string) {
    if (state.googleMerchantAccount.id) {
      if (!correlationId) {
        // eslint-disable-next-line no-param-reassign
        correlationId = `${state.shopIdPsAccounts}-${Math.floor(Date.now() / 1000)}`;
      }
      const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/merchant-accounts`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${state.tokenPsAccounts}`,
          'x-correlation-id': correlationId,
        },
      });
      if (!response.ok) {
        commit(
          MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
          WebsiteClaimErrorReason.UnlinkFailed,
        );
        throw new HttpClientError(response.statusText, response.status);
      }
    }
    commit(MutationsTypes.REMOVE_GMC);
    commit(`productFeed/${MutationsTypesProductFeed.TOGGLE_CONFIGURATION_FINISHED}`, false, {root: true});
    return true;
  },

  async [ActionsTypes.REQUEST_TO_OVERRIDE_CLAIM]({commit, dispatch}) {
    try {
      await dispatch(
        ActionsTypes.TRIGGER_WEBSITE_CLAIMING_PROCESS,
        {overwrite: true},
      );
      commit(MutationsTypes.SAVE_WEBSITE_CLAIMING_STATUS, false);
      setTimeout(() => {
        commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, null);
        commit(MutationsTypes.SAVE_WEBSITE_CLAIMING_STATUS, true);
      }, 2000);
    } catch (error) {
      if (error instanceof CannotOverwriteError) {
        commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
          WebsiteClaimErrorReason.OverwriteNeededWithManualAction);
      } else {
        commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
          WebsiteClaimErrorReason.AccountValidationFailed);
      }
    }
    return true;
  },

  /** Merchant Center Account - Website verification */
  async [ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_PROCESS]({dispatch, state}) {
    const correlationId = `${state.shopIdPsAccounts}-${Math.floor(Date.now() / 1000)}`;
    try {
      // 1- Get site verification token from Nest
      const {token} = await dispatch(ActionsTypes.REQUEST_SITE_VERIFICATION_TOKEN, correlationId);
      // 2- Store token in shop
      await dispatch(ActionsTypes.SAVE_WEBSITE_VERIFICATION_META, token);
      // 3- Request verification to Google via Nest
      await dispatch(ActionsTypes.REQUEST_GOOGLE_TO_VERIFY_WEBSITE, correlationId);
      // 4- Retrieve verification results
      const {isVerified, isClaimed} = await dispatch(
        ActionsTypes.REQUEST_WEBSITE_CLAIMING_STATUS,
        correlationId,
      );
      if (!isVerified) {
        throw new Error('Website was not verified by Google');
      }
      return {isVerified, isClaimed};
    } catch (error) {
      console.error(error);
      return {isVerified: false, isClaimed: false};
    } finally {
      // Remove token anyway
      await dispatch(ActionsTypes.SAVE_WEBSITE_VERIFICATION_META, false);
    }
  },

  async [ActionsTypes.REQUEST_SITE_VERIFICATION_TOKEN]({rootState, state}, correlationId: string) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-websites/site-verification/token`, {
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

  async [ActionsTypes.SAVE_WEBSITE_VERIFICATION_META]({rootState}, token: string|false) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'setWebsiteVerificationMeta',
        websiteVerificationMeta: token,
      }),
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    return response.json();
  },

  async [ActionsTypes.REQUEST_GOOGLE_TO_VERIFY_WEBSITE](
    {rootState, state},
    correlationId: string,
  ) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-websites/site-verification/verify`, {
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
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/shopping-websites/site-verification/status`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.tokenPsAccounts}`,
        'x-correlation-id': correlationId,
      },
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const json = await response.json();
    commit(MutationsTypes.SAVE_WEBSITE_VERIFICATION_AND_CLAIMING_STATUS, json);
    return json;
  },

  async [ActionsTypes.TRIGGER_WEBSITE_CLAIMING_PROCESS](
    {rootState, state, commit},
    payload,
  ) {
    const {overwrite, correlationId} = payload;
    const overwriteParam = `?overwrite=${overwrite ? 'true' : 'false'}`;
    const url = `${rootState.app.psxMktgWithGoogleApiUrl}/shopping-websites/site-verification/claim${overwriteParam}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${state.tokenPsAccounts}`,
        'x-correlation-id': correlationId,
      },
    });
    if (!response.ok) {
      const error = await response.json();

      if (error.fromGoogle?.needOverwrite) {
        throw new NeedOverwriteError(error, error.fromGoogle.error.code);
      }
      if (error.fromGoogle?.cannotOverwrite) {
        throw new CannotOverwriteError(error, error.fromGoogle.error.code);
      }
      throw new HttpClientError(response.statusText, response.status);
    }
    commit(MutationsTypes.SAVE_WEBSITE_CLAIMING_STATUS, true);
    commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, null);
    return response.json();
  },

  async [ActionsTypes.SEND_WEBSITE_REQUIREMENTS](
    {rootState},
    payload: Array<String>,
  ) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'setWebsiteRequirementStatus',
        requirements: payload,
      }),
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    return response.json();
  },

  async [ActionsTypes.REQUEST_WEBSITE_REQUIREMENTS]({rootState, commit}) {
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({
          action: 'getWebsiteRequirementStatus',
        }),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }

      const json = await response.json();
      commit(MutationsTypes.SAVE_WEBSITE_REQUIREMENTS, json);
    } catch (error) {
      console.log(error);
    }
  },

  async [ActionsTypes.REQUEST_SHOP_INFORMATIONS]({rootState, commit}) {
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({
          action: 'getShopConfigurationForGMC',
        }),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }

      const json = await response.json();
      commit(MutationsTypes.SAVE_SHOP_INFORMATIONS, json);
    } catch (error) {
      console.log(error);
    }
  },

  async [ActionsTypes.REQUEST_TO_SAVE_NEW_GMC]({
    rootState, dispatch, state, commit,
  }, payload) {
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/merchant-accounts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${state.tokenPsAccounts}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }

      const json = await response.json();
      const accountId = json.account_id;
      const newGmc = {
        aggregatorId: json.aggregator_id,
        kind: 'content#account',
        id: accountId,
        name: payload.shop_name,
        websiteUrl: payload.shop_url,
        adultContent: payload.adult_content,
        users: [
          {
            emailAddress: rootState.accounts.googleAccount.details.email,
            admin: true,
          },
        ],
        businessInformation: {
          address: {
            country: payload.location,
          },
        },
        subAccountNotManagedByPrestashop: false,
      };

      commit(MutationsTypes.ADD_NEW_GMC, newGmc);
      commit(MutationsTypes.SAVE_GMC, newGmc);
      await dispatch(ActionsTypes.SEND_WEBSITE_REQUIREMENTS, []);

      commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, WebsiteClaimErrorReason.PendingCreation);
      setTimeout(async () => {
        await dispatch(ActionsTypes.REQUEST_GMC_LIST); // TODO !0: tester cela
      }, 60000);
    } catch (error) {
      console.log(error);
    }
  },
};
