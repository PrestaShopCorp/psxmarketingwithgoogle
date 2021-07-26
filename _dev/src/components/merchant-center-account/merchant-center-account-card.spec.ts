/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import config, {cloneStore} from '@/../tests/init';

import {shallowMount} from '@vue/test-utils';
import MerchantCenterAccountCard from '@/components/merchant-center-account/merchant-center-account-card.vue';
import BadgeListRequirements from '@/components/commons/badge-list-requirements.vue';
import BootstrapVue, {BAlert} from 'bootstrap-vue';
import {
  merchantCenterAccountNotConnected,
  merchantCenterAccountConnected,
} from '../../../.storybook/mock/merchant-center-account';

describe('merchant-center-account-card.vue', () => {
  it('does show almot nothing when it is not actived yet', () => {
    const wrapper = shallowMount(MerchantCenterAccountCard, {
      propsData: {
        isEnabled: false,
        badges: [],
      },
      store: new Vuex.Store(cloneStore()),
      ...config,
    });
    wrapper.vm.$refs.mcaSelection = undefined;

    // Check disabled state
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(true);
    expect(wrapper.findComponent(BadgeListRequirements)).toBeTruthy();
    // Check existing GMC list, selected account details are not displayed
    expect(wrapper.find('#mcaSelection').exists()).toBeFalsy();
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
  });

  it('does show almost nothing when it is not actived yet', () => {
    const wrapper = shallowMount(MerchantCenterAccountCard, {
      propsData: {
        isEnabled: false,
        badges: [],
      },
      store: new Vuex.Store(cloneStore()),
    });

    // Check disabled state
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(true);
    expect(wrapper.findComponent(BadgeListRequirements).exists()).toBeTruthy();
    // Check existing GMC list, selected account details are not displayed
    expect(wrapper.find('#mcaSelection').exists()).toBeFalsy();
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
  });

  it('show the link to create an account when enabled', () => {
    const wrapper = shallowMount(MerchantCenterAccountCard, {
      propsData: {
        isEnabled: true,
        badges: [],
      },
      store: new Vuex.Store(cloneStore()),
    });

    // Check enabled state
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(false);
    expect(wrapper.findComponent(BadgeListRequirements).exists()).toBeFalsy();
    // Check button to create an account exists
    expect(wrapper.find('.material-icons').text()).toBe('person_add');
  });
});
