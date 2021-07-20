/**
 * @jest-environment jsdom
 */
 import Vuex from 'vuex';

 // Import this file first to init mock on window
 import {commonOptions, cloneStore} from '@/../tests/init';
 import BadgeListRequirements from '@/components/commons/badge-list-requirements.vue';

 import {shallowMount} from '@vue/test-utils';
 import ProductFeedCard from '@/components/product-feed/product-feed-card.vue';
 import Stepper from '@/components/commons/stepper.vue'
 import BootstrapVue, {BAlert, BButton} from 'bootstrap-vue';
 import {
    productFeed,
 } from '../../../.storybook/mock/product-feed';
 
 describe('merchant-center-account-card.vue', () => {
   it('is disabled when not activated', () => {
     const wrapper = shallowMount(ProductFeedCard, {
       propsData: {
         isEnabled: false,
       },
       ...commonOptions,
       store: new Vuex.Store(cloneStore()),
     }); 
     expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(true);
     expect(wrapper.findComponent(BadgeListRequirements)).toBeTruthy();
     expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
   });

   it('show stepper at 1 when enabled', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      propsData: {
        isEnabled: true,
      },
      ...commonOptions,
      store: new Vuex.Store(cloneStore()),
    }); 
    expect(wrapper.findComponent(Stepper)).toBeTruthy();
    expect(wrapper.findComponent(Stepper).props('activeStep')).toBe(1);
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
    expect(wrapper.findComponent(BButton)).toBeTruthy();
    // expect(wrapper.findComponent(BButton).props('disabled')).toBe(false);
    // expect(wrapper.findComponent(BButton).text()).toBe('configureAndExportProductFeed')
});
 
  
 });
 