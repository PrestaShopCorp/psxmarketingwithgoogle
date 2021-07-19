<template>
  <div>
    <product-feed-table-status-details v-if="visible" />
    <template v-else>
      <b-alert
        :show="syncStatus === 'success' || 'schedule'"
        variant="success"
        class="mb-0 mt-3 mb-3"
      >
        {{ $t('productFeedCard.alertSuccess') }}
      </b-alert>
      <product-feed-sync-status-card />
      <product-feed-product-status-card @showProductReporting="displayReporting" />
    </template>
  </div>
</template>

<script>
import ProductFeedProductStatusCard from '../components/product-feed-page/product-feed-product-status-card';
import ProductFeedSyncStatusCard from '../components/product-feed-page/product-feed-sync-status-card';
import ProductFeedTableStatusDetails from '../components/product-feed-page/product-feed-table-status-details';

export default {
  components: {
    ProductFeedSyncStatusCard,
    ProductFeedProductStatusCard,
    ProductFeedTableStatusDetails,
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
  },
  methods: {
    displayReporting() {
      this.visible = true;
    },
  },
  beforeCreate() {
    this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS');
    this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
    this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_SUMMARY');
  },

};
</script>

<style>

</style>
