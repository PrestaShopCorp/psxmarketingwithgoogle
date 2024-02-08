import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount, MountOptions} from '@vue/test-utils';
import {BCard, BTd} from 'bootstrap-vue';
import {ProductInfos, ProductStatus} from '@/store/modules/product-feed/state';
import config, {
  localVue, cloneStore, addBootstrapToVue, addShowdownToVue,
} from '@/../tests/init';

import DisapprovedProductsRow from './disapproved-products-row.vue';

describe('disapproved-products-row.vue', () => {
  const buildWrapper = (
    options: MountOptions<any> = {},
  ) => {
    addBootstrapToVue();
    addShowdownToVue();
    const store = cloneStore();

    return mount(DisapprovedProductsRow, {
      localVue,
      store: new Vuex.Store(store),
      ...config,
      ...options,
    });
  };

  it('displays products errors', () => {
    // Arrange
    const product: ProductInfos = {
      id: '7945',
      title: 'Blastoise',
      impacts: [{attribute: '0', currency: 'EUR', language: 'en'}],
      destinations: ['Shopping'],
      issues: [
        {
          title: 'Invalid value [gtin]',
          destination: 'Shopping',
          code: 'invalid_upc',
          affectedProperty: 'gtin',
          countries: ['FR', 'BE'],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            'https://support.google.com/merchants/answer/6239388',
          status: ProductStatus.Disapproved,
        },
      ],
    };

    // Act
    const wrapper = buildWrapper({
      propsData: {
        product,
      },
    });

    // Assert
    const cells = wrapper.findAllComponents(BTd);
    expect(cells.length).toBe(7);

    expect(cells.at(0).text()).toEqual('7945');
    expect(cells.at(1).text()).toEqual('Blastoise');
    const currencySpans = cells.at(2).findAllComponents(BCard);
    expect(currencySpans.length).toEqual(1);
    expect(currencySpans.at(0).text()).toEqual('EUR');

    const languageSpans = cells.at(3).findAllComponents(BCard);
    expect(languageSpans.length).toEqual(1);
    expect(languageSpans.at(0).text()).toEqual('en');

    const countrySpans = cells.at(4).findAllComponents(BCard);
    expect(countrySpans.length).toEqual(2);
    expect(countrySpans.at(0).text()).toEqual('France');
    expect(countrySpans.at(1).text()).toEqual('Belgium');

    const errorsList = cells.at(5).findAll('li');
    expect(errorsList.length).toEqual(1);
    expect(errorsList.at(0).text()).toEqual('Invalid value [gtin]');

    expect(cells.at(6).text()).toEqual('Learn more');
  });

  it('suggests to the merchant to open the GMC website to check the errors on the account level', () => {
    // Arrange
    const product: ProductInfos = {
      id: '7945',
      title: 'Blastoise',
      impacts: [{attribute: '0', currency: 'EUR', language: 'en'}],
      destinations: ['Shopping'],
    };

    // Act
    const wrapper = buildWrapper({
      propsData: {
        product,
      },
    });

    // Assert
    const cells = wrapper.findAllComponents(BTd);
    expect(cells.length).toBe(7);

    expect(cells.at(0).text()).toEqual('7945');
    expect(cells.at(1).text()).toEqual('Blastoise');
    const currencySpans = cells.at(2).findAllComponents(BCard);
    expect(currencySpans.length).toEqual(1);
    expect(currencySpans.at(0).text()).toEqual('EUR');

    const languageSpans = cells.at(3).findAllComponents(BCard);
    expect(languageSpans.length).toEqual(1);
    expect(languageSpans.at(0).text()).toEqual('en');

    const countrySpans = cells.at(4).findAllComponents(BCard);
    expect(countrySpans.length).toEqual(0);

    const errorsList = cells.at(5).findAll('li');
    expect(errorsList.length).toEqual(0);
    expect(cells.at(5).text()).toEqual('Not provided, check account errors on your Merchant Center.');

    expect(cells.at(6).text()).toEqual('Learn more');
  });

  it('List all the impacted currencies and languages', () => {
    // Arrange
    const product: ProductInfos = {
      id: '7945',
      title: 'Blastoise',
      impacts: [
        {attribute: '0', currency: 'EUR', language: 'de'},
        {attribute: '0', currency: 'GBP', language: 'en'},
        {attribute: '0', currency: 'EUR', language: 'fr'},
        {attribute: '0', currency: 'GBP', language: 'fr'},
        {attribute: '0', currency: 'SEK', language: 'en'},
      ],
      destinations: ['Shopping'],
      issues: [
        {
          title: 'Invalid value [gtin]',
          destination: 'Shopping',
          code: 'invalid_upc',
          affectedProperty: 'gtin',
          countries: ['FR', 'BE'],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            'https://support.google.com/merchants/answer/6239388',
          status: ProductStatus.Disapproved,
        },
      ],
    };

    // Act
    const wrapper = buildWrapper({
      propsData: {
        product,
      },
    });

    // Assert
    const cells = wrapper.findAllComponents(BTd);
    expect(cells.length).toBe(7);

    expect(cells.at(0).text()).toEqual('7945');
    expect(cells.at(1).text()).toEqual('Blastoise');
    const currencySpans = cells.at(2).findAllComponents(BCard);
    expect(currencySpans.length).toEqual(3);
    expect(currencySpans.at(0).text()).toEqual('EUR');
    expect(currencySpans.at(1).text()).toEqual('GBP');
    expect(currencySpans.at(2).text()).toEqual('SEK');

    const languageSpans = cells.at(3).findAllComponents(BCard);
    expect(languageSpans.length).toEqual(3);
    expect(languageSpans.at(0).text()).toEqual('de');
    expect(languageSpans.at(1).text()).toEqual('en');
    expect(languageSpans.at(2).text()).toEqual('fr');

    const countrySpans = cells.at(4).findAllComponents(BCard);
    expect(countrySpans.length).toEqual(2);
    expect(countrySpans.at(0).text()).toEqual('France');
    expect(countrySpans.at(1).text()).toEqual('Belgium');

    const errorsList = cells.at(5).findAll('li');
    expect(errorsList.length).toEqual(1);
    expect(errorsList.at(0).text()).toEqual('Invalid value [gtin]');

    expect(cells.at(6).text()).toEqual('Learn more');
  });

  it('Merges all variants currencies and languages', () => {
    // Arrange
    const product: ProductInfos = {
      id: '7945',
      title: 'Blastoise',
      impacts: [
        {attribute: '0', currency: 'EUR', language: 'en'},
        {attribute: '1', currency: 'EUR', language: 'en'},
        {attribute: '2', currency: 'EUR', language: 'en'},
        {attribute: '2', currency: 'EUR', language: 'fr'},
      ],
      destinations: ['Shopping'],
      issues: [
        {
          title: 'Invalid value [gtin]',
          destination: 'Shopping',
          code: 'invalid_upc',
          affectedProperty: 'gtin',
          countries: ['FR', 'BE'],
          advice: "Use your product's globally valid GTIN",
          documentationLink:
            'https://support.google.com/merchants/answer/6239388',
          status: ProductStatus.Disapproved,
        },
      ],
    };

    // Act
    const wrapper = buildWrapper({
      propsData: {
        product,
      },
    });

    // Assert
    const cells = wrapper.findAllComponents(BTd);
    expect(cells.length).toBe(7);

    expect(cells.at(0).text()).toEqual('7945');
    expect(cells.at(1).text()).toEqual('Blastoise');
    const currencySpans = cells.at(2).findAllComponents(BCard);
    expect(currencySpans.length).toEqual(1);
    expect(currencySpans.at(0).text()).toEqual('EUR');

    const languageSpans = cells.at(3).findAllComponents(BCard);
    expect(languageSpans.length).toEqual(2);
    expect(languageSpans.at(0).text()).toEqual('en');
    expect(languageSpans.at(1).text()).toEqual('fr');

    const countrySpans = cells.at(4).findAllComponents(BCard);
    expect(countrySpans.length).toEqual(2);
    expect(countrySpans.at(0).text()).toEqual('France');
    expect(countrySpans.at(1).text()).toEqual('Belgium');

    const errorsList = cells.at(5).findAll('li');
    expect(errorsList.length).toEqual(1);
    expect(errorsList.at(0).text()).toEqual('Invalid value [gtin]');

    expect(cells.at(6).text()).toEqual('Learn more');
  });
});
