<template>
  <b-card body-class="p-0">
    <template #header>
      <h1 class="mb-0 ps_gs-onboardingcard__title">
        {{ $t("productFeedSettings.breadcrumb1") }}
      </h1>
    </template>
    <div class="d-md-flex position-relative">
      <div
        v-if="inNeedOfConfiguration"
        class="ps_gs-onboardingcard__not-configured"
      >
        <NotConfiguredCard />
      </div>
      <div class="flex-shrink-0 d-flex flex-column p-3">
        <SyncHistory
          v-slot="{ syncStates }"
          :in-need-of-configuration="inNeedOfConfiguration"
        >
          <SyncState
            v-for="(syncState, i) in syncStates"
            :key="i"
            :sync-state="syncState"
          />
        </SyncHistory>
      </div>
      <div
        class="
          flex-grow-1
          p-3
          border-top border-md-top-0 border-md-left border-600-20
        "
      >
        <feed-configuration-card
          v-if="loading || productFeedConfiguration"
          :product-feed-configuration="productFeedConfiguration"
          :loading="loading"
        />
        <SubmittedProducts
          v-slot="{ productStatuses }"
          :in-need-of-configuration="inNeedOfConfiguration"
        >
          <ProductsStatusCard
            v-for="(productStatus, i) in productStatuses"
            :key="i"
            :product-status="productStatus"
          />
        </SubmittedProducts>
      </div>
    </div>
  </b-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import NotConfiguredCard from '@/components/commons/not-configured-card';
import FeedConfigurationCard from './feed-configuration/feed-configuration-card.vue';
import SubmittedProducts from './submitted-products/submitted-products';
import ProductsStatusCard from './submitted-products/products-status-card';
import SyncHistory from './sync-history/sync-history';
import SyncState from './sync-history/sync-state';
import {ProductFeedReport} from '../../store/modules/product-feed/state';

export default defineComponent({
  components: {
    FeedConfigurationCard,
    NotConfiguredCard,
    SubmittedProducts,
    ProductsStatusCard,
    SyncHistory,
    SyncState,
  },
  props: {
    inNeedOfConfiguration: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
    },
  },
  computed: {
    productFeedReport(): ProductFeedReport {
      console.log('productFeedReport', this.$store.getters['productFeed/GET_PRODUCT_FEED_REPORT']);
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_REPORT'];
    },
    productFeedConfiguration() {
      console.log('productFeedConfiguration', this.productFeedReport.lastConfigurationUsed);
      return this.productFeedReport.lastConfigurationUsed;
    },
  },
});
</script>
