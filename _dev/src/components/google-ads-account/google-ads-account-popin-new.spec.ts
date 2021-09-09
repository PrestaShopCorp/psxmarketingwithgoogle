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
import {ConfiguredNoTax} from 'stories/product-feed-card.stories';
import {
  initialStateApp,
} from '../../../.storybook/mock/state-app';

const VBTooltip = jest.fn();

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
  directives: {
    'b-tooltip': VBTooltip,
  },
  ...config,
};

describe('google-ads-account.vue / step 1', () => {
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

describe('google-ads-account.vue / step 2', () => {
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
    expect(wrapper.find('button.btn-primary').attributes('disabled')).toBe('disabled');
  });

  it('continue button is disabled when selectedBillingCountry is null', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,

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
    await wrapper.setData({newAccountInfos: {country: []}});
    expect(wrapper.find('button.btn-primary').attributes('disabled')).toBe('disabled');
  });

  it('continue button is disabled when selectedCurrency is null', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,

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
    expect(wrapper.find('button.btn-primary').attributes('disabled')).toBe('disabled');
  });

  it('continue button is enabled when selectedTimeZone, selectedBillingCountry, selectedCurrency are not null', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,
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

    expect(wrapper.find('button.btn-primary').attributes('disabled')).toBeUndefined();
  });
});

describe('google-ads-account.vue / step 3', () => {
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

    });
    await wrapper.setData({stepActiveData: 3});
    const checkboxWrapper = wrapper.find('[type=checkbox]');

    // Check if the checkbox is lacking the attribute checked
    expect(checkboxWrapper.attributes('checked')).toBeUndefined();
    // Check if the button is disabled
    expect(wrapper.find('button.btn-primary').attributes('disabled')).toBe('disabled');
  });

  it('create account button is enabled when checkbox is checked', async () => {
    const wrapper = mount(GoogleAdsAccountPopinNew, {
      ...wrapperOptions,
      store: new Vuex.Store(storeInitApp),
      localVue,

    });
    await wrapper.setData({stepActiveData: 3});
    const checkboxWrapper = wrapper.find('[type=checkbox]');
    // Set the checkbox to checked
    await checkboxWrapper.setChecked();

    // Check if the button is not disabled
    expect(wrapper.find('button.btn-primary').attributes('disabled')).toBeUndefined();
  });
});
