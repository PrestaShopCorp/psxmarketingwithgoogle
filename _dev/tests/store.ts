import cloneDeep from 'lodash.clonedeep';
import Vue from 'vue';
import Vuex from 'vuex';
import app from '@/store/modules/app';
import accounts from '@/store/modules/accounts';
import productFeed from '@/store/modules/product-feed';
import campaigns from '@/store/modules/campaigns';
import freeListing from '@/store/modules/free-listing';
import googleAds from '@/store/modules/google-ads';

Vue.use(Vuex);

export const cloneStore = () => {
  const store = {
    modules: {
      app: cloneDeep(app),
      accounts: cloneDeep(accounts),
      productFeed: cloneDeep(productFeed),
      freeListing: cloneDeep(freeListing),
      googleAds: cloneDeep(googleAds),
      campaigns: cloneDeep(campaigns),
    },
  };

  return store;
};

export default {
  cloneStore,
};
