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
      WARMUP_STORE: vi.fn(),
    };
    store = cloneStore();
    store.modules.productFeed.actions = {
      ...store.modules.productFeed.actions,
      ...actions,
    };
  });

  it('warms up the local durable sync state before create', () => {
    shallowMount(TunnelProductFeed, {
      ...config,
      store: new Vuex.Store(store),
    });
    expect(actions.WARMUP_STORE).toHaveBeenCalledOnce();
  });
});
