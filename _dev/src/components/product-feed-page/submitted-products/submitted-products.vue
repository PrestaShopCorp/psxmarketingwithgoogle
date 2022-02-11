<template>
  <div>
    <div class="d-flex mb-3">
      <div>
        <h2 class="ps_gs-fz-16 font-weight-600">
          {{ $t('productFeedPage.overview.title') }}
        </h2>
        <p class="text-secondary ps_gs-fz-13 mb-2">
          {{ $t('productFeedPage.overview.description') }}
        </p>
      </div>
      <span class="ps_gs-fz-20 font-weight-600 ml-auto pl-2">
        {{ nbProductsTotal }}
      </span>
    </div>
    <slot :productStatuses="productStatuses" />
  </div>
</template>

<script>
export default {
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
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
    nbProductsTotal() {
      return this.validationSummary.activeItems + this.validationSummary.pendingItems
      + this.validationSummary.disapprovedItems;
    },
    productStatuses() {
      return [
        {
          statusOfProducts: 'approved',
          numberOfProducts: this.validationSummary.activeItems,
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
          statusOfProducts: 'disapproved',
          numberOfProducts: this.validationSummary.disapprovedItems,
        },
      ];
    },
  },
};
</script>
