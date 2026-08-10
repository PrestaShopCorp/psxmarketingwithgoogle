import GetterTypes from './getters-types';
import {State} from './state';

export default {
  [GetterTypes.GET_GOOGLE_ACCOUNT_IS_ONBOARDED](state: State): boolean {
    return state.googleAccount.connected;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT](state: State) {
    return state.googleAccount;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_MCA_LIST](state: State) {
    return state.googleAccount.mcaSelectionOptions;
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_CONNECTED_ONCE](state: State): boolean {
    return state.googleAccount.connectedOnce;
  },
  [GetterTypes.GET_LOCAL_GOOGLE_IS_CONFIGURED](state: State): boolean {
    return state.googleAccount.configured === true;
  },
  [GetterTypes.GET_LOCAL_GOOGLE_IS_READY](state: State): boolean {
    return state.googleAccount.configured === true && state.googleAccount.connected === true;
  },
  [GetterTypes.GET_GOOGLE_MERCHANT_CENTER_ACCOUNT](state: State) {
    return state.googleMerchantAccount;
  },
  [GetterTypes.GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED](state: State): boolean {
    return Boolean(state.googleMerchantAccount.id);
  },
  [GetterTypes.GET_GOOGLE_ACCOUNT_AUTHENTICATION_URL](state: State) {
    return state.googleAccount.authenticationUrl;
  },
  [GetterTypes.GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_CONNECTED_ONCE](state: State): boolean {
    return state.googleMerchantAccount.connectedOnce;
  },
  [GetterTypes.GET_GOOGLE_MERCHANT_CENTER_IS_CONNECTED](state: State): boolean {
    return Boolean(state.googleMerchantAccount.id);
  },
  [GetterTypes.GET_MERCHANT_SELECTION_ERROR](state: State) {
    return state.googleMerchantAccount.selectionError;
  },
};
