<template>
  <b-card
    header-class="px-3 d-sm-flex justify-content-between align-items-center"
    body-class="p-3"
  >
    <template #header>
      <p class="flex-shrink-0 mb-2 ps_gs-onboardingcard__title mb-sm-0">
        {{ $t('keymetrics.title') }}
      </p>
      <KeyMetricsPeriodSelector :in-need-of-configuration="inNeedOfConfiguration" />
    </template>
    <NotConfiguredCard
      v-if="inNeedOfConfiguration"
      class="mx-auto"
    />
    <KeyMetricsErrorMessage v-else-if="errorWithApi && !inNeedOfConfiguration" />
    <div v-else>
      <div class="mt-2 d-flex justify-content-between flex-column flex-sm-row">
        <div class="order-1 mb-2 order-sm-0">
          <h3 class="mb-1 ps_gs-fz-20 font-weight-600">
            {{ $t('keymetrics.accountTitle') }}
          </h3>
          <p>
            {{ $t('keymetrics.accountSubtitle') }}
          </p>
        </div>
        <div class="mb-2 ml-auto order-0 order-sm-1">
          <b-button
            size="sm"
            variant="primary"
            @click="redirectToCreateCampaign"
          >
            {{ $t('cta.createCampaign') }}
          </b-button>
        </div>
      </div>
      <KeyMetricsKpiCardGroup>
        <KeyMetricsKpiCard
          v-for="(kpiValue, kpiType) in reportingKpis"
          :key="kpiType"
          :kpi-type="kpiType"
          :kpi-name="$t(`keymetrics.${kpiType}`)"
          :kpi-value="kpiValue.toString()"
          :tooltip="$t(`keymetrics.${kpiType}Tooltip`)"
        />
      </KeyMetricsKpiCardGroup>
      <KeyMetricsChartWrapper />
      <div class="mt-3 text-right text-primary">
        <a
          :href="googleAdsAccountUrl"
          target="_blank"
          class="d-inline-block"
        >
          {{ $t('cta.seeOnGoogleAds') }}
        </a>
      </div>
    </div>
  </b-card>
</template>

<script>
import KeyMetricsErrorMessage from './key-metrics-error-message.vue';
import KeyMetricsPeriodSelector from './key-metrics-period-selector.vue';
import KeyMetricsKpiCardGroup from './key-metrics-kpi-card-group.vue';
import KeyMetricsKpiCard from './key-metrics-kpi-card.vue';
import KeyMetricsChartWrapper from './key-metrics-chart-wrapper.vue';
import googleUrl from '@/assets/json/googleUrl.json';
import NotConfiguredCard from '@/components/commons/not-configured-card.vue';

export default {
  name: 'KeyMetricsBlock',
  components: {
    KeyMetricsErrorMessage,
    KeyMetricsPeriodSelector,
    KeyMetricsKpiCardGroup,
    KeyMetricsKpiCard,
    KeyMetricsChartWrapper,
    NotConfiguredCard,
  },
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    reportingKpis() {
      return this.$store.getters['campaigns/GET_REPORTING_KPIS'];
    },
    googleAdsAccountUrl() {
      return googleUrl.googleAdsAccount;
    },
    errorWithApi() {
      return this.$store.getters['campaigns/GET_REPORTING_KPIS_ERROR'];
    },
  },
  mounted() {
    this.fetchKpis();
  },
  methods: {
    fetchKpis() {
      this.$store.dispatch('campaigns/GET_REPORTING_KPIS');
    },
    redirectToCreateCampaign() {
      this.$router.push({
        name: 'campaign-creation',
      });
    },
  },
};
</script>
