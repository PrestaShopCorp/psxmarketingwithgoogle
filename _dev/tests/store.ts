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
      app: (cloneDeep(app) as typeof app),
      accounts: (cloneDeep(accounts) as typeof accounts),
      productFeed: (cloneDeep(productFeed) as typeof productFeed),
      freeListing: (cloneDeep(freeListing) as typeof freeListing),
      googleAds: (cloneDeep(googleAds) as typeof googleAds),
      campaigns: (cloneDeep(campaigns) as typeof campaigns),
    },
  };

  return store;
};

export default {
  cloneStore,
};
