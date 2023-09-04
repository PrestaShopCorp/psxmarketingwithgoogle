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
  describe('Header', () => {
    it.todo('has the proper number of columns');
    it.todo('has date + performance columns sortable');
    it.todo('adds a background color on performance columns');
  });

  describe('Pagination', () => {
    it.todo('should display the pagination controls');
    it.todo('handles an update of the current page');
    it.todo('handles an update of the page size');
    it.todo('calls the API when the parameters are updated');
  });
});
