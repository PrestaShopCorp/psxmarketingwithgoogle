<template>
  <div>
    <product-feed-settings
      :active-step="activeStep"
      @cancelProductFeedProcess="onCancelProductFeedSettingsConfiguration"
    />
    <PsToast
      variant="success"
      :visible="activeStep === 4"
      toaster="b-toaster-top-right"
    >
      <p>{{ $t('toast.attributesMapppingSuccess') }}</p>
    </PsToast>
    <!-- MODAL CANCEL -->
    <ProductFeedPopinCancel
      ref="productFeedCancelModal"
    />
  </div>
</template>

<script>
import ProductFeedSettings from '../components/product-feed/product-feed-settings';
import PsToast from '../components/commons/ps-toast';
import ProductFeedPopinCancel from '../components/product-feed/product-feed-popin-cancel';

export default {
  name: 'TunnelProductFeed',
  components: {
    ProductFeedSettings,
    PsToast,
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
    if (!this.$store.getters['productFeed/GET_PRODUCT_FEED_SETTINGS'].targetCountries.length) {
      this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
    }
    this.$store.dispatch('productFeed/GET_LAST_SYNCHRONISATION');
  },

};
</script>

<style>

</style>
