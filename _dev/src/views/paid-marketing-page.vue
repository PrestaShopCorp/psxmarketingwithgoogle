<template>
  <div>
    <paid-marketing-card />
  </div>
</template>

<script>
import paidMarketingCard from '../components/paid-marketing/paid-marketing-card.vue';

export default {
  components: {paidMarketingCard},
  computed: {
    googleAdsIsChosen() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];
    },
  },
  mounted() {
    if (!this.googleAdsIsChosen) {
      this.$router.push({
        name: 'onboarding',
      });
    }
  },

};
</script>

<style>

</style>
