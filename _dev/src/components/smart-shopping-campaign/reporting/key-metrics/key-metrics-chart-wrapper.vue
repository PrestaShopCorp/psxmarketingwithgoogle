<template>
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
  </section>
</template>

<script>
export default {
  name: 'KeyMetricsChartWrapper',
  data() {
    return {
      selectedDailyResultKpi: 'impressions',
    };
  },
  props: {
    kpis: {
      type: Array,
      required: true,
    },
  },
};
</script>
