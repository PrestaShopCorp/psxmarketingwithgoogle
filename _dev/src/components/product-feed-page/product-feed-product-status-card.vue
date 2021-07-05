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
        <b-button
          v-b-tooltip
          :title="$t('productFeedPage.productStatus.approvalStatusList')"
          variant="invisible"
          class="ml-1 p-0 border-0"
        >
          <i class="material-icons-round ps_gs-fz-14 mb-0">
            error_outline
          </i>
        </b-button>
      </p>
      <b-alert
        show
      >
        {{ $t('productFeedPage.productStatus.alert') }}
      </b-alert>
      <h3 class="font-weight-600 ps_gs-fz-14 my-3 pt-2">
        {{ $t('productFeedPage.productStatus.productsInGoogleCatalog', [nbProductsTotal]) }}
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
            :nb-products="this.validationSummary.activeItems"
            :is-sync-in-progress="isSyncInProgress"
          />
          <product-feed-card-report-products-sync-card
            variant="warning"
            :nb-products="this.validationSummary.pendingItems"
            :is-sync-in-progress="isSyncInProgress"
          />
          <product-feed-card-report-products-sync-card
            variant="danger"
            :nb-products="this.validationSummary.disapprovedItems"
            :is-sync-in-progress="isSyncInProgress"
          />
        </b-row>
        <div class="text-right mt-1">
          <a
            href="#"
            class="font-weight-600 ps_gs-fz-13"
          >
            {{ $t('cta.viewDetailedStatuses') }}
          </a>
        </div>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<script>
// TODO: Add linkTo "View all detailed statuses"

import {
  BAlert,
} from 'bootstrap-vue';

import productFeedCardReportProductsSyncCard from '../product-feed/product-feed-card-report-products-sync-card';

export default {
  name: 'ProductFeedSyncStatusCard',
  components: {
    BAlert,
    productFeedCardReportProductsSyncCard,
  },
  props: {
    //  TODO : retrieve it from sync/status
    isSyncInProgress: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    validationSummary() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_VALIDATION_SUMMARY'];
    },
    nbProductsTotal() {
      return this.validationSummary.activeItems + this.validationSummary.pendingItems
      + this.validationSummary.disapprovedItems;
    },
  },
};
</script>
