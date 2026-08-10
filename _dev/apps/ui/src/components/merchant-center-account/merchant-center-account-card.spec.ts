import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount, shallowMount} from '@vue/test-utils';
import {BAlert} from 'bootstrap-vue';
import createFetchMock from 'vitest-fetch-mock';
import config, {addBootstrapToVue, cloneStore, localVue} from '@/../tests/init';

import MerchantCenterAccountCard from '@/components/merchant-center-account/merchant-center-account-card.vue';
import actionsTypes from '../../store/modules/accounts/actions-types';
import {WebsiteClaimErrorReason} from '../../store/modules/accounts/state';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('merchant-center-account-card.vue', () => {
  beforeAll(() => {
    addBootstrapToVue();
  });

  it('does show almot nothing when it is not actived yet', () => {
    const wrapper = shallowMount(MerchantCenterAccountCard, {
      propsData: {
        isEnabled: false,
      },
      ...config,
      store: new Vuex.Store(cloneStore()),
    });
    wrapper.vm.$refs.mcaSelection = undefined;

    // Check disabled state
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(true);
    // Check existing GMC list, selected account details are not displayed
    expect(wrapper.find('#mcaSelection').exists()).toBeFalsy();
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
  });

  it('does show almost nothing when it is not actived yet', () => {
    const wrapper = shallowMount(MerchantCenterAccountCard, {
      propsData: {
        isEnabled: false,
      },
      ...config,
      store: new Vuex.Store(cloneStore()),
    });

    // Check disabled state
    expect(wrapper.find('.ps_gs-onboardingcard').classes('ps_gs-onboardingcard--disabled')).toBe(true);
    // Check existing GMC list, selected account details are not displayed
    expect(wrapper.find('#mcaSelection').exists()).toBeFalsy();
    expect(wrapper.findComponent(BAlert).exists()).toBeFalsy();
  });

  it('renders and selects a normalized local Merchant account without legacy user metadata', async () => {
    const store = new Vuex.Store(cloneStore());
    store.commit('accounts/SAVE_GMC_LIST', [{id: '123', name: 'Tiny Lux'}]);
    const wrapper = mount(MerchantCenterAccountCard, {
      propsData: {
        isEnabled: true,
        loading: false,
      },
      ...config,
      localVue,
      store,
    });

    expect(wrapper.text()).toContain('123 - Tiny Lux');
    expect(wrapper.text()).not.toContain('create your account');
    expect(wrapper.text()).not.toContain('Disconnect');

    await wrapper.setData({selectedMcaIndex: 0});
    expect(() => wrapper.vm.selectMerchantCenterAccount()).not.toThrow();
    expect(wrapper.emitted('selectMerchantCenterAccount')?.[0]).toEqual([{id: '123', name: 'Tiny Lux'}]);
  });
});

describe('merchant-center-account-card.vue / API errors', () => {
  it('display an error message when API fails when retrieving GMC details', async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({message: 'Sorry, API is on 🔥'}), {status: 500});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = shallowMount(MerchantCenterAccountCard, {
      propsData: {
        isEnabled: true,
      },
      ...config,
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
