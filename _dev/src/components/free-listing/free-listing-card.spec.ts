/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import config, {cloneStore} from '@/../tests/init';

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
  let mockRouter;

  beforeEach(() => {
    mockRouter = {go: jest.fn()};
  });

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

  it('switch is disabled when there is an API error', () => {
    const wrapper = shallowMount(FreeListingCard, {
      propsData: {
        isEnabled: true,
      },
      ...config,
      store: new Vuex.Store(cloneStore()),
      beforeMount(this: any) {
        this.$store.state.freeListing.errorAPI = true;
      },
    });

    // Check if toggle switch is disabled
    expect(wrapper.find('.ps-switch [type="radio"]').attributes('disabled')).toBe('disabled');
  });

  it('refresh button available when there is an API error and calls refresh function', async () => {
    const wrapper = shallowMount(FreeListingCard, {
      mocks: {
        $router: mockRouter,
      },
      propsData: {
        isEnabled: true,
      },
      ...config,
      store: new Vuex.Store(cloneStore()),
      beforeMount(this: any) {
        this.$store.state.freeListing.errorAPI = true;
      },
    });

    // Check if refresh button exists
    expect(wrapper.find('[data-test-id="btn-refresh"]').exists()).toBeTruthy();

    // Check if $router.go() has been called when refresh btn is clicked
    await wrapper.find('[data-test-id="btn-refresh"]').trigger('click');
    expect(mockRouter.go).toHaveBeenCalledTimes(1);
  });
});
