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
      body-class="p-2"
    >
      <dl class="mb-0">
        <dt
          class="mb-0 font-weight-normal"          
        >
          {{ kpiName }}
        </dt>
        <dd
          class="ps_gs-fz-24 font-weight-700 mb-0"  
        >
          {{ getFormattedValue(kpiValue) }}
        </dd>
      </dl>
    </b-card>
  </b-col>
</template>

<script>
import KpiType from '@/enums/reporting/KpiType';

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
    currencyCode() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']?.currencyCode;
    },
  },
  methods: {
    getFormattedValue() {
      if (this.kpiType === KpiType.CLICKS
        || this.kpiType === KpiType.CONVERSIONS
        || this.kpiType === KpiType.IMPRESSIONS) {
        return this.kpiValue;
      }

      return this.$options.filters.formatPrice(this.kpiValue, this.currencyCode);
    },
  },
};
</script>
