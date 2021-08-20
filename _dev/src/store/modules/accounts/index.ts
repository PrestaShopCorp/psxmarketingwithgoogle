import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import {state as initialState} from './state';

const {
  contextPsAccounts,
  shopIdPsAccounts,
  tokenPsAccounts,
}: any = window;

const state = Object.assign(
  initialState,
  {contextPsAccounts} || {},
  {shopIdPsAccounts} || '',
  {tokenPsAccounts} || '',
);

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
