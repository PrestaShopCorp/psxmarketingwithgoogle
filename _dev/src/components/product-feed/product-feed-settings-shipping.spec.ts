/**
 * @jest-environment jsdom
 */
 import Vuex from 'vuex';

 // Import this file first to init mock on window
 import {localVue, cloneStore} from '@/../tests/init';
 import config from '@/../tests/init';
 import {shallowMount} from '@vue/test-utils';
 import ProductFeedCard from '@/components/product-feed/product-feed-card.vue';
 import ProductFeedCardReportCard from '@/components/product-feed/product-feed-card-report-card.vue';
 import Stepper from '@/components/commons/stepper.vue';
 import VueShowdown from 'vue-showdown';
 
 import {
   productFeed,
   productFeedIsConfigured,
 } from '../../../.storybook/mock/product-feed';
import store from '@/store';
 
 describe('product-feed-settings-shipping.vue', () => {
   const mockRoute = {
     path: '/product-feed-settings',
   };
   const mockRouter = {
     push: jest.fn(),
   };
 
   let mutationsCloned;
   let storeStepOne;
   beforeEach(() => {   
    mutationsCloned = {
        SET_ACTIVE_CONFIGURATION_STEP : jest.fn(),
    }
     storeStepOne = cloneStore();
     storeStepOne.modules.productFeed.state = {
       ...storeStepOne.modules.productFeed.state,
       ...productFeed,
     };
     storeStepOne.modules.productFeed.mutations = {
        ...storeStepOne.modules.productFeed.mutations,
        ...mutationsCloned,
      };
   });
 
   it('shows stepper at 1 ', () => {
     const wrapper = shallowMount(ProductFeedCard, {
       propsData: {
         isEnabled: true,
         ...config,
       },
       store: new Vuex.Store(storeStepOne),
     });
     expect(wrapper.findComponent(Stepper).exists()).toBeTruthy();
     expect(wrapper.findComponent(Stepper).props('activeStep')).toBe(1);
     expect(wrapper.find('b-button').exists()).toBeTruthy();

   });
 
//    it('shows button continue and triggers next step on click', async () => {
//      const wrapper = shallowMount(ProductFeedCard, {
//        ...config,
//        propsData: {
//          isEnabled: true,
//        },
//        ...localVue,
//        store: new Vuex.Store(storeStepOne),
//      });
//      expect(wrapper.find('b-button'));
//      await wrapper.find(".commit").trigger("click");
//      expect(mutationsCloned.SET_ACTIVE_CONFIGURATION_STEP).toHaveBeenCalledTimes(1);
//      expect(mutationsCloned.SET_ACTIVE_CONFIGURATION_STEP).toHaveBeenCalledWith(2);
//    });
 
//    it('shows button cancel and triggers previous step on click', async () => {
//      const wrapper = shallowMount(ProductFeedCard, {
//        ...config,
//        propsData: {
//          isEnabled: true,
//        },
//        ...localVue,
//        store: new Vuex.Store(storeStepOne),
//      });
//      const button = wrapper.find('b-button')
//      await button.trigger('click');
//      expect(wrapper.emitted('cancelProductFeedSettingsConfiguration')).toBeTruthy();

//    });
 
//    it('shows input target countries with good datas', () => {
//      const timeConverterToDate = jest.fn();
//      localVue.filter('timeConverterToDate', timeConverterToDate);
//      const timeConverterToHour = jest.fn();
//      localVue.filter('timeConverterToHour', timeConverterToHour);
//      const changeCountryCodeToName = jest.fn();
//      changeCountryCodeToName.mockImplementation(() => []);
//      localVue.filter('changeCountryCodeToName', changeCountryCodeToName);
//      const wrapper = shallowMount(ProductFeedCard, {
//        propsData: {
//          isEnabled: true,
//        },
//        ...config,
//        mocks: {
//          $router: mockRouter,
//        },
//        localVue,
//        store: new Vuex.Store(storeStepOne),
//      });
//      expect(wrapper.findComponent(ProductFeedCardReportCard).exists()).toBeTruthy();
//      expect(timeConverterToDate).toHaveBeenCalledTimes(2);
//      expect(timeConverterToHour).toHaveBeenCalledTimes(1);
//      expect(changeCountryCodeToName).toHaveBeenCalledTimes(1);
//      expect(wrapper.findComponent(VueShowdown.VueShowdown).exists()).toBeTruthy();
//    });
 });
 