import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import {state as initialState} from './state';

const {
  psxMktgWithGoogleActiveCountries,
}: any = window;

const state = Object.assign(
  initialState,
  {psxMktgWithGoogleActiveCountries} || {},
);

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
