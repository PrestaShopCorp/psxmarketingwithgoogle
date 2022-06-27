import Vue from 'vue';
import {BootstrapVue} from 'bootstrap-vue';
import VueCollapse from 'vue2-collapse';
import psAccountsVueComponents from 'prestashop_accounts_vue_components';
import VueSegment from '@prestashopcorp/segment-vue';
import VueShowdown from 'vue-showdown';
import router from './router';
import store from './store';
import App from './App.vue';
import i18n from './lib/i18n';
import './assets/scss/app.scss';
import './utils/Filters';
// import showdown extension
import '../showdown.js';
import '@/utils/Sentry';
import CampaignStatus from '@/enums/reporting/CampaignStatus';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueCollapse);
Vue.use(psAccountsVueComponents, {locale: i18n.locale});
Vue.use(VueShowdown);
Vue.use(VueSegment, {
  // @ts-ignore
  id: global.psxMktgWithGoogleSegmentId,
  router,
  debug: process.env.NODE_ENV !== 'production',
  pageCategory: '[GGL]',
});

new Vue({
  router,
  store,
  i18n,
  methods: {
    identifySegment() {
      // @ts-ignore
      if (!this.$segment) {
        return;
      }

      const psAccountContext = this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT'];
      const userId = this.$store.state.accounts.shopIdPsAccounts;
      const campaigns = this.$store.getters['smartShoppingCampaigns/GET_ALL_CAMPAIGNS'];
      const isActiveCamp = campaigns.some((camp) => camp.status === CampaignStatus.ELIGIBLE);

      if (userId) {
        // @ts-ignore
        this.$segment.identify(userId, {
          name: psAccountContext.currentShop.domainSsl,
          email: psAccountContext.user.email,
          language: this.$i18n.locale,
          version_ps: this.$store.state.app.psVersion,
          ggl_module_version: this.$store.state.app.psxMktgWithGoogleModuleVersion,
          ggl_api_endpoint: this.$store.state.app.psxMktgWithGoogleApiUrl,
          ggl_user_has_enabled_campaign: isActiveCamp,
          ggl_user_has_googleAds_connected: !!this.$store.state.googleAds.accountChosen,
          ggl_user_has_productFeed_exported: this.$store.state.productFeed.isConfigured,
        });
      }
    },
  },
  render: (h) => h(App),
}).$mount('#psxMktgWithGoogleApp');

console.error('#################################################');
console.error('### SHOP ID:  ', window.shopIdPsAccounts, '  ###');
console.error('#################################################');
