import {ActionContext} from 'vuex';
import {fetchOnboarding, fetchShop, HttpClientError} from 'mktg-with-google-common';
import {
  GoogleConnectionStatus,
  GoogleMerchantAccount,
  WebsiteClaimErrorReason,
} from '@/store/modules/accounts/state';
import MutationsTypes from './mutations-types';
import MutationsTypesProductFeed from '../product-feed/mutations-types';
import MutationsTypesGoogleAds from '../google-ads/mutations-types';
import ActionsTypes from './actions-types';
import NeedOverwriteError from '../../../utils/NeedOverwriteError';
import CannotOverwriteError from '../../../utils/CannotOverwriteError';
import {FullState} from '@/store/types';
import appGetters from '@/store/modules/app/getters-types';
import {State} from './state';

type Context = ActionContext<State, FullState>;

export default {
  async [ActionsTypes.WARMUP_STORE](
    {dispatch, state}: Context,
  ) {
    if (state.warmedUp) {
      return;
    }
    state.warmedUp = true;

    await dispatch(ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS);
  },

  async [ActionsTypes.SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT](
    {
      commit,
      dispatch,
    }: Context,
    payload,
  ) {
    const {selectedAccount, correlationId} = payload;
    const merchantResponse = await fetchOnboarding(
      'POST',
      'merchant-accounts/select',
      {
        body: {accountId: selectedAccount.id},
        correlationId,
        onResponse: async (response) => {
          if (!response.ok) {
            commit(
              MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
              WebsiteClaimErrorReason.LinkingFailed,
            );
            throw new HttpClientError(response.statusText, response.status);
          }
          return response;
        },
      },
    );
    const json = await merchantResponse.json();
    commit(MutationsTypes.SAVE_GMC, json.account);
    dispatch(ActionsTypes.REQUEST_DATA_SOURCE_LIST);

    return json.account;
  },

  async [ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS](
    {
      commit,
      dispatch,
      state,
      rootState,
    }: Context,
    correlationId: string,
  ) {
    // Verify/claim reads are denied (403) until the shop's admin-user
    // invitation to the sub-account is accepted. Show the banner and poll for
    // acceptance so the flow resumes on its own (no manual page refresh).
    if (state.googleMerchantAccount.pendingUserInvitation) {
      commit(
        MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
        WebsiteClaimErrorReason.PendingUserInvitation,
      );
      dispatch(ActionsTypes.AWAIT_USER_INVITATION_ACCEPTANCE, correlationId);
      return;
    }
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
      } else if (state.googleMerchantAccount.accountIssues.length) {
        commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, null);
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

  async [ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH]({commit}: Context) {
    try {
      const json = await (await fetchOnboarding(
        'GET',
        'oauth/authorized-url',
      )).json();

      commit(MutationsTypes.SET_GOOGLE_AUTHENTICATION_URL, json.authorizedUrl);
    } catch (error) {
      console.error(`Could not request route to google auth: ${(<any>error)?.message}`);
      commit(MutationsTypes.SET_GOOGLE_AUTHENTICATION_URL, error);
    }
  },

  async [ActionsTypes.REQUEST_GOOGLE_ACCOUNT_DETAILS]({
    commit, dispatch,
  }: Context) {
    try {
      const connection = (await (await fetchOnboarding('GET', 'oauth')).json()) as GoogleConnectionStatus;

      commit(MutationsTypes.SET_GOOGLE_ACCOUNT, connection);
      if (!connection.connected) {
        dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
      } else {
        dispatch(ActionsTypes.REQUEST_GMC_LIST);
      }

      return connection;
    } catch (error) {
      dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
      commit(MutationsTypes.SET_GOOGLE_ACCOUNT, null);
      if (error instanceof HttpClientError && (error.code === 404 || error.code === 412)) {
        // This is likely caused by a missing Google account, so let's retrieve the URL
        return null;
      }
      console.error(`Could not request google account details: ${(<any>error)?.message}`);
    }
    return null;
  },

  async [ActionsTypes.REQUEST_GMC_LIST]({
    commit, state, dispatch,
  }: Context) {
    try {
      const json = await (await fetchOnboarding(
        'GET',
        'merchant-accounts',
      )).json();
      const {accounts} = json;
      commit(MutationsTypes.SAVE_GMC_LIST, accounts);

      if (state.googleAccount.merchantAccount) {
        const linkedGmc = accounts.find(
          (gmc) => gmc.id === state.googleAccount.merchantAccount,
        );

        if (linkedGmc) {
          commit(MutationsTypes.SAVE_GMC, linkedGmc);
          dispatch(ActionsTypes.REQUEST_DATA_SOURCE_LIST);
        }
      }

      return accounts;
    } catch (error) {
      commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, WebsiteClaimErrorReason.LinkingFailed);
      console.error(`Could not request GMC list: ${(<any>error)?.message}`);
    }
    return [];
  },

  async [ActionsTypes.REQUEST_DATA_SOURCE_LIST]({commit}: Context) {
    const json = await (await fetchOnboarding(
      'GET',
      'merchant-data-sources',
    )).json();
    commit(MutationsTypes.SAVE_DATA_SOURCE_LIST, json.dataSources);

    return json.dataSources;
  },

  async [ActionsTypes.CREATE_DATA_SOURCE]({commit}: Context, payload) {
    const json = await (await fetchOnboarding(
      'POST',
      'merchant-data-sources',
      {
        body: {
          feedLabel: payload.feedLabel,
          contentLanguage: payload.contentLanguage,
        },
      },
    )).json();
    commit(MutationsTypes.SAVE_DATA_SOURCE, json.dataSource);

    return json.dataSource;
  },

  async [ActionsTypes.DISSOCIATE_GOOGLE_ACCOUNT]({
    commit, dispatch,
  }: Context) {
    const correlationId = `tiny-lux-${Math.floor(Date.now() / 1000)}`;
    await fetchOnboarding('DELETE', 'oauth', {correlationId});

    commit(MutationsTypes.REMOVE_GMC);
    commit(MutationsTypes.SAVE_MCA_CONNECTED_ONCE, false);
    commit(`productFeed/${MutationsTypesProductFeed.TOGGLE_CONFIGURATION_FINISHED}`, false, {root: true});
    commit(MutationsTypes.REMOVE_GOOGLE_ACCOUNT);
    commit(MutationsTypes.SET_GOOGLE_ACCOUNT, null);
    dispatch(ActionsTypes.REQUEST_ROUTE_TO_GOOGLE_AUTH);
    return true;
  },

  async [ActionsTypes.DISSOCIATE_GMC]({
    commit,
    state,
    dispatch,
  }: Context, correlationId: string) {
    if (state.googleMerchantAccount.id) {
      if (!correlationId) {
        // eslint-disable-next-line no-param-reassign
        correlationId = `tiny-lux-${Math.floor(Date.now() / 1000)}`;
      }
      await fetchOnboarding(
        'DELETE',
        'merchant-accounts',
        {
          correlationId,
          onResponse: async (response) => {
            if (!response.ok) {
              commit(
                MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
                WebsiteClaimErrorReason.UnlinkFailed,
              );
              throw new HttpClientError(response.statusText, response.status);
            }
          },
        },
      );
    }
    dispatch(ActionsTypes.SAVE_WEBSITE_VERIFICATION_META, false);
    commit(MutationsTypes.REMOVE_GMC);
    commit(MutationsTypes.SAVE_MCA_CONNECTED_ONCE, false);
    commit(`googleAds/${MutationsTypesGoogleAds.SET_GOOGLE_ADS_ACCOUNT}`, null, {root: true});
    commit(`productFeed/${MutationsTypesProductFeed.REMOVE_PRODUCT_FEED}`, null, {root: true});
    commit(`productFeed/${MutationsTypesProductFeed.SET_ACTIVE_CONFIGURATION_STEP}`, 1, {root: true});
    commit(`productFeed/${MutationsTypesProductFeed.TOGGLE_CONFIGURATION_FINISHED}`, false, {root: true});
    return true;
  },

  async [ActionsTypes.REQUEST_TO_OVERRIDE_CLAIM]({commit, dispatch}: Context) {
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
  async [ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_PROCESS]({dispatch}: Context) {
    const correlationId = `tiny-lux-${Math.floor(Date.now() / 1000)}`;
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

  // eslint-disable-next-line no-empty-pattern
  async [ActionsTypes.REQUEST_SITE_VERIFICATION_TOKEN]({}: Context, correlationId: string) {
    return (await fetchOnboarding(
      'GET',
      'shopping-websites/site-verification/token',
      {correlationId},
    )).json();
  },

  // eslint-disable-next-line no-empty-pattern
  async [ActionsTypes.SAVE_WEBSITE_VERIFICATION_META]({}: Context, token: string|false) {
    return fetchShop('setWebsiteVerificationMeta', {websiteVerificationMeta: token});
  },

  // eslint-disable-next-line no-empty-pattern
  async [ActionsTypes.REQUEST_GOOGLE_TO_VERIFY_WEBSITE]({}: Context, correlationId: string) {
    return (await fetchOnboarding(
      'POST',
      'shopping-websites/site-verification/verify',
      {correlationId},
    )).json();
  },

  async [ActionsTypes.REQUEST_WEBSITE_CLAIMING_STATUS](
    {
      commit,
      rootGetters,
    }: Context,
    correlationId: string,
  ) {
    const params = new URLSearchParams({
      languageCode: rootGetters[`app/${appGetters.GET_CURRENT_LANGUAGE}`],
      timeZone: encodeURI(Intl.DateTimeFormat().resolvedOptions().timeZone),
    });
    const json = await (await fetchOnboarding(
      'GET',
      `shopping-websites/site-verification/status?${params.toString()}`,
      {correlationId},
    )).json();

    commit(MutationsTypes.SAVE_WEBSITE_VERIFICATION_AND_CLAIMING_STATUS, json);
    return json;
  },

  async [ActionsTypes.TRIGGER_WEBSITE_CLAIMING_PROCESS](
    {commit}: Context,
    payload,
  ) {
    const {overwrite, correlationId} = payload;
    const overwriteParam = `?overwrite=${overwrite ? 'true' : 'false'}`;
    const url = `shopping-websites/site-verification/claim${overwriteParam}`;
    const json = await fetchOnboarding(
      'POST',
      url,
      {
        correlationId,
        onResponse: async (response: Response) => {
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
          return response.json();
        },
      },
    );

    commit(MutationsTypes.SAVE_WEBSITE_CLAIMING_STATUS, true);
    commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING, null);
    return json;
  },

  // eslint-disable-next-line no-empty-pattern
  async [ActionsTypes.SEND_WEBSITE_REQUIREMENTS]({}: Context, payload: Array<String>) {
    return fetchShop('setWebsiteRequirementStatus', {requirements: payload});
  },

  async [ActionsTypes.REQUEST_WEBSITE_REQUIREMENTS]({commit}: Context) {
    try {
      const json = await fetchShop('getWebsiteRequirementStatus');

      commit(MutationsTypes.SAVE_WEBSITE_REQUIREMENTS, json);
    } catch (error) {
      console.error(`Could not request website requirements: ${(<any>error)?.message}`);
    }
  },

  async [ActionsTypes.REQUEST_SHOP_INFORMATIONS]({commit}: Context) {
    try {
      const json = await fetchShop('getShopConfigurationForGMC');
      commit(MutationsTypes.SAVE_SHOP_INFORMATIONS, json);
    } catch (error) {
      console.error(`Could not request shop information: ${(<any>error)?.message}`);
    }
  },

  async [ActionsTypes.REQUEST_NEW_GMC_DETAILS]({
    commit, rootState, state, dispatch,
  }: Context): Promise<GoogleMerchantAccount|null> {
    try {
      const linkedGmc = await (await fetchOnboarding(
        'GET',
        `merchant-accounts/${state.googleMerchantAccount.id}`,
      )).json();

      if (!linkedGmc) {
        throw new Error('Failed to find GMC!');
      }

      commit(MutationsTypes.SAVE_GMC, linkedGmc);
      dispatch(ActionsTypes.SEND_GMC_INFORMATION_TO_SHOP, {
        id: rootState.accounts.googleMerchantAccount.id,
      });
      return linkedGmc;
    } catch (error) {
      console.error(error);
      console.log(`GMC ${state.googleMerchantAccount.id} not found.`);
    }
    return null;
  },

  async [ActionsTypes.AWAIT_GMC_CREATION]({commit, dispatch, getters}: Context) {
    commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
      WebsiteClaimErrorReason.PendingCreation);

    setTimeout(() => {
      if (getters.GET_GOOGLE_ACCOUNT_WEBSITE_CLAIMING_OVERRIDE_STATUS
        === WebsiteClaimErrorReason.PendingCreation
      ) {
        commit(MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING,
          WebsiteClaimErrorReason.StillPendingCreation);
      }
    }, 10000);

    let accountIsFoundOnGoogleAPI = false;

    while (!accountIsFoundOnGoogleAPI) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => { setTimeout(resolve, 2000); });
      // eslint-disable-next-line no-await-in-loop
      accountIsFoundOnGoogleAPI = !!await dispatch(ActionsTypes.REQUEST_NEW_GMC_DETAILS);
    }

    dispatch(ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS);
  },

  async [ActionsTypes.AWAIT_USER_INVITATION_ACCEPTANCE](
    {dispatch, state, getters}: Context,
    correlationId: string,
  ) {
    // Poll the account until the shop's admin accepts the sub-account invite,
    // then resume verify/claim automatically — otherwise the pending-invitation
    // banner would stick until a manual page refresh. Bails out if the claiming
    // override moves off PendingUserInvitation (e.g. the merchant navigates away).
    while (
      getters.GET_GOOGLE_ACCOUNT_WEBSITE_CLAIMING_OVERRIDE_STATUS
        === WebsiteClaimErrorReason.PendingUserInvitation
      && state.googleMerchantAccount.pendingUserInvitation
    ) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => { setTimeout(resolve, 5000); });
      // eslint-disable-next-line no-await-in-loop
      await dispatch(ActionsTypes.REQUEST_NEW_GMC_DETAILS);
    }

    // Invite accepted (pendingUserInvitation cleared) while still on the banner
    // -> resume the verify/claim flow the merchant originally triggered.
    if (
      getters.GET_GOOGLE_ACCOUNT_WEBSITE_CLAIMING_OVERRIDE_STATUS
        === WebsiteClaimErrorReason.PendingUserInvitation
    ) {
      dispatch(
        ActionsTypes.TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS,
        correlationId,
      );
    }
  },

  // eslint-disable-next-line no-empty-pattern
  async [ActionsTypes.SEND_GMC_INFORMATION_TO_SHOP]({}: Context, gmcInfo) {
    try {
      await fetchShop('setGMCInformations', {gmcInformations: gmcInfo});
    } catch (error) {
      console.error(error);
    }
  },
};
