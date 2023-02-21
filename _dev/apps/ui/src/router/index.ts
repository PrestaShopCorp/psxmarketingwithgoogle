import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Store from '../store';
import CampaignPage from '../views/campaign-page.vue';
import CampaignForm from '../views/campaign-form.vue';
import CampaignList from '../views/campaign-list.vue';
import LandingPage from '../views/landing-page.vue';
import DebugPage from '../views/debug-page.vue';
import Help from '../views/help.vue';
import ConfigurationPage from '../views/configuration-page.vue';
import ProductFeedPage from '../views/product-feed-page.vue';
import ReportingPage from '../views/reporting-page.vue';
import TunnelProductFeed from '../views/tunnel-product-feed.vue';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

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
    component: ConfigurationPage,
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
    children: [
      {
        path: 'list',
        name: 'campaign-list',
        component: CampaignList,
      },
      {
        path: 'creation/:type',
        name: 'campaign-creation-typed',
        component: CampaignForm,
      },
      {
        path: 'creation',
        name: 'campaign-creation',
        redirect: () => ({
          name: 'campaign-creation-typed',
          params: {
            type: CampaignTypes.PERFORMANCE_MAX,
          },
        }),
      },
      {
        path: 'edit/:id',
        name: 'campaign-edition',
        component: CampaignForm,
      },
    ],
  },
  {
    path: '/reporting',
    name: 'reporting',
    component: ReportingPage,
  },
  {
    path: '/debug',
    name: 'DebugPage',
    component: DebugPage,
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
