import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import {state as initialState} from './state';


const {
  psGoogleShoppingActiveCountries
}: any = window;

const state = Object.assign(
  initialState,
  {psGoogleShoppingActiveCountries} || {},
);

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};


