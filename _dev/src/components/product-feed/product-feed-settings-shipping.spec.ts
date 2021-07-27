/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import config, {localVue, cloneStore} from '@/../tests/init';
import {shallowMount} from '@vue/test-utils';
import ProductFeedCard from '@/components/product-feed/product-feed-card.vue';
import ProductFeedCardReportCard from '@/components/product-feed/product-feed-card-report-card.vue';
import Stepper from '@/components/commons/stepper.vue';
import VueShowdown from 'vue-showdown';

import store from '@/store';
import {
  productFeed,
  productFeedIsConfigured,
} from '../../../.storybook/mock/product-feed';

describe('product-feed-settings-shipping.vue', () => {
  const mockRoute = {
    path: '/product-feed-settings',
  };
  const mockRouter = {
    push: jest.fn(),
  };

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
    const wrapper = shallowMount(ProductFeedCard, {
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
      },
      ...config,
      propsData: {
        isEnabled: true,
      },
      ...localVue,
      store: new Vuex.Store(storeStepOne),
    });
    await expect(wrapper.find('b-button').trigger('click'));
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(mockRoute);
    //   TODO : check for commit to be send
    //  expect(wrapper.find(".commit"));
    //  expect(mutationsCloned.SET_ACTIVE_CONFIGURATION_STEP).toHaveBeenCalledTimes(1);
    //  expect(mutationsCloned.SET_ACTIVE_CONFIGURATION_STEP).toHaveBeenCalledWith(2);
  });

  it('shows button cancel and triggers previous step on click', async () => {
    const wrapper = shallowMount(ProductFeedCard, {
      ...config,
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
      },
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
    expect(mockRouter.push).toHaveBeenCalledTimes(2);
    expect(mockRouter.push).toHaveBeenCalledWith(mockRoute);
  });

  //  it('shows input target countries with good datas', () => {
  //   TODO : check for inputs to be well filled

  //  });
});
