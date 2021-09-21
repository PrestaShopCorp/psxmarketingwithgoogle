<template>
  <div>
    <campaign-card
      @openPopin="onOpenPopinActivateTracking"
      v-if="$route.name === 'campaign' && !SSCExist"
    />
    <!-- here component v-if="$route.name === 'campaign' && SSCExist"  -->
    <smart-shopping-campaign-creation
      v-if="$route.name === 'campaign-creation'"
      @campaignCreated="onCampaignHasBeenCreated"
    />
    <SSCPopinActivateTracking
      ref="SSCPopinActivateTracking"
    />
    <PsToast
      v-if="campaignCreated"
      variant="success"
      @hidden="toastIsClosed"
      :visible="campaignCreated"
      toaster="b-toaster-top-right"
    >
      <p>{{ insideToast }}</p>
    </PsToast>
  </div>
</template>

<script>
import CampaignCard from '../components/smart-shopping-campaigns/campaign-card.vue';
import SSCPopinActivateTracking from '../components/smart-shopping-campaigns/ssc-popin-activate-tracking.vue';
import SmartShoppingCampaignCreation from '../components/smart-shopping-campaign-creation/smart-shopping-campaign-creation.vue';
import PsToast from '../components/commons/ps-toast';

export default {
  components: {
    CampaignCard,
    SmartShoppingCampaignCreation,
    SSCPopinActivateTracking,
    PsToast,
  },

  data() {
    return {
      campaignCreated: false,
    };
  },
  computed: {
    googleAdsIsChosen() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];
    },
    SSCExist() {
      return !!this.$store.getters['smartShoppingCampaigns/GET_ALL_SSC']?.length;
    },

    insideToast() {
      if (this.campaignCreated) {
        return this.$t('toast.campaignCreatedSuccess');
      }
      return '';
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
    onCampaignHasBeenCreated() {
      this.campaignCreated = true;
    },
    toastIsClosed() {
      this.campaignCreated = false;
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
