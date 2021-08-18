/**
 * @jest-environment jsdom
 */
 import Vuex from 'vuex';

 // Import this file first to init mock on window
 import {cloneStore} from '@/../tests/init';

 import {mount, shallowMount} from '@vue/test-utils';
 import GoogleAdsAccountPopinNew from '@/components/google-ads-account/google-ads-account-popin-new.vue';
 import {
   googleAccountConnected,
 } from "@/../.storybook/mock/google-account";

const VBTooltip = jest.fn();

const wrapper = mount(GoogleAdsAccountPopinNew, {
  store: new Vuex.Store(cloneStore()),
  propsData: {
   visible: true,
   user: Object.assign({}, googleAccountConnected),
  },
  stubs: {
   VueShowdown: true,
   BButton: true,
 },
  directives: {
    'b-tooltip': VBTooltip,
  },
});

describe('google-ads-account.vue / step 1', () => {
  it('step 1 is active in the stepper', async () => {
    await wrapper.setData({ stepActiveData: 1 })

    expect(wrapper.findAll('.ps_gs-stepper-step').at(0).attributes('aria-current')).toEqual('step');
    expect(wrapper.findAll('.ps_gs-stepper-step').at(1).attributes('aria-current')).toBeUndefined();
   });
});

describe('google-ads-account.vue / step 2', () => {
  it('step 2 is active in the stepper', async () => {
    await wrapper.setData({ stepActiveData: 2 })

    expect(wrapper.findAll('.ps_gs-stepper-step').at(1).attributes('aria-current')).toEqual('step');
    expect(wrapper.findAll('.ps_gs-stepper-step').at(0).attributes('aria-current')).toBeUndefined();
   });
});

describe('google-ads-account.vue / step 3', () => {
  it('step 3 is active in the stepper', async () => {
    await wrapper.setData({ stepActiveData: 3 })

    expect(wrapper.findAll('.ps_gs-stepper-step').at(2).attributes('aria-current')).toEqual('step');
    expect(wrapper.findAll('.ps_gs-stepper-step').at(0).attributes('aria-current')).toBeUndefined();
   });
});
