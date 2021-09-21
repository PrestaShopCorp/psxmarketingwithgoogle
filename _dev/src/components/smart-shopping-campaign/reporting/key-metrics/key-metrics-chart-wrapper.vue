<template>
  <section class="pt-2 mt-5">
    <div class="flex-wrap d-flex align-items-center justify-content-between">
      <h4 class="flex-shrink-0 mb-2 mr-3 font-weight-600 ps_gs-fz-16">
        {{ $t('keymetrics.dailyResultTitle') }}
      </h4>
      <b-dropdown
        id="dailyResultKpi"
        ref="dailyResultKpi"
        :text="$t(`keymetrics.${dailyResultTypeSelected}`)"
        variant=" "
        class="mb-2 ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250"
        size="sm"
        menu-class="ps-dropdown"
      >
        <b-dropdown-item
          v-for="dailyresultType in dailyResultTypeList"
          :key="dailyresultType"
          link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
          @click="dailyResultTypeSelected = dailyresultType"
        >
          {{ $t(`keymetrics.${dailyresultType}`) }}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div>
      <b-card body-class="p-4">
        <Chart type="bar" :data="getDataSetsByMetric" :options="options" />
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
  data() {
    return {
      options: {
        scales: {
          yAxes: {
            ticks: {
              callback: (value) => {
                return this.$options.filters.formatKpi(value);
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return this.$options.filters.formatKpi(context.dataset.data[context.dataIndex]);
              },
            },
          },
          legend: {
            display: false,
          },
        },
      },
    };
  },
  computed: {
    dailyResultTypeList() {
      return Object.values(KpiType);
    },
    dailyResultTypeSelected: {
      get() {
        return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_DAILY_RESULT_TYPE'];
      },
      set(dailyResultType) {
        this.$store.commit(
          'smartShoppingCampaigns/SET_REPORTING_DAILY_RESULTS_TYPE',
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
            backgroundColor: '#442CC7',
            borderColor: '#442CC7',
            borderWidth: 1,
          },
        ],
      };
    },
    getMetrics() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_DAILY_RESULT'];
    },
    getLabels() {
      return this.getMetrics.map((a) => a.date);
    },
  },
};
</script>
