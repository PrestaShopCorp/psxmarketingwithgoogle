/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window

// shallowMount creates the components without its children. Mount creates them all

import {mount, shallowMount, createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';
import {store} from '@/store';
import {commonOptions} from '@/../tests/init';
import ProductFeedSettings from './product-feed-settings.vue';
import ProductFeedSettingsShipping from './product-feed-settings-shipping.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('product-feed-settings.vue', () => {
  let state;
  let mockStore;

  beforeEach(() => {
    store.modules.productFeed.state = state;
    mockStore = new Vuex.Store({
      ...store,
    });
  });

  it('has stepper at 1 if user sees shipping settings', () => {
    const wrapper = shallowMount(ProductFeedSettings, {
      store: mockStore,
      ...commonOptions,
        });
    expect(wrapper.find(ProductFeedSettingsShipping).isVisible()).toBe(true);
  });
});
