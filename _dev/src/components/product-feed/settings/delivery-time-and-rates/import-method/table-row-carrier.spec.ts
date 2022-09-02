/**
 * @jest-environment jsdom
 */
// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import config from '@/../tests/init';

import TableRowCarrier from './table-row-carrier.vue';

describe.skip('table-row-carrier.vue', () => {
  it('is visible', () => {
    const wrapper = shallowMount(TableRowCarrier, {
      propsData: {
        carrier: {},
        carriersList: [],
      },
      ...config,
    });

    expect(wrapper.isVisible()).toBe(true);
  });
  it('displays carrier basic info', () => {
    const wrapper = shallowMount(TableRowCarrier, {
      propsData: {
        carrier: {
          carrierId: '13',
          country: 'IT',
          name: 'Carrier with fixed price',
          delay: 'Maybe 1 day, maybe never',
        },
        carriersList: [],
      },
      ...config,
    });

    expect(wrapper.find('.ps_gs-carrier__title').text()).toBe('Carrier with fixed price');
    expect(wrapper.find('.ps_gs-carrier__description').text()).toBe('Maybe 1 day, maybe never');
  });

  it('disables fields when toggle is off', () => {
    const wrapper = shallowMount(TableRowCarrier, {
      propsData: {
        carrier: {
          carrierId: '13',
          country: 'IT',
          name: 'Carrier with fixed price',
          delay: 'Maybe 1 day, maybe never',
          enabledCarrier: false,
        },
        carriersList: [],
      },
      ...config,
    });
    expect(wrapper.find('.ps_gs-carrier').classes().includes('ps_gs-carrier--disabled')).toBe(true);
    expect(wrapper.find('[data-test-id="deliveryType"]').attributes('disabled')).toBeTruthy();

    const numberInputs = wrapper.findAll('.ps_gs-carrier__input-number');
    expect(numberInputs).toHaveLength(4);
    expect(numberInputs.at(0).attributes('disabled')).toBeTruthy();
    expect(numberInputs.at(1).attributes('disabled')).toBeTruthy();
    expect(numberInputs.at(2).attributes('disabled')).toBeTruthy();
    expect(numberInputs.at(3).attributes('disabled')).toBeTruthy();

    expect(wrapper.find('[data-test-id="duplicateDetails"]').attributes('disabled')).toBeTruthy();
  });

  it('enables delivery type field when toggle is on', () => {
    const wrapper = shallowMount(TableRowCarrier, {
      propsData: {
        carrier: {
          carrierId: '13',
          country: 'IT',
          name: 'Carrier with fixed price',
          delay: 'Maybe 1 day, maybe never',
          enabledCarrier: true,
        },
        carriersList: [],
      },
      ...config,
    });
    expect(wrapper.find('.ps_gs-carrier').classes().includes('ps_gs-carrier--disabled')).toBe(false);
    expect(wrapper.find('[data-test-id="deliveryType"]').attributes('disabled')).toBeFalsy();

    const numberInputs = wrapper.findAll('.ps_gs-carrier__input-number');
    expect(numberInputs).toHaveLength(4);
    expect(numberInputs.at(0).attributes('disabled')).toBeTruthy();
    expect(numberInputs.at(1).attributes('disabled')).toBeTruthy();
    expect(numberInputs.at(2).attributes('disabled')).toBeTruthy();
    expect(numberInputs.at(3).attributes('disabled')).toBeTruthy();

    expect(wrapper.find('[data-test-id="duplicateDetails"]').attributes('disabled')).toBeFalsy();
  });

  it('enables number inputs when delivery type is set to delivery', () => {
    const wrapper = shallowMount(TableRowCarrier, {
      propsData: {
        carrier: {
          carrierId: '13',
          country: 'IT',
          name: 'Carrier with fixed price',
          delay: 'Maybe 1 day, maybe never',
          enabledCarrier: true,
          deliveryType: 'pickup',
        },
        carriersList: [],
      },
      ...config,
    });
    expect(wrapper.find('.ps_gs-carrier').classes().includes('ps_gs-carrier--disabled')).toBe(false);
    expect(wrapper.find('[data-test-id="deliveryType"]').attributes('disabled')).toBeFalsy();

    const numberInputs = wrapper.findAll('.ps_gs-carrier__input-number');
    expect(numberInputs).toHaveLength(4);
    expect(numberInputs.at(0).attributes('disabled')).toBeTruthy();
    expect(numberInputs.at(1).attributes('disabled')).toBeTruthy();
    expect(numberInputs.at(2).attributes('disabled')).toBeTruthy();
    expect(numberInputs.at(3).attributes('disabled')).toBeTruthy();
  });

  it('shows an error when handling times are wrong', () => {
    const carrier = {
      carrier: {
        carrierId: '13',
        country: 'IT',
        name: 'Carrier with fixed price',
        delay: 'Maybe 1 day, maybe never',
        enabledCarrier: true,
        deliveryType: 'delivery',
        minHandlingTimeInDays: 3,
        maxHandlingTimeInDays: 1,
        minTransitTimeInDays: 0,
        maxTransitTimeInDays: 3,
      },
      carriersList: [],
    };
    // @ts-ignore
    expect(TableRowCarrier.computed.timeStateHandling.call(carrier)).toBe(false);
    // @ts-ignore
    expect(TableRowCarrier.computed.timeStateDelivery.call(carrier)).toBe(null);
  });

  it('shows an error when handling times are exceeds 250', () => {
    const carrier = {
      carrier: {
        carrierId: '13',
        country: 'IT',
        name: 'Carrier with fixed price',
        delay: 'Maybe 1 day, maybe never',
        enabledCarrier: true,
        deliveryType: 'delivery',
        minHandlingTimeInDays: 251,
        maxHandlingTimeInDays: 22,
        minTransitTimeInDays: 0,
        maxTransitTimeInDays: 3,
      },
      carriersList: [],
    };
    // @ts-ignore
    expect(TableRowCarrier.computed.timeStateHandling.call(carrier)).toBe(false);
    // @ts-ignore
    expect(TableRowCarrier.computed.timeStateDelivery.call(carrier)).toBe(null);
  });

  it('shows an error when delivery times are wrong', () => {
    const carrier = {
      carrier: {
        carrierId: '13',
        country: 'IT',
        name: 'Carrier with fixed price',
        delay: 'Maybe 1 day, maybe never',
        enabledCarrier: true,
        deliveryType: 'delivery',
        minHandlingTimeInDays: 99,
        maxHandlingTimeInDays: 99,
        minTransitTimeInDays: -5.3,
        maxTransitTimeInDays: 3,
      },
      carriersList: [],
    };
    // @ts-ignore
    expect(TableRowCarrier.computed.timeStateHandling.call(carrier)).toBe(null);
    // @ts-ignore
    expect(TableRowCarrier.computed.timeStateDelivery.call(carrier)).toBe(false);
  });

  it('shows an error when delivery type is not selected', () => {
    const wrapper = shallowMount(TableRowCarrier, {
      propsData: {
        carrier: {
          carrierId: '13',
          country: 'IT',
          name: 'Carrier with fixed price',
          delay: 'Maybe 1 day, maybe never',
          enabledCarrier: true,
          minHandlingTimeInDays: 99,
          maxHandlingTimeInDays: 99,
          minTransitTimeInDays: 3,
          maxTransitTimeInDays: 3,
          deliveryType: undefined,
        },
        carriersList: [],
      },
      ...config,
    });
    expect(wrapper.find('[data-test-id="deliveryType"]').classes()).toContain('is-invalid');
  });
});
