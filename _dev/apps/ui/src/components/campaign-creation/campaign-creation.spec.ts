import Vuex from 'vuex';

// Import this file first to init mock on window
import cloneDeep from 'lodash.clonedeep';
import {MountOptions, shallowMount} from '@vue/test-utils';
import config, {localVue, cloneStore} from '@/../tests/init';

import {initialStateApp} from '@/../.storybook/mock/state-app';
import {googleAdsAccountChosen} from '@/../.storybook/mock/google-ads';
import {campaignWithUnhandledFilters, campaignWithoutUnhandledFilters, availableFilters} from '@/../.storybook/mock/campaigns';
import CampaignCreation from './campaign-creation.vue';
import {formatPrice} from '@/utils/Price';
import {deepCheckDimension} from '@/utils/SSCFilters';
import {RecommendedBudget} from '@/utils/CampaignsBudget';

const VBTooltip = vi.fn();
const buildWrapper = (
  options: MountOptions<any> = {},
) => {
  const store = cloneStore();

  store.modules.app.state = cloneDeep(initialStateApp);
  store.modules.googleAds.state = cloneDeep(googleAdsAccountChosen);

  store.modules.campaigns.state.sscAvailableFilters = cloneDeep(availableFilters)
    .map((dim) => deepCheckDimension(dim, false));
  store.modules.campaigns.state.dimensionChosen = deepCheckDimension(
    cloneDeep(availableFilters[0]),
    false,
  );
  store.modules.campaigns.state.errorCampaignNameExists = false;
  store.modules.googleAds.state = googleAdsAccountChosen;
  store.modules.campaigns.actions.GET_RECOMMENDED_BUDGET = vi.fn().mockImplementation(() => ({
    value: 15,
    currency: 'USD',
  }));

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
              values: ['ab'],
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

  it('shows how many products are elligible to the filter', async () => {
    wrapper.vm.updateDimensionCheckedValuesFromFiltersChosen();
    expect(wrapper.vm.totalProducts).toBe(10);
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

  describe('campaign-creation.vue - Campaign edition - Budget validation', () => {
    it('allows to continue when the budget is above the recommended one', () => {
      const wrapper = buildWrapper({
        data() {
          return {
            ...campaignWithUnhandledFilters,
            campaignDailyBudget: '20',
            recommendedBudget: {
              value: 10,
              currency: 'EUR',
            } as RecommendedBudget,
          };
        },
      });

      expect(wrapper.vm.campaignDailyBudgetFeedback).toEqual({
        result: true,
      });

      expect(wrapper.find('#campaign-daily-budget-fieldset').attributes('description')).toBe('The minimum for {country} is {budget}, ensuring sufficient reach for your campaign in this region.');
      expect(wrapper.find('#campaign-daily-budget-fieldset').attributes('invalid-feedback')).toBeUndefined();
    });

    it('forbids to continue when the value is not a number', () => {
      const wrapper = buildWrapper({
        data() {
          return {
            ...campaignWithUnhandledFilters,
            campaignDailyBudget: '🪲',
            recommendedBudget: {
              currency: 'EUR',
              value: 10,
            } as RecommendedBudget,
          };
        },
      });

      expect(wrapper.vm.campaignDailyBudgetFeedback).toEqual({
        result: false,
        error: 'Your daily budget must be a valid number greater than 1. For any decimal number, please use a dot as separator.',
      });

      // Display the error only, not the initial description
      expect(wrapper.find('#campaign-daily-budget-fieldset').attributes('description')).toBe(undefined);
      expect(wrapper.find('#campaign-daily-budget-fieldset').attributes('invalid-feedback')).toBe('Your daily budget must be a valid number greater than 1. For any decimal number, please use a dot as separator.');
    });

    it('forbids to continue when the value is below the minimum recommended budget', () => {
      const wrapper = buildWrapper({
        data() {
          return {
            ...campaignWithUnhandledFilters,
            campaignDailyBudget: '10',
            recommendedBudget: {
              currency: 'EUR',
              value: 120,
            } as RecommendedBudget,
          };
        },
      });

      expect(wrapper.vm.campaignDailyBudgetFeedback).toEqual({
        result: false,
        error: 'Minimum budget required for this target country is {budget}. Please increase your budget to continue.',
      });

      // Display the error only, not the initial description
      expect(wrapper.find('#campaign-daily-budget-fieldset').attributes('description')).toBe(undefined);
      expect(wrapper.find('#campaign-daily-budget-fieldset').attributes('invalid-feedback')).toBe('Minimum budget required for this target country is {budget}. Please increase your budget to continue.');
    });

    it('says nothing when recommended budget is not loaded', () => {
      const wrapper = buildWrapper({
        data() {
          return {
            ...campaignWithUnhandledFilters,
            campaignDailyBudget: '10',
            recommendedBudget: null,
          };
        },
      });

      expect(wrapper.vm.campaignDailyBudgetFeedback).toEqual({
        result: null,
      });

      expect(wrapper.find('#campaign-daily-budget-fieldset').attributes('description')).toBe('[AWAITING VALIDATION] The minimum budget varies based on your target country. Please select a country to see the exact minimum required.');
      expect(wrapper.find('#campaign-daily-budget-fieldset').attributes('invalid-feedback')).toBeUndefined();
    });

    it('says nothing when input is empty', () => {
      const wrapper = buildWrapper({
        data() {
          return {
            ...campaignWithUnhandledFilters,
            campaignDailyBudget: '',
            recommendedBudget: {
              currency: 'EUR',
              value: 120,
            } as RecommendedBudget,
          };
        },
      });

      expect(wrapper.vm.campaignDailyBudgetFeedback).toEqual({
        result: null,
      });

      expect(wrapper.find('#campaign-daily-budget-fieldset').attributes('description')).toBe('The minimum for {country} is {budget}, ensuring sufficient reach for your campaign in this region.');
      expect(wrapper.find('#campaign-daily-budget-fieldset').attributes('invalid-feedback')).toBeUndefined();
    });
  });
});
