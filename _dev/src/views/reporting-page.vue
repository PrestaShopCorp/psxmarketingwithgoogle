<template>
  <div id="reporting-page">
    <KeyMetricsBlock />
    <CampaignsPerformanceTable />
    <ProductsPerformanceTable />
    <FiltersPerformanceTable />
  </div>
</template>

<script>
import CampaignsPerformanceTable from '../components/smart-shopping-campaign/reporting/campaigns-performance/campaigns-performance-table.vue';
import KeyMetricsBlock from '../components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue';
import ProductsPerformanceTable from '../components/smart-shopping-campaign/reporting/products-performance/products-performance-table.vue';
import FiltersPerformanceTable from '../components/smart-shopping-campaign/reporting/filters-performance/filters-performance-table.vue';

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
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('smartShoppingCampaigns/SET_REPORTING_DATES_RANGE');
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_LIST');
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
      await this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
      await this.$store.dispatch('smartShoppingCampaigns/GET_SSC_LIST');
    },
  },
  created() {
    this.getDatas()
      .then(() => {
        if (!this.reportingTabIsActive) {
          this.$router.push({
            name: 'onboarding',
          });
        }
      });
  },
};
</script>
