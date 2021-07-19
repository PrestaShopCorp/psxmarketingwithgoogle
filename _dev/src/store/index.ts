import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import accounts from './modules/accounts';
import productFeed from './modules/product-feed';
import freeListing from './modules/free-listing';

Vue.use(Vuex);

export const store = {
  modules: {
    app,
    accounts,
    productFeed,
    freeListing,
  },
};

export default new Vuex.Store(store);
