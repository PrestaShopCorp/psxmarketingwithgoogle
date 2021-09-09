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
      <section class="mt-5 pt-2">
        <div class="d-flex align-items-center justify-content-between flex-wrap">
          <h4 class="font-weight-600 ps_gs-fz-16 mb-2 flex-shrink-0 mr-3">
            {{ $t('keymetrics.dailyResultTitle') }}
          </h4>
          <b-dropdown
            id="dailyResultKpi"
            ref="dailyResultKpi"
            :text="$t(`keymetrics.${selectedDailyResultKpi}`)"
            variant=" "
            class="ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250 mb-2"
            size="sm"
            menu-class="ps-dropdown"
            no-flip
          >
            <b-dropdown-item
              v-for="kpi in kpis"
              :key="kpi.type"
              link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
              @click="selectedDailyResultKpi = kpi.type"
            >
              {{ $t(`keymetrics.${kpi.type}`) }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div>
          placeholder chart
        </div>
        <div class="text-right text-primary mt-3">
          <a
            href="//google.com"
            target="_blank"
            class="d-inline-block"
          >
            See on Google Ads
          </a>
        </div>
      </section>
    </b-card>
</template>

<script>
import KeyMetricsPeriodSelector from './key-metrics-period-selector.vue';
import KeyMetricsKpiCardGroup from './key-metrics-kpi-card-group.vue';
import KeyMetricsKpiCard from './key-metrics-kpi-card.vue';

export default {
  name: 'KeyMetricsCard',
  components: {
    KeyMetricsPeriodSelector,
    KeyMetricsKpiCardGroup,
    KeyMetricsKpiCard,
  },
  data() {
    return {
      selectedDailyResultKpi: 'impressions',
      // TODO
      // Get real datas
      kpis: [
        {
          type: 'impressions',
          value: '122,789'
        },
        {
          type: 'clicks',
          value: '50,208'
        },
        {
          type: 'conversion',
          value: '73723'
        },
        {
          type: 'costPerClick',
          value: '$0.5'
        },
        {
          type: 'costs',
          value: '$25,104'
        },
        {
          type: 'sales',
          value: '$125 650'
        },
      ],
    };
  },
}
</script>
