/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import cloneDeep from 'lodash.clonedeep';
import {MountOptions, shallowMount} from '@vue/test-utils';
import config, {localVue, cloneStore} from '@/../tests/init';

import {initialStateApp} from '../../../.storybook/mock/state-app';
import {googleAdsAccountChosen} from '../../../.storybook/mock/google-ads';
import {campaignWithUnhandledFilters, campaignWithoutUnhandledFilters, availableFilters} from '../../../.storybook/mock/campaigns';
import CampaignCreation from './campaign-creation.vue';
import {formatPrice} from '@/utils/Price';

const VBTooltip = jest.fn();
const buildWrapper = (
  options: MountOptions<any> = {},
) => {
  const store = cloneStore();

  store.modules.app.state = cloneDeep(initialStateApp);
  store.modules.googleAds.state = cloneDeep(googleAdsAccountChosen);

  store.modules.campaigns.state.sscAvailableFilters = availableFilters;
  store.modules.campaigns.state.errorCampaignNameExists = false;
  store.modules.googleAds.state = googleAdsAccountChosen;

  localVue.filter('formatPrice', formatPrice);

  return shallowMount(CampaignCreation, {
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
      $route: {
        name: 'campaign-edition',
        params: {
          type: 'PERFORMANCE_MAX',
        },
      },
    },
    ...options,
  });
};

describe('campaign-creation.vue - Campaign creation', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = buildWrapper({
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

  it('should display the proper currency', async () => {
    const inputGroup = wrapper.find('[data-test-id="campaign-dailyBudget-input-group"]');
    expect(inputGroup.attributes('prepend')).toEqual('€');
    expect(inputGroup.attributes('append')).toEqual('EUR');

    wrapper.vm.$store.state.googleAds.accountChosen.currencyCode = 'USD';
    await wrapper.vm.$nextTick();

    const inputGroupWithDollars = wrapper.find('[data-test-id="campaign-dailyBudget-input-group"]');
    expect(inputGroupWithDollars.attributes('prepend')).toEqual('$');
    expect(inputGroupWithDollars.attributes('append')).toEqual('USD');
  });
});

describe('campaign-creation.vue - Campaign edition', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = buildWrapper({
      mocks: {
        $route: {
          name: 'campaign-edition',
          params: {
            type: 'SMART_SHOPPING_CAMPAIGN',
          },
        },
      },
      data() {
        return {
          ...campaignWithoutUnhandledFilters,
          campaignHasNoProductsFilter: false,
        };
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
  let wrapper;

  beforeEach(() => {
    wrapper = buildWrapper({
      data() {
        return {
          ...campaignWithoutUnhandledFilters,
          campaignHasNoProductsFilter: false,
        };
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
  let wrapper;

  beforeEach(() => {
    wrapper = buildWrapper({
      data() {
        return {
          ...campaignWithUnhandledFilters,
          campaignHasNoProductsFilter: false,
        };
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

describe('campaign-creation.vue - Campaign edition - End date validation', () => {
  it('allows to continue when end date is not set', async () => {
    const wrapper = buildWrapper({
      data() {
        return {
          ...campaignWithUnhandledFilters,
          campaignDurationStartDate: 'Fri Oct 01 2021 01:00:00 GMT+0100 (heure d’été britannique)',
          campaignDurationEndDate: null,
        };
      },
    });
    await wrapper.setData({
      recommendedBudget: {
        value: 10,
        currency: 'EUR',
      },
    });
    expect(wrapper.vm.campaignEndDateFeedback).toBe(null);
    expect(wrapper.find('[data-test-id="createCampaignButton"]').attributes('disabled')).toBeFalsy();
  });

  it('allows to continue when end date is acceptable', async () => {
    const wrapper = buildWrapper({
      data() {
        return {
          ...campaignWithUnhandledFilters,
          campaignDurationStartDate: 'Fri Oct 01 2021 01:00:00 GMT+0100 (heure d’été britannique)',
          // Year 3999 to make sure it always in the future
          campaignDurationEndDate: 'Fri Oct 11 3999 01:00:00 GMT+0100 (heure d’été britannique)',
        };
      },
    });
    await wrapper.setData({
      recommendedBudget: {
        value: 10,
        currency: 'EUR',
      },
    });
    expect(wrapper.vm.campaignEndDateFeedback).toBe(null);
    expect(wrapper.find('[data-test-id="createCampaignButton"]').attributes('disabled')).toBeFalsy();
  });

  it('warns merchant & prevents sending the form when end date does not match requierements', () => {
    const wrapper = buildWrapper({
      data() {
        return {
          ...campaignWithUnhandledFilters,
          campaignDurationStartDate: 'Fri Oct 01 2021 01:00:00 GMT+0100 (heure d’été britannique)',
          campaignDurationEndDate: 'Fri Oct 11 2021 01:00:00 GMT+0100 (heure d’été britannique)',
        };
      },
    });
    expect(wrapper.vm.campaignEndDateFeedback).toBe(false);
    expect(wrapper.find('[data-test-id="createCampaignButton"]').attributes('disabled')).toBeTruthy();
  });
});

describe('campaign-creation.vue - Campaign edition - Name validation', () => {
  it('forbids to continue when the name is too long', () => {
    // 42 * 3 > 125, will trigger the error
    const nameTooLong = 'wow'.repeat(42);

    const wrapper = buildWrapper({
      data() {
        return {
          ...campaignWithUnhandledFilters,
          campaignName: nameTooLong,
        };
      },
    });
    expect(wrapper.vm.campaignNameFeedback).toBe(false);
    expect(wrapper.vm.campaignNameFeedbackMessage).toBe('The name must be less than 125 characters in length.');
    expect(wrapper.find('[data-test-id="createCampaignButton"]').attributes('disabled')).toBeTruthy();
  });
});
