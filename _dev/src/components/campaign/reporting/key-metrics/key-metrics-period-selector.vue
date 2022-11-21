<template>
  <div>
    <b-form-group
      class="mb-0 d-none d-sm-block"
    >
      <b-form-radio-group
        buttons
        button-variant="outline-primary rounded-0"
        size="sm"
        v-model="reportingPeriod"
        :options="periods"
        :disabled="inNeedOfConfiguration"
      />
    </b-form-group>
    <b-dropdown
      id="periodSelectorMobile"
      :text="$t(`keymetrics.periods.${reportingPeriod}`)"
      variant=" "
      class="mb-2 ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250 d-sm-none"
      size="sm"
      menu-class="ps-dropdown"
    >
      <b-dropdown-item
        v-for="{value, text} in periods"
        :key="value"
        link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
        @click="reportingPeriod = value"
        :disabled="inNeedOfConfiguration"
      >
        {{ text }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import ReportingPeriod from '@/enums/reporting/ReportingPeriod';

export default {
  name: 'KeyMetricsPeriodSelector',
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      periods: [
        {
          value: ReportingPeriod.YESTERDAY,
          text: this.$i18n.t(`keymetrics.periods.${ReportingPeriod.YESTERDAY}`),
        },
        {
          value: ReportingPeriod.LAST_SEVEN_DAYS,
          text: this.$i18n.t(`keymetrics.periods.${ReportingPeriod.LAST_SEVEN_DAYS}`),
        },
        {
          value: ReportingPeriod.LAST_THIRTY_DAY,
          text: this.$i18n.t(`keymetrics.periods.${ReportingPeriod.LAST_THIRTY_DAY}`),
        },
        {
          value: ReportingPeriod.THREE_MONTH,
          text: this.$i18n.t(`keymetrics.periods.${ReportingPeriod.THREE_MONTH}`),
        },
      ],
    };
  },
  computed: {
    reportingPeriod: {
      get() {
        return this.$store.getters['campaigns/GET_REPORTING_PERIOD_SELECTED'];
      },
      set(period) {
        this.$store.dispatch('campaigns/CHANGE_REPORTING_DATES', period);
      },
    },
  },
};
</script>
