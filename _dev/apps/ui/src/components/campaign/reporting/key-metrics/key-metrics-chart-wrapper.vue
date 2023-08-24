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
import {ChartData, ChartDataset, ChartOptions, Point, ScriptableLineSegmentContext} from 'chart.js';
import KpiType from '@/enums/reporting/KpiType';
import Chart from '@/components/chart/chart.vue';
import {Kpis, DailyResultTypes} from '@/store/modules/campaigns/state';
import { timeConverterToDate } from '@/utils/Dates';

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
    dailyResultTypesSelected(): DailyResultTypes {
      return this.$store.getters['campaigns/GET_REPORTING_DAILY_RESULT_TYPES'];
    },
    getDataSetsByMetric(): ChartData<'line'> {
      return {
        labels: this.getLabels,
        datasets: Object.keys(this.dailyResultTypesSelected)
          .filter((color: string) => !!this.dailyResultTypesSelected[color])
          .map((color: string): ChartDataset<"line", (number | Point | null)[]> => {
            const kpiType = this.dailyResultTypesSelected[color];

            return {
              label: this.$t(`keymetrics.${kpiType}`).toString(),
              data: this.getMetrics.map((a) => a[kpiType]),
              backgroundColor: color,
              borderColor: color,
              borderWidth: 2,
              segment: {
                borderDash: (ctx) => skipped(ctx, [6, 6]),
              },
              spanGaps: true,
            };
          },
        ),
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
            // TODO: Be able to display several axis depending on the selected kpi types 
            ticks: {
              callback: (value) => this.getFormattedValue(
                value,
                this.$store.getters['campaigns/GET_REPORTING_DAILY_RESULT_TYPES'],
              ),
            },
            min: 0,
          },
          x: {
            type: 'time',
            ticks: {
              callback: (value) => timeConverterToDate(value),
            },
            time: {
              unit: 'day',
            },
            min: this.$store.getters['campaigns/GET_REPORTING_START_DATES'],
            max: this.$store.getters['campaigns/GET_REPORTING_END_DATES'],
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => tooltipItems.map((tooltipItem) => timeConverterToDate(tooltipItem.parsed.x)),
            },
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
    getFormattedValue(value: string|number|Point|null, type: KpiType) {
      if (type === KpiType.CLICKS
        || type === KpiType.CONVERSIONS
        || type === KpiType.IMPRESSIONS) {
        return value;
      }

      return this.$options.filters.formatPrice(value, this.currencyCode);
    },
  },
};
</script>
