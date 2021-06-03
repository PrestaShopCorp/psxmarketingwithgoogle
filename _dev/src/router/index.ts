import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Configuration from '../views/configuration.vue';
import OnboardingPage from '../views/onboarding-page.vue';
import Help from '../views/help.vue';
import Store from '../store';
import MutationsTypes from '../store/modules/accounts/mutations-types';

Vue.use(VueRouter);

const initialPath = (to, from, next) => {
  if ((from.path === '/' && Store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'])
  || (from.path === '/' && Store.getters['accounts/GET_PS_SHOP_IS_SELECTED'])) {
    next('/configuration');
  } else {
    next('/onboarding');
  }
};

const routes: Array<RouteConfig> = [
  {
    path: '/onboarding',
    name: 'configuration',
    component: Configuration,
  },
  {
    path: '/configuration',
    name: 'onboarding',
    component: OnboardingPage,
  },
  {
    path: '/help',
    name: 'help',
    component: Help,
  },
  {
    path: '/',
    beforeEnter: initialPath,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
