<template>
  <div>
    <campaign-card
      @openPopin="onOpenPopinActivateTracking"
      v-if="$route.name === 'campaign' && !SSCExist"
    />
    <smart-shopping-campaign-table-list
      :loading="loading"
      @loader="changeLoadingState($event)"
      v-else-if="$route.name === 'campaign-list' || $route.name === 'campaign' && SSCExist"
    />
    <smart-shopping-campaign-creation
      v-else-if="$route.name === 'campaign-creation'"
      @campaignCreated="onCampaignHasBeenCreated"
    />
    <smart-shopping-campaign-creation
      v-if="$route.name === 'campaign-edition'"
      :edit-mode="true"
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
      loading: false,
    };
  },
  computed: {
    googleAdsIsServing() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_IS_SERVING'];
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
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_LIST');
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
      await this.$store.dispatch('productFeed/GET_TOTAL_PRODUCTS');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_SUMMARY');
      await this.$store.dispatch('smartShoppingCampaigns/GET_SSC_LIST');
      await this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE');
      await this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED');
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
    changeLoadingState(event) {
      this.loading = event;
    },
  },
  mounted() {
    this.getDatas()
      .then(() => {
        if (!this.googleAdsIsServing) {
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
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
