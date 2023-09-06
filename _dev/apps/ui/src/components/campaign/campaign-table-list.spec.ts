import Vuex from 'vuex';

// Import this file first to init mock on window
import {MountOptions, Wrapper, mount} from '@vue/test-utils';
import {
  BButton, BCard, BSkeleton, BTh,
} from 'bootstrap-vue';
import config, {localVue, cloneStore, addBootstrapToVue} from '@/../tests/init';

import CampaignTableList from './campaign-table-list.vue';
import {campaigns} from '@/../.storybook/mock/campaigns-list';
import campaignTableListRowVue from './campaign-table-list-row.vue';
import tableApiErrorVue from '../commons/table-api-error.vue';
import KpiType from '@/enums/reporting/KpiType';
import QueryOrderDirection from '@/enums/reporting/QueryOrderDirection';
import CampaignSummaryListHeaderType from '../../enums/campaigns-summary/CampaignSummaryListHeaderType';
import tablePageControlsVue from '../commons/table-page-controls.vue';

const buildDefaultStore = (): ReturnType<typeof cloneStore> => {
  const store = cloneStore();
  store.modules.campaigns.state.campaigns.results.campaigns = campaigns;
  store.modules.campaigns.state.campaigns.results.totalCount = 123;

  store.modules.campaigns.actions.GET_DIMENSIONS_FILTERS = vi.fn();
  store.modules.campaigns.actions.GET_CAMPAIGNS_LIST = vi.fn();
  return store;
};

const buildWrapper = (
  options: MountOptions<any> = {},
  store: ReturnType<typeof cloneStore> = buildDefaultStore(),
) => mount(CampaignTableList, {
  localVue,
  store: new Vuex.Store(store),
  ...config,
  ...options,
});

