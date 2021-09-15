import cloneDeep from 'lodash.clonedeep';
import Vue from 'vue';
import Vuex from 'vuex';
import app from '@/store/modules/app';
import accounts from '@/store/modules/accounts';
import productFeed from '@/store/modules/product-feed';
import freeListing from '@/store/modules/free-listing';
import googleAds from '@/store/modules/google-ads';
import smartShoppingCampaigns from '@/store/modules/smart-shopping-campaigns';

Vue.use(Vuex);

export const cloneStore = () => {
  const store = {
    modules: {
      app: cloneDeep(app),
      accounts: cloneDeep(accounts),
      productFeed: cloneDeep(productFeed),
      freeListing: cloneDeep(freeListing),
      googleAds: cloneDeep(googleAds),
      smartShoppingCampaigns: cloneDeep(smartShoppingCampaigns),
    },
  };
  return store;
};

export default {
  cloneStore,
};
