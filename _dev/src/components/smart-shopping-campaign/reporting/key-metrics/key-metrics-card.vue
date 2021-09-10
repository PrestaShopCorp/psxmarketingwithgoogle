<template>
  <b-card
    header-class="d-sm-flex justify-content-between align-items-center px-3"
    body-class="p-3"
  >
    <template #header>
      <p class="ps_gs-onboardingcard__title mb-2 mb-sm-0 flex-shrink-0">
        {{ $t('keymetrics.title') }}
      </p>
      <KeyMetricsPeriodSelector />
    </template>
    <div class="mt-2 d-flex justify-content-between flex-column flex-sm-row">
      <div class="mb-2 order-1 order-sm-0">
        <h3 class="ps_gs-fz-20 font-weight-600 mb-1">
          {{ $t('keymetrics.accountTitle') }}
        </h3>
        <p>
          {{ $t('keymetrics.accountSubtitle') }}
        </p>
      </div>
      <div class="mb-2 order-0 order-sm-1 ml-auto">
        <b-button
          size="sm"
          variant="primary"
        >
          {{ $t('cta.createCampaign') }}
        </b-button>
      </div>
    </div>
    <KeyMetricsKpiCardGroup>
      <KeyMetricsKpiCard
        v-for="kpi in kpis"
        :key="kpi.type"
        :kpi="$t(`keymetrics.${kpi.type}`)"
        :value="kpi.value"
        :tooltip="$t(`keymetrics.${kpi.type}Tooltip`)"
      />
    </KeyMetricsKpiCardGroup>
    <KeyMetricsChartWrapper :kpis="kpis" />
    <div class="text-right text-primary mt-3">
      <!-- TODO / adds link -->
      <a
        href="//google.com"
        target="_blank"
        class="d-inline-block"
      >
        {{ $t('cta.seeOnGoogleAds') }}
      </a>
    </div>
  </b-card>
</template>

<script>
import KeyMetricsPeriodSelector from './key-metrics-period-selector.vue';
import KeyMetricsKpiCardGroup from './key-metrics-kpi-card-group.vue';
import KeyMetricsKpiCard from './key-metrics-kpi-card.vue';
import KeyMetricsChartWrapper from './key-metrics-chart-wrapper.vue';

export default {
  name: 'KeyMetricsCard',
  components: {
    KeyMetricsPeriodSelector,
    KeyMetricsKpiCardGroup,
    KeyMetricsKpiCard,
    KeyMetricsChartWrapper,
  },
  data() {
    return {
      selectedDailyResultKpi: 'impressions',
      // TODO
      // Get real datas
      kpis: [
        {
          type: 'impressions',
          value: '122,789',
        },
        {
          type: 'clicks',
          value: '50,208',
        },
        {
          type: 'conversion',
          value: '73723',
        },
        {
          type: 'costPerClick',
          value: '$0.5',
        },
        {
          type: 'costs',
          value: '$25,104',
        },
        {
          type: 'sales',
          value: '$125 650',
        },
      ],
    };
  },
};
</script>
