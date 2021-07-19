import cloneDeep from 'lodash.clonedeep';
import Vue from 'vue';
import Vuex from 'vuex';
import app from '@/store/modules/app';
import accounts from '@/store/modules/accounts';
import productFeed from '@/store/modules/product-feed';
import freeListing from '@/store/modules/free-listing';

Vue.use(Vuex);

export const cloneStore = () => {
  const store = {
    modules: {
      app: cloneDeep(app),
      accounts: cloneDeep(accounts),
      productFeed: cloneDeep(productFeed),
      freeListing: cloneDeep(freeListing),
    },
  };
  return store;
};

export default {
  cloneStore,
};
