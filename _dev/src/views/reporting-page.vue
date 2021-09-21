<template>
  <div id="reporting-page">
    <KeyMetricsBlock />
    <CampaignsPerformanceTable />
  </div>
</template>

<script>
import CampaignsPerformanceTable from '../components/smart-shopping-campaign/reporting/campaigns-performance/campaigns-performance-table.vue';
import KeyMetricsBlock from '../components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue';

export default {
  components: {
    KeyMetricsBlock,
    CampaignsPerformanceTable,
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
    this.getDatas()
      .then(() => {
        if (!this.googleAdsChosen || !this.remarketingTagIsSet) {
          this.$router.push({
            name: 'onboarding',
          });
        }
      });
  },
};
</script>
