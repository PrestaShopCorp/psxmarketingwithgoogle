<template>
  <b-card
    body-class="p-0"
    class="ps_gs-onboardingcard"
  >
    <template #header>
      <p class="mb-0 ps_gs-onboardingcard__title">
        {{ $t("productFeedSettings.breadcrumb1") }}
      </p>
    </template>
    <div class="d-md-flex position-relative">
      <div
        v-if="inNeedOfConfiguration"
        class="ps_gs-onboardingcard__not-configured"
      >
        <NotConfiguredCard />
      </div>
      <div class="flex-shrink-0 d-flex flex-column p-3 pt-4">
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
          p-3 pt-4
          border-top border-md-top-0 border-md-left border-600-20
        "
      >
        <merchant-center-account-alert-suspended
          v-if="gmcAccountIsSuspended"
          :issues="gmcAccountDetails.accountIssues"
          :account-overview-url="gmcAccountOverviewPage"
        />
        <feed-configuration-card
          v-if="loading || incrementalSyncContext"
          :product-feed-configuration="incrementalSyncContext"
          :loading="loading"
        />
        <verified-products
          :loading="loading"
          :verifications-stats="verificationStats"
        />
        <SubmittedProducts
          :in-need-of-configuration="inNeedOfConfiguration"
          :loading="loading"
        />
      </div>
    </div>
  </b-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import NotConfiguredCard from '@/components/commons/not-configured-card.vue';
import FeedConfigurationCard from './feed-configuration/feed-configuration-card.vue';
import MerchantCenterAccountAlertSuspended from '@/components/merchant-center-account/merchant-center-account-alert-suspended.vue';
import SubmittedProducts from './panel/submitted-products.vue';
import VerifiedProducts from './panel/verified-products.vue';
import SyncHistory from './sync-history/sync-history.vue';
import SyncState from './sync-history/sync-state.vue';
import {IncrementalSyncContext} from './feed-configuration/feed-configuration';
import {MerchantCenterAccountContext, WebsiteClaimErrorReason} from '@/store/modules/accounts/state';
import {getMerchantCenterWebsiteUrls} from '@/components/merchant-center-account/merchant-center-account-links';
import {VerificationStats} from '@/store/modules/product-feed/state';

export default defineComponent({
  components: {
    FeedConfigurationCard,
    MerchantCenterAccountAlertSuspended,
    NotConfiguredCard,
    SubmittedProducts,
    SyncHistory,
    SyncState,
    VerifiedProducts,
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
    verificationStats(): VerificationStats {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_VERIFICATION_STATS'];
    },
    incrementalSyncContext(): IncrementalSyncContext|null {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_SYNC_CONTEXT'];
    },
    gmcAccountDetails(): MerchantCenterAccountContext {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT'];
    },
    gmcAccountIsSuspended(): boolean {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_WEBSITE_CLAIMING_OVERRIDE_STATUS']
      === WebsiteClaimErrorReason.Suspended;
    },
    gmcAccountOverviewPage() {
      return getMerchantCenterWebsiteUrls(this.gmcAccountDetails.id).overview;
    },
  },
  watch: {
    loading(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.$segment.identify(this.$store.state.accounts.shopIdPsAccounts, {
          ggl_gmc_account_is_suspended: this.gmcAccountIsSuspended,
          ggl_sync_is_multi_target_countries:
            (this.incrementalSyncContext?.targetCountries.length || 0) > 1,
          ggl_sync_is_multi_languages:
            (this.incrementalSyncContext?.targetCountries.length || 0) > 1,
          ggl_sync_is_multi_currencies: (this.incrementalSyncContext?.currencies.length || 0) > 1,
          ggl_user_has_compliant_products: !!this.verificationStats.validProducts,
          ggl_user_has_non_compliant_products: !!this.verificationStats.validProducts,
        });
      }
    },
  },
});
</script>
