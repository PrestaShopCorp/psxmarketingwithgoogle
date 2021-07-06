import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import accounts from './modules/accounts';
import productFeed from './modules/product-feed';
import freeListing from './modules/free-listing';

export default {
  modules: {
    app,
    accounts,
    productFeed,
    freeListing,
  },
};
