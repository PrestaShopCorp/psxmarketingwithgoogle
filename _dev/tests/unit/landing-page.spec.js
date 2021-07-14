/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window
import { commonOptions } from './init.js';

import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import LandingPage from '@/views/landing-page.vue';
import store from '@/store';

describe('landing-page.vue', () => {
  it('show all the onboarding details', () => {
    const wrapper = shallowMount(LandingPage, {
      ...commonOptions,
      store: new Vuex.Store(Object.assign({}, store, {
        actions: {
        },
        mutations: {
        },
      })),
    });

    expect(wrapper.find('.ps_gs-landingpage').isVisible()).toBe(true);
  });
});
