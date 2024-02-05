import Vuex from 'vuex';

// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import createFetchMock from 'vitest-fetch-mock';

import config, {cloneStore} from '@/../tests/init';
import DisapprovedProductsRow from '@/components/product-feed-page/disapproved-products-page/disapproved-products-row.vue';
import DisapprovedProductsPage from '@/components/product-feed-page/disapproved-products-page/disapproved-products-page.vue';
import {
  productFeed,
} from '@/../.storybook/mock/product-feed';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('disapproved-products-page/disapproved-products-page.vue', () => {
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
    const wrapper = shallowMount(DisapprovedProductsPage, {
      ...config,
      store: new Vuex.Store(storeConfigured),
    });
    expect(wrapper.findAllComponents(DisapprovedProductsRow).exists()).toBeTruthy();
  });

  it('only display disapproved products', () => {
    storeConfigured = cloneStore();
    storeConfigured.modules.productFeed.state = {
      ...productFeed,
    };
    const wrapper = shallowMount(DisapprovedProductsPage, {
      ...config,
      store: new Vuex.Store(storeConfigured),
    });
    expect(wrapper.findAllComponents(DisapprovedProductsRow).length).toBe(4);
  });
});
