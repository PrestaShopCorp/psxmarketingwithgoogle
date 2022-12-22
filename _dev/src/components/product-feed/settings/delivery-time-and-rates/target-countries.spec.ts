/**
 * @jest-environment jsdom
 */
import {mount, MountOptions} from '@vue/test-utils';
import Vuex from 'vuex';
import cloneDeep from 'lodash.clonedeep';
import config, {localVue, cloneStore} from '@/../tests/init';
import TargetCountries from '@/components/product-feed/settings/delivery-time-and-rates/target-countries.vue';
import {ShippingSetupOption} from '../../../../enums/product-feed/shipping';
import {productFeed} from '@/../.storybook/mock/product-feed';

const buildWrapper = (
  options: MountOptions<any> = {},
) => mount(TargetCountries, {
  ...config,
  localVue,
  ...options,
});

describe('target-countries.vue', () => {
  it('removes countries from the selection if they are not part of the options', async () => {
    const store = cloneStore();
    store.modules.app.state.psxMktgWithGoogleActiveCountries = ['FR', 'US'];
    store.modules.app.state.psxMktgWithGoogleShopCurrency.isoCode = 'EUR';

    const wrapper = buildWrapper({
      propsData: {
        countries: ['FR', 'US', 'LEULEU'],
      },
      store: new Vuex.Store(store),
    });

    // The update of the list should be updated to keep only France and United States
    expect(wrapper.vm.validCountriesNames).toEqual(['France', 'United States']);
  });
});

describe('target-countries.vue / Estimating carriers', () => {
  it('allows to select any countries related to the currency (EUR)', () => {
    const store = cloneStore();
    store.modules.app.state.psxMktgWithGoogleShopCurrency.isoCode = 'EUR';
    store.modules.app.state.psxMktgWithGoogleActiveCountries = [
      'AT',
      'BE',
      'FI',
      'FR',
      'ES',
      'DE',
      'GR',
      'IE',
      'IT',
      'NL',
      'PT',
      'SK',
      'ES',
    ];

    const wrapper = buildWrapper({
      propsData: {
        countries: [],
        shippingSetupOption: ShippingSetupOption.ESTIMATE,
      },
      store: new Vuex.Store(store),
    });

    const listOfAcceptableCountries = wrapper.vm.selectableCountriesList;
    expect(listOfAcceptableCountries).toEqual([
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
    ]);
  });

  it('allows to select any countries related to the currency (USD)', () => {
    const store = cloneStore();
    store.modules.app.state.psxMktgWithGoogleShopCurrency.isoCode = 'USD';
    store.modules.app.state.psxMktgWithGoogleActiveCountries = [
      'EC',
      'SV',
      'PR',
      'US',
      'ZW',
    ];

    const wrapper = buildWrapper({
      propsData: {
        countries: [],
        shippingSetupOption: ShippingSetupOption.ESTIMATE,
      },
      store: new Vuex.Store(store),
    });

    const listOfAcceptableCountries = wrapper.vm.selectableCountriesList;
    expect(listOfAcceptableCountries).toEqual([
      'Ecuador',
      'El Salvador',
      'Puerto Rico',
      'United States',
      'Zimbabwe',
    ]);
  });

  it('allows to select any countries related to the currency (SEK)', () => {
    const store = cloneStore();
    store.modules.app.state.psxMktgWithGoogleShopCurrency.isoCode = 'SEK';
    store.modules.app.state.psxMktgWithGoogleActiveCountries = [
      'SE',
    ];

    const wrapper = buildWrapper({
      propsData: {
        countries: [],
        shippingSetupOption: ShippingSetupOption.ESTIMATE,
      },
      store: new Vuex.Store(store),
    });

    const listOfAcceptableCountries = wrapper.vm.selectableCountriesList;
    expect(listOfAcceptableCountries).toEqual([
      'Sweden',
    ]);
  });

  it('should display the Tax panel only when US is selected', () => testCheckingTaxPanelIsVisible(ShippingSetupOption.ESTIMATE));
});

