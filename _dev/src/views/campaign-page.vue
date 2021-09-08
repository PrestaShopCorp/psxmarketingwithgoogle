<template>
  <div>
    <campaign-card
      @openPopin="onOpenPopinActivateTracking"
      v-if="$route.path === '/campaign'"
    />
    <smart-shopping-campaign-creation
      v-if="$route.path === '/creation'"
    />
    <SSCPopinActivateTracking
      ref="SSCPopinActivateTracking"
    />
  </div>
</template>

<script>
import CampaignCard from '../components/smart-shopping-campaigns/campaign-card.vue';
import SSCPopinActivateTracking from '../components/smart-shopping-campaigns/ssc-popin-activate-tracking.vue';
import SmartShoppingCampaignCreation from '../components/smart-shopping-campaign-creation/smart-shopping-campaign-creation.vue';

export default {
  components: {
    CampaignCard,
    SmartShoppingCampaignCreation,
    SSCPopinActivateTracking,
  },
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
    onOpenPopinActivateTracking() {
      this.$bvModal.show(
        this.$refs.SSCPopinActivateTracking.$refs.modal.id,
      );
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
