import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Store from '../store';
import CampaignPage from '../views/campaign-page.vue';
import LandingPage from '../views/landing-page.vue';
import Debug from '../views/debug.vue';
import Help from '../views/help.vue';
import Configuration from '../views/configuration.vue';
import ProductFeedPage from '../views/product-feed-page.vue';
import ReportingPage from '../views/reporting-page.vue';
import TunnelProductFeed from '../views/tunnel-product-feed.vue';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';

Vue.use(VueRouter);

const initialPath = (to, from, next) => {
  if (from.path === '/'
    && Store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'] === false
  ) {
    next({name: 'landing-page'});
  } else {
    next({name: 'configuration'});
  }
};

const landingExistsInLocalstorage = (to, from, next) => {
  if (getDataFromLocalStorage('landingHasBeenSeen')) {
    next();
  } else {
    next({name: 'landing-page'});
  }
};

const campaignsAlreadyExist = (to, from, next) => {
  if (!Store.getters['smartShoppingCampaigns/GET_ALL_SSC'].length) {
    next();
  }
  next({name: 'campaign-list'});
};

const routes: Array<RouteConfig> = [
  {
    path: '/landing-page',
    name: 'landing-page',
    component: LandingPage,
  },
  {
    path: '/configuration',
    name: 'configuration',
    component: Configuration,
    beforeEnter: landingExistsInLocalstorage,
  },
  {
    path: '/configuration/product-feed-settings/:step',
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
    path: '/product-feed/pre-scan',
    name: 'product-feed-pre-scan',
    component: ProductFeedPage,
  },
  {
    path: '/campaign',
    name: 'campaign',
    component: CampaignPage,
    beforeEnter: campaignsAlreadyExist,
  },
  {
    path: '/campaign/list',
    name: 'campaign-list',
    component: CampaignPage,
  },
  {
    path: '/campaign-creation',
    name: 'campaign-creation',
    component: CampaignPage,
  },
  {
    path: '/campaign-edit/:id',
    name: 'campaign-edition',
    component: CampaignPage,
  },
  {
    path: '/reporting',
    name: 'reporting',
    component: ReportingPage,
  },
  {
    path: '/debug',
    name: 'Debug',
    component: Debug,
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
    // Allows to scroll to an anchor
    if (to.hash) {
      return {
        selector: to.hash,
        offset: {
          x: 0,
          y: 200, // Arbitrary value to take menu height into account
        },
      };
    } if (savedPosition) {
      // Allows to simulate position in page when using prev / next btn
      return savedPosition;
    }
    return {
      x: 0,
      y: 0,
    };
  },
});

export default router;
