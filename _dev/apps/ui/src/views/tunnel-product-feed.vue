<template>
  <div>
    <product-feed-settings
      :active-step="activeStep"
      @cancelProductFeedProcess="onCancelProductFeedSettingsConfiguration"
    />
    <!-- MODAL CANCEL -->
    <ProductFeedPopinCancel
      ref="productFeedCancelModal"
      @cancel-leave="onCancelLeave"
      @continue-leave="onContinueLeave"
    />
  </div>
</template>

<script>
import ProductFeedSettings from '../components/product-feed/product-feed-settings';
import ProductFeedPopinCancel from '../components/product-feed/product-feed-popin-cancel';
import {deleteProductFeedDataFromLocalStorage} from '@/utils/LocalStorage';

export default {
  name: 'TunnelProductFeed',
  components: {
    ProductFeedSettings,
    ProductFeedPopinCancel,
  },
  data() {
    return {
      nextRoute: null,
      navigationResolver: null,
    };
  },
  computed: {
    activeStep() {
      return this.$store.state.productFeed.stepper;
    },
  },
  methods: {
    onCancelProductFeedSettingsConfiguration() {
      this.$router.push({
        name: 'configuration',
        hash: '#product-feed-card',
      });
    },
    onCancelLeave() {
      this.$refs.productFeedCancelModal.$refs.modal.hide();
      this.nextRoute = null;

      if (this.navigationResolver) {
        this.navigationResolver(false);
        this.navigationResolver = null;
      }
    },
    onContinueLeave() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 1);
      this.$store.state.productFeed.attributesToMap
        .reduce((acc, curr) => [...acc, ...curr.fields], [])
        .forEach((fields) => {
          fields.mapped = null;
        });
      deleteProductFeedDataFromLocalStorage();
      this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
      this.$store.dispatch('productFeed/REQUEST_ATTRIBUTE_MAPPING');
      this.$refs.productFeedCancelModal.$refs.modal.hide();

      if (this.navigationResolver) {
        this.navigationResolver();
        this.navigationResolver = null;
      }
    },
  },
  beforeCreate() {
    this.$store.dispatch('productFeed/WARMUP_STORE');
  },
  beforeRouteLeave(to, from, next) {
    this.nextRoute = to;
    this.navigationResolver = next;
    this.$bvModal.show(
      this.$refs.productFeedCancelModal.$refs.modal.id,
    );
  },
};
</script>
