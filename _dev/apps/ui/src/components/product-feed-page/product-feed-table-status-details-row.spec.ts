import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount, MountOptions} from '@vue/test-utils';
import {BTd} from 'bootstrap-vue';
import {ProductInfos, ProductStatus} from '@/store/modules/product-feed/state';
import config, {
  localVue, cloneStore, addBootstrapToVue, addShowdownToVue,
} from '@/../tests/init';

import productFeedTableStatusDetailsRowVue from './product-feed-table-status-details-row.vue';

describe('product-feed-table-status-details-row.vue', () => {
  const buildWrapper = (
    options: MountOptions<any> = {},
  ) => {
    addBootstrapToVue();
    addShowdownToVue();
    const store = cloneStore();

    return mount(productFeedTableStatusDetailsRowVue, {
      localVue,
      store: new Vuex.Store(store),
      ...config,
      ...options,
    });
  };

  it('displays products errors', () => {
    // Arrange
    const product: ProductInfos = {
      id: '7990',
      attribute: '0',
      name: 'Psykokwak',
      language: 'fr',
      statuses: [
        {
          destination: 'Shopping',
          status: ProductStatus.Disapproved,
          countries: ['FR', 'IT', 'BE'],
        },
      ],
      issues: [
        {
          code: 'policy_enforcement_account_disapproval',
          servability: 'disapproved',
          resolution: 'merchant_action',
          destination: 'Shopping',
          description: 'Suspended account for policy violation',
          detail:
            'Remove products that violate our policies, or request a manual review',
          documentation:
            'https://support.google.com/merchants/answer/2948694',
          applicableCountries: ['BE'],
        },
      ],
    };

    // Act
    const wrapper = buildWrapper({
      propsData: {
        product,
        status: product.statuses[0],
        indexStatus: 0,
      },
    });

    // Assert
    const cells = wrapper.findAllComponents(BTd);
    expect(cells.length).toBe(7);

    expect(cells.at(0).text()).toEqual('7990');
    expect(cells.at(1).text()).toEqual('Psykokwak');

    const countrySpans = cells.at(2).findAll('span');
    expect(countrySpans.length).toEqual(3);
    expect(countrySpans.at(0).text()).toEqual('FR');
    expect(countrySpans.at(1).text()).toEqual('IT');
    expect(countrySpans.at(2).text()).toEqual('BE');

    expect(cells.at(3).text()).toEqual('fr');
    expect(cells.at(4).text()).toEqual('disapproved');

    const errorsList = cells.at(5).findAll('li');
    expect(errorsList.length).toEqual(1);
    expect(errorsList.at(0).text()).toEqual('Suspended account for policy violation');

    expect(cells.at(6).text()).toEqual('Shopping Ads');
  });

  it('suggests to the merchant to open the GMC website to check the errors on the account level', () => {
    // Arrange
    const product: ProductInfos = {
      id: '7990',
      attribute: '0',
      name: 'Psykokwak',
      language: 'fr',
      statuses: [
        {
          destination: 'Shopping',
          status: ProductStatus.Disapproved,
          countries: ['FR', 'IT', 'BE'],
        },
      ],
    };

    // Act
    const wrapper = buildWrapper({
      propsData: {
        product,
        status: product.statuses[0],
        indexStatus: 0,
      },
    });

    // Assert
    const cells = wrapper.findAllComponents(BTd);
    expect(cells.length).toBe(7);

    expect(cells.at(0).text()).toEqual('7990');
    expect(cells.at(1).text()).toEqual('Psykokwak');

    const countrySpans = cells.at(2).findAll('span');
    expect(countrySpans.length).toEqual(3);
    expect(countrySpans.at(0).text()).toEqual('FR');
    expect(countrySpans.at(1).text()).toEqual('IT');
    expect(countrySpans.at(2).text()).toEqual('BE');

    expect(cells.at(3).text()).toEqual('fr');
    expect(cells.at(4).text()).toEqual('disapproved');

    const errorsList = cells.at(5).findAll('li');
    expect(errorsList.length).toEqual(0);
    expect(cells.at(5).text()).toEqual('Not provided, check account errors on your Merchant Center.');

    expect(cells.at(6).text()).toEqual('Shopping Ads');
  });

  it('merges some cells with the upper line when statuses between for different destinations are the same', () => {
    // Arrange
    const product: ProductInfos = {
      id: '7990',
      attribute: '0',
      name: 'Psykokwak',
      language: 'fr',
      statuses: [
        {
          destination: 'Shopping',
          status: ProductStatus.Disapproved,
          countries: ['FR', 'IT', 'BE'],
        },
        {
          destination: 'SurfacesAcrossGoogle',
          status: ProductStatus.Disapproved,
          countries: ['FR', 'IT', 'BE'],
        },
      ],
      issues: [
        {
          // Content unecessary for the purpose of this test
        },
        {
          code: 'policy_enforcement_account_disapproval',
          servability: 'disapproved',
          resolution: 'merchant_action',
          destination: 'SurfacesAcrossGoogle',
          description: 'Another error',
          detail:
                'Remove products that violate our policies, or request a manual review',
          documentation:
                'https://support.google.com/merchants/answer/2948694',
          applicableCountries: ['BE'],
        },
      ],
    };

    // Act
    const wrapper = buildWrapper({
      propsData: {
        product,
        status: product.statuses[1],
        indexStatus: 1,
      },
    });

    // Assert
    const cells = wrapper.findAllComponents(BTd);
    expect(cells.length).toBe(2);
    expect(cells.at(0).text()).toEqual('Another error');
    expect(cells.at(1).text()).toEqual('Enhanced Free Listings');
  });
});
