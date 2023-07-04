import Vuex from 'vuex';

// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import createFetchMock from 'vitest-fetch-mock';

import config, {cloneStore} from '@/../tests/init';
import ProductFeedTableStatusDetailsRow from '@/components/product-feed-page/product-feed-table-status-details-row.vue';
import ProductFeedTableStatusDetails from '@/components/product-feed-page/product-feed-table-status-details.vue';
import {
  productFeed,
  productFeedWithDisapprovedProductsButNoIssues,
} from '../../../.storybook/mock/product-feed';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('product-feed-table-status-details.vue', () => {
  let storeConfigured;
  let storeConfiguredButNoIssued;
  beforeEach(() => {
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  it('display a suspended destination if there are associated issues', () => {
    storeConfigured = cloneStore();
    storeConfigured.modules.productFeed.state = {
      ...productFeed,
    };
    const wrapper = shallowMount(ProductFeedTableStatusDetails, {
      ...config,
      store: new Vuex.Store(storeConfigured),
    });
    expect(wrapper.findAllComponents(ProductFeedTableStatusDetailsRow).exists()).toBeTruthy();
  });
  it('does not display a suspended destination if there is not associated issues', () => {
    storeConfiguredButNoIssued = cloneStore();
    storeConfigured.modules.productFeed.state = {
      ...productFeedWithDisapprovedProductsButNoIssues,
    };
    const wrapper = shallowMount(ProductFeedTableStatusDetails, {
      ...config,
      store: new Vuex.Store(storeConfiguredButNoIssued),
    });
    expect(wrapper.findAllComponents(ProductFeedTableStatusDetailsRow).exists()).toBeFalsy();
  });
  it('only display disapproved products', () => {
    storeConfigured = cloneStore();
    storeConfigured.modules.productFeed.state = {
      ...productFeed,
    };
    const wrapper = shallowMount(ProductFeedTableStatusDetails, {
      ...config,
      store: new Vuex.Store(storeConfigured),
    });
    expect(wrapper.findAllComponents(ProductFeedTableStatusDetailsRow).length).toBe(8);
  });
});
