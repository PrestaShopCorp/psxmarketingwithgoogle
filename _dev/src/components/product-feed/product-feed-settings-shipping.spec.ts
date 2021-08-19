/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import config, {localVue, cloneStore} from '@/../tests/init';
import {shallowMount, mount} from '@vue/test-utils';
import ProductFeedSettingsShipping from '@/components/product-feed/product-feed-settings-shipping.vue';
import Stepper from '@/components/commons/stepper.vue';
import PsSelect from '@/components/commons/ps-select.vue';
import BootstrapVue, {BFormRadio} from 'bootstrap-vue';
import {
  ShippingSettings,
} from '@/../stories/product-feed-settings.stories';
import countriesSelectionOptions from '../../assets/json/countries.json';

describe('product-feed-settings-shipping.vue', () => {
  let mockMutation;
  let mockStore;

  beforeEach(() => {
    mockMutation = {
      SET_SELECTED_PRODUCT_FEED_SETTINGS: jest.fn(),
      SET_ACTIVE_CONFIGURATION_STEP: jest.fn(),
    };
    mockStore = cloneStore();
    mockStore.modules.productFeed.mutations = {
      ...mockStore.modules.productFeed.mutations,
      ...mockMutation,
    };
  });

  it('shows button continue and triggers next step on click', async () => {
    const wrapper = shallowMount(ProductFeedSettingsShipping, {
      store: new Vuex.Store(mockStore),
      propsData: ShippingSettings.args,
      beforeMount: ShippingSettings.args.beforeMount,
    });
    await expect(wrapper.find('[data-test-id="continueButton"]').trigger('click'));
    expect(wrapper.find('.commit'));
    expect(mockMutation.SET_ACTIVE_CONFIGURATION_STEP).toHaveBeenCalledTimes(1);
    expect(mockMutation.SET_ACTIVE_CONFIGURATION_STEP)
      .toHaveBeenCalledWith(expect.anything(), 2);
  });

  it('shows button cancel and triggers previous step on click', async () => {
    const wrapper = shallowMount(ProductFeedSettingsShipping, {
      store: new Vuex.Store(cloneStore()),
      propsData: ShippingSettings.args,
      beforeMount: ShippingSettings.args.beforeMount,
    });
    await expect(wrapper.find('b-button').trigger('click'));
    wrapper.vm.$emit('cancelProductFeedSettingsConfiguration');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('cancelProductFeedSettingsConfiguration')).toBeTruthy();
  });

  it('shows input target countries with prefill', () => {
    const wrapper = shallowMount(ProductFeedSettingsShipping, {
      store: new Vuex.Store(cloneStore()),
      propsData: ShippingSettings.args,
      beforeMount: ShippingSettings.args.beforeMount,
    });

    const input = wrapper.findComponent(PsSelect);
    expect(input.exists()).toBeTruthy();
    expect(input.props('value')).toEqual('FR');
  });

  it('shows button radio with auto and manually import settings with prefill', () => {
    const wrapper = shallowMount(ProductFeedSettingsShipping, {
      store: new Vuex.Store(cloneStore()),
      propsData: ShippingSettings.args,
      beforeMount: ShippingSettings.args.beforeMount,
    });
    const radioButton = wrapper.find('[data-test-id="radioButton"]');
    expect(radioButton.exists()).toBeTruthy();
  });
});
