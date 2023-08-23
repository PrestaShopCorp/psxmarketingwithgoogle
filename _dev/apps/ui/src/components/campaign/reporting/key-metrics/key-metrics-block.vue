<template>
  <b-card
    class="ps_gs-onboardingcard mb-3"
    header-class="px-3 d-sm-flex justify-content-between align-items-center"
    body-class="p-3"
  >
    <template #header>
      <ol class="mb-0 list-inline d-flex align-items-center ps_gs-breadcrumb">
        <li class="list-inline-item ps_gs-breadcrumb__item">
          {{ $t('keymetrics.title') }}
        </li>
      </ol>
    </template>
    <NotConfiguredCard
      v-if="inNeedOfConfiguration"
      class="mx-auto"
    />
    <KeyMetricsErrorMessage v-else-if="errorWithApi && !inNeedOfConfiguration" />
    <div v-else>
      <div class="mt-2 d-flex justify-content-between flex-column flex-sm-row">
        <div class="order-1 mb-2 order-sm-0">
          <p>
            {{ $t('keymetrics.accountSubtitle') }}
          </p>
        </div>
      </div>
      <KeyMetricsKpiCardGroup>
        <KeyMetricsKpiCard
          v-for="(kpiValue, kpiType) in reportingKpis"
          :key="kpiType"
          :kpi-type="kpiType"
          :kpi-name="$t(`keymetrics.${kpiType}`)"
          :kpi-value="kpiValue.toString()"
          :disabled="!accountHasAtLeastOneCampaign"
        />
      </KeyMetricsKpiCardGroup>
      <KeyMetricsChartWrapper
        @clickToCreateCampaign="$emit('clickToCreateCampaign')"
      />
      <div class="mt-3 d-flex justify-content-between">
        <p>
          {{ $t('keymetrics.helpUnderstanding') }}
        </p>
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

<script lang="ts">
import KeyMetricsErrorMessage from './key-metrics-error-message.vue';
import KeyMetricsKpiCardGroup from './key-metrics-kpi-card-group.vue';
import KeyMetricsKpiCard from './key-metrics-kpi-card.vue';
import KeyMetricsChartWrapper from './key-metrics-chart-wrapper.vue';
import googleUrl from '@/assets/json/googleUrl.json';
import NotConfiguredCard from '@/components/commons/not-configured-card.vue';
import { Kpis } from '@/store/modules/campaigns/state';

export default {
  name: 'KeyMetricsBlock',
  components: {
    KeyMetricsErrorMessage,
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
    reportingKpis(): Kpis {
      return this.$store.getters['campaigns/GET_REPORTING_KPIS'];
    },
    googleAdsAccountUrl() {
      return googleUrl.googleAdsAccount;
    },
    errorWithApi() {
      return this.$store.getters['campaigns/GET_REPORTING_KPIS_ERROR'];
    },
    accountHasAtLeastOneCampaign() {
      return !!this.$store.getters['campaigns/GET_ALL_CAMPAIGNS']?.length;
    },
  },
  mounted() {
    this.fetchKpis();
  },
  methods: {
    fetchKpis() {
      this.$store.dispatch('campaigns/GET_REPORTING_KPIS');
    },
  },
};
</script>
