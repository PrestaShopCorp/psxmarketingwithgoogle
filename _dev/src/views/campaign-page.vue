<template>
  <div>
    <campaign-card />
  </div>
</template>

<script>
import campaignCard from '../components/campaign/campaign-card.vue';

export default {
  components: {campaignCard},
  computed: {
    googleAdsIsChosen() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];
    },
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_SUMMARY');
    },
  },
  mounted() {
    this.getDatas()
      .then(() => {
        if (!this.googleAdsIsChosen) {
          this.$router.push({
            name: 'onboarding',
          });
        }
      });
  },
};
</script>

<style>

</style>
