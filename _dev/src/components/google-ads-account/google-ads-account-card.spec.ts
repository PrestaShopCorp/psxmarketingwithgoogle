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
import {BButton} from 'bootstrap-vue';

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

  it('dropdown should be available when card is enabled', () => {
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
    expect(wrapper.find('#googleAdsAccountSelection + b-button').attributes('disabled')).toBeTruthy();
  });

  it('there is a specific message when list is empty', () => {
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

  it('dropdown is disabled when API error', () => {
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

  it('clicking on disconnect emmit the event to open a popup', async () => {
    const wrapper = mount(GoogleAccountCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: EnabledConnected.args,
      beforeMount: EnabledConnected.args.beforeMount,
      stubs: {
        VueShowdown: true,
      },
    });

    // Check if openPopin event has been emmited when disconnect button is clicked
    await wrapper.find('[data-test-id="btn-disconnect"]').trigger('click');
    expect(wrapper.emitted('disconnectionGoogleAdsAccount')).toBeTruthy();
  });

  it('badge and alert are red when status is Canceled', () => {
    const wrapper = mount(GoogleAccountCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: Canceled.args,
      beforeMount: Canceled.args.beforeMount,
      stubs: {
        VueShowdown: true,
      },
    });

    // Check if b-badge has the variant props set to danger
    expect(wrapper.find('b-badge[variant="danger"]').exists()).toBeTruthy();

    // Check if b-alert has the variant props set to danger
    expect(wrapper.find('b-alert[variant="danger"]').exists()).toBeTruthy();
  });

  it('badge and alert are red when status is Suspended', () => {
    const wrapper = mount(GoogleAccountCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: Suspended.args,
      beforeMount: Suspended.args.beforeMount,
      stubs: {
        VueShowdown: true,
      },
    });

    // Check if b-badge has the variant props set to danger
    expect(wrapper.find('b-badge[variant="danger"]').exists()).toBeTruthy();

    // Check if b-alert has the variant props set to danger
    expect(wrapper.find('b-alert[variant="danger"]').exists()).toBeTruthy();
  });
});
