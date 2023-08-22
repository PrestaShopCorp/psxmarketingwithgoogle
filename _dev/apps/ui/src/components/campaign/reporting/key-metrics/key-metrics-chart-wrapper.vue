<template>
  <section class="pt-2 mt-2">
    <div class="flex-wrap d-flex align-items-center justify-content-between">
      <h4 class="flex-shrink-0 mb-2 mr-3 font-weight-600 ps_gs-fz-16">
        {{ $t('keymetrics.dailyResultTitle') }}
      </h4>
    </div>
    <div>
      <div
        v-if="metricsIsEmpty || !checkDataInDateRange"
        class="text-center py-3"
      >
        <span>{{ $t('keymetrics.noData') }}</span>
      </div>
      <b-card
        v-else
        body-class="p-md-4"
      >
        <Chart
          type="line"
          :data="getDataSetsByMetric"
          :options="chartOptions"
          :height="265"
          :width="1163"
        />
      </b-card>
    </div>
  </section>
</template>

<script>
import KpiType from '@/enums/reporting/KpiType';
import Chart from '@/components/chart/chart.vue';

export default {
  name: 'KeyMetricsChartWrapper',
  components: {
    Chart,
  },
  created() {
    this.fetchGraph();
  },
  computed: {
    dailyResultTypeList() {
      return Object.values(KpiType);
    },
    dailyResultTypeSelected: {
      get() {
        return this.$store.getters['campaigns/GET_REPORTING_DAILY_RESULT_TYPE'];
      },
      set(dailyResultType) {
        this.$store.commit(
          'campaigns/SET_REPORTING_DAILY_RESULTS_TYPE',
          dailyResultType,
        );
      },
    },
    getDataSetsByMetric() {
      // https://www.chartjs.org/docs/latest/general/data-structures.html
      return {
        labels: this.getLabels,
        datasets: [
          {
            label: this.$t(`keymetrics.${this.dailyResultTypeSelected}`),
            data: this.getMetrics.map((a) => a[this.dailyResultTypeSelected]),
            backgroundColor: '#000000',
            borderColor: '#000000',
            borderWidth: 2,
            maxBarThickness: 100,
          },
        ],
      };
    },
    checkDataInDateRange() {
      const startDate = new Date(this.$store.getters['campaigns/GET_REPORTING_START_DATES']);
      const endDate = new Date(this.$store.getters['campaigns/GET_REPORTING_END_DATES']);

      const dateMatchExists = this.getLabels.some((date) => {
        const dateFormat = new Date(date);

        return dateFormat >= startDate && dateFormat <= endDate;
      });

      return dateMatchExists;
    },
    getMetrics() {
      return this.$store.getters['campaigns/GET_REPORTING_DAILY_RESULT'];
    },
    getLabels() {
      return this.getMetrics.map((a) => a.date);
    },
    metricsIsEmpty() {
      return this.getMetrics.length === 0;
    },
    currencyCode() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']?.currencyCode;
    },
    chartOptions() {
      return {
        elements: {
          point: {
            pointStyle: false,
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => this.getFormattedValue(value),
            },
          },
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            min: this.$store.getters['campaigns/GET_REPORTING_START_DATES'],
            max: this.$store.getters['campaigns/GET_REPORTING_END_DATES'],
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => this.getFormattedValue(
                context.dataset.data[context.dataIndex]),
            },
          },
          legend: {
            display: false,
          },
        },
      };
    },
  },
  methods: {
    fetchGraph() {
      this.$store.dispatch('campaigns/GET_REPORTING_DAILY_RESULTS');
    },
    getFormattedValue(value) {
      const selectedKpi = this.$store.getters['campaigns/GET_REPORTING_DAILY_RESULT_TYPE'];

      if (selectedKpi === KpiType.CLICKS
        || selectedKpi === KpiType.CONVERSIONS
        || selectedKpi === KpiType.IMPRESSIONS) {
        return value;
      }

      return this.$options.filters.formatPrice(value, this.currencyCode);
    },
  },
};
</script>
