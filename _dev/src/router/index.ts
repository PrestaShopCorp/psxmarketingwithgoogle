import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Configuration from '../views/configuration.vue';
import Help from '../views/help.vue';

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
  if (window.location.href.indexOf('from') !== -1
  || window.location.href.indexOf('message') !== -1
  || window.location.href.indexOf('status') !== -1) {
    const params = new URLSearchParams(window.location.search);
    params.delete('message');
    params.delete('status');
    params.delete('from');
    window.history.replaceState(null, '', `?${params}${window.location.hash}`);
    // need to save the value from GET var
  }
  next();
});

export default router;
