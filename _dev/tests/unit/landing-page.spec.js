/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window

import {shallowMount} from '@vue/test-utils';
import LandingPage from '@/views/landing-page.vue';
import {commonOptions} from './init.js';

describe('landing-page.vue', () => {
  it('show all the onboarding details', () => {
    const wrapper = shallowMount(LandingPage, {
      ...commonOptions,
    });

    expect(wrapper.find('.ps_gs-landingpage').isVisible()).toBe(true);
  });
});
