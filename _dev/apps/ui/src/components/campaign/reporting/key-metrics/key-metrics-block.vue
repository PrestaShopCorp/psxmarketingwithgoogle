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
          :active-color="associatedColorToKpi(kpiType)"
          @toggleKpi="toggleKpi(kpiType, !associatedColorToKpi(kpiType))"
        />
      </KeyMetricsKpiCardGroup>
      <KeyMetricsChartWrapper
        @clickToCreateCampaign="$emit('clickToCreateCampaign')"
      />
      <div class="mt-3 d-flex justify-content-between">
        <i18n
          path="keymetrics.helpUnderstanding"
          class="d-inline-block"
          tag="p"
        >
          <b-link
            variant="link"
            target="_blank"
            :href="supportUrl"
          >
            {{ $t('help.helpCenter') }}
          </b-link>
        </i18n>
        <i18n
          path="cta.seeOnGoogleAds"
          class="d-inline-block"
          tag="p"
        >
          <b-link
            target="_blank"
            :href="googleAdsAccountUrl"
          >
            {{ $t('cta.GoogleAds') }}
          </b-link>
        </i18n>
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
import {DailyResultColor, DailyResultTypes, Kpis} from '@/store/modules/campaigns/state';
import KpiType from '@/enums/reporting/KpiType';

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
    dailyResultTypesSelected(): DailyResultTypes {
      return this.$store.getters['campaigns/GET_REPORTING_DAILY_RESULT_TYPES'];
    },
    googleAdsAccountUrl() {
      return googleUrl.googleAdsAccount;
    },
    errorWithApi() {
      return this.$store.getters['campaigns/GET_REPORTING_KPIS_ERROR'];
    },
    accountHasAtLeastOneCampaign() {
      return !!this.$store.getters['campaigns/GET_CAMPAIGNS_LIST']?.length;
    },
    supportUrl(): string {
      return this.$store.getters['app/GET_SUPPORT_URL'];
    },
  },
  mounted() {
    this.fetchKpis();
  },
  methods: {
    fetchKpis() {
      this.$store.dispatch('campaigns/GET_REPORTING_KPIS');
    },
    associatedColorToKpi(kpi: KpiType): DailyResultColor|undefined {
      return Object.keys(this.dailyResultTypesSelected).find((color: string) => this.dailyResultTypesSelected[color] === kpi);
    },
    toggleKpi(type: KpiType, newValueIsActive: boolean): void {
      if (!newValueIsActive) {
        this.$store.dispatch('campaigns/REMOVE_REPORTING_DAILY_RESULTS_TYPE', type);
        return;
      }
      this.$store.dispatch('campaigns/ADD_REPORTING_DAILY_RESULTS_TYPE', type);
    },
  },
};
</script>
