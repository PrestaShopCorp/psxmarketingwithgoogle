// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import Vuex from 'vuex';
import config, {cloneStore} from '@/../tests/init';
import TunnelProductFeed from '@/views/tunnel-product-feed.vue';

describe('tunnel-product-feed.vue', () => {
  let actions;
  let store;
  beforeEach(() => {
    actions = {
      GET_PRODUCT_FEED_SETTINGS: vi.fn(),
      GET_PRODUCT_FEED_SYNC_STATUS: vi.fn(),
      GET_TOTAL_PRODUCTS_READY_TO_SYNC: vi.fn(),
    };
    store = cloneStore();
    store.modules.productFeed.actions = {
      ...store.modules.productFeed.actions,
      ...actions,
    };
  });

  it('dispatches actions before Create', () => {
    shallowMount(TunnelProductFeed, {
      ...config,
      store: new Vuex.Store(store),
    });
    expect(actions.GET_PRODUCT_FEED_SETTINGS).toHaveBeenCalled();
    expect(actions.GET_PRODUCT_FEED_SYNC_STATUS).toHaveBeenCalled();
    expect(actions.GET_TOTAL_PRODUCTS_READY_TO_SYNC).toHaveBeenCalled();
  });
});
