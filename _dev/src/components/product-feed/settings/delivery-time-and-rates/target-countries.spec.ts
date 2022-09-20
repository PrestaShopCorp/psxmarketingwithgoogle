/**
 * @jest-environment jsdom
 */
import {mount, MountOptions} from '@vue/test-utils';
import Vuex from 'vuex';
import config, {localVue, cloneStore} from '@/../tests/init';
import TargetCountries from '@/components/product-feed/settings/delivery-time-and-rates/target-countries.vue';

const buildWrapper = (
  options: MountOptions<any> = {},
) => {
  return mount(TargetCountries, {
    propsData: {
      countries: ['FR', 'US', 'LEULEU'],
    },
    ...config,
    localVue,
    ...options,
  });
};

describe('target-countries.vue', () => {
  it('removes countries from the selection if they are not part of the options', async () => {
    const store = cloneStore();
    store.modules.app.state.psxMktgWithGoogleShopCurrency.isoCode = 'EUR';

    const wrapper = buildWrapper({
      propsData: {
        countries: ['FR', 'US', 'LEULEU'],
      },
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

describe('target-countries.vue / Estimating carriers', () => {
  it.todo('allows all countries related to the currency');

  it('should display the Tax panel only when US is selected', async () => {
    const store = cloneStore();
    store.modules.app.state.psxMktgWithGoogleShopCurrency.isoCode = 'USD';

    const wrapper = buildWrapper({
      propsData: {
        countries: [],
      },
      store: new Vuex.Store(store),
    });
    await wrapper.vm.$nextTick();

    // Without value, should not be visible
    expect(wrapper.find('[data-test-id="configureTax"]').exists()).toBeFalsy();

    // With any other country, should not be visible
    wrapper.setProps({countries: ['EC']});
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-test-id="configureTax"]').exists()).toBeFalsy();

    // After selecting US, should be visible
    wrapper.setProps({countries: ['US']});
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-test-id="configureTax"]').exists()).toBeTruthy();
  });
});

describe('target-countries.vue / Importing carriers', () => {
  it.todo('shows only countries that are related to a carrier on the shop');
});

describe('target-countries.vue / Campaign form', () => {
  it.todo('shows all countries');
  it.todo('never displays the Tax alert');
});