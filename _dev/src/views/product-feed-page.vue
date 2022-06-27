<template>
  <div>
    <product-feed-table-status-details v-if="$route.name === 'product-feed-status'" />
    <product-feed-pre-scan-table-status-details
      v-else-if="$route.path === '/product-feed/pre-scan'"
    />
    <template v-else>
      <PsToast
        v-if="allDataLoaded && syncStatus === 'schedule' && !inNeedOfConfiguration"
        variant="warning"
        :visible="syncStatus === 'schedule' && !inNeedOfConfiguration"
        toaster="b-toaster-top-right"
      >
        <p> {{ $t('productFeedPage.alert.alertSuccess') }}</p>
      </PsToast>
      <sync-timeline
        v-if="!inNeedOfConfiguration"
      />
      <sync-overview
        :in-need-of-configuration="inNeedOfConfiguration"
      />
    </template>
  </div>
</template>

<script>
import ProductFeedTableStatusDetails from '@/components/product-feed-page/product-feed-table-status-details';
import ProductFeedPreScanTableStatusDetails from '@/components/product-feed-page/product-feed-pre-scan-table-status-details';
import SyncTimeline from '@/components/sync-timeline/sync-timeline';
import SyncOverview from '@/components/product-feed-page/sync-overview.vue';
import PsToast from '../components/commons/ps-toast';
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  data() {
    return {
      allDataLoaded: false,
    };
  },
  components: {
    ProductFeedTableStatusDetails,
    ProductFeedPreScanTableStatusDetails,
    SyncTimeline,
    SyncOverview,
    PsToast,
  },
  computed: {
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
    inNeedOfConfiguration() {
      // TODO: check if in need of configuration
      return !this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED'];
    },
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('productFeed/GET_PREVALIDATION_SUMMARY');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_SUMMARY');
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_LIST');
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
      await this.$store.dispatch('smartShoppingCampaigns/GET_CAMPAIGNS_LIST', {isNewRequest: true, typeChosen: this.$options.CampaignTypes.PERFORMANCE_MAX});
    },
  },
  async created() {
    if (this.inNeedOfConfiguration) {
      await this.$store.dispatch('accounts/REQUEST_ACCOUNTS_DETAILS');
    }
    this.getDatas().then(() => {
      this.allDataLoaded = true;
    });
  },
  CampaignTypes,
};
</script>
