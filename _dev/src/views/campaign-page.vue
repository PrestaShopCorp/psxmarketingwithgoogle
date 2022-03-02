<template>
  <div>
    <b-skeleton-wrapper
      :loading="loadingPage"
      class="mb-3"
    >
      <template #loading>
        <b-card>
          <b-skeleton width="85%" />
          <b-skeleton width="55%" />
          <b-skeleton width="70%" />
        </b-card>
      </template>
      <campaign-card
        v-if="$route.name === 'campaign'"
        @openPopin="onOpenPopinActivateTracking"
      />
      <smart-shopping-campaign-table-list
        :loading="loadingCampaignList"
        @loader="changeLoadingState($event)"
        v-else-if="$route.name === 'campaign-list'"
        :in-need-of-configuration="inNeedOfConfiguration"
      />
      <smart-shopping-campaign-creation
        v-else-if="$route.name === 'campaign-edition' || $route.name === 'campaign-creation'"
        :edit-mode="$route.name === 'campaign-edition' ? true : false"
        @campaignCreated="onCampaignHasBeenCreated"
      />
    </b-skeleton-wrapper>
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
      loadingCampaignList: true,
      loadingPage: true,
    };
  },
  computed: {
    inNeedOfConfiguration() {
      return !this.googleAdsIsServing;
    },
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
      this.$store.dispatch('smartShoppingCampaigns/GET_DIMENSIONS_FILTERS', null);
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_LIST');
      await Promise.allSettled([
        this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT'),
        this.$store.dispatch('productFeed/GET_TOTAL_PRODUCTS'),
        this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS'),
        this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS'),
        this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_SUMMARY'),
        this.$store.dispatch('smartShoppingCampaigns/GET_SSC_LIST'),
        this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE'),
        this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED'),
      ]);
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
      this.loadingCampaignList = event;
    },
  },
  mounted() {
    if (!this.inNeedOfConfiguration) {
      this.getDatas()
        .then(() => {
          this.loadingPage = false;
          if (this.$route.name === 'campaign' && this.SSCExist) {
            this.$router.push({
              name: 'campaign-list',
            });
          }
        });
    }
    this.loadingPage = false;
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
