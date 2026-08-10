import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import store from '@/store';
import ConfigurationPage from '@/views/configuration-page.vue';
import HelpPage from '@/views/help-page.vue';
import ProductFeedPage from '@/views/product-feed-page.vue';
import TunnelProductFeed from '@/views/tunnel-product-feed.vue';
import ActionsTypesAccounts from '@/store/modules/accounts/actions-types';
import GettersTypesAccounts from '@/store/modules/accounts/getters-types';

Vue.use(VueRouter);

export const accountNavigationGuard = (to, from, next) => {
  if (!store.getters[`accounts/${GettersTypesAccounts.GET_LOCAL_GOOGLE_IS_READY}`]) {
    next({name: 'configuration'});
    return;
  }
  next();
};

export const initialPath = async (to, from, next) => {
  await store.dispatch(`accounts/${ActionsTypesAccounts.WARMUP_STORE}`);
  next({name: 'configuration'});
};

const routes: Array<RouteConfig> = [
  {
    path: '/configuration',
    name: 'configuration',
    component: ConfigurationPage,
  },
  {
    path: '/configuration/product-feed-settings/:step',
    name: 'product-feed-settings',
    component: TunnelProductFeed,
    beforeEnter: accountNavigationGuard,
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
    beforeEnter: accountNavigationGuard,
  },
  {
    path: '/',
    name: 'root',
    beforeEnter: initialPath,
  },
  {
    path: '/*',
    name: 'catch-all',
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
