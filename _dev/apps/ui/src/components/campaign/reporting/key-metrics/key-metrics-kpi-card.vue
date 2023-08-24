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
      :border-variant="disabled ? 'light': 'primary'"
      :text-variant="textVariant"
      body-class="p-2"
      :style="{ 'background-color': !disabled && activeColor }"
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
          {{ getFormattedValue }}
        </dd>
      </dl>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import KpiType from '@/enums/reporting/KpiType';
import { PropType } from 'vue';
import { DailyResultColor } from '@/store/modules/campaigns/state';

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
    kpiType: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    activeColor: {
      type: String as PropType<DailyResultColor|null>,
      default: null,
      required: false,
    },
  },
  computed: {
    currencyCode(): string|undefined {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']?.currencyCode;
    },
    getFormattedValue(): string {
      if (this.disabled) {
        return '--';
      }

      if (this.kpiType === KpiType.CLICKS
        || this.kpiType === KpiType.CONVERSIONS
        || this.kpiType === KpiType.IMPRESSIONS) {
        return this.kpiValue;
      }
  
      return this.$options.filters.formatPrice(this.kpiValue, this.currencyCode);
    },
    textVariant(): string {
      if (this.disabled) {
        return 'light';
      }
      if ([DailyResultColor.BLACK, DailyResultColor.BLUE].includes(this.activeColor)) {
        return 'white';
      }
      return 'primary';
    },
  },
};
</script>
