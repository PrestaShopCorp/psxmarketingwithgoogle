import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import {state as initialState} from './state';

const {
  contextPsAccounts,
  psGoogleShoppingApiUrl,
  psAccountShopId,
  psGoogleShoppingShopUrl,
}: any = window;

const state = Object.assign(
  initialState,
  {contextPsAccounts} || {},
  {psGoogleShoppingApiUrl} || '',
  {psGoogleShoppingShopUrl} || '',
  {psAccountShopId} || '',
);

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
