import MutationsTypes from './mutations-types';
import {
  GoogleConnectionStatus,
  GoogleMerchantAccount,
  MerchantDataSource,
  State,
} from './state';

export default {
  [MutationsTypes.SET_GOOGLE_ACCOUNT](
    state: State,
    response: Partial<GoogleConnectionStatus>|null,
  ) {
    const connection = response || {
      connected: false,
      googleEmail: null,
      merchantAccount: null,
      dataSource: null,
    };
    const includesMerchantAccount = response !== null
      && Object.prototype.hasOwnProperty.call(response, 'merchantAccount');
    const includesGoogleEmail = response !== null
      && Object.prototype.hasOwnProperty.call(response, 'googleEmail');
    const accountChanged = includesMerchantAccount
      && state.googleAccount.merchantAccount !== response.merchantAccount;
    state.googleAccount = {
      ...state.googleAccount,
      ...connection,
      details: {
        ...state.googleAccount.details,
        ...(includesGoogleEmail ? {email: connection.googleEmail} : {}),
      },
    };
    if (accountChanged) {
      state.googleAccount.dataSource = null;
      state.merchantDataSources = [];
      state.googleMerchantAccount.id = null;
    }
  },
  [MutationsTypes.REMOVE_GOOGLE_ACCOUNT](state: State) {
    state.googleAccount.connected = false;
    state.googleAccount.googleEmail = null;
    state.googleAccount.merchantAccount = null;
    state.googleAccount.dataSource = null;
    state.googleAccount.details = {};
  },
  [MutationsTypes.SET_GOOGLE_AUTHENTICATION_URL](state: State, url: string|Error) {
    state.googleAccount.authenticationUrl = url;
  },
  [MutationsTypes.SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE](state: State, status: boolean) {
    state.googleAccount.connectedOnce = status;
  },
  [MutationsTypes.SAVE_GMC_LIST](state: State, accounts: GoogleMerchantAccount[]) {
    state.googleAccount.mcaSelectionOptions = accounts;
  },
  [MutationsTypes.SAVE_GMC](state: State, selectedAccount: GoogleMerchantAccount) {
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
      selectionError: null,
    };
    state.googleAccount.merchantAccount = selectedId;
  },
  [MutationsTypes.SAVE_DATA_SOURCE_LIST](state: State, dataSources: MerchantDataSource[]) {
    state.merchantDataSources = dataSources;
    const selected = dataSources.find((source) => source.name === state.googleAccount.dataSource);

    if (!selected && state.googleAccount.dataSource) {
      state.googleAccount.dataSource = null;
    }
  },
  [MutationsTypes.SAVE_DATA_SOURCE](state: State, dataSource: MerchantDataSource) {
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
  [MutationsTypes.REMOVE_GMC](state: State) {
    state.googleMerchantAccount = {
      id: null,
      name: null,
      connectedOnce: false,
      selectionError: null,
    };
    state.googleAccount.merchantAccount = null;
    state.googleAccount.dataSource = null;
    state.merchantDataSources = [];
  },
  [MutationsTypes.SAVE_MCA_CONNECTED_ONCE](state: State, status: boolean) {
    state.googleMerchantAccount.connectedOnce = status;
  },
  [MutationsTypes.SET_MERCHANT_SELECTION_ERROR](state: State, error: 'LinkingFailed'|null) {
    state.googleMerchantAccount.selectionError = error;
  },
};
