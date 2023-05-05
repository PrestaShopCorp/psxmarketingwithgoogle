<template>
  <div>
    <div v-if="langConflict">
      <b-alert
        variant="danger"
        show
      >
        <p class="mb-0">
          {{
            $tc('productFeedSettings.preScan.langConflict',
                countries.length,
                [$options.filters.changeCountriesCodesToNames(countries)]
            )

          }}
        </p>
      </b-alert>
    </div>

    <div class="d-flex mb-3">
      <div>
        <h2 class="ps_gs-fz-16 font-weight-600">
          {{ $t('productFeedPage.overview.title') }}
        </h2>
        <p class="ps_gs-fz-13 mb-2">
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

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      langConflict: false,
    };
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
  created() {
    this.$store.dispatch('productFeed/GET_PREVALIDATION_SUMMARY')
      .catch((error: any) => {
        if (error.code === 409) {
          this.langConflict = true;
        }
      });
  },
});
</script>
