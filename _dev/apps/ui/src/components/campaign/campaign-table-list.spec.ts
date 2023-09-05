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

describe('CampaignTableList', () => {
  describe('Display', () => {
    it.todo('is hidden when there is no campaigns');
    it.todo('is shown when campaigns are being fetched');
    it.todo('is shown when API failed');
    it.todo('is shown during loading');
  });

  describe('Header', () => {
    it.todo('has the proper number of columns');
    it.todo('has date + performance columns sortable');
    it.todo('adds a background color on performance columns');
  });

  describe('Sorting', () => {
    it.todo('has no sorting by default');
    it.todo('sets as Ascending on first clic');
    it.todo('sets as Descending when current sorting is Ascending');
    it.todo('sets as Ascending when current sorting is Descending');
    it.todo('allows only one column to be sorted')
  });

  describe('Pagination', () => {
    it.todo('should display the pagination controls');
    it.todo('handles an update of the current page');
    it.todo('handles an update of the page size');
    it.todo('calls the API when the parameters are updated');
  });
});
