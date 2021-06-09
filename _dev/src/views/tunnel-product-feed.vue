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
    // ? Where do we get the active step ? Is it in backend ?
    // ? For now it is just in the store and 1 by default
    activeStep() {
      return this.$store.state.productFeed.productFeed.stepper;
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
    this.$store.dispatch('productFeed/GET_SHIPPING_SETTINGS');
    this.$store.dispatch('productFeed/GET_LAST_SYNCHRONISATION');
  },

};
</script>

<style>

</style>
