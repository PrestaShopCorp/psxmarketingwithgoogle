import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Configuration from '../views/configuration.vue';
import OnboardingPage from '../views/onboarding-page.vue';
import TunnelProductFeed from '../views/tunnel-product-feed.vue';
import ProductFeedPage from '../views/product-feed-page.vue';
import CampaignPage from '../views/campaign-page.vue';
import Help from '../views/help.vue';
import Store from '../store';

Vue.use(VueRouter);

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
  },
  {
    path: '/configuration/onboarding',
    name: 'onboarding',
    component: OnboardingPage,
  },
  {
    path: '/configuration/product-feed-settings',
    name: 'product-feed-settings',
    component: TunnelProductFeed,
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
  },
  {
    path: '/product-feed/status',
    name: 'product-feed-status',
    component: ProductFeedPage,
  },
  {
    path: '/campaign',
    name: 'campaign',
    component: CampaignPage,
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
});

export default router;
