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
      id: '7990',
      attribute: '0',
      name: 'Psykokwak',
      language: 'fr',
      currency: '💷',
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
      },
    });

    // Assert
    const cells = wrapper.findAllComponents(BTd);
    expect(cells.length).toBe(7);

    expect(cells.at(0).text()).toEqual('7990');
    expect(cells.at(1).text()).toEqual('Psykokwak');
    expect(cells.at(2).text()).toEqual('💷');
    expect(cells.at(3).text()).toEqual('fr');

    const countrySpans = cells.at(4).findAllComponents(BCard);
    expect(countrySpans.length).toEqual(3);
    expect(countrySpans.at(0).text()).toEqual('France');
    expect(countrySpans.at(1).text()).toEqual('Italy');
    expect(countrySpans.at(2).text()).toEqual('Belgium');

    const errorsList = cells.at(5).findAll('li');
    expect(errorsList.length).toEqual(1);
    expect(errorsList.at(0).text()).toEqual('Suspended account for policy violation');

    expect(cells.at(6).text()).toEqual('Learn more');
  });

  it('suggests to the merchant to open the GMC website to check the errors on the account level', () => {
    // Arrange
    const product: ProductInfos = {
      id: '7990',
      attribute: '0',
      name: 'Psykokwak',
      language: 'fr',
      currency: 'EUR',
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
      },
    });

    // Assert
    const cells = wrapper.findAllComponents(BTd);
    expect(cells.length).toBe(7);

    expect(cells.at(0).text()).toEqual('7990');
    expect(cells.at(1).text()).toEqual('Psykokwak');
    expect(cells.at(2).text()).toEqual('EUR');
    expect(cells.at(3).text()).toEqual('fr');

    const countrySpans = cells.at(4).findAllComponents(BCard);
    expect(countrySpans.length).toEqual(3);
    expect(countrySpans.at(0).text()).toEqual('France');
    expect(countrySpans.at(1).text()).toEqual('Italy');
    expect(countrySpans.at(2).text()).toEqual('Belgium');

    const errorsList = cells.at(5).findAll('li');
    expect(errorsList.length).toEqual(0);
    expect(cells.at(5).text()).toEqual('Not provided, check account errors on your Merchant Center.');

    expect(cells.at(6).text()).toEqual('Learn more');
  });
});
