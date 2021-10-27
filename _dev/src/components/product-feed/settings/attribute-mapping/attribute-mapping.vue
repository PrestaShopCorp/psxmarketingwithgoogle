<template>
  <div>
    <h3
      class="ps_gs-fz-20 font-weight-600 mb-2"
    >
      Map mandatory Google attributes to your custom fields
    </h3>
    <p>
      Google requires filling in a specific list of attributes depending on which product categories you sell. Map these attributes to your custom product fields to ensure your products are validated.
    </p>
    <product-feed-settings-footer />
  </div>
</template>

<script>
import ProductFeedSettingsFooter from '../../product-feed-settings-footer';
export default {
  name: 'ProductFeedSettingsAttributeMapping',
  components: {
    ProductFeedSettingsFooter,
  },
  data() {
    return {
    };
  },
  computed: {
    disableContinue() {
      return false;
    },
    sellApparel: {
      get() {
        // TODO
        // To clean in store
        return this.$store.getters['productFeed/GET_MERCHANT_SELL_APPAREL_AND_ACCESSORIES'];
      },
      set(value) {
        return this.$store.commit(
          // TODO
          // To clean in store
          'productFeed/TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_SELL_APPAREL', value,
        );
      },
    },
    sellRefurbished: {
      get() {
        // TODO
        // To clean in store
        return this.$store.getters['productFeed/GET_MERCHANT_SELL_REFURBISHED_PRODUCTS'];
      },
      set(value) {
        // TODO
        // To clean in store
        return this.$store.commit(
          'productFeed/TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_REFURBISHED', value,
        );
      },
    },
  },
  methods: {
    nextStep() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 4);
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
};
</script>
