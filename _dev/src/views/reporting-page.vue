<template>
  <div id="reporting-page">
    <KeyMetricsBlock />
  </div>
</template>

<script>
import KeyMetricsBlock from '../components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue';

export default {
  components: {
    KeyMetricsBlock,
  },
  computed: {
    remarketingTagIsSetted() {
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
        if (!this.googleAdsChosen || !this.remarketingTagIsSetted) {
          this.$router.push({
            name: 'onboarding',
          });
        }
      });
  },
};
</script>
