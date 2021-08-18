/**
 * @jest-environment jsdom
 */
 import Vuex from 'vuex';

 // Import this file first to init mock on window
 import {cloneStore} from '@/../tests/init';

 import {mount, shallowMount} from '@vue/test-utils';
 import GoogleAccountPopinNew from '@/components/google-ads-account/google-ads-account-popin-new.vue';
 import PsModal from '@/components/commons/ps-modal.vue';
 import Stepper from '@/components/commons/stepper.vue';
//  import {
//   StepOne,
//   StepTwo,
//   StepThree,
//  } from '@/../stories/google-ads-account-popin-new.stories';
import {
  googleAccountConnected,
} from "@/../.storybook/mock/google-account";

 describe('google-ads-account.vue / step 1', () => {
   it('shows a link to create a new account', () => {
     const wrapper = mount(GoogleAccountPopinNew, {
       store: new Vuex.Store(cloneStore()),
       propsData: {
        visible: true,
        stepActiveData: 1,
        user: Object.assign({}, googleAccountConnected),
       },
       stubs: {
        VueShowdown: true,
        PsModal,
        Stepper,
      },
     });

     console.log(wrapper.html())

     expect(wrapper.findAll('.ps_gs-stepper-step').at(0).attributes('aria-current')).toEqual('step');
    });
 });
