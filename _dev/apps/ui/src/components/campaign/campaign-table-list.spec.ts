import Vuex from 'vuex';

// Import this file first to init mock on window
import cloneDeep from 'lodash.clonedeep';
import {shallowMount} from '@vue/test-utils';
import config, {localVue, cloneStore} from '@/../tests/init';

import {initialStateApp} from '../../../.storybook/mock/state-app';
import {googleAdsAccountChosen} from '../../../.storybook/mock/google-ads';
import {campaignWithUnhandledFilters, availableFilters} from '../../../.storybook/mock/campaigns';
import CampaignTableList from './campaign-table-list.vue';
import BannerCampaigns from '../commons/banner-campaigns.vue';

const VBTooltip = vi.fn();

/* TODO:
 * Display of campaign dates
 * Pagination display
 */

describe('CampaignTableList', () => {
  describe('Display of dates', () => {
    it.todo('should render when campaign has only a start date');
    it.todo('should render when campaign has start & end dates');
    it.todo('should render when campaign has ended');
  });

  describe('Pagination', () => {
    it.todo('should display the pagination controls');
    it.todo('handles an update of the current page');
    it.todo('handles an update of the page size');
    it.todo('calls the API when the parameters are updated');
  });
});
