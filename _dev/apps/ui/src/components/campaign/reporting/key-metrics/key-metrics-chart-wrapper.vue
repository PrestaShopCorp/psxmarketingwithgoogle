<template>
  <section class="pt-2 mt-2">
    <div class="flex-wrap d-flex align-items-center justify-content-between">
      <h4 class="flex-shrink-0 mb-2 mr-3 font-weight-600 ps_gs-fz-16">
        {{ $t('keymetrics.dailyResultTitle') }}
      </h4>
    </div>
    <div>
      <b-card
        body-class="p-md-4"
      >
        <div
          class="d-flex flex-column align-items-center ps_gs-onboardingcard__not-configured"
          v-if="!accountHasAtLeastOneCampaign"
        >
          <i class="material-icons ps_gs-fz-48">show_chart</i>
          <p>{{ $t('keymetrics.noCampaigns') }}</p>
          <b-button
            class="flex-shrink-0"
            variant="primary"
            @click="$emit('clickToCreateCampaign')"
          >
            {{ this.accountHasAtLeastOneCampaign
              ? $t('cta.launchCampaign') : $t('banner.ctaCreateFirstCampaign')
            }}
          </b-button>
        </div>
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

<script lang="ts">
import {ChartData, ChartOptions, ScriptableLineSegmentContext} from 'chart.js';
import KpiType from '@/enums/reporting/KpiType';
import Chart from '@/components/chart/chart.vue';
import { Kpis } from '@/store/modules/campaigns/state';

const skipped = (ctx: ScriptableLineSegmentContext, value: [number, number]) => ctx.p0.skip || ctx.p1.skip ? value : undefined;

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
    getDataSetsByMetric(): ChartData<'line'> {
      return {
        labels: this.getLabels,
        datasets: [
          {
            label: this.$t(`keymetrics.${this.dailyResultTypeSelected}`).toString(),
            data: this.getMetrics.map((a) => a[this.dailyResultTypeSelected]),
            backgroundColor: '#000000',
            borderColor: '#000000',
            borderWidth: 2,
            segment: {
              borderDash: (ctx) => skipped(ctx, [6, 6]),
            },
            spanGaps: true,
          },
        ],
      };
    },
    getMetrics(): Kpis[] {
      return this.$store.getters['campaigns/GET_REPORTING_DAILY_RESULT'];
    },
    getLabels() {
      return this.getMetrics.map((a) => a.date);
    },
    metricsIsEmpty() {
      return this.getMetrics.length === 0;
    },
    currencyCode(): string|undefined {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']?.currencyCode;
    },
    chartOptions(): ChartOptions<'line'> {
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
            min: 0,
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
    accountHasAtLeastOneCampaign() {
      return !!this.$store.getters['campaigns/GET_ALL_CAMPAIGNS']?.length;
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
