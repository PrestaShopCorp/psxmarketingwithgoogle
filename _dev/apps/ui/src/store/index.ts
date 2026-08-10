import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import accounts from './modules/accounts';
import productFeed from './modules/product-feed';
import {FullState} from '@/store/types';

Vue.use(Vuex);

export default new Vuex.Store<FullState>({
  modules: {
    app,
    accounts,
    productFeed,
  },
});
