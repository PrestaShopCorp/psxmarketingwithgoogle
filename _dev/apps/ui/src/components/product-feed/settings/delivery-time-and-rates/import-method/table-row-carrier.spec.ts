/**
 * @jest-environment jsdom
 */
// Import this file first to init mock on window
import {mount, MountOptions} from '@vue/test-utils';
import config from '@/../tests/init';

import tableRowCarrierVue from './table-row-carrier.vue';

describe('table-row-carrier.vue', () => {
  const buildWrapper = (
    options: MountOptions<any> = {},
  ) => mount(tableRowCarrierVue, {
    ...config,
    ...options,
  });

  it('is visible', () => {
    const wrapper = buildWrapper({
      propsData: {
        carrier: {},
        carriersList: [],
        displayValidationErrors: false,
      },
    });

    expect(wrapper.isVisible()).toBe(true);
  });

  it('displays carrier basic info', () => {
    const wrapper = buildWrapper({
      propsData: {
        carrier: {
          carrierId: '13',
          country: 'IT',
          name: 'Carrier with fixed price',
          delay: 'Maybe 1 day, maybe never',
        },
        carriersList: [],
        displayValidationErrors: false,
      },
    });

    expect(wrapper.find('.ps_gs-carrier__title').text()).toBe('Carrier with fixed price');
    expect(wrapper.find('.ps_gs-carrier__description').text()).toBe('Maybe 1 day, maybe never');
  });

  it('disables fields when toggle is off', () => {
    const wrapper = buildWrapper({
      propsData: {
        carrier: {
          carrierId: '13',
          country: 'IT',
          name: 'Carrier with fixed price',
          delay: 'Maybe 1 day, maybe never',
          enabledCarrier: false,
        },
        carriersList: [],
        displayValidationErrors: false,
      },
    });
    expect(wrapper.find('.ps_gs-carrier').classes().includes('ps_gs-carrier--disabled')).toBe(true);

    const numberInputs = wrapper.findAll('.ps_gs-carrier__input-number');
    expect(numberInputs).toHaveLength(2);
    expect(numberInputs.at(0).attributes('disabled')).toBeTruthy();
    expect(numberInputs.at(1).attributes('disabled')).toBeTruthy();

    expect(wrapper.find('[data-test-id="duplicateDetails"]').attributes('disabled')).toBeTruthy();
  });

  it('shows an error when delivery times exceed 250 characters', () => {
    const wrapper = buildWrapper({
      propsData: {
        carrier: {
          carrierId: '13',
          country: 'IT',
          name: 'Carrier with fixed price',
          delay: 'Maybe 1 day, maybe never',
          enabledCarrier: true,
          deliveryType: 'delivery',
          minHandlingTimeInDays: 3,
          maxHandlingTimeInDays: 1,
          minTransitTimeInDays: 251,
          maxTransitTimeInDays: 22,
        },
        carriersList: [],
        displayValidationErrors: true,
      },
    });
    expect(wrapper.vm.timeStateDelivery).toBe(false);
  });

  it('shows an error when delivery times are invalid', () => {
    const wrapper = buildWrapper({
      propsData: {
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
        displayValidationErrors: true,
      },
    });
    expect(wrapper.vm.timeStateDelivery).toBe(false);
  });
});
