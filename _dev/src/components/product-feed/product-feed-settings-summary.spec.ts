/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import config, {localVue, cloneStore} from '@/../tests/init';
import {mount, shallowMount} from '@vue/test-utils';
import ProductFeedSettingsSummary from '@/components/product-feed/product-feed-settings-summary.vue';
import ProductFeedCardNextSyncCard from '@/components/product-feed/product-feed-card-next-sync-card.vue';
import Stepper from '@/components/commons/stepper.vue';
import PsSelect from '@/components/commons/ps-select.vue';

import {
  Summary,
} from '@/../stories/product-feed-settings.stories';

describe('product-feed-settings-summary.vue', () => {
  it('shows datas', () => {
    const timeConverterToDate = jest.fn();
    localVue.filter('timeConverterToDate', timeConverterToDate);
    const timeConverterToHour = jest.fn();
    localVue.filter('timeConverterToHour', timeConverterToHour);
    const changeCountryCodeToName = jest.fn();
    changeCountryCodeToName.mockImplementation(() => []);
    localVue.filter('changeCountryCodeToName', changeCountryCodeToName);
    const wrapper = shallowMount(ProductFeedSettingsSummary, {
      propsData: Summary.args,
      beforeMount: Summary.args.beforeMount,
      localVue,
      store: new Vuex.Store(cloneStore()),
    });
    changeCountryCodeToName.mockImplementation(() => []);
    localVue.filter('changeCountryCodeToName', changeCountryCodeToName);
    expect(changeCountryCodeToName).toHaveBeenCalledTimes(1);
    expect(wrapper.findComponent(ProductFeedCardNextSyncCard).exists()).toBeTruthy();
  });
  it('shows button cancel and triggers previous step on click', async () => {
    const timeConverterToDate = jest.fn();
    localVue.filter('timeConverterToDate', timeConverterToDate);
    const timeConverterToHour = jest.fn();
    localVue.filter('timeConverterToHour', timeConverterToHour);
    const changeCountryCodeToName = jest.fn();
    changeCountryCodeToName.mockImplementation(() => []);
    localVue.filter('changeCountryCodeToName', changeCountryCodeToName);
    const wrapper = shallowMount(ProductFeedSettingsSummary, {
      propsData: Summary.args,
      beforeMount: Summary.args.beforeMount,
      localVue,
      store: new Vuex.Store(cloneStore()),
    });
    expect(wrapper.find('b-button').exists()).toBeTruthy();
    await expect(wrapper.find('b-button').trigger('click'));
    wrapper.vm.$emit('cancelProductFeedSettingsConfiguration');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('cancelProductFeedSettingsConfiguration')).toBeTruthy();
  });
});