describe('target-countries.vue / Importing carriers', () => {
  it('shows only countries that are related to a carrier on the shop', () => {
    const store = cloneStore();
    store.modules.app.state.psxMktgWithGoogleShopCurrency.isoCode = 'EUR';
    store.modules.productFeed.state = cloneDeep(productFeed);
    store.modules.app.state.psxMktgWithGoogleActiveCountries = [
      'FR',
      'IT',
    ];

    const wrapper = buildWrapper({
      propsData: {
        countries: [],
        shippingSetupOption: ShippingSetupOption.IMPORT,
      },
      store: new Vuex.Store(store),
    });

    const listOfAcceptableCountries = wrapper.vm.selectableCountriesList;
    expect(listOfAcceptableCountries).toEqual([
      'France',
      'Italy',
    ]);
  });

  it('should display the Tax panel only when US is selected', () => testCheckingTaxPanelIsVisible(ShippingSetupOption.IMPORT));
});

describe('target-countries.vue / Campaign form', () => {
  it('shows all countries', () => {
    const wrapper = buildWrapper({
      propsData: {
        countries: [],
      },
      store: new Vuex.Store(cloneStore()),
    });

    const listOfAcceptableCountries = wrapper.vm.selectableCountriesList;
    expect(listOfAcceptableCountries).toEqual([
      'Algéria',
      'Angola',
      'Argentina',
      'Australia',
      'Austria',
      'Bahrain',
      'Bangladesh',
      'Belarus',
      'Belgium',
      'Brazil',
      'Cambodia',
      'Cameroon',
      'Canada',
      'Chile',
      'Colombia',
      'Costa Rica',
      'Ivory Coast',
      'Czechia',
      'Denmark',
      'Dominican Republic',
      'Ecuador',
      'Egypt',
      'El Salvador',
      'Ethiopia',
      'Finland',
      'France',
      'Georgia',
      'Germany',
      'Ghana',
      'Greece',
      'Guatemala',
      'HongKong',
      'Hungary',
      'India',
      'Indonesia',
      'Ireland',
      'Israel',
      'Italy',
      'Japan',
      'Jordan',
      'Kazakhstan',
      'Kenya',
      'Kuwait',
      'Lebanon',
      'Madagascar',
      'Malaysia',
      'Mauritius',
      'Mexico',
      'Morocco',
      'Mozambique',
      'Burma (Myanmar)',
      'Nepal',
      'Netherlands',
      'New Zealand',
      'Nicaragua',
      'Nigeria',
      'Norway',
      'Oman',
      'Pakistan',
      'Panama',
      'Paraguay',
      'Peru',
      'Philippines',
      'Poland',
      'Portugal',
      'Puerto Rico',
      'Romania',
      'Russia',
      'Saudi Arabia',
      'Senegal',
      'Singapore',
      'Slovakia',
      'South Africa',
      'South Korea',
      'Spain',
      'Sri Lanka',
      'Sweden',
      'Switzerland',
      'Taiwan',
      'Tanzania',
      'Thailand',
      'Tunisia',
      'Turkey',
      'Uganda',
      'Ukraine',
      'United Arab Emirates',
      'United Kingdom',
      'United States',
      'Uruguay',
      'Uzbekistan',
      'Venezuela',
      'Vietnam',
      'Zambia',
      'Zimbabwe',
    ]);
  });

  it('never displays the Tax panel', () => {
    const store = cloneStore();
    store.modules.app.state.psxMktgWithGoogleShopCurrency.isoCode = 'USD';

    const wrapper = buildWrapper({
      propsData: {
        countries: ['US'],
        shippingSetupOption: null,
      },
      store: new Vuex.Store(store),
    });

    expect(wrapper.find('[data-test-id="configureTax"]').exists()).toBeFalsy();
  });
});

const testCheckingTaxPanelIsVisible = async (method: ShippingSetupOption) => {
  const store = cloneStore();
  store.modules.app.state.psxMktgWithGoogleShopCurrency.isoCode = 'USD';
  store.modules.app.state.psxMktgWithGoogleActiveCountries = [
    'EC',
    'US',
  ];

  const wrapper = buildWrapper({
    propsData: {
      countries: [],
      shippingSetupOption: method,
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
};
