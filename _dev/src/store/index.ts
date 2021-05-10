import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import accounts from './modules/accounts';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    accounts,
  },
});
