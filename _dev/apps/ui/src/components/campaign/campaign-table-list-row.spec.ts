// Import this file first to init mock on window
import {mount} from '@vue/test-utils';
import {BDropdownItemButton, BTd} from 'bootstrap-vue';
import config, {localVue, addBootstrapToVue} from '@/../tests/init';

import CampaignTableListRow from './campaign-table-list-row.vue';
import CampaignStatus, {CampaignTypes} from '@/enums/reporting/CampaignStatus';
import {CampaignPerformanceObject} from '@/store/modules/campaigns/state';
import alertLowBudgetVue from './alert-low-budget.vue';

describe('CampaignTableListRow', () => {
  beforeEach(() => {
    addBootstrapToVue();
  });

  const defaultCampaign: CampaignPerformanceObject = {
    id: 19968248543,
    campaignName: 'Tartiflette day (Paused)',
    startDate: '2021-06-20T00:00:00.000Z',
    endDate: '2021-11-15T00:00:00.000Z',
    targetCountry: 'FR',
    dailyBudget: 15,
    status: CampaignStatus.PAUSED,
    currencyCode: 'GBP',
    productFilters: [],
    type: CampaignTypes.PERFORMANCE_MAX,
    impressions: 29,
    clicks: 20,
    adSpend: 10,
    conversions: 3,
    sales: 1300.34,
    hasUnhandledFilters: false,
    isBudgetBelowMinimum: false,
  };

  describe('Columns', () => {
    it('should display the values properly', () => {
      const wrapper = mount(CampaignTableListRow, {
        config,
        localVue,
        propsData: {
          campaign: defaultCampaign,
        },
      });

      const allCells = wrapper.findAllComponents(BTd);

      expect(allCells).toHaveLength(11);
      expect(allCells.at(0).find('span').classes()).toContain('ps_gs-cell-status--paused');
      expect(allCells.at(1).text()).toEqual('Tartiflette day (Paused)');
      expect(allCells.at(2).text()).toEqual('From {startDate} to {endDate}');
      expect(allCells.at(3).text()).toEqual('29');
      expect(allCells.at(4).text()).toEqual('20');
      expect(allCells.at(5).text()).toEqual('3');
      expect(allCells.at(6).text()).toEqual('1\u202f300,34\xa0£');
      expect(allCells.at(7).text()).toEqual('10\xa0£');
      expect(allCells.at(8).text()).toEqual('France');
      expect(allCells.at(9).text()).toEqual('15\xa0£');
      expect(allCells.at(9).findComponent(alertLowBudgetVue).exists()).toBe(false);
    });

    it('should display an alert when the budget is too low', () => {
      const wrapper = mount(CampaignTableListRow, {
        config,
        localVue,
        propsData: {
          campaign: {
            ...defaultCampaign,
            isBudgetBelowMinimum: true,
          },
        },
      });

      const allCells = wrapper.findAllComponents(BTd);

      expect(allCells).toHaveLength(11);
      expect(allCells.at(0).find('span').classes()).toContain('ps_gs-cell-status--paused');
      expect(allCells.at(1).text()).toEqual('Tartiflette day (Paused)');
      expect(allCells.at(2).text()).toEqual('From {startDate} to {endDate}');
      expect(allCells.at(3).text()).toEqual('29');
      expect(allCells.at(4).text()).toEqual('20');
      expect(allCells.at(5).text()).toEqual('3');
      expect(allCells.at(6).text()).toEqual('1\u202f300,34\xa0£');
      expect(allCells.at(7).text()).toEqual('10\xa0£');
      expect(allCells.at(8).text()).toEqual('France');
      expect(allCells.at(9).findComponent(alertLowBudgetVue).exists()).toBe(true);
    });
  });

  describe('Display of dates', () => {
    it('displays the case of a campaign with only a start date', () => {
      const wrapper = mount(CampaignTableListRow, {
        config,
        localVue,
        propsData: {
          campaign: {
            ...defaultCampaign,
            endDate: undefined,
          } as CampaignPerformanceObject,
        },
      });
      const allCells = wrapper.findAllComponents(BTd);

      expect(allCells.at(2).text()).toEqual('From {startDate}');
    });

    it('displays the case of a campaign with start & end dates', () => {
      const wrapper = mount(CampaignTableListRow, {
        config,
        localVue,
        propsData: {
          campaign: {
            ...defaultCampaign,
          } as CampaignPerformanceObject,
        },
      });
      const allCells = wrapper.findAllComponents(BTd);

      expect(allCells.at(2).text()).toEqual('From {startDate} to {endDate}');
    });

    it('displays the case of an ended campaign', () => {
      const wrapper = mount(CampaignTableListRow, {
        config,
        localVue,
        propsData: {
          campaign: {
            ...defaultCampaign,
            status: CampaignStatus.ENDED,
          } as CampaignPerformanceObject,
        },
      });
      const allCells = wrapper.findAllComponents(BTd);

      expect(allCells.at(2).text()).toEqual('Ended on {endDate}');
    });
  });

  describe('Actions', () => {
    it('should display several action for running campaigns', () => {
      const wrapper = mount(CampaignTableListRow, {
        config,
        localVue,
        propsData: {
          campaign: {
            ...defaultCampaign,
          } as CampaignPerformanceObject,
        },
      });

      const actionButtons = wrapper.findAllComponents(BDropdownItemButton);

      expect(actionButtons).toHaveLength(2);
      expect(actionButtons.at(0).text()).toBe('Enable');
      expect(actionButtons.at(1).text()).toBe('Modify');
    });

    it('should display one action for ended campaigns', () => {
      const wrapper = mount(CampaignTableListRow, {
        config,
        localVue,
        propsData: {
          campaign: {
            ...defaultCampaign,
            status: CampaignStatus.ENDED,
          } as CampaignPerformanceObject,
        },
      });

      const actionButtons = wrapper.findAllComponents(BDropdownItemButton);

      expect(actionButtons).toHaveLength(1);
      expect(actionButtons.at(0).text()).toBe('Modify');
    });
  });
});
