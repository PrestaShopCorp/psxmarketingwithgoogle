/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount, shallowMount} from '@vue/test-utils';
import {BFormCheckbox, BButton} from 'bootstrap-vue';
import config, {cloneStore, filters, localVue} from '@/../tests/init';
import GoogleAdsAccountPopinNew from '@/components/google-ads-account/google-ads-account-popin-new.vue';

import {
  googleAccountConnected,
} from '@/../.storybook/mock/google-account';
import {
  initialStateApp,
} from '../../../.storybook/mock/state-app';

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

describe('google-ads-account-popin-new.vue / step 1', () => {
  let storeInitApp;
  beforeEach(() => {
    storeInitApp = cloneStore();
    storeInitApp.modules.app.state = {
      ...storeInitApp.modules.app.state,
      ...initialStateApp,
    };
  });
  it('step 1 is active in the stepper', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,
    });
    await wrapper.setData({stepActiveData: 1});

    expect(wrapper.findAll('.ps_gs-stepper-step').at(0).attributes('aria-current')).toEqual('step');
    expect(wrapper.findAll('.ps_gs-stepper-step').at(1).attributes('aria-current')).toBeUndefined();
  });
});

describe('google-ads-account-popin-new.vue / step 2', () => {
  let storeInitApp;
  beforeEach(() => {
    storeInitApp = cloneStore();
    storeInitApp.modules.app.state = {
      ...storeInitApp.modules.app.state,
      ...initialStateApp,
    };
  });
  it('step 2 is active in the stepper', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      store: new Vuex.Store(storeInitApp),
      ...wrapperOptions,
      localVue,
    });
    await wrapper.setData({stepActiveData: 2});

    expect(wrapper.findAll('.ps_gs-stepper-step').at(1).attributes('aria-current')).toEqual('step');
    expect(wrapper.findAll('.ps_gs-stepper-step').at(0).attributes('aria-current')).toBeUndefined();
  });

  it('continue button is disabled when selectedTimeZone is null', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,
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
    await wrapper.setData({stepActiveData: 2});
    await wrapper.setData({newAccountInfos: {country: ['AU']}});
    expect(wrapper.find('[data-test-id="buttonContinue"]').attributes('disabled')).toBeTruthy();
  });

  it('continue button is disabled when selectedBillingCountry is null', async () => {
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
    await wrapper.setData({stepActiveData: 2});
    await wrapper.setData({newAccountInfos: {country: null}});
    expect(wrapper.find('[data-test-id="buttonContinue"]').attributes('disabled')).toBeTruthy();
  });

  it('continue button is disabled when selectedCurrency is null', async () => {
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
          return null;
        },
        selectedDescriptiveName() {
          return 'Google';
        },
      },
    });
    await wrapper.setData({stepActiveData: 2});
    await wrapper.setData({newAccountInfos: {country: ['AU']}});
    expect(wrapper.find('[data-test-id="buttonContinue"]').attributes('disabled')).toBeTruthy();
  });

  it('continue button is enabled when selectedTimeZone, selectedBillingCountry, selectedCurrency are not null', async () => {
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
    await wrapper.setData({stepActiveData: 2});
    await wrapper.setData({newAccountInfos: {country: ['AU']}});
    expect(wrapper.find('[data-test-id="buttonContinue"]').attributes('disabled')).toBeUndefined();
  });
});

describe('google-ads-account-popin-new.vue / step 3', () => {
  let storeInitApp;
  beforeEach(() => {
    storeInitApp = cloneStore();
    storeInitApp.modules.app.state = {
      ...storeInitApp.modules.app.state,
      ...initialStateApp,
    };
  });
  it('step 3 is active in the stepper', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,
      stubs: {
        VueShowdown: true,
      },
    });
    await wrapper.setData({stepActiveData: 3});
    expect(wrapper.findAll('.ps_gs-stepper-step').at(2).attributes('aria-current')).toEqual('step');
    expect(wrapper.findAll('.ps_gs-stepper-step').at(0).attributes('aria-current')).toBeUndefined();
  });

  it('create account button is disabled when checkbox is not checked', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,
      stubs: {
        VueShowdown: true,
      },
    });
    await wrapper.setData({stepActiveData: 3});
    const checkboxWrapper = wrapper.find('[data-test-id="buttonCheckbox"]');

    // Check if the checkbox is lacking the attribute checked
    expect(checkboxWrapper.attributes('checked')).toBeUndefined();
    // Check if the button is disabled
    expect(wrapper.find('[data-test-id="buttonContinueStep2"]').attributes('disabled')).toBeTruthy();
  });

  it('create account button is enabled when checkbox is checked', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,
      stubs: {
        VueShowdown: true,
      },
    });
    await wrapper.setData({stepActiveData: 3});
    // Set the checkbox to checked
    await wrapper.setData({acceptsGoogleTerms: true});
    const checkboxWrapper = wrapper.find('[data-test-id="buttonCheckbox"]');
    expect(checkboxWrapper.attributes('disabled')).toBeUndefined();
    // Check if the button is not disabled
    expect(wrapper.find('[data-test-id="buttonContinueStep2"]').attributes('disabled')).toBeUndefined();
  });
});
