import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import {state as initialState} from './state';

/*const {
  psAccountShopInConflict,
  contextPsAccounts,
  shopIdPsAccounts,
  tokenPsAccounts,
}: any = window;

const state = Object.assign(
  initialState,
  {psAccountShopInConflict} || {},
  {contextPsAccounts} || {},
  {shopIdPsAccounts} || '',
  {tokenPsAccounts} || '',
);*/

const state = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
