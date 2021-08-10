/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import config, {cloneStore} from '@/../tests/init';

import {mount, shallowMount} from '@vue/test-utils';
import GoogleAccountCard from '@/components/google-ads-account/google-ads-account-card.vue';
import {
  Disabled,
  Enabled,
  EnabledButNoAccount,
  EnabledConnected,
  CantConnect,
  Suspended,
  BillingSettingsMissing,
  NeedRefreshAfterBilling,
  Canceled,
} from '@/../stories/google-ads-account-card.stories';

describe('google-ads-account.vue / disabled', () => {
  it('card is greyed out when card is disabled', () => {
    const wrapper = mount(GoogleAccountCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: Disabled.args,
      beforeMount: Disabled.args.beforeMount,
    });

    // Check if the card is greyed out
    expect(wrapper.find('.ps_gs-onboardingcard').classes()).toContain('ps_gs-onboardingcard--disabled-grey');
  });
});

describe('google-ads-account.vue / enabled', () => {
  it('shows a link to create a new account', () => {
    const wrapper = mount(GoogleAccountCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: Enabled.args,
      beforeMount: Enabled.args.beforeMount,
      stubs: {
        VueShowdown: true,
      },
    });

    // Check enabled state
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled-grey')).toBe(false);
    // Check button to create an account exists
    expect(wrapper.find('a .material-icons').text()).toBe('person_add');
  });

  it.skip('dropdown should be available when card is enabled', () => {
    const wrapper = mount(GoogleAccountCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: Enabled.args,
      beforeMount: Enabled.args.beforeMount,
      stubs: {
        VueShowdown: true,
      },
    });

    // Check that the dropdown is not disabled
    expect(wrapper.find('#googleAdsAccountSelection').attributes('disabled')).toBeFalsy();

    // Check that the connect button is disabled as now account is selected
    // TODO > Have a correct selector when I'll be able to modify the markup
    expect(wrapper.find('#googleAdsAccountSelection + .btn').attributes('disabled')).toBeTruthy();
  });

  // TODO: it.skip because it's not done yet
  it.skip('there is a specific message when list is empty', () => {
    const wrapper = mount(GoogleAccountCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: EnabledButNoAccount.args,
      beforeMount: EnabledButNoAccount.args.beforeMount,
      stubs: {
        VueShowdown: true,
      },
    });

    // Check that the dropdown is disabled
    expect(wrapper.find('[data-test-id="message-empty-list"]').exists()).toBeTruthy();
  });

  // TODO: it.skip because it's not done yet
  it.skip('dropdown is disabled when API error', () => {
    const wrapper = mount(GoogleAccountCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: CantConnect.args,
      beforeMount: CantConnect.args.beforeMount,
      stubs: {
        VueShowdown: true,
      },
    });

    // Check that the dropdown is disabled
    expect(wrapper.find('#googleAdsAccountSelection').attributes('disabled')).toBeTruthy();
  });
});
