/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window

// shallowMount creates the components without its children. Mount creates them all

import {mount, shallowMount, createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';
import TunnelProductFeed from '@/views/tunnel-product-feed.vue';
import {store} from '@/store';
import ProductFeedCardShippingSettings from '../components/product-feed/product-feed-card-shipping-settings.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('tunnel-product-feed.vue', () => {
  let actions;
  let mockStore;

  beforeEach(() => {
    actions = {
      GET_PRODUCT_FEED_SETTINGS: jest.fn(),
      GET_PRODUCT_FEED_SYNC_STATUS: jest.fn(),
      GET_TOTAL_PRODUCTS: jest.fn(),
    };
    store.modules.productFeed.actions = actions;
    mockStore = new Vuex.Store({
      ...store,
    });
  });

  it('dispatches actions before Create', () => {
    const wrapper = shallowMount(TunnelProductFeed, {
      localVue,
      store: mockStore,
    });
    expect(actions.GET_PRODUCT_FEED_SETTINGS).toHaveBeenCalled();
    expect(actions.GET_PRODUCT_FEED_SYNC_STATUS).toHaveBeenCalled();
    expect(actions.GET_TOTAL_PRODUCTS).toHaveBeenCalled();
  });
});
