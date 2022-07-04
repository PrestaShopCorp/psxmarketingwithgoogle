import SecureLS from 'secure-ls';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import app from './modules/app';
import accounts from './modules/accounts';
import productFeed from './modules/product-feed';
import freeListing from './modules/free-listing';
import googleAds from './modules/google-ads';
import campaigns from './modules/campaigns';

Vue.use(Vuex);

const ls = new SecureLS({encodingType: 'aes'});

const plugins = [
  createPersistedState({
    key: 'psxmarketingwithgoogle-vuex',
    storage: {
      getItem: (key:string) => ls.get(key),
      setItem: (key:string, value:any) => ls.set(key, value),
      removeItem: (key: string) => ls.remove(key),
    },
    paths: [
      'campaigns.reporting.request',
    ],
  }),
];

export default new Vuex.Store({
  modules: {
    app,
    accounts,
    productFeed,
    freeListing,
    googleAds,
    campaigns,
  },
  plugins,
});
