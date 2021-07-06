import Vue from 'vue';
import Vuex from 'vuex';
import {BootstrapVue} from 'bootstrap-vue';
import VueCollapse from 'vue2-collapse';
import psAccountsVueComponents from 'prestashop_accounts_vue_components';
import VueShowdown from 'vue-showdown';
import router from './router';
import store from './store';
import App from './App.vue';
import i18n from './lib/i18n';
import './assets/scss/app.scss';
import './utils/Filters';
// import showdown extension
import '../showdown.js';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueCollapse);
Vue.use(psAccountsVueComponents, {locale: i18n.locale});
Vue.use(VueShowdown);
Vue.use(Vuex);

new Vue({
  router,
  store: new Vuex.Store(store),
  i18n,
  render: (h) => h(App),
}).$mount('#googleShoppingApp');
