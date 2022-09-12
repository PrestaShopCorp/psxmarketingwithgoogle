/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount} from '@vue/test-utils';
import {BFormRadio} from 'bootstrap-vue';
import config, {cloneStore} from '@/../tests/init';
import ShippingSetup from './shipping-setup.vue';
import {
  productFeed,
} from '@/../.storybook/mock/product-feed';
import {ProductFeedSettings} from '../../../../store/modules/product-feed/state';
import {ShippingSetupOption} from '../../../../enums/product-feed/shipping';

describe('shipping-setup.vue', () => {
  const getStore = (settings: Partial<ProductFeedSettings>) => {
    const storeDisabledOrNotConfigured = cloneStore();
    storeDisabledOrNotConfigured.modules.productFeed.state = {
      ...storeDisabledOrNotConfigured.modules.productFeed.state,
      ...productFeed,

    };
    storeDisabledOrNotConfigured.modules.productFeed.state.settings = {
      ...storeDisabledOrNotConfigured.modules.productFeed.state.settings,
      ...settings,
    };
    return storeDisabledOrNotConfigured;
  };
  const getWrapper = (settings: Partial<ProductFeedSettings> = {}) => mount(ShippingSetup, {
    propsData: {
      isEnabled: false,
      badges: [],
      loading: false,
    },
    ...config,
    store: new Vuex.Store(getStore(settings)),
  });

  it('displays unselected options by default', () => {
    const wrapper = getWrapper();

    const shippingSetupOptions = wrapper.findAllComponents(BFormRadio);
    expect(shippingSetupOptions.length).toBe(2);
    expect(wrapper.findAll('.ps_gs-shipping-setup-option').length).toBe(2);
    expect(wrapper.findAllComponents(BFormRadio).length).toBe(2);
    expect(shippingSetupOptions.at(0).attributes('checked')).toBeFalsy();
    expect(shippingSetupOptions.at(1).attributes('checked')).toBeFalsy();
    expect(shippingSetupOptions.at(0).classes('selected')).toBeFalsy();
    expect(shippingSetupOptions.at(1).classes('selected')).toBeFalsy();
  });

  it('checks the first option when estimate is chosen', async () => {
    const wrapper = getWrapper({shippingSetup: ShippingSetupOption.ESTIMATE});
    const shippingSetupOptions = wrapper.findAll('.ps_gs-shipping-setup-option');
    expect(shippingSetupOptions.at(0).classes('selected')).toBeTruthy();
    expect(shippingSetupOptions.at(1).classes('selected')).toBeFalsy();
  });

  it('checks the second option when import is chosen', async () => {
    const wrapper = getWrapper({shippingSetup: ShippingSetupOption.IMPORT});
    const shippingSetupOptions = wrapper.findAll('.ps_gs-shipping-setup-option');
    expect(shippingSetupOptions.at(0).classes('selected')).toBeFalsy();
    expect(shippingSetupOptions.at(1).classes('selected')).toBeTruthy();
  });

  it('hides the previous bouton', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('[data-test-id="previousButton"]').exists()).toBe(false);
    expect(wrapper.find('[data-test-id="continueButton"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="cancelButton"]').exists()).toBe(true);
  });
});
