<template>
  <div>
    <div
      v-if="nbProductsFailingPrescan > 0"
      class="pb-2"
    >
      <b-alert
        variant="danger"
        show
      >
        <p class="mb-0">
          <strong>
            {{
              $tc('productFeedPage.overview.alert.prescanTitle',
                  nbProductsFailingPrescan, [nbProductsFailingPrescan])
            }}
          </strong><br>
          <span class="ps_gs-fz-12">
            {{ $tc('productFeedPage.overview.alert.prescanDescription') }}
          </span>
        </p>
        <div
          class="d-md-flex text-center align-items-center mt-2"
        >
          <b-button
            size="sm"
            class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1 text-white text-decoration-none"
            variant="danger"
            :to="{name: 'product-feed-pre-scan'}"
          >
            {{ $t('cta.investigate') }}
          </b-button>
        </div>
      </b-alert>
    </div>
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
    nbProductsFailingPrescan() {
      return this.$store.state.productFeed.prevalidationScanSummary.invalidItems;
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
    nbProductsTotal() {
      return this.validationSummary.activeItems + this.validationSummary.pendingItems
      + this.validationSummary.disapprovedItems;
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
};
</script>
