/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import cloneDeep from 'lodash.clonedeep';
import {shallowMount} from '@vue/test-utils';
import config, {localVue, cloneStore} from '@/../tests/init';

import {initialStateApp} from '../../../.storybook/mock/state-app';
import {googleAdsAccountChosen} from '../../../.storybook/mock/google-ads.js';
import {campaignWithUnhandledFilters} from '../../../.storybook/mock/smart-shopping-campaigns';
import SmartShoppingCampaignCreation from './smart-shopping-campaign-creation.vue';

const VBTooltip = jest.fn();

describe('smart-shopping-campaign-creation.vue - Campaign creation', () => {
  // TODO: Describe behavior of this component
});

describe('smart-shopping-campaign-creation.vue - Campaign edition', () => {
  // TODO: Describe behavior of this component
});

describe('smart-shopping-campaign-creation.vue - Campaign edition - Unhandled filters', () => {
  let store;
  let wrapper;
  const mockRoute = {
    name: 'campaign-edition',
  };
  beforeEach(() => {
    store = cloneStore();

    store.modules.productFeed.state.app = {
      ...cloneDeep(initialStateApp),
    };
    store.modules.productFeed.state.googleAds = {
      ...cloneDeep(googleAdsAccountChosen),
    };


    wrapper = shallowMount(SmartShoppingCampaignCreation, {
      localVue,
      store: new Vuex.Store(store),
      directives: {
        'b-tooltip': VBTooltip,
      },
      ...config,
      stubs: {
        VueShowdown: true,
      },
      mocks: {
        $route: mockRoute,
      },
      data() {
        return campaignWithUnhandledFilters;
      },
    });
  });

  it('should render the component', () => {
    expect(wrapper.isVisible()).toBe(true);
  });

  it('shows a warning message', () => {
    expect(wrapper.find('[data-test-id="unhandled-filters-alert"]').isVisible()).toBe(true);
  });

  it('disables the option about filters', () => {
    expect(wrapper.findAll('#campaign-products-filter-fieldset b-form-radio')).toHaveLength(2);

    expect(wrapper.findAll('#campaign-products-filter-fieldset b-form-radio').at(0).attributes('disabled')).toBeTruthy();
    expect(wrapper.findAll('#campaign-products-filter-fieldset b-form-radio').at(1).attributes('disabled')).toBeTruthy();
  });

  it('shows & disables the button "Select filters"', () => {
    expect(wrapper.find('#campaign-products-filter-fieldset b-button').isVisible()).toBe(true);
    expect(wrapper.find('#campaign-products-filter-fieldset b-button').attributes('disabled')).toBeTruthy();
  });
});
