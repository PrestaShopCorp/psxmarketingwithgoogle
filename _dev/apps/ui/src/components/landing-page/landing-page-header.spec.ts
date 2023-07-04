// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import config from '@/../tests/init';

import LandingPageHeader from '@/components/landing-page/landing-page-header.vue';

describe('landing-page-header.vue', () => {
  const $route = {
    name: 'configuration',
  };
  it('Emit event to route push when click on CTA', async () => {
    const wrapper = shallowMount(LandingPageHeader, {
      ...config,
      mocks: {
        $route,
      },
    });

    await wrapper.find('[data-test-id="lp-header-cta"]').trigger('click');
    expect(wrapper.vm.$route.name).toBe($route.name);
    expect(wrapper.emitted('hideLandingPage')).toBeTruthy();
  });
});
