<template>
  <div>
    <b-form-group
      class="d-none d-sm-block"
    >
      <b-form-radio-group
        buttons
        button-variant="default rounded-0"
        size="sm"
        v-model="selectedPeriod"
        :options="periods"
      />
    </b-form-group>
    <b-dropdown
      id="periodSelectorMobile"
      :text="$t(`keymetrics.periods.${selectedPeriod}`)"
      variant=" "
      class="ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250 mb-2 d-sm-none"
      size="sm"
      menu-class="ps-dropdown"
      no-flip
    >
      <b-dropdown-item
        v-for="{value, text} in periods"
        :key="value"
        link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
        @click="selectedPeriod = period"
      >
        {{ text }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'KeyMetricsPeriodSelector',
  data() {
    return {
      selectedPeriod: 'yesterday',
      periods: [
        {
          value: 'yesterday',
          text: this.$i18n.t('keymetrics.periods.yesterday'),
        },
        {
          value: 'last7Days',
          text: this.$i18n.t('keymetrics.periods.last7Days'),
        },
        {
          value: 'last30Days',
          text: this.$i18n.t('keymetrics.periods.last30Days'),
        },
        {
          value: '3Months',
          text: this.$i18n.t('keymetrics.periods.3Months'),
        },
      ],
    };
  },
};
</script>
