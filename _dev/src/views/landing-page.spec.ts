/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window

import {shallowMount} from '@vue/test-utils';
import LandingPage from '@/views/landing-page.vue';
import {commonOptions} from '@/../tests/init';

describe('landing-page.vue', () => {
  it('shows all the onboarding details', () => {
    const wrapper = shallowMount(LandingPage, {
      ...commonOptions,
    });

    expect(wrapper.find('.ps_gs-landingpage').isVisible()).toBe(true);
  });
});
