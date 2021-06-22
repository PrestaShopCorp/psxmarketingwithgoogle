import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import {state as initialState} from './state';

const {
  psAccountShopInConflict,
  psGoogleShoppingActiveCountries,
  contextPsAccounts,
  shopIdPsAccounts,
  tokenPsAccounts,
}: any = window;

const state = Object.assign(
  initialState,
  {psGoogleShoppingActiveCountries} || {},
  {psAccountShopInConflict} || {},
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
