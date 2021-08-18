/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import config, {localVue, cloneStore} from '@/../tests/init';
import BadgeListRequirements from '@/components/commons/badge-list-requirements.vue';
import {shallowMount, mount} from '@vue/test-utils';
import ProductFeedCard from '@/components/product-feed/product-feed-card.vue';
import ProductFeedCardReportCard from '@/components/product-feed/product-feed-card-report-card.vue';
import Stepper from '@/components/commons/stepper.vue';
import BootstrapVue, {BAlert} from 'bootstrap-vue';
import VueShowdown from 'vue-showdown';

import {
  productFeed,
  productFeedMissingFields,
  productFeedIsConfigured,
  productFeedIsReadyForExport,
  productFeedStatusSyncFailed,
  productFeedErrorAPI,
} from '../../../.storybook/mock/product-feed';

describe('merchant-center-account-card.vue', () => {
  const mockRoute = {
    name: 'product-feed-settings',
  };
  const mockRouter = {
    push: jest.fn(),
  };

  let storeDisabledOrNotConfigured;
  let storeConfigured;
  let storeMissingFields;
  let storeApiError;
  let storeReadyForExport;
  let storeSyncFailed;
  
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
    storeMissingFields = cloneStore();
    storeMissingFields.modules.productFeed.state = {
      ...storeMissingFields.modules.productFeed.state,
      ...productFeedMissingFields,
    };
    storeApiError = cloneStore();
    storeApiError.modules.productFeed.state = {
      ...storeApiError.modules.productFeed.state,
      ...productFeedErrorAPI,
    };
    storeReadyForExport = cloneStore();
    storeReadyForExport.modules.productFeed.state = {
      ...storeReadyForExport.modules.productFeed.state,
      ...productFeedIsReadyForExport,
    };
    storeSyncFailed = cloneStore();
    storeSyncFailed.modules.productFeed.state = {
      ...storeSyncFailed.modules.productFeed.state,
      ...productFeedStatusSyncFailed,
    };
  });

  it('is disabled when not activated', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: false,
        badges: [],
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
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
    expect(wrapper.findComponent(ProductFeedCardReportCard).exists()).toBeTruthy();
    expect(timeConverterToDate).toHaveBeenCalledTimes(2);
    expect(timeConverterToHour).toHaveBeenCalledTimes(1);
    expect(changeCountryCodeToName).toHaveBeenCalledTimes(1);
    expect(wrapper.findComponent(VueShowdown.VueShowdown).exists()).toBeTruthy();
  });

  it('shows product feed card ready for export at first configuration', () => {
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
      stubs: {
        VueShowdown: true,
      },
      store: new Vuex.Store(storeReadyForExport),
    });
    expect(wrapper.find('b-alert')).toBeTruthy();
    expect(wrapper.find('b-alert').attributes('variant')).toBe('info');
    expect(wrapper.findComponent(ProductFeedCardReportCard).exists()).toBeTruthy();
    expect(timeConverterToDate).toHaveBeenCalledTimes(1);
    expect(changeCountryCodeToName).toHaveBeenCalledTimes(1);
    expect(wrapper.findComponent(VueShowdown.VueShowdown).exists()).toBeTruthy();
  });

  it('shows alert when missing infos', () => {
    const timeConverterToDate = jest.fn();
    localVue.filter('timeConverterToDate', timeConverterToDate);
    const timeConverterToHour = jest.fn();
    localVue.filter('timeConverterToHour', timeConverterToHour);
    const changeCountryCodeToName = jest.fn();
    changeCountryCodeToName.mockImplementation(() => []);
    localVue.filter('changeCountryCodeToName', changeCountryCodeToName);

    const wrapper = mount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
      },
      ...config,
      mocks: {
        $router: mockRouter,
      },
      localVue,
      store: new Vuex.Store(storeMissingFields),
      stubs: {
        VueShowdown: true,
      },
    });
    expect(wrapper.findComponent(ProductFeedCardReportCard).exists()).toBeTruthy();
    expect(timeConverterToDate).not.toHaveBeenCalled();
    expect(timeConverterToHour).not.toHaveBeenCalled();
    expect(changeCountryCodeToName).toHaveBeenCalledTimes(1);
    expect(wrapper.findComponent(VueShowdown.VueShowdown).exists()).toBeTruthy();
    expect(wrapper.find('b-alert')).toBeTruthy();
    expect(wrapper.find('b-alert').attributes('variant')).toBe('warning');
    expect(wrapper.find('b-button').text()).toEqual('Add shipping info');
    expect(wrapper.find('p').text()).toBe('To successfully sync your product data, add shipping info.');
  });

  it('shows error when api error', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
        ...config,
      },
      stubs: {
        VueShowdown: true,
        BAlert,
      },
      store: new Vuex.Store(storeApiError),
    });
    expect(wrapper.findComponent(Stepper).exists()).toBeTruthy();
    expect(wrapper.findComponent(Stepper).props('activeStep')).toBe(1);
    expect(wrapper.find('b-button').attributes('disabled')).toBe('true');
    expect(wrapper.find('b-button').text()).toEqual('Export feed');
    expect(wrapper.findComponent(BAlert).exists()).toBeTruthy();
    expect(wrapper.findComponent(BAlert).find('b-button').text()).toEqual('Refresh page');
  });

  it('shows error when sync failed', () => {
    const timeConverterToDate = jest.fn();
    localVue.filter('timeConverterToDate', timeConverterToDate);
    const timeConverterToHour = jest.fn();
    localVue.filter('timeConverterToHour', timeConverterToHour);
    const changeCountryCodeToName = jest.fn();
    changeCountryCodeToName.mockImplementation(() => []);
    localVue.filter('changeCountryCodeToName', changeCountryCodeToName);

    const wrapper = mount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
      },
      ...config,
      mocks: {
        $router: mockRouter,
      },
      localVue,
      store: new Vuex.Store(storeSyncFailed),
      stubs: {
        VueShowdown: true,
      },
    });
    expect(wrapper.findComponent(ProductFeedCardReportCard).exists()).toBeTruthy();
    expect(timeConverterToDate).toHaveBeenCalledTimes(2);
    expect(timeConverterToHour).toHaveBeenCalledTimes(1);
    expect(changeCountryCodeToName).toHaveBeenCalledTimes(1);
    expect(wrapper.findComponent(VueShowdown.VueShowdown).exists()).toBeTruthy();
    expect(wrapper.find('b-alert')).toBeTruthy();
    expect(wrapper.find('b-alert').attributes('variant')).toBe('warning');
  });
});
