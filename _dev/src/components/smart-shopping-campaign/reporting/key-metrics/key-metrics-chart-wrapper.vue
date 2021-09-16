<template>
  <section class="pt-2 mt-5">
    <div class="flex-wrap d-flex align-items-center justify-content-between">
      <h4 class="flex-shrink-0 mb-2 mr-3 font-weight-600 ps_gs-fz-16">
        {{ $t('keymetrics.dailyResultTitle') }}
      </h4>
      <b-dropdown
        id="dailyResultKpi"
        ref="dailyResultKpi"
        :text="$t(`keymetrics.${dailyResultTypeSelected}`)"
        variant=" "
        class="mb-2 ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250"
        size="sm"
        menu-class="ps-dropdown"
        no-flip
      >
        <b-dropdown-item
          v-for="dailyresultType in dailyResultTypeList"
          :key="dailyresultType"
          link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
          @click="dailyResultTypeSelected = dailyresultType"
        >
          {{ $t(`keymetrics.${dailyresultType}`) }}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div>
      placeholder chart
    </div>
  </section>
</template>

<script>
import DailyResultType from '@/enums/reporting/DailyResultType';

export default {
  name: 'KeyMetricsChartWrapper',
  computed: {
    dailyResultTypeList() {
      return Object.values(DailyResultType);
    },
    dailyResultTypeSelected: {
      get() {
        return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_DAILY_RESULT_TYPE'];
      },
      set(dailyResultType) {
        this.$store.commit('smartShoppingCampaigns/SET_REPORTING_DAILY_RESULTS_TYPE', dailyResultType);
      },
    },
  },
};
</script>
