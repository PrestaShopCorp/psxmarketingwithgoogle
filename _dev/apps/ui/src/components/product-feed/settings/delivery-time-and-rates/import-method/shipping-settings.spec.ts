import {mount, MountOptions} from '@vue/test-utils';
import config, {localVue, filters} from '@/../tests/init';

import ShippingSettings from './shipping-settings.vue';
import TableRowCarrier from './table-row-carrier.vue';
import {productFeed} from '@/../.storybook/mock/product-feed';

describe('shipping-settings.vue', () => {
  const buildWrapper = (
    options: MountOptions<any> = {},
  ) => mount(ShippingSettings, {
    mocks: {
      $store: {
        getters: {
          'app/GET_CARRIERS_URL': '/',
        },
      },
    },
    localVue,
    ...config,
    ...options,
  });

  it('is visible', () => {
    const wrapper = buildWrapper({
      propsData: {
        countries: ['FR'],
        carriers: [],
        displayValidationErrors: false,
      },
    });
    expect(wrapper.isVisible()).toBe(true);
    // Country selector
    expect(filters.changeCountriesCodesToNames).toHaveBeenCalledTimes(1);
    expect(wrapper.find('#table-carriers').isVisible()).toBe(true);
  });

  it('shows a default message when there are no selected countries', () => {
    const wrapper = buildWrapper({
      propsData: {
        countries: [],
        carriers: [],
        displayValidationErrors: false,
      },
    });
    expect(filters.changeCountriesCodesToNames).toHaveBeenCalledTimes(0);
    expect(wrapper.findAllComponents(TableRowCarrier)).toHaveLength(0);
    expect(wrapper.find('[data-test-id="no-carriers"]').isVisible()).toBe(true);
  });

  it('shows the table with carriers filtered by target countries (FR)', () => {
    const wrapper = buildWrapper({
      propsData: {
        countries: ['FR'],
        carriers: productFeed.settings.deliveryDetails.filter((carrier) => carrier.country === 'FR'),
        displayValidationErrors: false,
      },
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
    const wrapper = buildWrapper({
      propsData: {
        countries: ['IT'],
        carriers: productFeed.settings.deliveryDetails.filter((carrier) => carrier.country === 'IT'),
        displayValidationErrors: false,
      },
    });
    // Country selector
    expect(filters.changeCountriesCodesToNames).toHaveBeenCalledTimes(1);
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

  it('forwards carriers updates to the parent', async () => {
    const carriers = productFeed.settings.deliveryDetails.filter((carrier) => carrier.country === 'IT');
    const wrapper = buildWrapper({
      propsData: {
        countries: ['IT'],
        carriers,
        displayValidationErrors: false,
      },
    });

    const emittedEvents = wrapper.emitted('dataUpdated');
    expect(emittedEvents).toBeTruthy();
    // There is a watcher with `immediate: true` -> event will be triggered
    expect((emittedEvents as any[]).length).toBe(1);

    wrapper.findAllComponents(TableRowCarrier).at(0).vm.$emit('carrierUpdated', carriers[0]);
    await wrapper.vm.$nextTick();

    expect((emittedEvents as any[]).length).toBe(2);
    expect((emittedEvents as any[])[1]).toEqual([carriers]);
  });

  describe('Error management', () => {
    it('displays an error on validation when no carrier is enabled', () => {
      const wrapper = buildWrapper({
        propsData: {
          countries: ['FR', 'IT'],
          carriers: [],
          displayValidationErrors: true,
        },
      });

      expect(wrapper.find('.text-danger').exists()).toBeTruthy();
      expect(wrapper.findAll('.text-danger').length).toBe(1);
      expect(wrapper.find('.text-danger').text()).toBe('You need to enable at least one carrier to continue');
    });

    it('displays an error on validation when a country is enabled but has no associated carrier', () => {
      const carriers = productFeed.settings.deliveryDetails.filter((carrier) => ['FR', 'IT'].includes(carrier.country)).map((carrier) => {
        // Disable all carriers for Italy to get the error
        if (carrier.country === 'IT') {
          carrier.enabledCarrier = false;
        }

        return carrier;
      });
      const wrapper = buildWrapper({
        propsData: {
          countries: ['FR', 'IT'],
          carriers,
          displayValidationErrors: true,
        },
      });

      expect(wrapper.find('.text-danger').exists()).toBeTruthy();
      expect(wrapper.findAll('.text-danger').length).toBe(1);
      expect(wrapper.find('.text-danger').text()).toBe('To continue, you need to activate and complete at least one carrier for each selected target country');
    });
  });

  describe('Country selector', () => {
    it('is visible when several countries are chosen', () => {
      const wrapper = buildWrapper({
        propsData: {
          countries: ['FR', 'IT'],
          carriers: [],
          displayValidationErrors: false,
        },
      });

      expect(wrapper.find('#filterByCountryDropdown').exists()).toBeTruthy();
      expect(wrapper.find('#filterByCountryDropdown').attributes('disabled')).toBeFalsy();
    });

    it('is visible but disabled when only one country is chosen', () => {
      const wrapper = buildWrapper({
        propsData: {
          countries: ['FR'],
          carriers: [],
          displayValidationErrors: false,
        },
      });

      expect(wrapper.find('#filterByCountryDropdown').exists()).toBeTruthy();
      expect(wrapper.find('#filterByCountryDropdown').attributes('disabled')).toBeTruthy();
    });

    it('displays only carriers related to the filtered country', async () => {
      const carriers = productFeed.settings.deliveryDetails.filter((carrier) => carrier.country === 'IT' || carrier.country === 'FR');
      const wrapper = buildWrapper({
        propsData: {
          countries: ['IT', 'FR'],
          carriers,
          displayValidationErrors: false,
        },
      });

      expect(wrapper.findAllComponents(TableRowCarrier).length).toBe(7);

      wrapper.vm.countryChosen = 'FR';
      await wrapper.vm.$nextTick();
      expect(wrapper.findAllComponents(TableRowCarrier).length).toBe(3);

      wrapper.vm.countryChosen = 'IT';
      await wrapper.vm.$nextTick();
      expect(wrapper.findAllComponents(TableRowCarrier).length).toBe(4);
    });
  });
});
