/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import cloneDeep from 'lodash.clonedeep';
import {mount, shallowMount} from '@vue/test-utils';
import config, {localVue, cloneStore} from '@/../tests/init';

import {initialStateApp} from '../../../.storybook/mock/state-app';
import {googleAdsAccountChosen} from '../../../.storybook/mock/google-ads';
import {campaignWithUnhandledFilters, availableFilters} from '../../../.storybook/mock/campaigns';
import CampaignTableList from './campaign-table-list.vue';
import BannerCampaigns from '../commons/banner-campaigns.vue';

const VBTooltip = jest.fn();

describe('campaign-table-list.vue - display banner SSC ads if user is configured and has no campaigns', () => {
  let store;
  let wrapper;
  const mockRoute = {
    name: 'campaign-list',
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

    wrapper = shallowMount(CampaignTableList, {
      propsData: {
        inNeedOfConfiguration: false,
        loading: false,
      },
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
    });
  });

  it('should render the component', () => {
    expect(wrapper.isVisible()).toBe(true);
  });
  it('should display banner', () => {
    expect(wrapper.findComponent(BannerCampaigns).exists()).toBeTruthy();
  });
  it('should hide buttons', () => {
    expect(wrapper.find('[data-test-id="redirect-to-reporting-button"]').exists()).toBeFalsy();
    expect(wrapper.find('[data-test-id="create-campaign-button"]').exists()).toBeFalsy();
  });
});

describe('campaign-table-list.vue - hide banner SSC ads if user is not configured', () => {
  let store;
  let wrapper;
  const mockRoute = {
    name: 'campaign-list',
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

    wrapper = shallowMount(CampaignTableList, {
      propsData: {
        inNeedOfConfiguration: true,
        loading: false,
      },
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
    });
  });

  it('should render the component', () => {
    expect(wrapper.isVisible()).toBe(true);
  });
  it('should hide banner', () => {
    expect(wrapper.findComponent(BannerCampaigns).exists()).toBeFalsy();
  });
  it('should hide buttons', () => {
    expect(wrapper.find('[data-test-id="redirect-to-reporting-button"]').exists()).toBeFalsy();
    expect(wrapper.find('[data-test-id="create-campaign-button"]').exists()).toBeFalsy();
  });
});

describe('campaign-table-list.vue - show banner SSC ads if user has campaigns', () => {
  let store;
  let wrapper;
  const mockRoute = {
    name: 'campaign-list',
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
    store.modules.campaigns.state.campaigns.campaignsList = [campaignWithUnhandledFilters];

    wrapper = shallowMount(CampaignTableList, {
      propsData: {
        inNeedOfConfiguration: false,
        loading: false,
      },
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
    });
  });

  it('should render the component', () => {
    expect(wrapper.isVisible()).toBe(true);
  });
  it('should show banner', () => {
    expect(wrapper.findComponent(BannerCampaigns).exists()).toBeTruthy();
  });
  it('should display only go to reporting button', () => {
    expect(wrapper.find('[data-test-id="redirect-to-reporting-button"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-test-id="create-campaign-button"]').exists()).toBeFalsy();
  });
});
