<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard px-0"
  >
    <b-card-header
      header-tag="h3"
      header-class="px-3 py-3 font-weight-600 ps_gs-fz-16 mb-0"
    >
      {{ $t('productFeedPage.productStatus.title') }}
    </b-card-header>
    <b-card-body
      body-class="p-3"
    >
      <p>
        {{ $t('productFeedPage.productStatus.description') }}
      </p>
      <h3 class="d-flex align-items-center font-weight-600 ps_gs-fz-14 my-3 pt-2">
        <i
          class="material-icons ps_gs-fz-14 mr-2 text-primary"
          v-if="isSyncInProgress"
        >
          schedule
        </i>
        {{
          isSyncInProgress
            ? $t('productFeedPage.syncStatus.readyForExport')
            : $t('productFeedPage.productStatus.productsSubmittedToGoogle', [nbProductsTotal])
        }}
      </h3>
      <b-container
        fluid
        class="p-0"
      >
        <b-row
          no-gutters
          class="mx-n1"
        >
          <product-feed-card-report-products-sync-card
            variant="success"
            :nb-products="validationSummary.activeItems"
            :is-sync-in-progress="isSyncInProgress"
          />
          <product-feed-card-report-products-sync-card
            variant="warning"
            :nb-products="validationSummary.pendingItems"
            :is-sync-in-progress="isSyncInProgress"
          />
          <product-feed-card-report-products-sync-card
            variant="danger"
            :nb-products="validationSummary.disapprovedItems"
            :is-sync-in-progress="isSyncInProgress"
          />
        </b-row>
        <div class="text-right mt-1">
          <b-button
            variant="invisible"
            @click="displayReporting"
            class="bg-transparent p-0 border-0 font-weight-600 ps_gs-fz-13"
            :class="isSyncInProgress ? 'text-secondary' : 'text-primary'"
            :disabled="isSyncInProgress"
            :aria-disabled="isSyncInProgress"
          >
            {{ $t('cta.viewDetailedStatuses') }}
          </b-button>
        </div>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<script>
// TODO: Add linkTo "View all detailed statuses"

import productFeedCardReportProductsSyncCard from '../product-feed/product-feed-card-report-products-sync-card';

export default {
  name: 'ProductFeedSyncStatusCard',
  components: {
    productFeedCardReportProductsSyncCard,
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    validationSummary() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_VALIDATION_SUMMARY'];
    },
    getProductFeedStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'];
    },
    isSyncInProgress() {
      return !this.getProductFeedStatus.failedSyncs.length
      && !this.getProductFeedStatus.successfulSyncs.length;
    },
    nbProductsTotal() {
      return this.validationSummary.activeItems + this.validationSummary.pendingItems
      + this.validationSummary.disapprovedItems;
    },
  },
  methods: {
    displayReporting() {
      this.$emit('showProductReporting', true);
    },
  },
};
</script>
