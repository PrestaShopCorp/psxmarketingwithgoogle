/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';

import config, {cloneStore} from '@/../tests/init';

import ProductFeedTableStatusDetails from '@/components/product-feed-page/product-feed-table-status-details.vue';
import {
  productFeed,
  productFeedWithDisapprovedProductsButNoIssues,
} from '../../../.storybook/mock/product-feed';

describe('product-feed-status-details.vue', () => {
  let storeConfigured;
  let storeConfiguredButNoIssued;

  beforeEach(() => {
    storeConfigured = cloneStore();
    storeConfigured.modules.productFeed.state = {
      ...productFeed,
    };
    storeConfiguredButNoIssued = cloneStore();
    storeConfigured.modules.productFeed.state = {
      ...productFeedWithDisapprovedProductsButNoIssues,
    };
  });

  it('display a suspended destination if there are associated issues', () => {
    const wrapper = shallowMount(ProductFeedTableStatusDetails, {
      ...config,
      store: new Vuex.Store(storeConfigured),
    });
    expect(wrapper.find('[data-test-id="row-product-feed-detail"]').exists()).toBeTruthy();
  });
  it('does not display a suspended destination if there is not associated issues', () => {
    const wrapper = shallowMount(ProductFeedTableStatusDetails, {
      ...config,
      store: new Vuex.Store(storeConfiguredButNoIssued),
    });

    expect(wrapper.find('[data-test-id="row-product-feed-detail"]').exists()).toBeFalsy();
  });
});
