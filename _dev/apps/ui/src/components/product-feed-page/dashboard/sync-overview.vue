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
        <b-alert
          v-if="displayAlertNoProductSelected"
          show
          variant="danger"
          class="border border-danger d-sm-flex justify-content-sm-between flex-sm-row"
        >
          <p>
            {{ $t('productFeedPage.dashboardPage.productVerification.alertNoProductSelected') }}
          </p>
          <b-button
            variant="danger"
            class="px-3 py-2 ml-3 ml-sm-0 mt-3 mt-sm-0 w-auto"
            @click="goToProductSelection"
          >
            {{ $t('cta.edit') }}
          </b-button>
        </b-alert>
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
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';

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
    displayAlertNoProductSelected(): boolean {
      return this.verificationStats.productsInCatalog
        ? this.verificationStats.productsInCatalog === 0 : false;
    },
  },
  methods: {
    goToProductSelection() {
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.PRODUCT_SELECTION,
        },
      });
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
  mounted() {
    console.log('store', this.$store.getters['productFeed/GET_PRODUCT_FEED_VERIFICATION_STATS']);
    console.log('display alert', this.displayAlertNoProductSelected);
    console.log('computed store', this.verificationStats.productsInCatalog);
  },
});
</script>
