/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import Vuex from 'vuex';
import cloneDeep from 'lodash.clonedeep';
import config, {cloneStore} from '@/../tests/init';
import {initialStateApp} from '../../.storybook/mock/state-app';

import LandingPage from '@/views/landing-page.vue';

describe('landing-page.vue', () => {
  let store;
  beforeEach(() => {
    store = cloneStore();
    store.modules.app.state = {
      ...cloneDeep(initialStateApp),
    };
  });

  it('shows all the onboarding details', () => {
    const wrapper = shallowMount(LandingPage, {
      ...config,
      store: new Vuex.Store(store),
    });
    expect(wrapper.find('.ps_gs-landingpage').isVisible()).toBe(true);
  });
});
