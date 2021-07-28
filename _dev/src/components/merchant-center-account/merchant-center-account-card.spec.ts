/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {commonOptions, cloneStore} from '@/../tests/init';

import {shallowMount} from '@vue/test-utils';
import MerchantCenterAccountCard from '@/components/merchant-center-account/merchant-center-account-card.vue';
import BadgeListRequirements from '@/components/commons/badge-list-requirements.vue';
import {BAlert} from 'bootstrap-vue';
import fetchMock from 'jest-fetch-mock';
import actionsTypes from '../../store/modules/accounts/actions-types';
import {WebsiteClaimErrorReason} from '../../store/modules/accounts/state';

fetchMock.enableMocks();

describe('merchant-center-account-card.vue', () => {
  it('does show almot nothing when it is not actived yet', () => {
    const wrapper = shallowMount(MerchantCenterAccountCard, {
      propsData: {
        isEnabled: false,
      },
      ...commonOptions,
      store: new Vuex.Store(cloneStore()),
    });
    wrapper.vm.$refs.mcaSelection = undefined;

    // Check disabled state
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(true);
    expect(wrapper.findComponent(BadgeListRequirements).exists()).toBeTruthy();
    // Check existing GMC list, selected account details are not displayed
    expect(wrapper.find('#mcaSelection').exists()).toBeFalsy();
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
  });

  it('does show almost nothing when it is not actived yet', () => {
    const wrapper = shallowMount(MerchantCenterAccountCard, {
      propsData: {
        isEnabled: false,
      },
      ...commonOptions,
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
      },
      ...commonOptions,
      store: new Vuex.Store(cloneStore()),
    });

    // Check enabled state
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(false);
    expect(wrapper.findComponent(BadgeListRequirements).exists()).toBeFalsy();
    // Check button to create an account exists
    expect(wrapper.find('.material-icons').text()).toBe('person_add');
  });
});

describe('merchant-center-account-card.vue / API errors', () => {
  it('display an error message when API fails when retrieving GMC details', async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({message: 'Sorry, API is on 🔥'}), {status: 500});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = shallowMount(MerchantCenterAccountCard, {
      propsData: {
        isEnabled: true,
      },
      ...commonOptions,
      store: new Vuex.Store(cloneStore()),
    });

    await wrapper.vm.$store.dispatch(`accounts/${actionsTypes.REQUEST_GMC_LIST}`);

    // Status is on linking failed
    expect(wrapper.vm.$store.state.accounts.googleMerchantAccount.gmcStatus)
      .toEqual(WebsiteClaimErrorReason.LinkingFailed);
    // Alert exists
    expect(wrapper.findComponent(BAlert).exists()).toBeTruthy();
    // With reload button
    expect(wrapper.findComponent(BAlert).find('b-button').text()).toEqual('Refresh page');
    // Check error message
    expect(wrapper.findComponent(BAlert).find('p').text()).toBe('You can\'t connect to your Merchant Center account right now. Try again later.');
  });
});
