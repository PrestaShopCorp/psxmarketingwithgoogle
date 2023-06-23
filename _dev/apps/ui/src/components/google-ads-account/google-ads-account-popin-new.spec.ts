/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount} from '@vue/test-utils';
import {BFormCheckbox, BButton} from 'bootstrap-vue';
import config, {cloneStore, localVue} from '@/../tests/init';
import GoogleAdsAccountPopinNew from '@/components/google-ads-account/google-ads-account-popin-new.vue';

import {
  googleAccountConnected,
} from '@/../.storybook/mock/google-account';
import {
  initialStateApp,
} from '@/../.storybook/mock/state-app';

const wrapperOptions = {
  propsData: {
    visible: true,
    user: {...googleAccountConnected},
  },
  stubs: {
    VueShowdown: true,
    BButton,
    BFormCheckbox,
  },
  ...config,
};

describe('google-ads-account-popin-new.vue', () => {
  let storeInitApp: ReturnType<typeof cloneStore>;
  beforeEach(() => {
    storeInitApp = cloneStore();
    storeInitApp.modules.app.state = {
      ...storeInitApp.modules.app.state,
      ...initialStateApp,
    };
    storeInitApp.modules.googleAds.actions.GET_GOOGLE_ADS_SHOPINFORMATIONS_BILLING = jest.fn();
  });

  it('create account button is disabled when inputs not filled but checkbox is  checked', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,
      stubs: {
        VueShowdown: true,
      },
      computed: {
        selectedTimeZone() {
          return null;
        },
        selectedCurrency() {
          return 'DIR';
        },
        selectedDescriptiveName() {
          return 'Google';
        },
      },
    });

    await wrapper.setData({acceptsGoogleTerms: true});
    await wrapper.setData({
      newAccountInfos: {
        country: 'FR',
      },
    });
    const checkboxWrapper = wrapper.find('[data-test-id="buttonCheckbox"]');
    expect(checkboxWrapper.attributes('disabled')).toBeUndefined();
    // Check if the checkbox is lacking the attribute checked
    expect(checkboxWrapper.attributes('checked')).toBeUndefined();
    expect(wrapper.find('[data-test-id="buttonCreate"]').attributes('disabled')).toBeTruthy();
  });

  it('create account button is disabled when inputs filled but checkbox is not checked', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,
      stubs: {
        VueShowdown: true,
      },
      computed: {
        selectedTimeZone() {
          return '(UTC-10:00) Hawaii';
        },
        selectedCurrency() {
          return 'DIR';
        },
        selectedDescriptiveName() {
          return 'Google';
        },
      },
    });

    const checkboxWrapper = wrapper.find('[data-test-id="buttonCheckbox"]');
    // Check if the checkbox is lacking the attribute checked
    expect(checkboxWrapper.attributes('checked')).toBeUndefined();
    expect(wrapper.find('[data-test-id="buttonCreate"]').attributes('disabled')).toBeTruthy();
  });

  it('create account button is enabled when everything is checked', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,
      stubs: {
        VueShowdown: true,
      },
      computed: {
        selectedTimeZone() {
          return '(UTC-10:00) Hawaii';
        },
        selectedCurrency() {
          return 'DIR';
        },
        selectedDescriptiveName() {
          return 'Google';
        },
      },

    });

    // Set the checkbox to checked

    await wrapper.setData({acceptsGoogleTerms: true});
    await wrapper.setData({
      newAccountInfos: {
        country: 'FR',
      },
    });
    const checkboxWrapper = wrapper.find('[data-test-id="buttonCheckbox"]');
    expect(checkboxWrapper.attributes('disabled')).toBeUndefined();
    // Check if the button is not disabled
    expect(wrapper.find('[data-test-id="buttonCreate"]').attributes('disabled')).toBeUndefined();
  });
});
