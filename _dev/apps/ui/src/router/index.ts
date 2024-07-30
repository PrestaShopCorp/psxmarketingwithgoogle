import Vue from 'vue';
import VueRouter, {NavigationGuard, RouteConfig} from 'vue-router';
import store from '@/store';
import BillingTab from '@/views/billing-tab.vue';
import CampaignPage from '@/views/campaign-page.vue';
import CampaignForm from '@/views/campaign-form.vue';
import ConfigurationPage from '@/views/configuration-page.vue';
import LandingPage from '@/views/landing-page.vue';
import DebugPage from '@/views/debug-page.vue';
import HelpPage from '@/views/help-page.vue';
import ProductFeedPage from '@/views/product-feed-page.vue';
import TunnelProductFeed from '@/views/tunnel-product-feed.vue';
import ActionsTypesAccounts from '@/store/modules/accounts/actions-types';
import GettersTypesAccounts from '@/store/modules/accounts/getters-types';
import GettersTypesApp from '@/store/modules/app/getters-types';

Vue.use(VueRouter);

const billingNavigationGuard: NavigationGuard = (to, from, next) => {
  if (!store.getters[`accounts/${GettersTypesAccounts.GET_PS_ACCOUNTS_IS_ONBOARDED}`]) {
    next({name: 'configuration'});
    return;
  }

  if (!store.getters[`app/${GettersTypesApp.GET_BILLING_SUBSCRIPTION_ACTIVE}`]) {
    next({name: 'configuration'});
    return;
  }

  next();
};

const initialPath = async (to, from, next) => {
  if (!store.getters[`accounts/${GettersTypesAccounts.GET_PS_ACCOUNTS_IS_ONBOARDED}`]) {
    next({name: 'landing-page'});
    return;
  }

  await store.dispatch(`accounts/${ActionsTypesAccounts.WARMUP_STORE}`);
  if (!store.getters[`accounts/${GettersTypesAccounts.GET_GOOGLE_ACCOUNT_IS_ONBOARDED}`]) {
    next({name: 'landing-page'});
    return;
  }

  next({name: 'configuration'});
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
  },
  {
    path: '/configuration/product-feed-settings/:step',
    name: 'product-feed-settings',
    component: TunnelProductFeed,
    beforeEnter: billingNavigationGuard,
  },
  {
    path: '/help',
    name: 'help',
    component: HelpPage,
  },
  {
    path: '/product-feed',
    name: 'product-feed',
    component: ProductFeedPage,
    beforeEnter: billingNavigationGuard,
    children: [
      {
        path: 'status',
        name: 'product-feed-status',
        component: ProductFeedPage,
        beforeEnter: billingNavigationGuard,
      },
      {
        path: 'non-compliant-products/:error',
        name: 'product-feed-verification-error-products',
        component: ProductFeedPage,
        beforeEnter: billingNavigationGuard,
      },
      {
        path: 'non-compliant-products',
        name: 'product-feed-verification-errors',
        component: ProductFeedPage,
        beforeEnter: billingNavigationGuard,
      },
    ],
  },
  {
    path: '/campaign',
    name: 'campaign',
    component: CampaignPage,
    beforeEnter: billingNavigationGuard,
    children: [
      {
        path: 'creation',
        name: 'campaign-creation',
        component: CampaignForm,
        beforeEnter: billingNavigationGuard,
      },
      {
        path: 'edit/:id',
        name: 'campaign-edition',
        component: CampaignForm,
        beforeEnter: billingNavigationGuard,
      },
    ],
  },
  {
    path: '/billing',
    name: 'Billing',
    component: BillingTab,
    beforeEnter: billingNavigationGuard,
  },
  {
    path: '/debug',
    name: 'Debug',
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
