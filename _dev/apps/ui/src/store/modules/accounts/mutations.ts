import MutationsTypes from './mutations-types';
import {
  State as LocalState,
  GoogleMerchantAccount,
  GoogleAccount,
  GoogleAccountToken,
  MerchantCenterAccountContext, WebsiteClaimErrorReason,
  ShopInformations,
} from './state';

export default {
  /** Google Account mutations */
  [MutationsTypes.SET_GOOGLE_ACCOUNT](state: LocalState, response: GoogleAccount) {
    state.googleAccount = {
      ...state.googleAccount,
      ...response,
    };
  },
  [MutationsTypes.SAVE_GOOGLE_ACCOUNT_TOKEN](
    state: LocalState,
    payload: GoogleAccountToken|Error,
  ) {
    if (payload instanceof Error) {
      state.googleAccount.access_token = payload;
      return;
    }
    state.googleAccount.access_token = payload.access_token;
    state.googleAccount.expiry_date = payload.expiry_date;
  },
  [MutationsTypes.REMOVE_GOOGLE_ACCOUNT](state: LocalState) {
    state.googleAccount.access_token = '';
    state.googleAccount.expiry_date = 0;
    state.googleAccount.details = {};
  },
  [MutationsTypes.SET_GOOGLE_AUTHENTICATION_URL](state: LocalState, url: string|Error) {
    state.googleAccount.authenticationUrl = url;
  },
  [MutationsTypes.SET_GOOGLE_AUTHENTICATION_RESPONSE](state: LocalState, googleResponse) {
    state.googleAccount.from = googleResponse.from;
    state.googleAccount.message = googleResponse.message;
    state.googleAccount.status = googleResponse.status;
  },
  [MutationsTypes.SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE](state: LocalState, response) {
    state.googleAccount.connectedOnce = response;
  },
  [MutationsTypes.SAVE_GMC_LIST](
    state: LocalState,
    mcaSelectionOptions: GoogleMerchantAccount[],
  ) {
    state.googleAccount.mcaSelectionOptions = mcaSelectionOptions;
  },
  /** End of Google Account mutations */

  /** Merchant Center Account mutations */
  [MutationsTypes.SAVE_GMC](state: LocalState, selectedAccount: GoogleMerchantAccount) {
    state.googleMerchantAccount = {
      ...state.googleMerchantAccount,
      ...selectedAccount,
    };
  },
  [MutationsTypes.ADD_NEW_GMC](state: LocalState, googleMerchantAccount: GoogleMerchantAccount) {
    if (state.googleAccount.mcaSelectionOptions) {
      state.googleAccount.mcaSelectionOptions.push(googleMerchantAccount);
    }
  },
  [MutationsTypes.REMOVE_GMC](state: LocalState) {
    state.googleMerchantAccount = {
      ...state.googleMerchantAccount,
      id: null,
      gmcStatus: null,
      isVerified: false,
      isClaimed: false,
      isSuspended: {
        status: false,
      },
      isEnhancedFreeListingCompliant: {
        status: true,
      },
    };
  },
  [MutationsTypes.SAVE_WEBSITE_VERIFICATION_AND_CLAIMING_STATUS](
    state: LocalState,
    websiteClaimingStatus: MerchantCenterAccountContext,
  ) {
    state.googleMerchantAccount = {
      ...state.googleMerchantAccount,
      ...websiteClaimingStatus,
    };
  },
  [MutationsTypes.SAVE_WEBSITE_CLAIMING_STATUS](state: LocalState, status: boolean) {
    state.googleMerchantAccount.isClaimed = status;
  },
  [MutationsTypes.SAVE_STATUS_OVERRIDE_CLAIMING](
    state: LocalState,
    overrideClaimStatus: WebsiteClaimErrorReason,
  ) {
    state.googleMerchantAccount.gmcStatus = overrideClaimStatus;
  },
  [MutationsTypes.SAVE_MCA_CONNECTED_ONCE](state: LocalState, status: boolean) {
    state.googleMerchantAccount.connectedOnce = status;
  },
  [MutationsTypes.SAVE_MCA_CONNECTED_AUTOMATICALLY](state: LocalState, status: boolean) {
    state.googleMerchantAccount.connectedAutomatically = status;
  },
  [MutationsTypes.SAVE_WEBSITE_REQUIREMENTS](state: LocalState, requirementsList) {
    state.googleMerchantAccount.websiteRequirements = requirementsList.requirements;
  },
  [MutationsTypes.SAVE_SHOP_INFORMATIONS](state: LocalState, shopInformations: ShopInformations) {
    state.googleMerchantAccount.shopInfo = shopInformations;
  },
  /** End of Merchant Center Account mutations */
};
