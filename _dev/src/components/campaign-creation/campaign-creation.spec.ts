/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import cloneDeep from 'lodash.clonedeep';
import {mount, shallowMount} from '@vue/test-utils';
import config, {localVue, cloneStore} from '@/../tests/init';

import {initialStateApp} from '../../../.storybook/mock/state-app';
import {googleAdsAccountChosen} from '../../../.storybook/mock/google-ads.js';
import {campaignWithUnhandledFilters, campaignWithoutUnhandledFilters, availableFilters} from '../../../.storybook/mock/campaigns';
import CampaignCreation from './campaign-creation.vue';

const VBTooltip = jest.fn();

describe('campaign-creation.vue - Campaign creation', () => {
  let store;
  let wrapper;
  const mockRoute = {
    name: 'campaign-creation',
    params: {
      type: 'SHOPPING_CAMPAIGN',
    },
  };
  beforeEach(() => {
    store = cloneStore();

    store.modules.productFeed.state.app = {
      ...cloneDeep(initialStateApp),
    };
    store.modules.productFeed.state.googleAds = {
      ...cloneDeep(googleAdsAccountChosen),
    };

    store.modules.campaigns.state.sscAvailableFilters = availableFilters;

    wrapper = shallowMount(CampaignCreation, {
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
        return campaignWithoutUnhandledFilters;
      },
    });
  });

  it('should render the component', () => {
    expect(wrapper.isVisible()).toBe(true);
  });

  it('should have all inputs to null', () => {
    expect(wrapper.find('[data-test-id="campaign-name-input"]').text()).toEqual('');
    expect(wrapper.find('[data-test-id="campaign-dailyBudget-input"]').text()).toEqual('');
  });
});

describe('campaign-creation.vue - Campaign edition', () => {
  let store;
  let wrapper;
  const mockRoute = {
    name: 'campaign-edition',
    params: {
      type: 'SMART_SHOPPING_CAMPAIGN',
    },
  };
  beforeEach(() => {
    store = cloneStore();

    store.modules.productFeed.state.app = {
      ...cloneDeep(initialStateApp),
    };
    store.modules.productFeed.state.googleAds = {
      ...cloneDeep(googleAdsAccountChosen),
    };

    store.modules.campaigns.state.sscAvailableFilters = availableFilters;

    wrapper = shallowMount(CampaignCreation, {
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
        return campaignWithoutUnhandledFilters;
      },
      computed: {
        filtersChosen() {
          return [
            {
              dimension: 'categories',
              values: ['42'],
            },
          ];
        },
        productsHaveBeenApprovedByGoogle() {
          return true;
        },
      },
    });
  });

  it('should render the component', () => {
    expect(wrapper.isVisible()).toBe(true);
  });

  it('shows the button "Select filters" as filters are chosen', () => {
    expect(wrapper.find('#campaign-products-filter-fieldset b-button').isVisible()).toBe(true);
    expect(wrapper.find('#campaign-products-filter-fieldset b-button').attributes('disabled')).toBeFalsy();
  });
});

describe('campaign-creation.vue - Campaign edition - No active products', () => {
  let store;
  let wrapper;
  const mockRoute = {
    name: 'campaign-edition',
    params: {
      type: 'PERFORMANCE_MAX',
    },
  };
  beforeEach(() => {
    store = cloneStore();

    store.modules.productFeed.state.app = {
      ...cloneDeep(initialStateApp),
    };
    store.modules.productFeed.state.googleAds = {
      ...cloneDeep(googleAdsAccountChosen),
    };

    store.modules.campaigns.state.sscAvailableFilters = availableFilters;

    wrapper = shallowMount(CampaignCreation, {
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
        return campaignWithoutUnhandledFilters;
      },
      computed: {
        filtersChosen() {
          return [
            {
              dimension: 'categories',
              values: ['42'],
            },
          ];
        },
        productsHaveBeenApprovedByGoogle() {
          return false;
        },
      },
    });
  });

  it('should render the component', () => {
    expect(wrapper.isVisible()).toBe(true);
  });

  it('shows & disables the button "Select filters"', () => {
    expect(wrapper.find('#campaign-products-filter-fieldset b-button').isVisible()).toBe(true);
    expect(wrapper.find('#campaign-products-filter-fieldset b-button').attributes('disabled')).toBeTruthy();
  });
});

describe('campaign-creation.vue - Campaign edition - Unhandled filters', () => {
  let store;
  let wrapper;
  const mockRoute = {
    name: 'campaign-edition',
    params: {
      type: 'PERFORMANCE_MAX',
    },
  };
  beforeEach(() => {
    store = cloneStore();

    store.modules.productFeed.state.app = {
      ...cloneDeep(initialStateApp),
    };
    store.modules.productFeed.state.googleAds = {
      ...cloneDeep(googleAdsAccountChosen),
    };

    wrapper = shallowMount(CampaignCreation, {
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
      computed: {
        filtersChosen() {
          return [
            {
              dimension: 'categories',
              values: ['42'],
            },
          ];
        },
        productsHaveBeenApprovedByGoogle() {
          return true;
        },
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
