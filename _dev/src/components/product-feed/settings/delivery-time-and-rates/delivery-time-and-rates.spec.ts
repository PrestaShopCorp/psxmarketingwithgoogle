/**
 * @jest-environment jsdom
 */
import {mount, MountOptions} from '@vue/test-utils';
import Vuex from 'vuex';
import cloneDeep from 'lodash.clonedeep';
import config, {localVue, cloneStore} from '@/../tests/init';
import DeliveryTimeAndRatesVue from './delivery-time-and-rates.vue';
import countriesFormListVue from './estimate-method/countries-form-list.vue';
import {ShippingSetupOption} from '../../../../enums/product-feed/shipping';
import shippingSettingsVue from './import-method/shipping-settings.vue';
import {productFeed, productFeedEstimateConfigured} from '../../../../../.storybook/mock/product-feed';
import DeliveryType from '../../../../enums/product-feed/delivery-type';
import CustomCarrierForm from './estimate-method/custom-carrier-form.vue';
import {createCustomCarriersTemplate, CustomCarrier} from '@/providers/shipping-rate-provider';
import CountriesFromList from './estimate-method/countries-form-list.vue';
import {OfferType} from '@/enums/product-feed/offer';
import { RateType } from '@/enums/product-feed/rate';

describe('delivery-time-and-rates.vue', () => {
  describe('Estimating carriers - custom-carrier-form components', () => {
    const buildWrapper = (
      options: MountOptions<any> = {},
      ) => {
        const store = cloneStore();
        store.modules.productFeed.state = cloneDeep(productFeed);
        store.modules.productFeed.state.stepper = 2;
        store.modules.productFeed.state.settings.shippingSetup = ShippingSetupOption.ESTIMATE;

        return mount(CustomCarrierForm, {
          localVue,
          store: new Vuex.Store(store),
          ...config,
          ...options,
        });
      };

    describe('validate cases', () => {
      it('is visible', () => {
        const store = cloneStore();
        const carrier: CustomCarrier = [...productFeedEstimateConfigured.settings.estimateCarriers][0];

        const wrapper = buildWrapper({
          propsData: {
            customCarrier: carrier,
            displayValidationErrors: false,
          },
          store: new Vuex.Store(store),
        });

        expect(wrapper.isVisible()).toBe(true);
        expect(wrapper.find('#customCarrierForm').isVisible()).toBe(true);
      });

      it('should show another block when merchant choose OfferType.FLAT_SHIPPING_RATE', async () => {
        const store = cloneStore();
        const carrier: CustomCarrier = {
          ...productFeedEstimateConfigured.settings.estimateCarriers[0],
          carrierName: 'DHL',
          minDeliveryTime: 1,
          maxDeliveryTime: 2,
          offer: OfferType.FLAT_SHIPPING_RATE,
        };

        const wrapper = buildWrapper({
          propsData: {
            customCarrier: carrier,
            displayValidationErrors: false,
          },
          store: new Vuex.Store(store),
        });

        const radios = wrapper.findAll('.form-check');
        radios.at(0).trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('#customCarrierForm .offer-rates').exists()).toBeTruthy();
      });

      it('should show another block when merchant choose OfferType.FREE_SHIPPING_OVER_AMOUNT', async () => {
        const store = cloneStore();
        const carrier: CustomCarrier = {
          ...productFeedEstimateConfigured.settings.estimateCarriers[0],
          carrierName: 'DHL',
          minDeliveryTime: 1,
          maxDeliveryTime: 2,
          offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
        };

        const wrapper = buildWrapper({
          propsData: {
            customCarrier: carrier,
            displayValidationErrors: false,
          },
          store: new Vuex.Store(store),
        });

        const radios = wrapper.findAll('.form-check');
        radios.at(2).trigger('click');
        await wrapper.vm.$nextTick();

        const inputs = wrapper.findAll('#customCarrierForm .offer-rates .freeShippingOverAmount');
        expect(inputs).toHaveLength(2);
        expect(radios).toHaveLength(3);
      });
    });

    describe('errors cases', () => {
      it('should throw an error if carrierName is not filled', () => {
        const store = cloneStore();
        const carrier: CustomCarrier = [
          ...productFeedEstimateConfigured.settings.estimateCarriers
        ][0];

        const wrapper = buildWrapper({
          propsData: {
            customCarrier: carrier,
            displayValidationErrors: true,
          },
          store: new Vuex.Store(store),
        });

        expect(wrapper.vm.validateCarrierName).toBe(false);
      });

      it('should throw an error if offer is not selected', () => {
        const store = cloneStore();
        const carrier: CustomCarrier = [
          ...productFeedEstimateConfigured.settings.estimateCarriers
        ][0];

        const wrapper = buildWrapper({
          propsData: {
            customCarrier: carrier,
            displayValidationErrors: true,
          },
          store: new Vuex.Store(store),
        });

        expect(wrapper.vm.validateRadio).toBe(false);
      });

      it('should throw an error if delivery time has not the right value', () => {
        const store = cloneStore();
        const carrier: CustomCarrier = [
          ...productFeedEstimateConfigured.settings.estimateCarriers
        ][0];
        carrier.minDeliveryTime = -50;

        const wrapper = buildWrapper({
          propsData: {
            customCarrier: carrier,
            displayValidationErrors: true,
          },
          store: new Vuex.Store(store),
        });

        expect(wrapper.vm.validateTimeDelivery).toBe(false);
      });

      // it('should throw an error if carrier is not filled correctly', () => {
      //   const store = cloneStore();
      //   const carrier: CustomCarrier = [
      //     ...productFeedEstimateConfigured.settings.estimateCarriers
      //   ][0];
      //   carrier.carrierName = '';
      //   carrier.minDeliveryTime = -42;

      //   const wrapper = buildWrapper({
      //     propsData: {
      //       customCarrier: carrier,
      //       displayValidationErrors: true,
      //     },
      //     store: new Vuex.Store(store),
      //   });

      //   expect(wrapper.vm.validateCarrier).toBe(false);
      // });
    });
  });
  describe('Estimating carriers - countries-form-list components', () => {
    const buildWrapper = (
      options: MountOptions<any> = {},
      ) => {
        const store = cloneStore();
        store.modules.productFeed.state = cloneDeep(productFeed);
        store.modules.productFeed.state.stepper = 2;
        store.modules.productFeed.state.settings.shippingSetup = ShippingSetupOption.ESTIMATE;

        return mount(CountriesFromList, {
          localVue,
          store: new Vuex.Store(store),
          ...config,
          ...options,
        });
      };
    it('should ok when carrier is filled correctly', () => {
      const store = cloneStore();
      const carriers: CustomCarrier[] = [
        ...productFeedEstimateConfigured.settings.estimateCarriers
      ];
      carriers[0].carrierName = 'DHL';
      carriers[0].offer = OfferType.FREE_SHIPPING;
      carriers[0].minDeliveryTime = 1;
      carriers[0].maxDeliveryTime = 2;

      const wrapper = buildWrapper({
        propsData: {
          carriers,
          countries: productFeedEstimateConfigured.settings.targetCountries,
          rateChosen: RateType.RATE_ALL_COUNTRIES,
          displayValidationErrors: true,
        },
        store: new Vuex.Store(store),
      });

      expect(wrapper.vm.validateCarrier(carriers[0])).toBe(null);
    });

    it('should display as many countries as there are blocks when merchant choose RateType.RATE_PER_COUNTRY', () => {
      const store = cloneStore();
      productFeedEstimateConfigured.settings.targetCountries = ['FR', 'BE'];
      const carriers: CustomCarrier[] = createCustomCarriersTemplate(
        RateType.RATE_PER_COUNTRY,
        productFeedEstimateConfigured.settings.targetCountries,
        'EUR'
      );
      const wrapper = buildWrapper({
        propsData: {
          carriers,
          countries: productFeedEstimateConfigured.settings.targetCountries,
          rateChosen: RateType.RATE_PER_COUNTRY,
          displayValidationErrors: true,
        },
        store: new Vuex.Store(store),
      });

      const cards = wrapper.findAll('.estimateMultiCountries #card_per_country');
      expect(wrapper.find('.estimateMultiCountries #card_per_country')).toBeTruthy();
      expect(wrapper.find('.estimateMultiCountries #for_all_countries').exists()).toBeFalsy();
      expect(cards).toHaveLength(2);
    });

    it('should display only one card with many countries when merchant choose RateType.RATE_ALL_COUNTRIES', () => {
      const store = cloneStore();
      productFeedEstimateConfigured.settings.targetCountries = ['FR', 'BE'];
      const carriers: CustomCarrier[] = createCustomCarriersTemplate(
        RateType.RATE_ALL_COUNTRIES,
        productFeedEstimateConfigured.settings.targetCountries,
        'EUR'
      );
      const wrapper = buildWrapper({
        propsData: {
          carriers,
          countries: productFeedEstimateConfigured.settings.targetCountries,
          rateChosen: RateType.RATE_ALL_COUNTRIES,
          displayValidationErrors: true,
        },
        store: new Vuex.Store(store),
      });

      const cards = wrapper.findAll('.estimateMultiCountries #for_all_countries');
      expect(wrapper.find('.estimateMultiCountries #for_all_countries')).toBeTruthy();
      expect(wrapper.find('.estimateMultiCountries #card_per_country').exists()).toBeFalsy();
      expect(cards).toHaveLength(1);
    });

    it('should display nothing if there are no rate selected', () => {
      const store = cloneStore();
      productFeedEstimateConfigured.settings.targetCountries = ['FR', 'BE'];
      const carriers: CustomCarrier[] = createCustomCarriersTemplate(
        RateType.RATE_PER_COUNTRY,
        productFeedEstimateConfigured.settings.targetCountries,
        'EUR'
      );
      const wrapper = buildWrapper({
        propsData: {
          carriers,
          countries: productFeedEstimateConfigured.settings.targetCountries,
          rateChosen: null,
          displayValidationErrors: true,
        },
        store: new Vuex.Store(store),
      });

      expect(wrapper.find('.estimateMultiCountries #for_all_countries').exists()).toBeFalsy();
      expect(wrapper.find('.estimateMultiCountries #card_per_country').exists()).toBeFalsy();
    });
  });

  describe('Importing carriers', () => {
    let store: ReturnType<typeof cloneStore>;

    const buildWrapper = (
      options: MountOptions<any> = {},
    ) => {
      const wrapper = mount(DeliveryTimeAndRatesVue, {
        ...config,
        localVue,
        store: new Vuex.Store(store),
        ...options,
      });
      wrapper.setData({countries: ['FR']});

      return wrapper;
    };

    beforeEach(() => {
      store = cloneStore();
      store.modules.productFeed.state = cloneDeep(productFeed);
      store.modules.productFeed.state.settings.shippingSetup = ShippingSetupOption.IMPORT;
      store.modules.productFeed.actions.GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS = jest
        .fn().mockImplementation(() => {});
      store.modules.productFeed.getters.GET_TARGET_COUNTRIES = jest.fn().mockImplementation(() => ['FR']);
    });

    it('should display import method interface', () => {
      const wrapper = buildWrapper();

      expect(wrapper.findComponent(shippingSettingsVue).exists()).toBeTruthy();
      expect(wrapper.findComponent(countriesFormListVue).exists()).toBeFalsy();
    });

    it('filters the list of carriers to configure based on the selected countries', () => {
      const wrapper = buildWrapper();

      expect(wrapper.vm.carriersToConfigure).toEqual([
        {
          carrierId: '9',
          country: 'FR',
          name: 'PrestaShop',
          delay: 'Pick up in-store',
          deliveryType: undefined,
        },
        {
          enabledCarrier: true,
          carrierId: '11',
          country: 'FR',
          name: 'My carrier',
          delay: 'Delivery next day!',
          deliveryType: DeliveryType.DELIVERY,
          maxTransitTimeInDays: 3,
          maxHandlingTimeInDays: 3,
          minTransitTimeInDays: 0,
          minHandlingTimeInDays: 0,
        },
        {
          enabledCarrier: true,
          carrierId: '13',
          country: 'FR',
          name: 'Carrier with fixed price',
          delay: 'Maybe 1 day, maybe never',
          deliveryType: DeliveryType.DELIVERY,
          maxTransitTimeInDays: 60,
          minHandlingTimeInDays: 0,
          minTransitTimeInDays: 1,
          maxHandlingTimeInDays: 3,
        },
      ]);
    });

    it('forbids to continue if no carrier is found', () => {
      const wrapper = buildWrapper();
      wrapper.setData({countries: ['LEULEU']});

      expect(wrapper.vm.validateForm()).toBeFalsy();
    });

    it('forbids to continue if no carrier is enabled', () => {
      const wrapper = buildWrapper();

      store.modules.productFeed.state.settings.deliveryDetails.map((c) => {
        c.enabledCarrier = false;
        return c;
      });
      expect(wrapper.vm.validateForm()).toBeFalsy();
    });

    it('forbids to continue if one carrier in invalid', () => {
      const wrapper = buildWrapper();

      store.modules.productFeed.state.settings.deliveryDetails[2].minTransitTimeInDays = -1;
      expect(wrapper.vm.validateForm()).toBeFalsy();
    });

    it('allows to continue if all carriers are valid', () => {
      const wrapper = buildWrapper();

      expect(wrapper.vm.validateForm()).toBeTruthy();
    });
  });
});
