/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import config, {cloneStore} from '@/../tests/init';

import ShippingSettings from '@/components/product-feed/settings/shipping-settings/shipping-settings.vue';
import TableRowCarrier from '@/components/product-feed/settings/shipping-settings/table-row-carrier.vue';
import {productFeed} from '@/../.storybook/mock/product-feed';

const VBTooltip = jest.fn();

describe('shipping-settings.vue', () => {
  let store;

  beforeEach(() => {
    store = cloneStore();
    store.modules.productFeed.state = {
      ...store.modules.productFeed.state,
      stepper: 2,
    };
    store.modules.productFeed.state.settings.deliveryDetails = [
      ...productFeed.settings.deliveryDetails,
    ];
  });

  it('is visible', () => {
    const wrapper = shallowMount(ShippingSettings, {
      store: new Vuex.Store(store),
      directives: {
        'b-tooltip': VBTooltip,
      },
      ...config,
    });

    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.find('#table-carriers').isVisible()).toBe(true);
  });

  it.skip('shows a default message when there are no carriers', () => {
    store.modules.app.state.targetCountries = ['XXX'];

    const wrapper = shallowMount(ShippingSettings, {
      store: new Vuex.Store(store),
      directives: {
        'b-tooltip': VBTooltip,
      },
      ...config,
    });

    expect(wrapper.findAllComponents(TableRowCarrier)).toHaveLength(0);

    // TODO: Check the default message is shown
  });

  it('shows the table with carriers filtered by target countries (FR)', () => {
    store.modules.app.state.targetCountries = ['FR'];

    const wrapper = shallowMount(ShippingSettings, {
      store: new Vuex.Store(store),
      directives: {
        'b-tooltip': VBTooltip,
      },
      ...config,
    });

    expect(wrapper.findAllComponents(TableRowCarrier)).toHaveLength(3);
    expect(wrapper.findAllComponents(TableRowCarrier).at(0).props('carrier')).toEqual({
      carrierId: '9',
      country: 'FR',
      name: 'PrestaShop',
      delay: 'Pick up in-store',
    });
    expect(wrapper.findAllComponents(TableRowCarrier).at(1).props('carrier')).toEqual({
      enabledCarrier: true,
      carrierId: '11',
      country: 'FR',
      name: 'My carrier',
      delay: 'Delivery next day!',
      deliveryType: 'delivery',
      maxTransitTimeInDays: 3,
      maxHandlingTimeInDays: 3,
      minTransitTimeInDays: 0,
      minHandlingTimeInDays: 0,
    });
    expect(wrapper.findAllComponents(TableRowCarrier).at(2).props('carrier')).toEqual({
      enabledCarrier: true,
      carrierId: '13',
      country: 'FR',
      name: 'Carrier with fixed price',
      delay: 'Maybe 1 day, maybe never',
      deliveryType: 'delivery',
      maxTransitTimeInDays: 60,
      minHandlingTimeInDays: 0,
      minTransitTimeInDays: 1,
      maxHandlingTimeInDays: 3,
    });
  });

  it('shows the table with carriers filtered by target countries (IT)', () => {
    store.modules.app.state.targetCountries = ['IT'];

    const wrapper = shallowMount(ShippingSettings, {
      store: new Vuex.Store(store),
      directives: {
        'b-tooltip': VBTooltip,
      },
      ...config,
    });

    expect(wrapper.findAllComponents(TableRowCarrier)).toHaveLength(4);
    expect(wrapper.findAllComponents(TableRowCarrier).at(0).props('carrier')).toEqual({
      carrierId: '9',
      country: 'IT',
      name: 'PrestaShop',
      delay: 'Pick up in-store',
    });
    expect(wrapper.findAllComponents(TableRowCarrier).at(1).props('carrier')).toEqual({
      carrierId: '11',
      country: 'IT',
      name: 'My carrier',
      delay: 'Delivery next day!',
    });
    expect(wrapper.findAllComponents(TableRowCarrier).at(2).props('carrier')).toEqual({
      carrierId: '13',
      country: 'IT',
      name: 'Carrier with fixed price',
      delay: 'Maybe 1 day, maybe never',
    });
    expect(wrapper.findAllComponents(TableRowCarrier).at(3).props('carrier')).toEqual({
      carrierId: '14',
      country: 'IT',
      name: 'Carrier #2 with fixed price',
      delay: 'Maybe 1 day, maybe never',
    });
  });

  it('enables the button "Continue" if all carriers are valid', () => {
    // Select French carriers and one valid carrier
    store.modules.app.state.targetCountries = ['FR'];
    // Based on data in _dev/.storybook/mock/product-feed.js
    // TODO: Mocking the method validateDeliveryDetail() would be safer
    store.modules.productFeed.state.settings.deliveryDetails[3].enabledCarrier = true;

    const wrapper = shallowMount(ShippingSettings, {
      store: new Vuex.Store(store),
      directives: {
        'b-tooltip': VBTooltip,
      },
      ...config,
    });

    expect(wrapper.find('[data-test-id="continueButton"]').attributes('disabled')).toBeFalsy();
  });

  it('disables the button "Continue" if one carrier in invalid', () => {
    // Select French carriers and one invalid carrier
    store.modules.app.state.targetCountries = ['FR'];
    // Based on data in _dev/.storybook/mock/product-feed.js
    // TODO: Mocking the method validateDeliveryDetail() would be safer
    store.modules.productFeed.state.settings.deliveryDetails[0].enabledCarrier = true;

    const wrapper = shallowMount(ShippingSettings, {
      store: new Vuex.Store(store),
      directives: {
        'b-tooltip': VBTooltip,
      },
      ...config,
    });

    expect(wrapper.find('[data-test-id="continueButton"]').attributes('disabled')).toBeTruthy();
  });
});
