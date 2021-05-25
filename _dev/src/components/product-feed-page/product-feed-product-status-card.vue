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
      <b-alert
        variant="warning"
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
          <product-feed-card-report-product-card
            variant="success"
            :nb-products="nbProductsSuccess"
            :is-sync-in-progress="isSyncInProgress"
          />
          <product-feed-card-report-product-card
            variant="warning"
            :nb-products="nbProductsPending"
            :is-sync-in-progress="isSyncInProgress"
          />
          <product-feed-card-report-product-card
            variant="danger"
            :nb-products="nbProductsDisapproved"
            :is-sync-in-progress="isSyncInProgress"
          />
        </b-row>
        <div class="text-right mt-1">
          <a
            href="//google.com"
            class="font-weight-600 ps_gs-fz-13"
          >
            {{ $t('cta.checkProductsStatusDetails') }}
          </a>
        </div>
      </b-container>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BAlert,
} from 'bootstrap-vue';

import productFeedCardReportProductCard from '../product-feed/product-feed-card-report-product-card';

export default {
  name: 'ProductFeedSyncStatusCard',
  components: {
    BAlert,
    productFeedCardReportProductCard,
  },
  props: {
    isSyncInProgress: {
      type: Boolean,
      default: false,
    },
    nbProductsSuccess: {
      type: Number,
      default: 0,
    },
    nbProductsPending: {
      type: Number,
      default: 0,
    },
    nbProductsDisapproved: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    nbProductsTotal() {
      return this.nbProductsSuccess + this.nbProductsPending + this.nbProductsDisapproved;
    },
  },
};
</script>
