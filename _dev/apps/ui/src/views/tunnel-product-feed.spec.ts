/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window

// shallowMount creates the components without its children. Mount creates them all

import {shallowMount} from '@vue/test-utils';
import Vuex from 'vuex';
import config, {cloneStore} from '@/../tests/init';
import TunnelProductFeed from '@/views/tunnel-product-feed.vue';

describe('tunnel-product-feed.vue', () => {
  let actions;
  let store;
  beforeEach(() => {
    actions = {
      GET_PRODUCT_FEED_SETTINGS: jest.fn(),
      GET_PRODUCT_FEED_SYNC_STATUS: jest.fn(),
      GET_TOTAL_PRODUCTS_READY_TO_SYNC: jest.fn(),
    };
    store = cloneStore();
    store.modules.productFeed.actions = {
      ...store.modules.productFeed.actions,
      ...actions,
    };
  });

  it('dispatches actions before Create', () => {
    const wrapper = shallowMount(TunnelProductFeed, {
      ...config,
      store: new Vuex.Store(store),
    });
    expect(actions.GET_PRODUCT_FEED_SETTINGS).toHaveBeenCalled();
    expect(actions.GET_PRODUCT_FEED_SYNC_STATUS).toHaveBeenCalled();
    expect(actions.GET_TOTAL_PRODUCTS_READY_TO_SYNC).toHaveBeenCalled();
  });
});
