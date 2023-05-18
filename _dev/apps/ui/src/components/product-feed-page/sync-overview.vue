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
        <merchant-center-account-alert-suspended
          v-if="gmcAccountIsSuspended"
          :issues="gmcAccountDetails.isSuspended.issues"
          :account-overview-url="gmcAccountOverviewPage"
        />
        <feed-configuration-card
          v-if="loading || incrementalSyncContext"
          :product-feed-configuration="incrementalSyncContext"
          :loading="loading"
        />
        <verified-products-panel
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
import MerchantCenterAccountAlertSuspended from '@/components/merchant-center-account/merchant-center-account-alert-suspended.vue';
import SubmittedProducts from './submitted-products/submitted-products';
import VerifiedProductsPanel from './verified-products/verified-products-panel';
import ProductsStatusCard from './submitted-products/products-status-card';
import SyncHistory from './sync-history/sync-history';
import SyncState from './sync-history/sync-state';
import {IncrementalSyncContext} from './feed-configuration/feed-configuration';
import {WebsiteClaimErrorReason} from '@/store/modules/accounts/state';
import {getMerchantCenterWebsiteUrls} from '@/components/merchant-center-account/merchant-center-account-links';

export default defineComponent({
  components: {
    FeedConfigurationCard,
    MerchantCenterAccountAlertSuspended,
    NotConfiguredCard,
    ProductsStatusCard,
    SubmittedProducts,
    SyncHistory,
    SyncState,
    VerifiedProductsPanel,
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
    incrementalSyncContext(): IncrementalSyncContext|null {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_SYNC_CONTEXT'];
    },
    gmcAccountDetails() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT'];
    },
    gmcAccountIsSuspended() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_WEBSITE_CLAIMING_OVERRIDE_STATUS']
      === WebsiteClaimErrorReason.Suspended;
    },
    gmcAccountOverviewPage() {
      return getMerchantCenterWebsiteUrls(this.gmcAccountDetails.id).overview;
    },
  },
});
</script>
