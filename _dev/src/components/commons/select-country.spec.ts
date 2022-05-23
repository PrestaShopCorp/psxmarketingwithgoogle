/**
 * @jest-environment jsdom
 */

import Vuex from 'vuex';
import VueShowdown from 'vue-showdown';
import {mount} from '@vue/test-utils';
import config, {cloneStore} from '@/../tests/init';
import SelectCountry from '@/components/commons/select-country.vue';

describe('select countries', () => {
  const countries = [
    'Austria',
    'Belgium',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Ireland',
    'Italy',
    'Netherlands',
    'Portugal',
    'Slovakia',
    'Spain',
  ];
  let mutations;
  let store;
  beforeEach(() => {
    mutations = {
      SET_SELECTED_PRODUCT_FEED_SETTINGS: jest.fn(),
    };
    store = cloneStore();
    store.modules.productFeed.mutations = {
      ...store.modules.productFeed.mutations,
      ...mutations,
    };
  });
  it('should return an array with multiple countries', async () => {
    const wrapper = mount(SelectCountry, {
      ...config,
      store: new Vuex.Store(store),
      propsData: {
        dropdownOptions: countries,
        multipleCountries: true,
        defaultValue: ['FR'],
      },
      stubs: {
        VueShowdown: true,
      },
    });

    await wrapper.find('[data-test-id="ps-select-country"] [type="search"]').trigger('mousedown');
    const options = wrapper.findAll('[data-test-id="ps-select-country"] ul li');
    await options.at(0).trigger('click');

    expect(wrapper.vm.$data.countriesChosen).toEqual(['Austria']);
    expect(wrapper.emitted('countrySelected')).toBeTruthy();
    expect(options.at(0).find('div').text()).toBe('Austria');

    await options.at(1).trigger('click');
    expect(wrapper.vm.$data.countriesChosen).toEqual(['Austria', 'Belgium']);
  });

  it('should return an array with only one country', async () => {
    const wrapper = mount(SelectCountry, {
      ...config,
      store: new Vuex.Store(store),
      propsData: {
        dropdownOptions: countries,
        multipleCountries: false,
        defaultValue: ['FR'],
      },
      stubs: {
        VueShowdown: true,
      },
    });

    await wrapper.find('[data-test-id="ps-select-country"] [type="search"]').trigger('mousedown');
    const options = wrapper.findAll('[data-test-id="ps-select-country"] ul li');
    await options.at(0).trigger('click');

    expect(wrapper.vm.$data.countriesChosen).toEqual(['Austria']);
    expect(wrapper.emitted('countrySelected')).toBeTruthy();
    expect(options.at(0).find('div').text()).toBe('Austria');

    await options.at(1).trigger('click');
    expect(wrapper.vm.$data.countriesChosen).toEqual(['Belgium']);
  });
});
