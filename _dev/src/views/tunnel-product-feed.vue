<template>
  <div>
    <product-feed-settings
      :active-step="activeStep"
    />
  </div>
</template>

<script>
import ProductFeedSettings from '../components/product-feed/product-feed-settings';

export default {
  name: 'TunnelProductFeed',
  components: {
    ProductFeedSettings,
  },
  data() {
    return {
    };
  },
  computed: {
    // Where do we get the active step ? Is it in backend ? For now it is just in the store
    activeStep() {
      return this.$store.state.productFeed.productFeed.stepper;
    },
  },
  beforeCreate() {
    this.$store.dispatch('productFeed/GET_SHIPPING_SETTINGS');
  },

};
</script>

<style>

</style>
