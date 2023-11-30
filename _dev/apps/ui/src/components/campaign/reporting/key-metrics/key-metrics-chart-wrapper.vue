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
            {{ $t('banner.ctaCreateFirstCampaign') }}
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
import {defineComponent} from 'vue';
import {
  ChartData, ChartDataset, ChartOptions, Point, ScriptableLineSegmentContext,
} from 'chart.js';
import KpiType from '@/enums/reporting/KpiType';
import Chart from '@/components/chart/chart.vue';
import {Kpis, DailyResultTypes} from '@/store/modules/campaigns/state';
import {timeConverterToDate} from '@/utils/Dates';
import {externalTooltipHandler} from '@/utils/ChartTooltip';

const skipped = (
  ctx: ScriptableLineSegmentContext,
  value: [number, number],
) => (ctx.p0.skip || ctx.p1.skip || ctx.p1.stop ? value : undefined);

export default defineComponent({
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
          .map((color: string): ChartDataset<'line', (number | Point | null)[]> => {
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
              spanGaps: 1000 * 60 * 60 * 24 * 2, // 2 days,
              yAxisID: this.typeDisplaysPrices(kpiType) ? 'yPrice' : 'y',
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
    currencyCode(): string|undefined {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']?.currencyCode;
    },
    absoluteValuesAxisIsDisplayed(): boolean {
      return !!Object.keys(this.dailyResultTypesSelected)
        .filter((color: string) => !!this.dailyResultTypesSelected[color])
        .find((color: string) => {
          const kpiType = this.dailyResultTypesSelected[color];

          return !this.typeDisplaysPrices(kpiType);
        });
    },
    chartOptions(): ChartOptions<'line'> {
      return {
        elements: {
          point: {
            radius: this.$store.getters['campaigns/GET_REPORTING_START_DATES'] === this.$store.getters['campaigns/GET_REPORTING_END_DATES'] ? 3 : 0,
            hoverRadius: 3,
          },
        },
        hover: {
          mode: 'index',
          intersect: false,
        },
        scales: {
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
            position: this.absoluteValuesAxisIsDisplayed ? 'right' : 'left',
            grid: {
              drawOnChartArea: !this.absoluteValuesAxisIsDisplayed,
              lineWidth: 1,
              color: '#BBBBBB',
            },
            border: {
              dash: [1, 2],
            },
            ticks: {
              callback: (value) => this.getFormattedValue(
                value,
                KpiType.AVERAGE_COST_PER_CLICK,
              ),
            },
            min: 0,
            grace: '15%',
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
            grid: {
              color: '#EEEEEE',
            },
          },
        },
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            position: 'nearest',
            external: externalTooltipHandler,
            intersect: false,
            mode: 'index',
            padding: 12,
            callbacks: {
              title: (tooltipItems) => [
                ...new Set(tooltipItems.map(
                  (tooltipItem) => timeConverterToDate(tooltipItem.parsed.x),
                )),
              ],
              label: (tooltipItem) => {
                if (tooltipItem.dataset.yAxisID === 'yPrice') {
                  const {label} = tooltipItem.dataset;
                  const price = this.getFormattedValue(tooltipItem.parsed.y);

                  return `${label}~ ${price}`;
                }
                return `${tooltipItem.dataset.label}~${tooltipItem.parsed.y}`;
              },
            },
          },
        },
      };
    },
    accountHasAtLeastOneCampaign(): boolean {
      return this.$store.getters['campaigns/GET_ACCOUNT_HAS_AT_LEAST_ONE_CAMPAIGN'];
    },
  },
  methods: {
    fetchGraph() {
      this.$store.dispatch('campaigns/GET_REPORTING_DAILY_RESULTS');
    },
    typeDisplaysPrices(type: KpiType): boolean {
      return type === KpiType.AVERAGE_COST_PER_CLICK
        || type === KpiType.SALES
        || type === KpiType.COSTS;
    },
    getFormattedValue(value: string|number|Point|null) {
      return this.$options.filters.formatPrice(value, this.currencyCode);
    },
  },
});
</script>
