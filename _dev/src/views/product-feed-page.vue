<template>
  <div>
    <b-alert
      show
      variant="success"
      class="mb-0 mt-3 mb-3"
    >
      {{ $t('productFeedCard.alertSuccess') }}
    </b-alert>
    <product-feed-sync-status-card />
    <product-feed-product-status-card />
  </div>
</template>

<script>
import ProductFeedProductStatusCard from '../components/product-feed-page/product-feed-product-status-card';
import ProductFeedSyncStatusCard from '../components/product-feed-page/product-feed-sync-status-card';

export default {
  components: {
    ProductFeedSyncStatusCard,
    ProductFeedProductStatusCard,
  },

  computed: {
    productFeedStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'];
    },
  },
  beforeCreate() {
    this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS');
    this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
  },

};
</script>

<style>

</style>
