<template>
  <div>
    <product-feed-settings
      :active-step="activeStep"
    />
    <PsToast
      variant="success"
      :visible="activeStep === 4"
      toaster="b-toaster-top-right"
    >
      <p>{{ $t('toast.attributesMapppingSuccess') }}</p>
    </PsToast>
  </div>
</template>

<script>
import ProductFeedSettings from '../components/product-feed/product-feed-settings';
import PsToast from '../components/commons/ps-toast';

export default {
  name: 'TunnelProductFeed',
  components: {
    ProductFeedSettings,
    PsToast,
  },
  computed: {
    // ? Where do we get the active step ? Is it in backend ?
    // ? For now it is just in the store and 1 by default
    activeStep() {
      return this.$store.state.productFeed.productFeed.stepper;
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
