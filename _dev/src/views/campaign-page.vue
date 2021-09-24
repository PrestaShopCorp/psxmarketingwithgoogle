<template>
  <div>
    <campaign-card
      @openPopin="onOpenPopinActivateTracking"
      v-if="$route.name === 'campaign'"
    />
    <smart-shopping-campaign-table-list
      :loading="loading"
      v-else-if="$route.name === 'campaign-list'"
    />
    <smart-shopping-campaign-creation
      v-else-if="$route.name === 'campaign-creation'"
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
import SmartShoppingCampaignTableList from '../components/smart-shopping-campaign/smart-shopping-campaign-table-list.vue';

export default {
  components: {
    CampaignCard,
    SmartShoppingCampaignCreation,
    SSCPopinActivateTracking,
    PsToast,
    SmartShoppingCampaignTableList,
  },

  data() {
    return {
      campaignCreated: false,
      loading: true,
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
      await this.$store.dispatch('smartShoppingCampaigns/GET_SSC_LIST').then(() => {
        this.loading = false;
      });
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
  watch: {
    $route: {
      handler(route) {
        if (route.name === 'campaign' && this.SSCExist) {
          this.$router.push({
            name: 'campaign-list',
          });
        }
        this.$store.commit('accounts/SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE', false);
        this.$store.commit('accounts/SAVE_MCA_CONNECTED_ONCE', false);
        this.$store.commit('productFeed/SAVE_CONFIGURATION_CONNECTED_ONCE', false);
        this.$store.commit('freeListing/SAVE_ACTIVATED_ONCE', false);
        this.$store.commit('googleAds/SAVE_GOOGLE_ADS_ACCOUNT_CONNECTED_ONCE', false);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>

</style>
