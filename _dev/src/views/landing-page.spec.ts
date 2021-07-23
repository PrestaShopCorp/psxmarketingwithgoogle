/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window

import {shallowMount} from '@vue/test-utils';
import config from '@/../tests/init';
import LandingPage from '@/views/landing-page.vue';

describe('landing-page.vue', () => {
  it('shows all the onboarding details', () => {
    const wrapper = shallowMount(LandingPage, {
<<<<<<< HEAD
      ...config,
=======
>>>>>>> ec1796a1 (test error with vue showdown)
    });

    expect(wrapper.find('.ps_gs-landingpage').isVisible()).toBe(true);
  });
});
