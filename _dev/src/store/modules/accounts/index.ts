import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import {state as initialState} from './state';

const {
  contextPsAccounts,
  shopIdPsAccounts,
  tokenPsAccounts,
}: any = window;

const state = {
  ...initialState,
  contextPsAccounts: contextPsAccounts || {},
  shopIdPsAccounts: shopIdPsAccounts || '',
  tokenPsAccounts: tokenPsAccounts || '',
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
