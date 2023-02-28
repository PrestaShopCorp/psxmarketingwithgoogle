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
import MutationsTypesGoogleAds from '../google-ads/mutations-types';
import ActionsTypes from './actions-types';
import {fetchShop} from "mktg-with-google-common/api/shopClient";
import {fetchOnboarding} from "mktg-with-google-common/api/onboardingClient";
import HttpClientError from "mktg-with-google-common/api/HttpClientError";
import NeedOverwriteError from '../../../utils/NeedOverwriteError';
import CannotOverwriteError from '../../../utils/CannotOverwriteError';

export default {
  async [ActionsTypes.WARMUP_STORE](
    {dispatch, state},
  ) {
    if (state.warmedUp) {
      return;
    }
    state.warmedUp = true;

    await dispatch(ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS);
  },
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
      console.error(`Could not trigger onboarding to google account: ${(<any>error)?.message}`);
    }
  },

  async [ActionsTypes.SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT](
    {
      commit,
      rootState,
      state,
      dispatch,
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
    dispatch(ActionsTypes.SEND_GMC_INFORMATION_TO_SHOP, {
      id: selectedAccount.id,
    });

    await response.json();
    commit(MutationsTypes.SAVE_GMC, selectedAccount);
  },

  async [ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS](
    {
      commit,
      dispatch,
      state,
      rootState,
    },
    correlationId: string,
  ) {
    commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, WebsiteClaimErrorReason.PendingCheck);
    try {
      let {isVerified, isClaimed} = await dispatch(
        ActionsTypes.REQUEST_WEBSITE_CLAIMING_STATUS,
        correlationId,
      );

      const {token} = await dispatch(ActionsTypes.REQUEST_SITE_VERIFICATION_TOKEN, correlationId);
      dispatch(ActionsTypes.SAVE_WEBSITE_VERIFICATION_META, token);

      if (!isVerified || !isClaimed) {
        if (rootState.app.psxMktgWithGoogleModuleIsEnabled === false) {
          commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, null);
          return;
        }
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
      } else if (state.googleMerchantAccount.isSuspended.status) {
        commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, null);
      } else if (state.googleMerchantAccount.isPhoneVerified.status === false) {
        commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
          WebsiteClaimErrorReason.PhoneVerificationNeeded);
      } else {
        commit(MutationsTypes.SAVE_MCA_CONNECTED_ONCE, true);
        commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, null);
      }
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
  },

  async [ActionsTypes.TOGGLE_GOOGLE_ACCOUNT_IS_REGISTERED]({
    rootState,
  }, isGoogleAccountLinked: boolean) {
    return fetchShop('toggleGoogleAccountIsRegistered', {isGoogleAccountLinked});
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
      console.error(`Could not request route to google auth: ${(<any>error)?.message}`);
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
      if (json.google_ads_account_id) {
        commit(`googleAds/${MutationsTypesGoogleAds.SET_GOOGLE_ADS_ACCOUNT_ID}`, json.google_ads_account_id,
          {root: true},
        );
      }
      // If GMC is already linked, must start by requesting GMC list, then look after the link GMC.
      // Also needed if we didn't have linked the accounts yet, as the marchant has to pick one.
      dispatch(ActionsTypes.REQUEST_GMC_LIST);
      return json;
    } catch (error) {
      dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
      if (error instanceof HttpClientError && (error.code === 404 || error.code === 412)) {
        // This is likely caused by a missing Google account, so let's retrieve the URL
        return null;
      }
      console.error(`Could not request google account details: ${(<any>error)?.message}`);
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
          // Cannot find linked GMC. Maybe it's a freshly created one, in this case previous HTTP
          //  call has failed. Then try another way...
          dispatch(ActionsTypes.REQUEST_NEW_GMC_DETAILS);
        }
      }
    } catch (error) {
      commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, WebsiteClaimErrorReason.LinkingFailed);
      console.error(`Could not request GMC list: ${(<any>error)?.message}`);
    }
  },

  async [ActionsTypes.DISSOCIATE_GOOGLE_ACCOUNT]({
    commit, rootState, state, dispatch,
  }) {
    const correlationId = `${state.shopIdPsAccounts}-${Math.floor(Date.now() / 1000)}`;
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

    commit(MutationsTypes.REMOVE_GMC);
    commit(MutationsTypes.SAVE_MCA_CONNECTED_ONCE, false);
    commit(`productFeed/${MutationsTypesProductFeed.TOGGLE_CONFIGURATION_FINISHED}`, false, {root: true});
    commit(MutationsTypes.REMOVE_GOOGLE_ACCOUNT);
    commit(MutationsTypes.SET_GOOGLE_ACCOUNT, null);
    dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
    dispatch(ActionsTypes.TOGGLE_GOOGLE_ACCOUNT_IS_REGISTERED, false);
    return true;
  },

  async [ActionsTypes.DISSOCIATE_GMC]({
    commit,
    rootState,
    state,
    dispatch,
  }, correlationId: string) {
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
    dispatch(ActionsTypes.SAVE_WEBSITE_VERIFICATION_META, false);
    commit(MutationsTypes.REMOVE_GMC);
    commit(MutationsTypes.SAVE_MCA_CONNECTED_ONCE, false);
    commit(`googleAds/${MutationsTypesGoogleAds.SET_GOOGLE_ADS_ACCOUNT}`, '', {root: true});
    commit(`productFeed/${MutationsTypesProductFeed.REMOVE_PRODUCT_FEED}`, null, {root: true});
    commit(`productFeed/${MutationsTypesProductFeed.SET_ACTIVE_CONFIGURATION_STEP}`, 1, {root: true});
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
      commit(MutationsTypes.SAVE_MCA_CONNECTED_ONCE, true);
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
      // 1- Get site verification token from onboarding API
      const {token} = await dispatch(ActionsTypes.REQUEST_SITE_VERIFICATION_TOKEN, correlationId);
      // 2- Store token in shop
      await dispatch(ActionsTypes.SAVE_WEBSITE_VERIFICATION_META, token);
      // 3- Request verification to Google via onboarding API
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
      console.error(`Could not trigger website verification process: ${(<any>error)?.message}`);
      throw error;
    }
  },

  async [ActionsTypes.REQUEST_SITE_VERIFICATION_TOKEN]({rootState, state}, correlationId: string) {
    return await fetchOnboarding(
      'GET',
      'shopping-websites/site-verification/token',
      correlationId,
    );
  },

  // eslint-disable-next-line no-empty-pattern
  async [ActionsTypes.SAVE_WEBSITE_VERIFICATION_META]({}, token: string|false) {
    return fetchShop('setWebsiteVerificationMeta', {websiteVerificationMeta: token});
  },

  async [ActionsTypes.REQUEST_GOOGLE_TO_VERIFY_WEBSITE](
    {rootState, state},
    correlationId: string,
  ) {
    return await fetchOnboarding(
      'POST',
      'shopping-websites/site-verification/verify',
      correlationId,
    );
  },

  async [ActionsTypes.REQUEST_WEBSITE_CLAIMING_STATUS](
    {
      rootState, state, commit, dispatch,
    },
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

  // eslint-disable-next-line no-empty-pattern
  async [ActionsTypes.SEND_WEBSITE_REQUIREMENTS]({}, payload: Array<String>) {
    return fetchShop('setWebsiteRequirementStatus', {requirements: payload});
  },

  async [ActionsTypes.REQUEST_WEBSITE_REQUIREMENTS]({commit}) {
    try {
      const json = await fetchShop('getWebsiteRequirementStatus');

      commit(MutationsTypes.SAVE_WEBSITE_REQUIREMENTS, json);
    } catch (error) {
      console.error(`Could not request website requirements: ${(<any>error)?.message}`);
    }
  },

  async [ActionsTypes.REQUEST_SHOP_INFORMATIONS]({rootState, commit}) {
    try {
      const json = await fetchShop('getShopConfigurationForGMC');
      commit(MutationsTypes.SAVE_SHOP_INFORMATIONS, json);
    } catch (error) {
      console.error(`Could not request shop information: ${(<any>error)?.message}`);
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
      dispatch(ActionsTypes.SEND_GMC_INFORMATION_TO_SHOP, {
        id: accountId,
      });

      commit(
        MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
        WebsiteClaimErrorReason.PhoneVerificationNeeded,
      );
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.REQUEST_NEW_GMC_DETAILS]({
    commit, rootState, state, dispatch,
  }) {
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/merchant-accounts/${state.googleMerchantAccount.id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${state.tokenPsAccounts}`,
        },
      });

      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const linkedGmc = await response.json();

      if (linkedGmc) {
        commit(MutationsTypes.SAVE_GMC, linkedGmc);
        dispatch(ActionsTypes.SEND_GMC_INFORMATION_TO_SHOP, {
          id: rootState.accounts.googleMerchantAccount.id,
        });
        dispatch(ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS);
      } else {
        throw new Error('Failed to find GMC!');
      }
    } catch (error) {
      console.error(error);
      console.log(`GMC ${state.googleMerchantAccount.id} not found, try to search again in 15s`);
      setTimeout(() => dispatch(ActionsTypes.REQUEST_GMC_LIST), 15000);
    }
    return null;
  },

  async [ActionsTypes.REQUEST_VERIFICATION_CODE](
    {rootState, state}, payload) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/merchant-accounts/phone-verification/request-code`, {
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
    return response.json();
  },

  async [ActionsTypes.SEND_VERIFICATION_CODE](
    {rootState, state}, payload) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/merchant-accounts/phone-verification/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${state.tokenPsAccounts}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const json = await response.json();
      throw new HttpClientError(json, response.status);
    }
    return response.json();
  },

  async [ActionsTypes.SEND_GMC_INFORMATION_TO_SHOP]({
    rootState,
  }, gmcInfo) {
    try {
      await fetchShop('setGMCInformations', {gmcInformations: gmcInfo});
    } catch (error) {
      console.error(error);
    }
  },
};
