import {mount, MountOptions} from '@vue/test-utils';
import Vuex from 'vuex';
import cloneDeep from 'lodash.clonedeep';
import config, {localVue, cloneStore} from '@/../tests/init';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {productFeed, productFeedEstimateConfigured} from '@/../.storybook/mock/product-feed';
import CustomCarrierForm from './custom-carrier-form.vue';
import {CustomCarrier} from '@/providers/shipping-rate-provider';
import currencyDropdownVue from './currency-dropdown.vue';
import {OfferType} from '@/enums/product-feed/offer';

describe('custom-carrier-form.vue', () => {
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
      stubs: {

      },
    });
  };

  describe('Multi currencies', () => {
    it('shows the currency selector 1 time for flat rate', () => {
      const store = cloneStore();
      const carrier: CustomCarrier = {
        ...productFeedEstimateConfigured.settings.estimateCarriers[0],
        offer: OfferType.FLAT_SHIPPING_RATE,
      };
      store.modules.app.state.psxMktgWithGoogleActiveCurrencies = ['EUR', 'USD', 'GBP'];

      const wrapper = buildWrapper({
        propsData: {
          estimateCarrier: carrier,
          displayValidationErrors: false,
        },
        store: new Vuex.Store(store),
      });

      const currencySelector = wrapper.findAllComponents(currencyDropdownVue);
      expect(currencySelector).toHaveLength(1);
    });

    it('shows the currency selector 2 times for free shipping from a given cart amount', () => {
      const store = cloneStore();
      const carrier: CustomCarrier = {
        ...productFeedEstimateConfigured.settings.estimateCarriers[0],
        offer: OfferType.FREE_SHIPPING_OVER_AMOUNT,
      };
      store.modules.app.state.psxMktgWithGoogleActiveCurrencies = ['EUR', 'USD', 'GBP'];

      const wrapper = buildWrapper({
        propsData: {
          estimateCarrier: carrier,
          displayValidationErrors: false,
        },
        store: new Vuex.Store(store),
      });

      const currencySelector = wrapper.findAllComponents(currencyDropdownVue);
      expect(currencySelector).toHaveLength(2);
    });

    it('shows the currency selector 0 times for free shipping', () => {
      const store = cloneStore();
      const carrier: CustomCarrier = {
        ...productFeedEstimateConfigured.settings.estimateCarriers[0],
        offer: OfferType.FREE_SHIPPING,
      };
      store.modules.app.state.psxMktgWithGoogleActiveCurrencies = ['EUR', 'USD', 'GBP'];

      const wrapper = buildWrapper({
        propsData: {
          estimateCarrier: carrier,
          displayValidationErrors: false,
        },
        store: new Vuex.Store(store),
      });

      const currencySelector = wrapper.findAllComponents(currencyDropdownVue);
      expect(currencySelector).toHaveLength(0);
    });
  });

  describe('Mono currency', () => {
    it('shows the currency as a label and cannot be modified', () => {
      const store = cloneStore();
      const carrier: CustomCarrier = {
        ...productFeedEstimateConfigured.settings.estimateCarriers[0],
        offer: OfferType.FLAT_SHIPPING_RATE,
      };
      store.modules.app.state.psxMktgWithGoogleActiveCurrencies = ['EUR'];

      const wrapper = buildWrapper({
        propsData: {
          estimateCarrier: carrier,
          displayValidationErrors: false,
        },
        store: new Vuex.Store(store),
      });

      const currencySelector = wrapper.findAllComponents(currencyDropdownVue);
      expect(currencySelector).toHaveLength(0);
      const inputGroup = wrapper.findAll('.ps_gs-carrier__input-number-group');
      expect(inputGroup.at(1).attributes('append')).toEqual('EUR');
    });
  });
});
