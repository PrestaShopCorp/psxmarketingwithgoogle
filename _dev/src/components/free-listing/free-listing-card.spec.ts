/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import { cloneStore} from '@/../tests/init';
import config from '@/../tests/init';

import {shallowMount} from '@vue/test-utils';
import FreeListingCard from '@/components/free-listing/free-listing-card.vue';

describe('free-listing.vue / disabled', () => {
  it('switch is hidden when card is disabled', () => {
    const wrapper = shallowMount(FreeListingCard, {
      propsData: {
        isEnabled: false,
      },
      ...config,
      store: new Vuex.Store(cloneStore()),
    });

    // Check if toggle switch is hidden
    expect(wrapper.find('.ps-switch').exists()).toBeFalsy();
  });
});

describe('free-listing.vue / enabled', () => {
  it('switch is shown when card is enabled', () => {
    const wrapper = shallowMount(FreeListingCard, {
      propsData: {
        isEnabled: true,
      },
      ...config,
      store: new Vuex.Store(cloneStore()),
    });

    // Check if toggle switch is visible
    expect(wrapper.find('.ps-switch').exists()).toBeTruthy();
  });
});
