import Vuex from 'vuex';

// Import this file first to init mock on window
import {shallowMount, mount} from '@vue/test-utils';
import {BAlert} from 'bootstrap-vue';
import VueShowdown from 'vue-showdown';
import config, {localVue, cloneStore} from '@/../tests/init';
import ProductFeedCard from '@/components/product-feed/product-feed-card.vue';
import ProductFeedCardReportCard from '@/components/product-feed/product-feed-card-report-card.vue';
import ProductFeedStepper from '@/components/product-feed/product-feed-stepper.vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import productFeedSummaryCards from './summary/product-feed-summary-cards.vue';

import {
  productFeed,
  productFeedIsReadyForExport,
  productFeedIsConfigured,
  productFeedMissingFields,
  productFeedStatusSyncFailed,
  productFeedErrorAPI,
} from '../../../.storybook/mock/product-feed';

describe('product-feed-card.vue', () => {
  const mockRoute = {
    name: 'product-feed-settings',
    params: {
      step: ProductFeedSettingsPages.SHIPPING_SETUP,
    },
  };
  const mockRouter = {
    push: vi.fn(),
  };

  let storeDisabledOrNotConfigured;
  let storePartiallyConfigured;
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
    storePartiallyConfigured = cloneStore();
    storePartiallyConfigured.modules.productFeed.state = {
      ...storePartiallyConfigured.modules.productFeed.state,
      ...productFeed,
      stepper: 2,
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
        loading: false,
      },
      ...config,
      store: new Vuex.Store(storeDisabledOrNotConfigured),
    });
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(true);
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
  });

  it('does not show stepper at 1 when enabled', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
        loading: false,
        ...config,
      },
      store: new Vuex.Store(storeDisabledOrNotConfigured),
    });
    expect(wrapper.findComponent(ProductFeedStepper).exists()).toBeFalsy();
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
    expect(wrapper.find('b-button').exists()).toBeTruthy();
  });

  it('shows stepper at 2 when enabled', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
        loading: false,
        ...config,
      },
      store: new Vuex.Store(storePartiallyConfigured),
    });
    expect(wrapper.findComponent(ProductFeedStepper).exists()).toBeTruthy();
    expect(wrapper.findComponent(ProductFeedStepper).props('activeStep')).toBe(2);
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
    expect(wrapper.find('b-button').exists()).toBeTruthy();
  });

  it('shows button and triggers configuration on click', async () => {
    const wrapper = shallowMount(ProductFeedCard, {
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
      },
      ...config,
      propsData: {
        isEnabled: true,
        loading: false,
      },
      store: new Vuex.Store(storeDisabledOrNotConfigured),
    });
    await wrapper.find('b-button').trigger('click');
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(mockRoute);
  });

  it('shows product feed card ready if already configured', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
        loading: false,
      },
      ...config,
      localVue,
      store: new Vuex.Store(storeConfigured),
    });
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
    expect(wrapper.findComponent(productFeedSummaryCards).exists()).toBeTruthy();
    expect(wrapper.findComponent(VueShowdown.VueShowdown).exists()).toBeTruthy();
  });

  it('shows product feed card ready for export at first configuration', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
        loading: false,
      },
      ...config,
      localVue,
      stubs: {
        VueShowdown: true,
      },
      store: new Vuex.Store(storeReadyForExport),
    });
    expect(wrapper.find('b-alert')).toBeTruthy();
    expect(wrapper.find('b-alert').attributes('variant')).toBe('info');
    expect(wrapper.findComponent(productFeedSummaryCards).exists()).toBeTruthy();
    expect(wrapper.findComponent(VueShowdown.VueShowdown).exists()).toBeTruthy();
  });

  it('shows alert when missing infos', () => {
    const wrapper = mount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
        loading: false,
      },
      ...config,
      localVue,
      store: new Vuex.Store(storeMissingFields),
      stubs: {
        VueShowdown: true,
      },
    });

    const summaryCards = wrapper.findComponent(productFeedSummaryCards);
    expect(summaryCards.exists()).toBeTruthy();
    // @ts-ignore
    expect(summaryCards.vm.targetCountries).toEqual(['{country} ({currency})']);
    expect(wrapper.findComponent(productFeedSummaryCards).exists()).toBeTruthy();
    expect(wrapper.findComponent(VueShowdown.VueShowdown).exists()).toBeTruthy();
    expect(wrapper.find('b-alert')).toBeTruthy();
    expect(wrapper.find('b-alert').attributes('variant')).toBe('warning');
    expect(wrapper.find('b-alert p').text()).toBe('In order to successfully synchronize your product feed, please add shipping information.');
  });

  it('shows error when api error', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
        loading: false,
        ...config,
      },
      stubs: {
        VueShowdown: true,
        BAlert,
      },
      store: new Vuex.Store(storeApiError),
    });
    expect(wrapper.findComponent(ProductFeedStepper).exists()).toBeFalsy();
    expect(wrapper.find('b-button').attributes('disabled')).toBe('true');
    expect(wrapper.find('b-button').text()).toEqual('Start your configuration');
    expect(wrapper.findComponent(BAlert).exists()).toBeTruthy();
    expect(wrapper.findComponent(BAlert).find('b-button').text()).toEqual('Refresh page');
  });

  it('shows error when sync failed', () => {
    const wrapper = mount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
        loading: false,
      },
      ...config,
      localVue,
      store: new Vuex.Store(storeSyncFailed),
      stubs: {
        VueShowdown: true,
      },
    });

    const summaryCards = wrapper.findComponent(productFeedSummaryCards);
    expect(summaryCards.exists()).toBeTruthy();
    // @ts-ignore
    expect(summaryCards.vm.targetCountries).toEqual(['{country} ({currency})']);
    expect(wrapper.findComponent(ProductFeedCardReportCard).exists()).toBeTruthy();
    expect(wrapper.findComponent(VueShowdown.VueShowdown).exists()).toBeTruthy();
    expect(wrapper.find('b-alert')).toBeTruthy();
    expect(wrapper.find('b-alert').attributes('variant')).toBe('warning');
  });
});
