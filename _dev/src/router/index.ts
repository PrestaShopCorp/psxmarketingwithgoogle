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

export default router;
