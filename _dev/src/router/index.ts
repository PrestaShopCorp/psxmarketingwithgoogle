import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import VueAdBlockDetect from 'vue-adblock-detect';
import Store from '../store';
import CampaignPage from '../views/campaign-page.vue';
import Configuration from '../views/configuration.vue';
import Debug from '../views/debug.vue';
import AdBlocker from '../views/blocker-page.vue';
import Help from '../views/help.vue';
import OnboardingPage from '../views/onboarding-page.vue';
import ProductFeedPage from '../views/product-feed-page.vue';
import ReportingPage from '../views/reporting-page.vue';
import TunnelProductFeed from '../views/tunnel-product-feed.vue';

Vue.use(VueRouter);

const verifyAdBlocker = (to, from, next) => {
  console.log('hey');
  next();
//   setTimeout(function() {
//   VueAdBlockDetect.methods.detectAdBlock().then((response) => {
//     if (response) {
//       // ad blocker detected
//       console.log('ad bloker detected', response);
//       next({name: 'ad-blocker'});
//     } else {
//       console.log('NO ad bloker detected');
//       next();
//     }
//   });
// }, 10000);  
};

const initialPath = (to, from, next) => {
  if (from.path === '/'
    && (!Store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED']
      || Store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT_SHOPS'].length)
  ) {
    next({name: 'configuration'});
  } else {
    next({name: 'onboarding'});
  }
};

const routes: Array<RouteConfig> = [
  {
    path: '/configuration',
    name: 'configuration',
    component: Configuration,
    beforeEnter: verifyAdBlocker,

  },
  {
    path: '/configuration/onboarding',
    name: 'onboarding',
    component: OnboardingPage,
    beforeEnter: verifyAdBlocker,
  },
  {
    path: '/configuration/product-feed-settings',
    name: 'product-feed-settings',
    component: TunnelProductFeed,
    beforeEnter: verifyAdBlocker,

  },
  {
    path: '/help',
    name: 'help',
    component: Help,
  },
  {
    path: '/product-feed',
    name: 'product-feed',
    component: ProductFeedPage,
    beforeEnter: verifyAdBlocker,

  },
  {
    path: '/product-feed/status',
    name: 'product-feed-status',
    component: ProductFeedPage,
    beforeEnter: verifyAdBlocker,

  },
  {
    path: '/campaign',
    name: 'campaign',
    component: CampaignPage,
    beforeEnter: verifyAdBlocker,

  },
  {
    path: '/campaign/creation',
    name: 'campaign-creation',
    component: CampaignPage,
    beforeEnter: verifyAdBlocker,

  },
  {
    path: '/campaign/list',
    name: 'campaign-list',
    component: CampaignPage,
    beforeEnter: verifyAdBlocker,

  },
  {
    path: '/campaign/edit/:name',
    name: 'campaign-edition',
    component: CampaignPage,
    beforeEnter: verifyAdBlocker,

  },
  {
    path: '/reporting',
    name: 'reporting',
    component: ReportingPage,
    beforeEnter: verifyAdBlocker,

  },
  {
    path: '/debug',
    name: 'Debug',
    component: Debug,
  },
  {
    path: '/blocker',
    name: 'ad-blocker',
    component: AdBlocker,
  },
  {
    path: '/',
    name: 'root',
    beforeEnter: initialPath,
  },
  {
    path: '/*',
    name: 'root',
    beforeEnter: initialPath,
  },
];

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0};
  },
});

export default router;
