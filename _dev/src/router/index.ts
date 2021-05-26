import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Configuration from '../views/configuration.vue';
import OnboardingPage from '../views/onboarding-page.vue';
import Help from '../views/help.vue';
import Store from '../store';
import MutationsTypes from '../store/modules/accounts/mutations-types';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/configuration',
    name: 'configuration',
    component: Configuration,
  },
  {
    path: '/onboarding',
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
    redirect: '/configuration',
  },
];

const router = new VueRouter({
  routes,
});

export default router;
