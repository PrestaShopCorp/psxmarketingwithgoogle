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
    remarketingTagIsSet() {
      return this.$store.getters['smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_IS_SET'];
    },
    googleAdsChosen() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']
        && this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'].billingSettings.isSet;
    },
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('smartShoppingCampaigns/UPDATE_ALL_REPORTING_DATA');
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
    },
  },
  mounted() {
    this.getDatas();
  },
};
</script>
