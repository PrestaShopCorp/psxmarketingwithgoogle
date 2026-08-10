import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import {state as initialState} from './state';

const localConnection = window.tinyLuxGoogleConnection;

const state = {
  ...initialState,
  googleAccount: {
    ...initialState.googleAccount,
    ...localConnection,
    details: {
      ...initialState.googleAccount.details,
      email: localConnection?.googleEmail || undefined,
    },
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
