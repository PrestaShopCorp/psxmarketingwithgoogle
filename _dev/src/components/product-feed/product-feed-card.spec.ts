/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {localVue, cloneStore} from '@/../tests/init';
import config from '@/../tests/init';
import BadgeListRequirements from '@/components/commons/badge-list-requirements.vue';
import {shallowMount} from '@vue/test-utils';
import ProductFeedCard from '@/components/product-feed/product-feed-card.vue';
import ProductFeedCardReportCard from '@/components/product-feed/product-feed-card-report-card.vue';
import Stepper from '@/components/commons/stepper.vue';
import BootstrapVue, {BAlert} from 'bootstrap-vue';
import VueShowdown from 'vue-showdown';

import {
  productFeed,
  productFeedIsConfigured,
} from '../../../.storybook/mock/product-feed';



describe('merchant-center-account-card.vue', () => {
  const mockRoute = {
    path: '/product-feed-settings',
  };
  const mockRouter = {
    push: jest.fn(),
  };
  let storeDisabledOrNotConfigured;
  let storeConfigured;
  beforeEach(() => {
    storeDisabledOrNotConfigured = cloneStore();
    storeDisabledOrNotConfigured.modules.productFeed.state = {
      ...storeDisabledOrNotConfigured.modules.productFeed.state,
      ...productFeed
    };
    storeConfigured = cloneStore();
    storeConfigured.modules.productFeed.state = {
      ...storeConfigured.modules.productFeed.state,
      ...productFeedIsConfigured
    };
  })

  let storeDisabledOrNotConfigured;
  let storeConfigured;
  beforeEach(() => {
    storeDisabledOrNotConfigured = cloneStore();
    storeDisabledOrNotConfigured.modules.productFeed.state = {
      ...storeDisabledOrNotConfigured.modules.productFeed.state,
      ...productFeed,
    };
    storeConfigured = cloneStore();
    storeConfigured.modules.productFeed.state = {
      ...storeConfigured.modules.productFeed.state,
      ...productFeedIsConfigured,
    };
  });

  it('is disabled when not activated', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: false,
      },
      ...config,
      store: new Vuex.Store(storeDisabledOrNotConfigured),
    });
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(true);
    expect(wrapper.findComponent(BadgeListRequirements).exists()).toBeTruthy();
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
  });

  it('shows stepper at 1 when enabled', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
        ...config,
      },
      store: new Vuex.Store(storeDisabledOrNotConfigured),
    });
    expect(wrapper.findComponent(Stepper).exists()).toBeTruthy();
    expect(wrapper.findComponent(Stepper).props('activeStep')).toBe(1);
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
    expect(wrapper.find('b-button').exists()).toBeTruthy();
  });

  it('shows button and triggers configration on click', async () => {
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
      store: new Vuex.Store(storeDisabledOrNotConfigured),
    });
    await wrapper.find('b-button').trigger('click');
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(mockRoute);
  });

  it('shows product feed card ready if already configured', () => {
    const timeConverterToDate = jest.fn();
    localVue.filter('timeConverterToDate', timeConverterToDate);
    const timeConverterToHour = jest.fn();
    localVue.filter('timeConverterToHour', timeConverterToHour);
    const changeCountryCodeToName = jest.fn();
    changeCountryCodeToName.mockImplementation(() => []);
    localVue.filter('changeCountryCodeToName', changeCountryCodeToName);
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
      },
      ...config,
      mocks: {
        $router: mockRouter,
      },
      localVue,
      store: new Vuex.Store(storeConfigured),
    });
    expect(wrapper.findComponent(ProductFeedCardReportCard).exists()).toBeTruthy();
    expect(timeConverterToDate).toHaveBeenCalledTimes(2);
    expect(timeConverterToHour).toHaveBeenCalledTimes(1);
    expect(changeCountryCodeToName).toHaveBeenCalledTimes(1);
    expect(wrapper.findComponent(VueShowdown.VueShowdown).exists()).toBeTruthy();
  });
});
