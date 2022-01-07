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
      <h3 class="d-flex align-items-center font-weight-600 ps_gs-fz-14 mb-2">
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
      <p>
        {{ $t('productFeedPage.productStatus.description') }}
      </p>
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
            :is-loading-in-progress="isSyncSummaryLoadingInProgress"
          />
          <product-feed-card-report-products-sync-card
            variant="primary"
            :nb-products="validationSummary.pendingItems"
            :is-loading-in-progress="isSyncSummaryLoadingInProgress"
          />
          <product-feed-card-report-products-sync-card
            variant="warning"
            :is-expired="true"
            :nb-products="validationSummary.expiringItems"
            :is-loading-in-progress="isSyncSummaryLoadingInProgress"
          />
          <product-feed-card-report-products-sync-card
            variant="danger"
            :nb-products="validationSummary.disapprovedItems"
            :is-loading-in-progress="isSyncSummaryLoadingInProgress"
          />
        </b-row>
        <div class="text-right mt-1">
          <b-button
            v-if="productsSent"
            variant="invisible"
            @click="displayReporting"
            class="text-primary bg-transparent p-0 border-0 font-weight-600 ps_gs-fz-13"
          >
            {{ $t('cta.viewDetailedStatuses') }}
          </b-button>
        </div>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<script>

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
      return this.getProductFeedStatus.jobEndedAt === null;
    },
    isSyncSummaryLoadingInProgress() {
      return this.$store.state.productFeed.isSyncSummaryLoadingInProgress;
    },
    nbProductsTotal() {
      return this.validationSummary.activeItems + this.validationSummary.pendingItems
      + this.validationSummary.disapprovedItems;
    },
    getGMCInformations() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT'];
    },
    productsSent() {
      return this.validationSummary.pendingItems !== null
      || this.validationSummary.activeItems !== null
      || this.validationSummary.expiringItems !== null
      || this.validationSummary.disapprovedItems !== null;
    },
  },
  methods: {
    displayReporting() {
      this.$router.push({
        path: '/product-feed/status',
      });
      // Now we just generate link for redirect merchant for products statuses
      // window.open(`https://merchants.google.com/mc/products/diagnostics?a=${this.getGMCInformations.id}`);
    },
  },
};
</script>
