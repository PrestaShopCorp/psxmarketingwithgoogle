import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import {state as initialState} from './state';

const state = Object.assign(
  initialState,
);

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
