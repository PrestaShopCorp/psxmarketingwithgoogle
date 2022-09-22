/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import cloneDeep from 'lodash.clonedeep';
import {mount, MountOptions, shallowMount} from '@vue/test-utils';
import config, {localVue, cloneStore, filters} from '@/../tests/init';
import CustomCarrierForm from './custom-carrier-form.vue';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {CustomCarrier} from '@/providers/shipping-rate-provider';
import {OfferType} from '@/enums/product-feed/offer';
import {productFeed} from '../../../../../../.storybook/mock/product-feed';

const VBTooltip = jest.fn();
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
    directives: {
      'b-tooltip': VBTooltip,
    },
    ...config,
    stubs: {
      VueShowdown: true,
    },
    ...options,
  });
};

describe('custom-carrier-form.vue.vue', () => {
  describe('validate cases', () => {
    it.todo('case for multiple target countries');
    it('is visible', () => {
      const store = cloneStore();
      const carrier: CustomCarrier = {...productFeed.settings.estimateCarrier}

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

    it('should ok when carrier is filled correctly', () => {
      const store = cloneStore();
      const carrier: CustomCarrier = {
        ...productFeed.settings.estimateCarrier,
        carrierName: 'DHL',
        offer: OfferType.FREE_SHIPPING,
        minDeliveryTime: 1,
        maxDeliveryTime: 2,
      }

      const wrapper = buildWrapper({
        propsData: {
          customCarrier: carrier,
          displayValidationErrors: false,
        },
        store: new Vuex.Store(store),
      });

      expect(wrapper.vm.validateCarrier).toBe(null);
    });

    it('should show another block when merchant choose OfferType.FLAT_SHIPPING_RATE', async () => {
      const store = cloneStore();
      const carrier: CustomCarrier = {
        ...productFeed.settings.estimateCarrier,
        carrierName: 'DHL',
        minDeliveryTime: 1,
        maxDeliveryTime: 2,
        offer: OfferType.FLAT_SHIPPING_RATE,
      }

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
        ...productFeed.settings.estimateCarrier,
        carrierName: 'DHL',
        minDeliveryTime: 1,
        maxDeliveryTime: 2,
        offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
      }

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
      const carrier: CustomCarrier = {...productFeed.settings.estimateCarrier}

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
      const carrier: CustomCarrier = {...productFeed.settings.estimateCarrier}

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
      const carrier: CustomCarrier = {
        ...productFeed.settings.estimateCarrier,
        minDeliveryTime: -50
      }

      const wrapper = buildWrapper({
        propsData: {
          customCarrier: carrier,
          displayValidationErrors: true,
        },
        store: new Vuex.Store(store),
      });

      expect(wrapper.vm.validateTimeDelivery).toBe(false);
    });

    it('should throw an error if delivery time has not the right value', () => {
      const store = cloneStore();
      const carrier: CustomCarrier = {
        ...productFeed.settings.estimateCarrier,
        minDeliveryTime: -50
      }

      const wrapper = buildWrapper({
        propsData: {
          customCarrier: carrier,
          displayValidationErrors: true,
        },
        store: new Vuex.Store(store),
      });

      expect(wrapper.vm.validateTimeDelivery).toBe(false);
    });

    it('should throw an error if carrier is not filled correctly', () => {
      const store = cloneStore();
      const carrier: CustomCarrier = {
        ...productFeed.settings.estimateCarrier,
        minDeliveryTime: -50,
        carrierName: '',
      }

      const wrapper = buildWrapper({
        propsData: {
          customCarrier: carrier,
          displayValidationErrors: true,
        },
        store: new Vuex.Store(store),
      });

      expect(wrapper.vm.validateCarrier).toBe(false);
    });
  });
});
