/**
 * @jest-environment jsdom
 */
import {mount} from '@vue/test-utils';
import Vuex from 'vuex';
import config, {localVue, cloneStore} from '@/../tests/init';
import TargetCountries from '@/components/product-feed/settings/delivery-time-and-rates/target-countries.vue';

describe('target-countries.vue', () => {
  it('removes countries from the selection if they are not part of the options', async () => {
    const store = cloneStore();
    store.modules.app.state.psxMktgWithGoogleShopCurrency.isoCode = 'EUR';

    const wrapper = mount(TargetCountries, {
      propsData: {
        countries: ['FR', 'US', 'LEULEU'],
      },
      ...config,
      localVue,
      store: new Vuex.Store(store),
    });

    await wrapper.vm.$nextTick();

    const emittedEvents = wrapper.emitted('countrySelected');
    // The update of the list should be updated to keep only France
    expect(emittedEvents).toBeTruthy();
    expect((emittedEvents as any[]).length).toBe(1);
    expect((emittedEvents as any[])[0]).toEqual([['FR']]);
  });
});
