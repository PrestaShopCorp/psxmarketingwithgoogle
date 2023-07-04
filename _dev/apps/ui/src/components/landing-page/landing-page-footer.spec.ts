// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import config from '@/../tests/init';

import LandingPageFooter from '@/components/landing-page/landing-page-footer.vue';

describe('landing-page-footer.vue', () => {
  const $route = {
    name: 'configuration',
  };
  it('Emit event to route push when click on CTA', async () => {
    const wrapper = shallowMount(LandingPageFooter, {
      ...config,
      mocks: {
        $route,
      },
    });
    await wrapper.find('[data-test-id="lp-footer-cta"]').trigger('click');
    expect(wrapper.vm.$route.name).toBe($route.name);
    expect(wrapper.emitted('hideLandingPage')).toBeTruthy();
  });
});
