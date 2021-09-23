<template>
  <b-col
    cols="12"
    sm="6"
    md="4"
    xl="2"
    class="py-1 d-flex flex-column"
  >
    <b-card
      class="ps_gs-kpi-card flex-grow-1"
      body-class="p-3"
    >
      <b-button
        v-if="tooltip"
        variant="invisible"
        class="ps_gs-kpi-card__tooltip"
        v-b-tooltip:psxMktgWithGoogleApp
        :title="tooltip"
      >
        <i class="material-icons ps_gs-fz-14 text-secondary">info_outlined</i>
        <span class="sr-only">
          {{ $t('cta.moreInfosAboutX', [kpiName]) }}
        </span>
      </b-button>
      <dl class="mb-0">
        <dt
          class="ps_gs-fz-18 font-weight-bold"
        >
          {{ formattedValue }}
        </dt>
        <dd class="mb-0">
          {{ kpiName }}
        </dd>
      </dl>
    </b-card>
  </b-col>
</template>

<script>
export default {
  name: 'KeyMetricsKpiCard',
  props: {
    kpiValue: {
      type: String,
      required: true,
    },
    kpiName: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      default: '',
      required: false,
    },
    kpiType: {
      type: String,
      required: true,
    },
  },
  computed: {
    formattedValue() {
      const googleAdsAccount = this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];

      if (!googleAdsAccount) {
        return '--';
      }

      return this.$options.filters.formatKpi(this.kpiValue, this.kpiType);
    },
  },
};
</script>
