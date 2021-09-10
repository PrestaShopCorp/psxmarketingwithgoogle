<template>
  <div>
    <b-button-group
      size="sm"
      class="d-none d-sm-inline-flex"
    >
      <b-button
        v-for="period in periods"
        variant="default"
        class="rounded-0"
        :key="period"
      >
        {{ $t(`keymetrics.periods.${period}`) }}
      </b-button>
    </b-button-group>
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
        v-for="period in periods"
        :key="period"
        link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
        @click="selectedPeriod = period"
      >
        {{ $t(`keymetrics.periods.${period}`) }}
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
        'yesterday',
        'last7Days',
        'last30Days',
        '3Months',
      ],
    };
  },
};
</script>
