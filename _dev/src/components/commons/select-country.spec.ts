/**
 * @jest-environment jsdom
 */

import Vuex from 'vuex';
import {mount} from '@vue/test-utils';
import config, {cloneStore} from '@/../tests/init';
import PsSelect from '@/components/commons/ps-select.vue';
import VueShowdown from 'vue-showdown';
import SelectCountry from '@/components/commons/select-country.vue';

describe('select countries', () => {
  const countries = ["Austria","Belgium","Finland","France","Germany","Greece","Ireland","Italy","Netherlands","Portugal","Slovakia","Spain"];
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
  it('should return a array with countries', async () => {
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

    const options = await wrapper.find('[data-test-id="ps-select-country"]').trigger('click');
    expect(wrapper.emitted('countrySelected')).toBeTruthy();
  });
});
