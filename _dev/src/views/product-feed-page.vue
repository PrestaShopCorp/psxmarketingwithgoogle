<template>
  <div>
    <product-feed-table-status-details v-if="$route.path === '/product-feed/status'" />
    <template v-else>
      <PsToast
        v-if="syncStatus === 'success'"
        variant="success"
        :visible="syncStatus === 'success'"
        toaster="b-toaster-top-right"
      >
        <p> {{ $t('productFeedPage.alert.alertSuccess') }}</p>
      </PsToast>
      <sync-timeline />
      <sync-overview />
    </template>
  </div>
</template>

<script>
import ProductFeedTableStatusDetails from '@/components/product-feed-page/product-feed-table-status-details';
import SyncTimeline from '@/components/sync-timeline/sync-timeline';
import SyncOverview from '@/components/product-feed-page/sync-overview.vue';
import PsToast from '../components/commons/ps-toast';

export default {
  components: {
    ProductFeedTableStatusDetails,
    SyncTimeline,
    SyncOverview,
    PsToast,
  },
  computed: {
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
    productFeedIsConfigured() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED'];
    },
  },
  methods: {
    async getDatas() {
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
      await this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_SUMMARY');
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_LIST');
      await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
      await this.$store.dispatch('smartShoppingCampaigns/GET_SSC_LIST');
    },
  },
  mounted() {
    this.getDatas()
      .then(() => {
        if (!this.productFeedIsConfigured) {
          this.$router.push({
            name: 'onboarding',
          });
        }
      });
  },
};
</script>
