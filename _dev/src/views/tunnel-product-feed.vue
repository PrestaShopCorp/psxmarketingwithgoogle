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
import ProductFeedSettingsPages from '../enums/product-feed/product-feed-settings-pages.ts';

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
    this.$store.dispatch('productFeed/WARMUP_STORE');
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('productFeed/SET_IS_IN_ON_FUNNEL', false);
    // when the funnel is over to sent data to API, no need to call again for getSettings route.
    if (from.params.step === ProductFeedSettingsPages.SUMMARY && to.name === 'configuration') {
      next();
      return;
    }
    this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
    next();
  },
};
</script>
