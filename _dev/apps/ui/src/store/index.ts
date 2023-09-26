import SecureLS from 'secure-ls';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import app from './modules/app';
import accounts from './modules/accounts';
import productFeed from './modules/product-feed';
import googleAds from './modules/google-ads';
import campaigns from './modules/campaigns';
import {State as AppState} from './modules/app/state';
import {State as AccountsState} from './modules/accounts/state';
import {State as ProductFeedState} from './modules/product-feed/state';
import {State as GoogleAdsState} from './modules/google-ads/state';
import {State as CampaignsState} from './modules/campaigns/state';

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

export interface FullState {
  app: AppState,
  accounts: AccountsState,
  productFeed: ProductFeedState,
  googleAds: GoogleAdsState,
  campaigns: CampaignsState,
}

export default new Vuex.Store<FullState>({
  modules: {
    app,
    accounts,
    productFeed,
    googleAds,
    campaigns,
  },
  plugins,
});
