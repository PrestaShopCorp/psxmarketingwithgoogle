/**
 * @jest-environment jsdom
 */
import config, {localVue, cloneStore} from '@/../tests/init';
import { mount, MountOptions } from "@vue/test-utils";
import DeliveryTimeAndRatesVue from "./delivery-time-and-rates.vue";
import Vuex from 'vuex';
import countriesFormListVue from './estimate-method/countries-form-list.vue';
import { ShippingSetupOption } from '../../../../enums/product-feed/shipping';
import shippingSettingsVue from './import-method/shipping-settings.vue';
import { cloneDeep } from 'lodash';
import { productFeed } from '../../../../../.storybook/mock/product-feed';
import DeliveryType from '../../../../enums/product-feed/delivery-type';

describe('delivery-time-and-rates.vue', () => {
  describe('Estimating carriers', () => {
    it.todo('should display import method interface');
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
      store.modules.productFeed.actions.GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS = jest.fn().mockImplementation(() => {});
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
          carrierId: "9",
          country: "FR",
          name: "PrestaShop",
          delay: "Pick up in-store",
          deliveryType: undefined,
        },
        {
          enabledCarrier: true,
          carrierId: "11",
          country: "FR",
          name: "My carrier",
          delay: "Delivery next day!",
          deliveryType: DeliveryType.DELIVERY,
          maxTransitTimeInDays: 3,
          maxHandlingTimeInDays: 3,
          minTransitTimeInDays: 0,
          minHandlingTimeInDays: 0,
        },
        {
          enabledCarrier: true,
          carrierId: "13",
          country: "FR",
          name: "Carrier with fixed price",
          delay: "Maybe 1 day, maybe never",
          deliveryType: DeliveryType.DELIVERY,
          maxTransitTimeInDays: 60,
          minHandlingTimeInDays: 0,
          minTransitTimeInDays: 1,
          maxHandlingTimeInDays: 3,
        },
      ]);
    });

    it('disables the button "Continue" if no carrier is found', () => {
      const wrapper = buildWrapper();
      wrapper.setData({countries: ['LEULEU']});

      expect(wrapper.vm.validateForm()).toBeFalsy();
    });

    it('disables the button "Continue" if no carrier is enabled', () => {
      const wrapper = buildWrapper();

      store.modules.productFeed.state.settings.deliveryDetails.map((c) => {
        c.enabledCarrier = false;
        return c;
      });
      expect(wrapper.vm.validateForm()).toBeFalsy();
    });

    it('disables the button "Continue" if one carrier in invalid', () => {
      const wrapper = buildWrapper();

      store.modules.productFeed.state.settings.deliveryDetails[2].minTransitTimeInDays = -1;
      expect(wrapper.vm.validateForm()).toBeFalsy();
    });

    it('enables the button "Continue" if all carriers are valid', () => {
      const wrapper = buildWrapper();

      expect(wrapper.vm.validateForm()).toBeTruthy();
    });
  });
});
