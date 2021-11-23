<template>
  <div>
    <product-feed-settings
      :active-step="activeStep"
      @cancelProductFeedProcess="onCancelProductFeedSettingsConfiguration"
    />
    <!-- MODAL CANCEL -->
    <ProductFeedPopinCancel
      ref="productFeedCancelModal"
    />
  </div>
</template>

<script>
import ProductFeedSettings from '../components/product-feed/product-feed-settings';
import ProductFeedPopinCancel from '../components/product-feed/product-feed-popin-cancel';

export default {
  name: 'TunnelProductFeed',
  components: {
    ProductFeedSettings,
    ProductFeedPopinCancel,
  },
  computed: {
    activeStep() {
      return this.$store.state.productFeed.stepper;
    },
  },
  methods: {
    onCancelProductFeedSettingsConfiguration() {
      this.$bvModal.show(
        this.$refs.productFeedCancelModal.$refs.modal.id,
      );
    },
  },
  beforeCreate() {
    this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
    this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS');
    this.$store.dispatch('productFeed/GET_TOTAL_PRODUCTS');
    this.$store.dispatch('googleAds/GET_GOOGLE_ADS_LIST')
    .then(() => this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT'));
  },

};
</script>
