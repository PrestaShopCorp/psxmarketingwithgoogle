import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import LandingPage from '@/views/landing-page.vue';
import store from '@/store';
import i18n from '@/lib/i18n';

var window = {};

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

describe('landing-page.vue', () => {
  it('show all the onboarding details', () => {
    const wrapper = shallowMount(LandingPage, {
      store: new Vuex.Store(Object.assign({}, store, {
        actions: {
        },
        mutations: {
        },
      })),
      localVue,
      i18n,
    });

    expect(wrapper.find('.ps_gs-landingpage').isVisible()).toBe(false);
  });
});
