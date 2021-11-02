<template>
  <div>
    <product-feed-table-status-details v-if="$route.path === '/product-feed/status'" />
    <template v-else>
      <b-alert
        :show="syncStatus === 'success'"
        variant="success"
        class="mb-0 mt-3 mb-3"
      >
        {{ $t('productFeedPage.alert.alertSuccess') }}
      </b-alert>
      <product-feed-sync-status-card />
      <product-feed-product-status-card />
    </template>
  </div>
</template>

<script>
import ProductFeedProductStatusCard from '@/components/product-feed-page/product-feed-product-status-card';
import ProductFeedSyncStatusCard from '@/components/product-feed-page/product-feed-sync-status-card';
import ProductFeedTableStatusDetails from '@/components/product-feed-page/product-feed-table-status-details';

export default {
  components: {
    ProductFeedSyncStatusCard,
    ProductFeedProductStatusCard,
    ProductFeedTableStatusDetails,
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

<style>

</style>
