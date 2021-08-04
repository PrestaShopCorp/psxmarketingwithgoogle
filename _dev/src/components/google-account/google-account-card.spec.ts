/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window
import config from '@/../tests/init';
import {
  Disabled,
  NotConnectedAndNoAuthenticationUrlYet,
  NotConnectedAndCanNotGetAuthenticationUrl,
  NotConnected,
  CouldNotConnect,
  Connected,
} from '@/../stories/google-account-card.stories';

import {createWrapper, shallowMount, mount} from '@vue/test-utils';
import GoogleAccountCard from '@/components/google-account/google-account-card.vue';

describe('google-account-card.vue', () => {
  it('card is greyed when disabled', () => {
    const wrapper = mount(GoogleAccountCard, {
      ...config,
      propsData: Disabled.args,
    });

    expect(wrapper.find('.ps_gs-onboardingcard--disabled-grey').exists()).toBeTruthy();
  });

  it('card isn\'t greyed when enabled', () => {
    const wrapper = mount(GoogleAccountCard, {
      ...config,
      propsData: NotConnected.args,
    });

    expect(wrapper.find('.ps_gs-onboardingcard--disabled-grey').exists()).toBeFalsy();
  });
});