describe('CampaignTableList', () => {
  beforeEach(() => {
    addBootstrapToVue();
  });

  describe('Display', () => {
    it('is shown by default', () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });

      // Overall card
      expect(wrapper.findComponent(BCard).exists()).toBe(true);

      // Error card
      expect(wrapper.findComponent(tableApiErrorVue).exists()).toBe(false);

      // Loading state
      expect(wrapper.findAllComponents(BSkeleton)).toHaveLength(0);

      // Campaigns data
      const tableRows = wrapper.findAllComponents(campaignTableListRowVue);
      expect(tableRows).toHaveLength(6);
      expect(tableRows.at(2).props('campaign')).toEqual(campaigns[2]);
    });

    it('is shown when campaigns are being fetched', async () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });
      await wrapper.setData({
        fetchingCampaigns: true,
      });

      // Overall card
      expect(wrapper.findComponent(BCard).exists()).toBe(true);

      // Error card
      expect(wrapper.findComponent(tableApiErrorVue).exists()).toBe(false);

      // Loading state
      const numberOfCells = (1 + 10) * 11;
      expect(wrapper.findAllComponents(BSkeleton)).toHaveLength(numberOfCells);

      // Campaigns data
      expect(wrapper.findAllComponents(campaignTableListRowVue)).toHaveLength(0);
    });

    it('is shown when API failed', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.campaigns.results.error = true;
      store.modules.campaigns.state.campaigns.results.campaigns = [];
      store.modules.campaigns.state.campaigns.results.totalCount = 0;

      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      }, store);

      // Overall card
      expect(wrapper.findComponent(BCard).exists()).toBe(true);

      // Error card
      expect(wrapper.findComponent(tableApiErrorVue).exists()).toBe(true);

      // Loading state
      expect(wrapper.findAllComponents(BSkeleton)).toHaveLength(0);

      // Campaigns data
      expect(wrapper.findAllComponents(campaignTableListRowVue)).toHaveLength(0);
    });

    it('is shown during loading', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.campaigns.results.error = true;
      store.modules.campaigns.state.campaigns.results.campaigns = [];
      store.modules.campaigns.state.campaigns.results.totalCount = 0;

      const wrapper = buildWrapper({
        propsData: {
          loading: true,
        },
      }, store);

      // Overall card
      expect(wrapper.findComponent(BCard).exists()).toBe(true);

      // Error card
      expect(wrapper.findComponent(tableApiErrorVue).exists()).toBe(false);

      // Loading state
      const numberOfCells = (1 + 10) * 11;
      expect(wrapper.findAllComponents(BSkeleton)).toHaveLength(numberOfCells);

      // Campaigns data
      expect(wrapper.findAllComponents(campaignTableListRowVue)).toHaveLength(0);
    });

    it('is hidden when there is no campaigns', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.campaigns.results.campaigns = [];
      store.modules.campaigns.state.campaigns.results.totalCount = 0;

      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      }, store);

      expect(wrapper.findComponent(BCard).exists()).toBe(false);
    });
  });

  describe('Header', () => {
    it('has the proper number of columns', () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });

      const headerCells = wrapper.findAllComponents(BTh);

      expect(headerCells).toHaveLength(11);
      expect(headerCells.at(0).text()).toEqual('');
      expect(headerCells.at(1).find('span').text()).toEqual('Title');
      expect(headerCells.at(2).find('span').text()).toEqual('Date');
      expect(headerCells.at(3).find('span').text()).toEqual('Impressions');
      expect(headerCells.at(4).find('span').text()).toEqual('Clicks');
      expect(headerCells.at(5).find('span').text()).toEqual('Conversions');
      expect(headerCells.at(6).find('span').text()).toEqual('Sales');
      expect(headerCells.at(7).find('span').text()).toEqual('Ad spend');
      expect(headerCells.at(8).find('span').text()).toEqual('Target country');
      expect(headerCells.at(9).find('span').text()).toEqual('Daily budget');
      expect(headerCells.at(10).find('span').text()).toEqual('Actions');
    });

    it('has date + performance columns sortable', () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });

      const isSortable = (w: Wrapper<any, Element>): boolean => w.findComponent(BButton).exists();

      const headerCells = wrapper.findAllComponents(BTh);

      expect(headerCells).toHaveLength(11);
      expect(isSortable(headerCells.at(0))).toBe(false);
      expect(isSortable(headerCells.at(1))).toBe(false);
      expect(isSortable(headerCells.at(2))).toBe(true);
      expect(isSortable(headerCells.at(3))).toBe(true);
      expect(isSortable(headerCells.at(4))).toBe(true);
      expect(isSortable(headerCells.at(5))).toBe(true);
      expect(isSortable(headerCells.at(6))).toBe(true);
      expect(isSortable(headerCells.at(7))).toBe(true);
      expect(isSortable(headerCells.at(8))).toBe(false);
      expect(isSortable(headerCells.at(9))).toBe(false);
      expect(isSortable(headerCells.at(10))).toBe(false);
    });

    it('adds a background color on performance columns', () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });

      const hasPerformanceClass = (w: Wrapper<any, Element>): boolean => w.classes().includes('ps_gs-table-performance-header');

      const headerCells = wrapper.findAllComponents(BTh);

      expect(headerCells).toHaveLength(11);
      expect(hasPerformanceClass(headerCells.at(0))).toBe(false);
      expect(hasPerformanceClass(headerCells.at(1))).toBe(false);
      expect(hasPerformanceClass(headerCells.at(2))).toBe(false);
      expect(hasPerformanceClass(headerCells.at(3))).toBe(true);
      expect(hasPerformanceClass(headerCells.at(4))).toBe(true);
      expect(hasPerformanceClass(headerCells.at(5))).toBe(true);
      expect(hasPerformanceClass(headerCells.at(6))).toBe(true);
      expect(hasPerformanceClass(headerCells.at(7))).toBe(true);
      expect(hasPerformanceClass(headerCells.at(8))).toBe(false);
      expect(hasPerformanceClass(headerCells.at(9))).toBe(false);
      expect(hasPerformanceClass(headerCells.at(10))).toBe(false);
    });
  });

  describe('Sorting', () => {
    it('sorts by clicks (descending) by default', () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });
      expect(wrapper.vm.queryOrderDirection).toEqual({
        [KpiType.CLICKS]: QueryOrderDirection.DESCENDING,
      });

      const headerCells = wrapper.findAllComponents(BTh);

      expect(headerCells.at(2).find('i').text()).toBe('expand_less');
      expect(headerCells.at(3).find('i').text()).toBe('expand_less');
      expect(headerCells.at(4).find('i').text()).toBe('expand_more');
      expect(headerCells.at(5).find('i').text()).toBe('expand_less');
      expect(headerCells.at(6).find('i').text()).toBe('expand_less');
      expect(headerCells.at(7).find('i').text()).toBe('expand_less');
    });

    it('sets as Descending on first clic', async () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });
      expect(wrapper.vm.queryOrderDirection).toEqual({
        [KpiType.CLICKS]: QueryOrderDirection.DESCENDING,
      });

      const headerCells = wrapper.findAllComponents(BTh);
      await headerCells.at(2).findComponent(BButton).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.queryOrderDirection).toEqual({
        [CampaignSummaryListHeaderType.DURATION]: QueryOrderDirection.DESCENDING,
      });

      expect(headerCells.at(2).find('i').text()).toBe('expand_more');
      expect(headerCells.at(3).find('i').text()).toBe('expand_less');
      expect(headerCells.at(4).find('i').text()).toBe('expand_less');
      expect(headerCells.at(5).find('i').text()).toBe('expand_less');
      expect(headerCells.at(6).find('i').text()).toBe('expand_less');
      expect(headerCells.at(7).find('i').text()).toBe('expand_less');
    });

    it('sets as Descending when current sorting is Ascending', async () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });
      expect(wrapper.vm.queryOrderDirection).toEqual({
        [KpiType.CLICKS]: QueryOrderDirection.DESCENDING,
      });

      const headerCells = wrapper.findAllComponents(BTh);
      await headerCells.at(2).findComponent(BButton).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.queryOrderDirection).toEqual({
        [CampaignSummaryListHeaderType.DURATION]: QueryOrderDirection.DESCENDING,
      });

      await headerCells.at(2).findComponent(BButton).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.queryOrderDirection).toEqual({
        [CampaignSummaryListHeaderType.DURATION]: QueryOrderDirection.ASCENDING,
      });

      expect(headerCells.at(2).find('i').text()).toBe('expand_less');
      expect(headerCells.at(3).find('i').text()).toBe('expand_less');
      expect(headerCells.at(4).find('i').text()).toBe('expand_less');
      expect(headerCells.at(5).find('i').text()).toBe('expand_less');
      expect(headerCells.at(6).find('i').text()).toBe('expand_less');
      expect(headerCells.at(7).find('i').text()).toBe('expand_less');
    });

    it('sets as Ascending when current sorting is Descending', async () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });
      expect(wrapper.vm.queryOrderDirection).toEqual({
        [KpiType.CLICKS]: QueryOrderDirection.DESCENDING,
      });

      const headerCells = wrapper.findAllComponents(BTh);
      await headerCells.at(2).findComponent(BButton).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.queryOrderDirection).toEqual({
        [CampaignSummaryListHeaderType.DURATION]: QueryOrderDirection.DESCENDING,
      });

      await headerCells.at(2).findComponent(BButton).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.queryOrderDirection).toEqual({
        [CampaignSummaryListHeaderType.DURATION]: QueryOrderDirection.ASCENDING,
      });

      await headerCells.at(2).findComponent(BButton).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.queryOrderDirection).toEqual({
        [CampaignSummaryListHeaderType.DURATION]: QueryOrderDirection.DESCENDING,
      });

      expect(headerCells.at(2).find('i').text()).toBe('expand_more');
      expect(headerCells.at(3).find('i').text()).toBe('expand_less');
      expect(headerCells.at(4).find('i').text()).toBe('expand_less');
      expect(headerCells.at(5).find('i').text()).toBe('expand_less');
      expect(headerCells.at(6).find('i').text()).toBe('expand_less');
      expect(headerCells.at(7).find('i').text()).toBe('expand_less');
    });

    it('allows only one column to be sorted', async () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });
      expect(wrapper.vm.queryOrderDirection).toEqual({
        [KpiType.CLICKS]: QueryOrderDirection.DESCENDING,
      });

      const headerCells = wrapper.findAllComponents(BTh);
      await headerCells.at(2).findComponent(BButton).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.queryOrderDirection).toEqual({
        [CampaignSummaryListHeaderType.DURATION]: QueryOrderDirection.DESCENDING,
      });

      await headerCells.at(4).findComponent(BButton).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.queryOrderDirection).toEqual({
        [CampaignSummaryListHeaderType.CLICKS]: QueryOrderDirection.DESCENDING,
      });

      await headerCells.at(6).findComponent(BButton).trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.queryOrderDirection).toEqual({
        [CampaignSummaryListHeaderType.SALES]: QueryOrderDirection.DESCENDING,
      });

      expect(headerCells.at(2).find('i').text()).toBe('expand_less');
      expect(headerCells.at(3).find('i').text()).toBe('expand_less');
      expect(headerCells.at(4).find('i').text()).toBe('expand_less');
      expect(headerCells.at(5).find('i').text()).toBe('expand_less');
      expect(headerCells.at(6).find('i').text()).toBe('expand_more');
      expect(headerCells.at(7).find('i').text()).toBe('expand_less');
    });
  });

  describe('Pagination', () => {
    it('should display the pagination controls', () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });

      expect(wrapper.findComponent(tablePageControlsVue).exists()).toBe(true);
      expect(wrapper.findComponent(tablePageControlsVue).isVisible()).toBe(true);
    });

    it('handles an update of the current page', async () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });

      expect(wrapper.findComponent(tablePageControlsVue).exists()).toBe(true);
      expect(wrapper.vm.activePage).toBe(1);

      await wrapper.vm.$root.$emit('changePage', 3);

      expect(wrapper.vm.activePage).toBe(3);
    });

    it('handles an update of the page size', async () => {
      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      });

      expect(wrapper.findComponent(tablePageControlsVue).exists()).toBe(true);
      expect(wrapper.vm.totalPages).toBe(13);

      await wrapper.vm.$root.$emit('changeLimit', 50);

      expect(wrapper.vm.totalPages).toBe(3);
    });

    it('calls the API when the parameters are updated', async () => {
      const store = buildDefaultStore();
      const campaignsListAction = vi.fn();
      store.modules.campaigns.actions.GET_CAMPAIGNS_LIST = campaignsListAction;

      const wrapper = buildWrapper({
        propsData: {
          loading: false,
        },
      }, store);

      expect(campaignsListAction).toHaveBeenCalledTimes(1);

      await wrapper.vm.$root.$emit('changeLimit', 50);
      expect(campaignsListAction).toHaveBeenCalledTimes(2);

      await wrapper.vm.$root.$emit('changePage', 3);
      expect(campaignsListAction).toHaveBeenCalledTimes(3);
    });
  });
});
