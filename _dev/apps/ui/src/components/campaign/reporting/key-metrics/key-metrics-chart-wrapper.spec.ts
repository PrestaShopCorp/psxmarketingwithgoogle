import {MountOptions, shallowMount} from '@vue/test-utils';
import Vuex from 'vuex';

import config, {localVue, cloneStore} from '@/../tests/init';
import KeyMetricsChartWrapperVue from './key-metrics-chart-wrapper.vue';
import ChartCanvasVue from '@/components/chart/chart-canvas.vue';
import {campaigns} from '@/../.storybook/mock/campaigns-list';
import {dateGenerator} from '@/../.storybook/utils/date-generator';
import KpiType from '@/enums/reporting/KpiType';
import {DailyResultColor} from '../../../../store/modules/campaigns/state';

describe('KeyMetricsChartWrapper', () => {
  const buildDefaultStore = (): ReturnType<typeof cloneStore> => {
    const store = cloneStore();
    store.modules.campaigns.state.campaigns.results.campaigns = campaigns;
    store.modules.campaigns.state.campaigns.results.totalCount = 123;

    store.modules.campaigns.actions.GET_REPORTING_DAILY_RESULTS = vi.fn();
    store.modules.campaigns.actions.GET_CAMPAIGNS_LIST = vi.fn();
    return store;
  };

  const buildWrapper = (
    options: MountOptions<any> = {},
    store: ReturnType<typeof cloneStore> = buildDefaultStore(),
  ) => shallowMount(KeyMetricsChartWrapperVue, {
    localVue,
    store: new Vuex.Store(store),
    ...config,
    ...options,
  });

  describe('Display', () => {
    it('is shown by default', () => {
      const wrapper = buildWrapper();

      expect(wrapper.findComponent(ChartCanvasVue).exists()).toBe(true);
      expect(wrapper.find('.ps_gs-onboardingcard__not-configured').exists()).toBe(false);
    });

    it('displays a message when there is no campaigns', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.campaigns.results.totalCount = 0;
      const wrapper = buildWrapper({}, store);

      expect(wrapper.findComponent(ChartCanvasVue).exists()).toBe(true);
      expect(wrapper.find('.ps_gs-onboardingcard__not-configured').exists()).toBe(true);
    });

    it('displays the graph if campaigns API call failed but stats exist', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.campaigns.results.error = true;
      store.modules.campaigns.state.reporting.results.dailyResultChart.dailyResultList = [{
        impressions: 400,
        clicks: 200,
        conversions: 10,
        averageCostPerClick: 0.20,
        costs: 20,
        sales: 13000,
        date: dateGenerator(0),
      }];
      const wrapper = buildWrapper({}, store);

      expect(wrapper.findComponent(ChartCanvasVue).exists()).toBe(true);
      expect(wrapper.find('.ps_gs-onboardingcard__not-configured').exists()).toBe(false);
    });

    it('displays a message if campaigns API call failed and stats are empty', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.campaigns.results.error = true;
      store.modules.campaigns.state.reporting.results.dailyResultChart.dailyResultList = [];
      const wrapper = buildWrapper({}, store);

      expect(wrapper.findComponent(ChartCanvasVue).exists()).toBe(true);
      expect(wrapper.find('.ps_gs-onboardingcard__not-configured').exists()).toBe(true);
    });
  });

  describe('Data values style', () => {
    it('only shows the line without points by default, unless hovered', () => {
      const store = buildDefaultStore();
      const wrapper = buildWrapper({}, store);

      expect(wrapper.vm.chartOptions.elements).toEqual({
        point: {
          radius: 0,
          hoverRadius: 3,
        },
      });
    });

    it('shows a point where there is only one date to display', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.reporting.request.dateRange.endDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dateRange.startDate = dateGenerator(0);
      const wrapper = buildWrapper({}, store);

      expect(wrapper.vm.chartOptions.elements).toEqual({
        point: {
          radius: 3,
          hoverRadius: 3,
        },
      });
    });

    it('assigns the color to the line', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.reporting.request.dateRange.endDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dateRange.startDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dailyResultTypes = {
        [DailyResultColor.BLACK]: null,
        [DailyResultColor.BLUE]: KpiType.SALES,
        [DailyResultColor.YELLOW]: null,
      };
      store.modules.campaigns.state.reporting.results.dailyResultChart.dailyResultList = [{
        impressions: 400,
        clicks: 200,
        conversions: 10,
        averageCostPerClick: 0.20,
        costs: 20,
        sales: 13000,
        date: dateGenerator(0),
      }];
      const wrapper = buildWrapper({}, store);

      expect(wrapper.vm.getDataSetsByMetric).toStrictEqual({
        labels: [dateGenerator(0)],
        datasets: [
          {
            label: 'Sales',
            data: [13000],
            backgroundColor: '#174EEF',
            borderColor: '#174EEF',
            borderWidth: 2,
            segment: expect.any(Object),
            spanGaps: 172800000,
            yAxisID: 'yPrice',
          },
        ],
      });
    });
  });

  describe('Y axis', () => {
    it('numbers and prices are on different axis', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.reporting.request.dateRange.endDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dateRange.startDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dailyResultTypes = {
        // Colors won't match the type
        // @ts-ignore
        color1: KpiType.AVERAGE_COST_PER_CLICK,
        color2: KpiType.CLICKS,
        color3: KpiType.CONVERSIONS,
        color4: KpiType.COSTS,
        color5: KpiType.IMPRESSIONS,
        color6: KpiType.SALES,
      };
      store.modules.campaigns.state.reporting.results.dailyResultChart.dailyResultList = [{
        impressions: 400,
        clicks: 200,
        conversions: 10,
        averageCostPerClick: 0.20,
        costs: 20,
        sales: 13000,
        date: dateGenerator(0),
      }];
      const wrapper = buildWrapper({}, store);

      expect(wrapper.vm.getDataSetsByMetric).toStrictEqual({
        labels: [dateGenerator(0)],
        datasets: [
          {
            label: 'Avg cost / click',
            data: [0.20],
            backgroundColor: 'color1',
            borderColor: 'color1',
            borderWidth: 2,
            segment: expect.any(Object),
            spanGaps: 172800000,
            yAxisID: 'yPrice',
          },
          {
            label: 'Clicks',
            data: [200],
            backgroundColor: 'color2',
            borderColor: 'color2',
            borderWidth: 2,
            segment: expect.any(Object),
            spanGaps: 172800000,
            yAxisID: 'y',
          },
          {
            label: 'Conversions',
            data: [10],
            backgroundColor: 'color3',
            borderColor: 'color3',
            borderWidth: 2,
            segment: expect.any(Object),
            spanGaps: 172800000,
            yAxisID: 'y',
          },
          {
            label: 'Costs',
            data: [20],
            backgroundColor: 'color4',
            borderColor: 'color4',
            borderWidth: 2,
            segment: expect.any(Object),
            spanGaps: 172800000,
            yAxisID: 'yPrice',
          },
          {
            label: 'Impressions',
            data: [400],
            backgroundColor: 'color5',
            borderColor: 'color5',
            borderWidth: 2,
            segment: expect.any(Object),
            spanGaps: 172800000,
            yAxisID: 'y',
          },
          {
            label: 'Sales',
            data: [13000],
            backgroundColor: 'color6',
            borderColor: 'color6',
            borderWidth: 2,
            segment: expect.any(Object),
            spanGaps: 172800000,
            yAxisID: 'yPrice',
          },
        ],
      });
    });

    it('displays the only Y axis (absolute numbers) on the left', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.reporting.request.dateRange.endDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dateRange.startDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dailyResultTypes = {
        [DailyResultColor.BLACK]: KpiType.IMPRESSIONS,
        [DailyResultColor.BLUE]: KpiType.CLICKS,
        [DailyResultColor.YELLOW]: KpiType.CONVERSIONS,
      };
      store.modules.campaigns.state.reporting.results.dailyResultChart.dailyResultList = [{
        impressions: 400,
        clicks: 200,
        conversions: 10,
        averageCostPerClick: 0.20,
        costs: 20,
        sales: 13000,
        date: dateGenerator(0),
      }];
      const wrapper = buildWrapper({}, store);

      expect(wrapper.vm.chartOptions.scales).toStrictEqual({
        y: {
          display: 'auto',
          min: 0,
          grace: '15%',
          grid: {
            lineWidth: 2,
            color: '#BBBBBB',
          },
          border: {
            dash: [1, 2],
          },
        },
        yPrice: {
          axis: 'y',
          display: 'auto',
          position: 'right',
          grid: {
            drawOnChartArea: false,
            lineWidth: 1,
            color: '#BBBBBB',
          },
          border: {
            dash: [1, 2],
          },
          ticks: expect.any(Object),
          min: 0,
          grace: '15%',
        },
        x: {
          type: 'time',
          ticks: expect.any(Object),
          time: {
            unit: 'day',
          },
          min: dateGenerator(0),
          max: dateGenerator(0),
          grid: {
            color: '#EEEEEE',
          },
        },
      });
    });

    it('displays the only Y axis (prices) on the left', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.reporting.request.dateRange.endDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dateRange.startDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dailyResultTypes = {
        [DailyResultColor.BLACK]: KpiType.AVERAGE_COST_PER_CLICK,
        [DailyResultColor.BLUE]: KpiType.COSTS,
        [DailyResultColor.YELLOW]: KpiType.SALES,
      };
      store.modules.campaigns.state.reporting.results.dailyResultChart.dailyResultList = [{
        impressions: 400,
        clicks: 200,
        conversions: 10,
        averageCostPerClick: 0.20,
        costs: 20,
        sales: 13000,
        date: dateGenerator(0),
      }];
      const wrapper = buildWrapper({}, store);

      expect(wrapper.vm.chartOptions.scales).toStrictEqual({
        y: {
          display: 'auto',
          min: 0,
          grace: '15%',
          grid: {
            lineWidth: 2,
            color: '#BBBBBB',
          },
          border: {
            dash: [1, 2],
          },
        },
        yPrice: {
          axis: 'y',
          display: 'auto',
          position: 'left',
          grid: {
            drawOnChartArea: true,
            lineWidth: 1,
            color: '#BBBBBB',
          },
          border: {
            dash: [1, 2],
          },
          ticks: expect.any(Object),
          min: 0,
          grace: '15%',
        },
        x: {
          type: 'time',
          ticks: expect.any(Object),
          time: {
            unit: 'day',
          },
          min: dateGenerator(0),
          max: dateGenerator(0),
          grid: {
            color: '#EEEEEE',
          },
        },
      });
    });

    it('displays axis on each sides when both are visible', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.reporting.request.dateRange.endDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dateRange.startDate = dateGenerator(0);
      store.modules.campaigns.state.reporting.request.dailyResultTypes = {
        [DailyResultColor.BLACK]: KpiType.IMPRESSIONS,
        [DailyResultColor.BLUE]: KpiType.SALES,
        [DailyResultColor.YELLOW]: null,
      };
      store.modules.campaigns.state.reporting.results.dailyResultChart.dailyResultList = [{
        impressions: 400,
        clicks: 200,
        conversions: 10,
        averageCostPerClick: 0.20,
        costs: 20,
        sales: 13000,
        date: dateGenerator(0),
      }];
      const wrapper = buildWrapper({}, store);

      expect(wrapper.vm.chartOptions.scales).toStrictEqual({
        y: {
          display: 'auto',
          min: 0,
          grace: '15%',
          grid: {
            lineWidth: 2,
            color: '#BBBBBB',
          },
          border: {
            dash: [1, 2],
          },
        },
        yPrice: {
          axis: 'y',
          display: 'auto',
          position: 'right',
          grid: {
            drawOnChartArea: false,
            lineWidth: 1,
            color: '#BBBBBB',
          },
          border: {
            dash: [1, 2],
          },
          ticks: expect.any(Object),
          min: 0,
          grace: '15%',
        },
        x: {
          type: 'time',
          ticks: expect.any(Object),
          time: {
            unit: 'day',
          },
          min: dateGenerator(0),
          max: dateGenerator(0),
          grid: {
            color: '#EEEEEE',
          },
        },
      });
    });
  });
});
