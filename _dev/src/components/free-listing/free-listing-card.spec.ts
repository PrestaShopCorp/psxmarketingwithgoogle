/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import config, {cloneStore} from '@/../tests/init';

import {mount, shallowMount} from '@vue/test-utils';
import FreeListingCard from '@/components/free-listing/free-listing-card.vue';
import {
  Disabled,
  Enabled,
  AlertEnableFreeListing,
  AlertCantEnableFreeListing,
} from '@/../stories/free-listing-card.stories';

describe('free-listing.vue / disabled', () => {
  it('switch is hidden when card is disabled', () => {
    const wrapper = mount(FreeListingCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: Disabled.args,
      beforeMount: Disabled.args.beforeMount,
      stubs: {
        BadgeListRequirements: true,
      },
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

  it('switch is shown and not disabled when card is enabled', () => {
    const wrapper = mount(FreeListingCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: Enabled.args,
      beforeMount: Enabled.args.beforeMount,
    });

    // Check if toggle switch is visible and not disabled
    expect(wrapper.find('.ps-switch').exists()).toBeTruthy();
    expect(wrapper.find('.ps-switch [type="radio"]').attributes('disabled')).toBeFalsy();
  });

  it('switch is disabled when there is an API error', () => {
    const wrapper = mount(FreeListingCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: AlertCantEnableFreeListing.args,
      beforeMount: AlertCantEnableFreeListing.args.beforeMount,
    });

    // Check if toggle switch is disabled
    expect(wrapper.find('.ps-switch').exists()).toBeTruthy();
    expect(wrapper.find('.ps-switch [type="radio"]').attributes('disabled')).toBe('disabled');
  });

  it('refresh button available when there is an API error and calls refresh function', async () => {
    const wrapper = mount(FreeListingCard, {
      mocks: {
        $router: mockRouter,
      },
      store: new Vuex.Store(cloneStore()),
      propsData: AlertCantEnableFreeListing.args,
      beforeMount: AlertCantEnableFreeListing.args.beforeMount,
    });

    // Check if refresh button exists
    expect(wrapper.find('[data-test-id="btn-refresh"]').exists()).toBeTruthy();

    // Check if $router.go() has been called when refresh btn is clicked
    await wrapper.find('[data-test-id="btn-refresh"]').trigger('click');
    expect(mockRouter.go).toHaveBeenCalledTimes(1);
  });

  it('Clicking on the toggle when the free listing is enabled emmit the event to open a popup', async () => {
    const wrapper = mount(FreeListingCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: Enabled.args,
      beforeMount: Enabled.args.beforeMount,
    });

    // Check if openPopin event has been emmited when toggle is clicked
    await wrapper.find('.ps-switch [type="radio"]').trigger('click');
    expect(wrapper.emitted('openPopin')).toBeTruthy();
  });

  it('When free listing is not activated there is an alert', async () => {
    const wrapper = mount(FreeListingCard, {
      store: new Vuex.Store(cloneStore()),
      propsData: AlertEnableFreeListing.args,
      beforeMount: AlertEnableFreeListing.args.beforeMount,
    });

    // There is an alert when the free listing is not activated
    expect(wrapper.find('b-alert')).toBeTruthy();
  });
});
