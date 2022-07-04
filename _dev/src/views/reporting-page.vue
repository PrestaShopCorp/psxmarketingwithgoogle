<template>
  <div id="reporting-page">
    <KeyMetricsBlock :in-need-of-configuration="inNeedOfConfiguration" />
    <template v-if="!inNeedOfConfiguration">
      <CampaignsPerformanceTable />
      <ProductsPerformanceTable />
      <FiltersPerformanceTable />
    </template>
  </div>
</template>

<script>
import CampaignsPerformanceTable from '../components/smart-shopping-campaign/reporting/campaigns-performance/campaigns-performance-table.vue';
import KeyMetricsBlock from '../components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue';
import ProductsPerformanceTable from '../components/smart-shopping-campaign/reporting/products-performance/products-performance-table.vue';
import FiltersPerformanceTable from '../components/smart-shopping-campaign/reporting/filters-performance/filters-performance-table.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  components: {
    KeyMetricsBlock,
    CampaignsPerformanceTable,
    ProductsPerformanceTable,
    FiltersPerformanceTable,
  },
  computed: {
    reportingTabIsActive() {
      return this.$store.getters['smartShoppingCampaigns/GET_REPORTING_TAB_IS_ACTIVE'];
    },
    inNeedOfConfiguration() {
      return !this.reportingTabIsActive;
    },
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('smartShoppingCampaigns/WARMUP_STORE');
    },
  },

  async created() {
    if (this.inNeedOfConfiguration) {
      await this.$store.dispatch('accounts/WARMUP_STORE');
    }
    this.getDatas();
  },
  CampaignTypes,
};
</script>
