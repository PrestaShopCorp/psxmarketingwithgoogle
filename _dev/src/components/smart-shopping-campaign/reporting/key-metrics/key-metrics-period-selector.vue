<template>
  <div>
    <b-form-group
      class="d-none d-sm-block"
    >
      <b-form-radio-group
        buttons
        button-variant="default rounded-0"
        size="sm"
        v-model="reportingPeriod"
        :options="periods"
      />
    </b-form-group>
    <b-dropdown
      id="periodSelectorMobile"
      :text="$t(`keymetrics.periods.${reportingPeriod}`)"
      variant=" "
      class="mb-2 ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250 d-sm-none"
      size="sm"
      menu-class="ps-dropdown"
      no-flip
    >
      <b-dropdown-item
        v-for="{value, text} in periods"
        :key="value"
        link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
        @click="reportingPeriod = value"
      >
        {{ text }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import ReportingPeriod from '../../../../enums/ReportingPeriod';

export default {
  name: 'KeyMetricsPeriodSelector',
  data() {
    return {
      periods: [
        {
          value: ReportingPeriod.YESTERDAY,
          text: this.$i18n.t('keymetrics.periods.yesterday'),
        },
        {
          value: ReportingPeriod.LAST_SEVEN_DAYS,
          text: this.$i18n.t('keymetrics.periods.last7Days'),
        },
        {
          value: ReportingPeriod.LAST_THIRTY_DAY,
          text: this.$i18n.t('keymetrics.periods.last30Days'),
        },
        {
          value: ReportingPeriod.THREE_MONTH,
          text: this.$i18n.t('keymetrics.periods.3Months'),
        },
      ],
    };
  },
  computed: {
    reportingPeriod: {
      get() {
        return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_PERIOD_SELECTED'];
      },
      set(period) {
        this.$store.commit('smartShoppingCampaigns/SET_REPORTING_PERIOD_SELECTED', period);
      },
    },
  },
};
</script>
