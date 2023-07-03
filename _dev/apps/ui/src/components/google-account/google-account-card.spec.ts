/**
 * @vitest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount} from '@vue/test-utils';
import config, {cloneStore} from '@/../tests/init';

import {
  Disabled,
  NotConnectedAndCanNotGetAuthenticationUrl,
  NotConnected,
  CouldNotConnect,
  Connected,
} from '@/../stories/google-account-card.stories';

import GoogleAccountCard from '@/components/google-account/google-account-card.vue';

describe('google-account-card.vue', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = {go: vi.fn()};
  });

  it('card is greyed when disabled', () => {
    const wrapper = mount(GoogleAccountCard, {
      ...config,
      propsData: Disabled.args,
      stubs: {
        VueShowdown: true,
      },
    });

    expect(wrapper.find('.ps_gs-onboardingcard--disabled').exists()).toBeTruthy();
  });

  it('card isn\'t greyed when enabled', () => {
    const wrapper = mount(GoogleAccountCard, {
      ...config,
      propsData: NotConnected.args,
      stubs: {
        VueShowdown: true,
      },
    });

    expect(wrapper.find('.ps_gs-onboardingcard--disabled').exists()).toBeFalsy();
  });

  it('refresh button available when there is an API error and calls refresh function', async () => {
    const wrapper = mount(GoogleAccountCard, {
      mocks: {
        $router: mockRouter,
      },
      ...config,
      stubs: {
        VueShowdown: true,
      },
      propsData: NotConnectedAndCanNotGetAuthenticationUrl.args,
    });

    // Check if refresh button exists
    expect(wrapper.find('[data-test-id="btn-refresh"]').exists()).toBeTruthy();

    // Check if $router.go() has been called when refresh btn is clicked
    await wrapper.find('[data-test-id="btn-refresh"]').trigger('click');
    expect(mockRouter.go).toHaveBeenCalledTimes(1);
  });

  it('warning visible and connect button not disabled when couldn\'t connect', () => {
    const wrapper = mount(GoogleAccountCard, {
      ...config,
      propsData: CouldNotConnect.args,
      stubs: {
        VueShowdown: true,
      },
    });
    // Check if alert is visible
    expect(wrapper.find('.alert').exists()).toBeTruthy();

    // Check if connect button exists and is not disabled
    expect(wrapper.find('[data-test-id="btn-connect"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-test-id="btn-connect"]').attributes('disabled')).toBeFalsy();
  });

  it('account email visible when connected', () => {
    const wrapper = mount(GoogleAccountCard, {
      ...config,
      store: new Vuex.Store(cloneStore()),
      propsData: Connected.args,
      stubs: {
        VueShowdown: true,
      },
    });
    // Check if account email is visible, the email is defined in the mock
    expect(wrapper.find('a').text()).toBe('v.godard@maisonroyer.com');
  });
});
