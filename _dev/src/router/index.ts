import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Configuration from '../views/configuration.vue';
import Help from '../views/help.vue';
import Store from '../store';
import MutationsTypes from '../store/modules/accounts/mutations-types';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/Configuration',
    name: 'configuration',
    component: Configuration,
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

router.beforeEach((to, from, next) => {
  const paramsFromGoogleCb: Array<string> = ['from', 'message', 'status'];
  const paramsFound = paramsFromGoogleCb.filter((x) => window.location.href.indexOf(x) !== -1);
  const paramsWithValues = {};

  if (paramsFound.length > 0) {
    paramsFromGoogleCb.forEach((key, value) => {
      const params = new URLSearchParams(window.location.search);
      paramsWithValues[key] = params.get(key);
      params.delete(key);
      window.history.replaceState(null, '', `?${params}${window.location.hash}`);
    });
  }
  Store.commit(MutationsTypes.SET_GOOGLE_AUTHENTICATION_RESPONSE, paramsWithValues);
  next();
});

export default router;
