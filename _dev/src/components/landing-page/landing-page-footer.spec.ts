/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window
import {createWrapper, shallowMount} from '@vue/test-utils';
import config from '@/../tests/init';

import LandingPageFooter from '@/components/landing-page/landing-page-footer.vue';

describe('landing-page-footer.vue', () => {
  it('Emit event to hide landing page when click on CTA', async () => {
    const wrapper = shallowMount(LandingPageFooter, {
      ...config,
    });

    // Check if onHideLanding event has been emmited when btn is clicked
    await wrapper.find('[data-test-id="lp-footer-cta"]').trigger('click');
    const rootWrapper = createWrapper(wrapper.vm.$root);

    expect(rootWrapper.emitted('onHideLanding')).toBeTruthy();
  });
});
