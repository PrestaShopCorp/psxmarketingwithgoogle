<template>
  <div id="reporting-page">
    <KeyMetricsBlock />
    <CampaignsPerformanceTable />
    <ProductsPerformanceTable />
  </div>
</template>

<script>
import CampaignsPerformanceTable from '../components/smart-shopping-campaign/reporting/campaigns-performance/campaigns-performance-table.vue';
import KeyMetricsBlock from '../components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue';
import ProductsPerformanceTable from '../components/smart-shopping-campaign/reporting/products-performance/products-performance-table.vue';

export default {
  components: {
    KeyMetricsBlock,
    CampaignsPerformanceTable,
    ProductsPerformanceTable,
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
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
      await this.$store.dispatch('smartShoppingCampaigns/UPDATE_ALL_REPORTING_DATA');
    },
  },
  mounted() {
    this.getDatas()
      .then(() => {
        if (!this.remarketingTagIsSet || !this.googleAdsChosen) {
          this.$router.push({
            name: 'onboarding',
          });
        }
      });
  },
};
</script>
