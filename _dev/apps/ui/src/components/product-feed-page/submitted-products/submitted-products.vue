<template>
  <div>
    <div class="d-flex align-items-center mb-3">
      <h2 class="ps_gs-fz-16 font-weight-600">
        {{ $t('productFeedPage.dashboardPage.productsSentToGoogle.stepTitle') }}
      </h2>
      <b-button
        id="tooltip-submitted-product"
        class="ml-1 p-0 d-flex"
        variant="text"
      >
        <span class="material-icons-round ps_gs-fz-20 mb-1 ml-0 text-secondary">
          info_outlined
        </span>
      </b-button>
      <b-tooltip
        target="tooltip-submitted-product"
        triggers="hover"
        container="#psxMktgWithGoogleApp"
      >
        <VueShowdown
          :markdown="$t('productFeedPage.dashboardPage.productsSentToGoogle.stepDetails')"
        />
      </b-tooltip>
    </div>
    <slot :productStatuses="productStatuses" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    nbProductsFailingPrescan() {
      return this.$store.state.productFeed.prevalidationScanSummary.invalidItems;
    },
    countries() {
      return this.$store.getters['productFeed/GET_TARGET_COUNTRIES'];
    },
    validationSummary() {
      return this.inNeedOfConfiguration
        ? {
          activeItems: 0,
          pendingItems: 0,
          disapprovedItems: 0,
          expiringItems: 0,
        }
        : this.$store.getters['productFeed/GET_PRODUCT_FEED_VALIDATION_SUMMARY'];
    },
    productStatuses() {
      return [
        {
          statusOfProducts: 'disapproved',
          numberOfProducts: this.validationSummary.disapprovedItems,
        },
        {
          statusOfProducts: 'pending',
          numberOfProducts: this.validationSummary.pendingItems,
        },
        {
          statusOfProducts: 'expiring',
          numberOfProducts: this.validationSummary.expiringItems,
        },
        {
          statusOfProducts: 'approved',
          numberOfProducts: this.validationSummary.activeItems,
        },
      ];
    },
  },
  created() {
    this.$store.dispatch('productFeed/GET_PREVALIDATION_SUMMARY');
  },
});
</script>
