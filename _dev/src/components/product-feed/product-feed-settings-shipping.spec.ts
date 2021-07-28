/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import config, {localVue, cloneStore} from '@/../tests/init';
import {shallowMount} from '@vue/test-utils';
import ProductFeedCard from '@/components/product-feed/product-feed-card.vue';
import ProductFeedSettingsShipping from '@/components/product-feed/product-feed-settings-shipping.vue';
import ProductFeedSettingsShippingReportCard from '@/components/product-feed/product-feed-card-report-card.vue';
import Stepper from '@/components/commons/stepper.vue';
import VueShowdown from 'vue-showdown';

import store from '@/store';
import {
  productFeed,
  productFeedIsConfigured,
} from '../../../.storybook/mock/product-feed';
import {
  initialStateApp,
} from '../../../.storybook/mock/state-app';

describe('product-feed-settings-shipping.vue', () => {
  let mutationsCloned;
  let storeStepOne;
  beforeEach(() => {
    mutationsCloned = {
      SET_ACTIVE_CONFIGURATION_STEP: jest.fn(),
    };
    storeStepOne = cloneStore();
    storeStepOne.modules.productFeed.state = {
      ...storeStepOne.modules.productFeed.state,
      ...productFeed,
    };

    storeStepOne.modules.app.state = {
      ...storeStepOne.modules.app.state,
      ...initialStateApp,
    };

    storeStepOne.modules.productFeed.mutations = {
      ...storeStepOne.modules.productFeed.mutations,
      ...mutationsCloned,
    };
  });

  it('shows stepper at 1 ', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
        ...config,
      },
      store: new Vuex.Store(storeStepOne),
    });
    expect(wrapper.findComponent(Stepper).exists()).toBeTruthy();
    expect(wrapper.findComponent(Stepper).props('activeStep')).toBe(1);
    expect(wrapper.find('b-button').exists()).toBeTruthy();
  });

  it('shows button continue and triggers next step on click', async () => {
    const wrapper = shallowMount(ProductFeedSettingsShipping, {
      ...config,
      propsData: {
        isEnabled: true,
      },
      ...localVue,
      store: new Vuex.Store(storeStepOne),
    });
    await expect(wrapper.find('[data-test-id="continueButton"]').trigger('click'));
    expect(wrapper.find('.commit'));
    expect(mutationsCloned.SET_ACTIVE_CONFIGURATION_STEP).toHaveBeenCalledTimes(1);
    expect(mutationsCloned.SET_ACTIVE_CONFIGURATION_STEP)
      .toHaveBeenCalledWith(expect.anything(), 2);
  });

  it('shows button cancel and triggers previous step on click', async () => {
    const wrapper = shallowMount(ProductFeedSettingsShipping, {
      ...config,
      propsData: {
        isEnabled: true,
      },
      ...localVue,
      store: new Vuex.Store(storeStepOne),
    });
    await expect(wrapper.find('b-button').trigger('click'));
    wrapper.vm.$emit('cancelProductFeedSettingsConfiguration');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('cancelProductFeedSettingsConfiguration')).toBeTruthy();
  });
});
