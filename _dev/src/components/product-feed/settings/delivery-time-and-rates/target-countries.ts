/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount, shallowMount} from '@vue/test-utils'; // eslint-disable-line import/no-extraneous-dependencies
import BootstrapVue, {BFormRadio} from 'bootstrap-vue';
import config, {localVue, cloneStore, filters} from '@/../tests/init';
import ProductFeedSettingsShipping from './target-countries.vue';
import Stepper from '@/components/commons/stepper.vue';
import PsSelect from '@/components/commons/ps-select.vue';
import {
  SettingsSetup,
} from '@/../stories/product-feed-settings.stories';
import countriesSelectionOptions from '@/assets/json/countries.json';

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
      propsData: SettingsSetup.args,
      beforeMount: SettingsSetup.args.beforeMount,
      localVue,
      store: new Vuex.Store(mockStore),
    });
    expect(filters.changeCountriesCodesToNames).toHaveBeenCalledTimes(1);
    await expect(wrapper.find('[data-test-id="continueButton"]').trigger('click'));
    expect(wrapper.find('.commit'));
    expect(mockMutation.SET_ACTIVE_CONFIGURATION_STEP).toHaveBeenCalledTimes(1);
    expect(mockMutation.SET_ACTIVE_CONFIGURATION_STEP)
      .toHaveBeenCalledWith(expect.anything(), 2);
  });

  it('shows button cancel and triggers previous step on click', async () => {
    const wrapper = shallowMount(ProductFeedSettingsShipping, {
      propsData: SettingsSetup.args,
      beforeMount: SettingsSetup.args.beforeMount,
      localVue,
      store: new Vuex.Store(cloneStore()),
    });
    expect(filters.changeCountriesCodesToNames).toHaveBeenCalledTimes(1);
    await expect(wrapper.find('b-button').trigger('click'));
    wrapper.vm.$emit('cancelProductFeedSettingsConfiguration');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('cancelProductFeedSettingsConfiguration')).toBeTruthy();
  });

  it('shows input target countries', () => {
    const wrapper = mount(ProductFeedSettingsShipping, {
      store: new Vuex.Store(cloneStore()),
      propsData: SettingsSetup.args,
      beforeMount: SettingsSetup.args.beforeMount,
      localVue,
      stubs: {
        VueShowdown: true,
      },
    });
    const input = wrapper.find('input');
    expect(input.exists()).toBeTruthy();
    expect(filters.changeCountriesCodesToNames).toHaveBeenCalledTimes(1);
  });

  it('shows button radio with auto and manually import settings with prefill', () => {
    const wrapper = shallowMount(ProductFeedSettingsShipping, {
      propsData: SettingsSetup.args,
      beforeMount: SettingsSetup.args.beforeMount,
      localVue,
      store: new Vuex.Store(cloneStore()),
    });
    const radioButton = wrapper.find('[data-test-id="radioButton"]');
    expect(filters.changeCountriesCodesToNames).toHaveBeenCalledTimes(1);
    expect(radioButton.exists()).toBeTruthy();
  });
});
