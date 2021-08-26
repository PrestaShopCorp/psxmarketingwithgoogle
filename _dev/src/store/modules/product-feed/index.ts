import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import {state as initialState} from './state';

const {
  psxMtgWithGoogleDefaultShopCountry,
}: any = window;

const state = Object.assign(
  initialState,
  {psxMtgWithGoogleDefaultShopCountry} || {},
);

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
