<template>
  <b-col
    cols="12"
    sm="6"
    md="4"
    xl="2"
    class="py-1 d-flex flex-column"
  >
    <b-card
      class="ps_gs-kpi-card flex-grow-1 ps_gs-cursor-disabled"
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
      <b-link
        v-if="!disabled && (dailyResultSpotAvailable || activeColor)"
        class="stretched-link external_link-no_icon"
        @click="$emit('toggleKpi')"
      />
    </b-card>
  </b-col>
</template>

<script lang="ts">
import {PropType} from 'vue';
import KpiType from '@/enums/reporting/KpiType';
import {DailyResultColor} from '@/store/modules/campaigns/state';
import {formatPrice} from '@/utils/Price';

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
      type: String as PropType<KpiType>,
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
    dailyResultSpotAvailable(): boolean {
      return this.$store.getters['campaigns/GET_REPORTING_DAILY_RESULT_TYPES_AVAILABLE'];
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

      return formatPrice(this.kpiValue, this.currencyCode);
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
