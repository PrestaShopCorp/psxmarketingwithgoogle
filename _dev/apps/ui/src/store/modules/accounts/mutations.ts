import MutationsTypes from './mutations-types';
import {
  State as LocalState,
  GoogleMerchantAccount,
  GoogleConnectionStatus,
  MerchantCenterAccountContext, WebsiteClaimErrorReason,
  ShopInformations, MerchantDataSource,
} from './state';

export default {
  /** Google Account mutations */
  [MutationsTypes.SET_GOOGLE_ACCOUNT](state: LocalState, response: GoogleConnectionStatus|null) {
    const connection = response || {
      connected: false,
      googleEmail: null,
      merchantAccount: null,
      dataSource: null,
    };
    const accountChanged = response !== null
      && state.googleAccount.merchantAccount !== response.merchantAccount;
    state.googleAccount = {
      ...state.googleAccount,
      ...connection,
      details: {
        ...state.googleAccount.details,
        email: connection.googleEmail,
      },
    };
    if (accountChanged) {
      state.googleAccount.dataSource = null;
      state.merchantDataSources = [];
      state.googleMerchantAccount.id = null;
    }
  },
  [MutationsTypes.REMOVE_GOOGLE_ACCOUNT](state: LocalState) {
    state.googleAccount.connected = false;
    state.googleAccount.googleEmail = null;
    state.googleAccount.merchantAccount = null;
    state.googleAccount.dataSource = null;
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
    const selectedId = selectedAccount.id || null;
    const accountChanged = (state.googleAccount.merchantAccount !== null
      && state.googleAccount.merchantAccount !== selectedId)
      || (state.googleMerchantAccount.id !== null
        && state.googleMerchantAccount.id !== selectedId);

    if (accountChanged) {
      state.googleAccount.dataSource = null;
      state.merchantDataSources = [];
    }
    state.googleMerchantAccount = {
      ...state.googleMerchantAccount,
      ...selectedAccount,
    };
    state.googleAccount.merchantAccount = selectedId;
  },
  [MutationsTypes.SAVE_DATA_SOURCE_LIST](
    state: LocalState,
    dataSources: MerchantDataSource[],
  ) {
    state.merchantDataSources = dataSources;
  },
  [MutationsTypes.SAVE_DATA_SOURCE](state: LocalState, dataSource: MerchantDataSource) {
    state.googleAccount.dataSource = dataSource.name;
    const existing = state.merchantDataSources.findIndex(
      (source) => source.name === dataSource.name,
    );

    if (existing === -1) {
      state.merchantDataSources.push(dataSource);
    } else {
      state.merchantDataSources.splice(existing, 1, dataSource);
    }
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
      isEnhancedFreeListingCompliant: {
        status: true,
      },
      accountIssues: [],
    };
    state.googleAccount.merchantAccount = null;
    state.googleAccount.dataSource = null;
    state.merchantDataSources = [];
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
