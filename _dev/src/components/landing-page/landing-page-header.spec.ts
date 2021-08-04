/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window
import config from '@/../tests/init';

import {createWrapper, shallowMount} from '@vue/test-utils';
import LandingPageHeader from '@/components/landing-page/landing-page-header.vue';

describe('landing-page-header.vue', () => {
  it('Emit event to hide landing page when click on CTA', async () => {
    const wrapper = shallowMount(LandingPageHeader, {
      ...config,
    });

    // Check if onHideLanding event has been emmited when btn is clicked
    await wrapper.find('[data-test-id="lp-header-cta"]').trigger('click');
    const rootWrapper = createWrapper(wrapper.vm.$root);

    expect(rootWrapper.emitted('onHideLanding')).toBeTruthy();
  });
});
