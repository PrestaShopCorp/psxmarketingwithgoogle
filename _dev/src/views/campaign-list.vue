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
      <smart-shopping-campaign-table-list
        :loading="loadingCampaignList"
        @loader="changeLoadingState($event)"
        :in-need-of-configuration="inNeedOfConfiguration"
      />
    </b-skeleton-wrapper>
    <SSCPopinActivateTracking
      ref="SSCPopinActivateTrackingList"
      modal-id="SSCPopinActivateTrackingList"
    />
  </div>
</template>

<script>
import SSCPopinActivateTracking from '../components/smart-shopping-campaigns/ssc-popin-activate-tracking.vue';
import SmartShoppingCampaignTableList from '../components/smart-shopping-campaign/smart-shopping-campaign-table-list.vue';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  components: {
    SSCPopinActivateTracking,
    SmartShoppingCampaignTableList,
  },

  data() {
    return {
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
        this.$store.dispatch('smartShoppingCampaigns/GET_SSC_LIST', {isNewRequest: true, typeChosen: this.$options.CampaignTypes.PERFORMANCE_MAX}),
        this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE'),
        this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED'),
      ]);
    },
    onOpenPopinActivateTracking() {
      this.$bvModal.show(
        this.$refs.SSCPopinActivateTrackingList.$refs.modal.id,
      );
    },
    changeLoadingState(event) {
      this.loadingCampaignList = event;
    },
  },
  async created() {
    if (this.inNeedOfConfiguration) {
      await this.$store.dispatch('accounts/REQUEST_ACCOUNTS_DETAILS');
    }
    // Not dispatch if there already are campaigns in the store
    if (!this.SSCExist) {
      this.getDatas()
        .then(() => {
          this.loadingPage = false;
        });
    } else {
      this.loadingPage = false;
    }
  },
  CampaignTypes,
};
</script>
