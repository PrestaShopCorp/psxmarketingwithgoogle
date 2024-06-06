<template>
  <div>
    <product-feed-settings
      :active-step="activeStep"
      @cancelProductFeedProcess="onCancelProductFeedSettingsConfiguration"
      @saveProductFeedProcess="onSaveProductFeedSettingsConfiguration"
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
import ActionsTypes from '@/store/modules/product-feed/actions-types';

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
      continue: false,
    };
  },
  computed: {
    activeStep() {
      return this.$store.state.productFeed.stepper;
    },
  },
  methods: {
    onCancelProductFeedSettingsConfiguration() {
      this.continue = false;
      this.$router.push({
        name: 'configuration',
        hash: '#product-feed-card',
      });
    },
    async onSaveProductFeedSettingsConfiguration() {
      this.continue = true;
      await this.$store.dispatch(`productFeed/${ActionsTypes.SEND_PRODUCT_FEED_SETTINGS}`);
      await this.$router.push({
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
    if (this.continue) {
      next();
      return;
    }
    this.nextRoute = to;
    this.navigationResolver = next;
    this.$bvModal.show(
      this.$refs.productFeedCancelModal.$refs.modal.id,
    );
  },
};
</script>
