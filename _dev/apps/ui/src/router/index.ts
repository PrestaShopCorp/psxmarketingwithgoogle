import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Store from '../store';
import CampaignPage from '../views/campaign-page.vue';
import CampaignForm from '../views/campaign-form.vue';
import LandingPage from '../views/landing-page.vue';
import Debug from '../views/debug.vue';
import Help from '../views/help.vue';
import Configuration from '../views/configuration.vue';
import ProductFeedPage from '../views/product-feed-page.vue';
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
    return;
  }
  next({name: 'landing-page'});
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
    children: [
      {
        path: 'status',
        name: 'product-feed-status',
        component: ProductFeedPage,
      },
      {
        path: 'non-compliant-products/:error',
        name: 'product-feed-verification-error-products',
        component: ProductFeedPage,
      },
      {
        path: 'non-compliant-products',
        name: 'product-feed-verification-errors',
        component: ProductFeedPage,
      },
    ],
  },
  {
    path: '/campaign',
    name: 'campaign',
    component: CampaignPage,
    children: [
      {
        path: 'creation',
        name: 'campaign-creation',
        component: CampaignForm,
      },
      {
        path: 'edit/:id',
        name: 'campaign-edition',
        component: CampaignForm,
      },
    ],
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
