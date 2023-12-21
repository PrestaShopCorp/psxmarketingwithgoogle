import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount, MountOptions} from '@vue/test-utils';
import cloneDeep from 'lodash.clonedeep';
import config, {localVue, cloneStore} from '@/../tests/init';

import GoogleAccountCard from '@/components/google-ads-account/google-ads-account-card.vue';
import {
  Disabled,
  Enabled,
  EnabledButNoAccount,
  EnabledConnected,
  CantConnect,
  Suspended,
  Canceled,
} from '@/../stories/google-ads-account-card.stories';
import {GoogleAdsErrorReason} from '@/store/modules/google-ads/state';
import googleAdsNotChosen, {googleAdsAccountChosen} from '../../../.storybook/mock/google-ads';

describe('google-ads-account.vue / disabled', () => {
  it('card is greyed out when card is disabled', () => {
    const wrapper = mount(GoogleAccountCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: Disabled.args,
      beforeMount: Disabled.args.beforeMount,
      stubs: {
        VueShowdown: true,
      },
    });

    // Check if the card is greyed out
    expect(wrapper.find('.ps_gs-onboardingcard').classes()).toContain('ps_gs-onboardingcard--disabled');

    // Check if there is no b-alert
    expect(wrapper.find('b-alert').exists()).toBeFalsy();

    // Check that the dropdown doesn't exist
    expect(wrapper.find('#googleAdsAccountSelection').exists()).toBeFalsy();
  });
});

describe('google-ads-account.vue / enabled', () => {
  const buildWrapper = (
    options: MountOptions<any> = {},
  ) => {
    const store = cloneStore();

    return mount(GoogleAccountCard, {
      localVue,
      store: new Vuex.Store(store),
      ...config,
      ...options,
    });
  };

  it('shows a link to create a new account', () => {
    const store = cloneStore();
    store.modules.googleAds.state = cloneDeep(googleAdsNotChosen);

    const wrapper = buildWrapper({
      propsData: Enabled.args,
      beforeMount: Enabled.args.beforeMount,
      store: new Vuex.Store(store),
      stubs: {
        VueShowdown: true,
      },
    });

    // Check enabled state
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(false);
  });

  it('dropdown should be available when card is enabled', () => {
    const store = cloneStore();
    store.modules.googleAds.state = cloneDeep(googleAdsNotChosen);

    const wrapper = buildWrapper({
      propsData: Enabled.args,
      beforeMount: Enabled.args.beforeMount,
      store: new Vuex.Store(store),
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
    const store = cloneStore();
    store.modules.googleAds.state = cloneDeep(googleAdsNotChosen);
    store.modules.googleAds.state.list = [];

    const wrapper = buildWrapper({
      propsData: EnabledButNoAccount.args,
      beforeMount: EnabledButNoAccount.args.beforeMount,
      store: new Vuex.Store(store),
      stubs: {
        VueShowdown: true,
      },
    });

    // Check that the dropdown is disabled
    expect(wrapper.find('[data-test-id="message-empty-list"]').exists()).toBeTruthy();
  });

  it('dropdown is disabled when API error', () => {
    const store = cloneStore();
    store.modules.googleAds.state = cloneDeep(googleAdsAccountChosen);

    const wrapper = buildWrapper({
      propsData: CantConnect.args,
      beforeMount: CantConnect.args.beforeMount,
      store: new Vuex.Store(store),
      stubs: {
        VueShowdown: true,
      },
    });

    // Check that the dropdown is disabled
    expect(wrapper.find('#googleAdsAccountSelection').attributes('disabled')).toBeTruthy();
  });

  it('clicking on disconnect emmit the event to open a popup', async () => {
    const store = cloneStore();
    store.modules.googleAds.state = cloneDeep(googleAdsAccountChosen);

    const wrapper = buildWrapper({
      propsData: EnabledConnected.args,
      beforeMount: EnabledConnected.args.beforeMount,
      store: new Vuex.Store(store),
      stubs: {
        VueShowdown: true,
      },
    });

    // Check if openPopin event has been emmited when disconnect button is clicked
    await wrapper.find('[data-test-id="btn-disconnect"]').trigger('click');
    expect(wrapper.emitted('disconnectionGoogleAdsAccount')).toBeTruthy();
  });

  it('badge and alert are red when status is Canceled', () => {
    const store = cloneStore();

    store.modules.googleAds.state.status = GoogleAdsErrorReason.Cancelled;

    const wrapper = buildWrapper({
      propsData: Canceled.args,
      beforeMount: Canceled.args.beforeMount,
      store: new Vuex.Store(store),
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
    const store = cloneStore();

    store.modules.googleAds.state.status = GoogleAdsErrorReason.Suspended;

    const wrapper = buildWrapper({
      propsData: Suspended.args,
      beforeMount: Suspended.args.beforeMount,
      store: new Vuex.Store(store),
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
