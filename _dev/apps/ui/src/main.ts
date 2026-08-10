import Vue from 'vue';
import {BootstrapVue} from 'bootstrap-vue';
import VueShowdown from 'vue-showdown';
import {initOnboardingClient} from 'mktg-with-google-common/api/onboardingClient';
import router from './router';
import store from './store';
import App from './App.vue';
import i18n from './lib/i18n';
import './assets/scss/app.scss';
import './utils/Filters';
// import showdown extension
import '../showdown.js';

// Prevent rebranding on PrestaShop Edition to alter our interface
document.body.classList.add('no-smb-reskin');

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueShowdown);

initOnboardingClient({apiUrl: window.tinyLuxGoogleApiUrl});

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#psxMktgWithGoogleApp');
