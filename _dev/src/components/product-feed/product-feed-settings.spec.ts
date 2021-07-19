/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window

// shallowMount creates the components without its children. Mount creates them all

import {mount, shallowMount, createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';
import {store} from '@/store';
import i18n from '@/lib/i18n';
import {commonOptions} from '@/../tests/init';
import ProductFeedSettings from './product-feed-settings.vue';
import ProductFeedSettingsShipping from './product-feed-settings-shipping.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('product-feed-settings.vue', () => {
  let state;
  let mockStore;

  beforeEach(() => {
    console.log('coucou', commonOptions);
    // state = {
    //   stepper: 1,
    // };
    store.modules.productFeed.state = state;
    mockStore = new Vuex.Store({
      ...store,
    });
  });

  it('has stepper at 1 if user sees shipping settings', () => {
    // const $t = (key) => key;
    // const $i18n = (key) => key;
    const wrapper = shallowMount(ProductFeedSettings, {
      store: mockStore,
      ...commonOptions,
      // mocks: { $t, $i18n},
      i18n,
    });
    expect(wrapper.find(ProductFeedSettingsShipping).isVisible()).toBe(true);
  });
});
