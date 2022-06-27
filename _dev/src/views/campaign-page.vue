<template>
  <div>
    <b-skeleton-wrapper
      v-if="$route.name === 'campaign'"
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
        @openPopin="onOpenPopinActivateTracking"
        :in-need-of-configuration="inNeedOfConfiguration"
      />
    </b-skeleton-wrapper>
    <SSCPopinActivateTracking
      ref="SSCPopinActivateTrackingCampaignPage"
      modal-id="SSCPopinActivateTrackingCampaignPage"
    />
    <!-- Need this new router-view since we now have nested children routes -->
    <router-view />
  </div>
</template>

<script>
import SSCPopinActivateTracking from '../components/smart-shopping-campaigns/ssc-popin-activate-tracking.vue';
import CampaignCard from '../components/smart-shopping-campaigns/campaign-card.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  components: {
    CampaignCard,
    SSCPopinActivateTracking,
  },

  data() {
    return {
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
    accountHasAtLeastOneCampaign() {
      return !!this.$store.getters['smartShoppingCampaigns/GET_ALL_CAMPAIGNS']?.length;
    },
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_LIST');
      await Promise.allSettled([
        this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT'),
        this.$store.dispatch('productFeed/GET_TOTAL_PRODUCTS_READY_TO_SYNC'),
        this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS'),
        this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS'),
        this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_SUMMARY'),
        this.$store.dispatch('smartShoppingCampaigns/GET_CAMPAIGNS_LIST', {isNewRequest: true, typeChosen: this.$options.CampaignTypes.PERFORMANCE_MAX}),
        this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE'),
        this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED'),
      ]);
    },
    onOpenPopinActivateTracking() {
      this.$bvModal.show(
        this.$refs.SSCPopinActivateTrackingCampaignPage.$refs.modal.id,
      );
    },
  },
  async created() {
    if (this.inNeedOfConfiguration) {
      await this.$store.dispatch('accounts/REQUEST_ACCOUNTS_DETAILS');
    }
    this.getDatas()
      .then(() => {
        this.loadingPage = false;
        if (this.$route.name === 'campaign' && this.accountHasAtLeastOneCampaign) {
          this.$router.push({
            name: 'campaign-list',
          });
        }
      }).finally(() => {
        this.loadingPage = false;
      });
  },
  watch: {
    $route: {
      handler(route) {
        if (route.name === 'campaign' && this.accountHasAtLeastOneCampaign) {
          this.$router.push({
            name: 'campaign-list',
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  CampaignTypes,
};
</script>
