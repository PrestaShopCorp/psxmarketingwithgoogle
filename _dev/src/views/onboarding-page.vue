<template>
  <div class="pt-2">
    <section-title
      :step-number="1"
      :step-title="$t('onboarding.sectionTitle.psAccount')"
      :is-enabled="true"
      :is-done="stepsAreCompleted.step1"
    />
    <b-alert
      v-if="!psAccountsContext.isShopContext && shops.length"
      show
      variant="warning"
      class="mb-0 mt-3 mb-3"
    >
      {{ $t('onboarding.warningMultistore') }}
    </b-alert>
    <MultiStoreSelector
      v-if="!psAccountsContext.isShopContext && shops.length"
      :shops="shops"
      @shop-selected="onShopSelected($event)"
    />
    <ps-accounts
      v-else-if="!shopInConflictPsAccount"
      class="ps_gs-ps-account-card"
      :context="psAccountsContext"
    />
    <b-alert
      v-if="shopInConflictPsAccount && psAccountsContext.isShopContext && !shops.length"
      show
      variant="warning"
      class="mb-0 mt-3 mb-3"
    >
      {{ $t('onboarding.GMCAlreadyLinked') }}
    </b-alert>
    <template v-if="psAccountsContext.isShopContext">
      <section-title
        :step-number="2"
        :step-title="$t('onboarding.sectionTitle.freeListing')"
        :is-enabled="!shopInConflictPsAccount && stepsAreCompleted.step1"
        :is-done="stepsAreCompleted.step2"
      />
      <ProductFeedNotice
        v-if="stepsAreCompleted.step1"
      />
      <google-account-card
        :is-enabled="!shopInConflictPsAccount && stepsAreCompleted.step1"
        :user="getGoogleAccount"
        :is-connected="googleAccountIsOnboarded"
        @connectGoogleAccount="onGoogleAccountConnection"
        @dissociateGoogleAccount="onGoogleAccountDissociationRequest"
      />
      <MerchantCenterAccountCard
        v-if="stepsAreCompleted.step1"
        :is-enabled="!shopInConflictPsAccount && googleAccountIsOnboarded"
        :is-connected="merchantCenterAccountIsChosen"
        :is-e-u="showCSSForMCA"
        :is-linking="isMcaLinking"
        @selectMerchantCenterAccount="onMerchantCenterAccountSelected($event)"
        @dissociateMerchantCenterAccount="onMerchantCenterAccountDissociationRequest"
        :error="mcaError"
      />

      <ProductFeedCard
        v-if="stepsAreCompleted.step1"
        :is-enabled="true"
        @toggleSync="onSyncToggled"
      />
      <!-- <ProductFeedCard
        v-if="stepsAreCompleted.step1"
        :is-enabled="!shopInConflictPsAccount && merchantCenterAccountIsChosen"
        @disableSync="onSyncDisabled"
      /> -->

      <FreeListingCard
        v-if="stepsAreCompleted.step1"
        :is-enabled="!shopInConflictPsAccount && productFeedIsConfigured"
      />
      <section-title
        :step-number="3"
        :step-title="$t('onboarding.sectionTitle.smartShoppingCampaign')"
        :is-enabled="!shopInConflictPsAccount && stepsAreCompleted.step2"
        :is-done="stepsAreCompleted.step3"
      />
      <google-ads-account-card
        :is-enabled="!shopInConflictPsAccount && stepsAreCompleted.step2"
        :is-connected="false"
      />
    </template>
    <!-- Modals -->
    <GoogleAccountPopinDisconnect
      ref="googleAccountDisconnectModal"
    />

    <MerchantCenterAccountPopinDisconnect
      ref="mcaDisconnectModal"
    />

    <ProductFeedPopinDisable
      ref="productFeedDisableModal"

    />
    <!-- Toast -->
    <PsToast
      variant="success"
      :visible="googleAccountConnectedOnce"
      toaster="b-toaster-top-right"
    >
      <p>{{ $t('toast.googleAccountConnectedOnceSuccess') }}</p>
    </PsToast>
  </div>
</template>

<script>
import {MultiStoreSelector, PsAccounts} from 'prestashop_accounts_vue_components';
import {WebsiteClaimErrorReason} from '@/store/modules/accounts/state';
import SectionTitle from '../components/onboarding/section-title';
import GoogleAccountCard from '../components/google-account/google-account-card';
import GoogleAdsAccountCard from '../components/google-ads-account/google-ads-account-card';
import ProductFeedNotice from '../components/onboarding/product-feed-notice.vue';
import ProductFeedPopinDisable from '../components/product-feed/product-feed-popin-disable.vue';
import MerchantCenterAccountCard from '../components/merchant-center-account/merchant-center-account-card.vue';
import ProductFeedCard from '../components/product-feed/product-feed-card.vue';
import FreeListingCard from '../components/free-listing/free-listing-card.vue';
import GoogleAccountPopinDisconnect from '../components/google-account/google-account-popin-disconnect.vue';
import MerchantCenterAccountPopinDisconnect from '../components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
import PsToast from '../components/commons/ps-toast';

export default {
  name: 'OnboardingPage',
  components: {
    PsAccounts,
    MultiStoreSelector,
    SectionTitle,
    GoogleAccountCard,
    GoogleAdsAccountCard,
    ProductFeedNotice,
    MerchantCenterAccountCard,
    ProductFeedCard,
    ProductFeedPopinDisable,
    FreeListingCard,
    GoogleAccountPopinDisconnect,
    MerchantCenterAccountPopinDisconnect,
    PsToast,
  },
  data() {
    return {
      isMcaLinking: false,
      mcaError: null,
    };
  },
  methods: {
    onShopSelected(shopSelected) {
      window.location.href = shopSelected.url;
    },
    onMerchantCenterAccountSelected(selectedAccount) {
      this.isMcaLinking = true;
      this.$store.dispatch('accounts/SAVE_SELECTED_GOOGLE_ACCOUNT', selectedAccount)
        .catch(() => {
          this.mcaError = WebsiteClaimErrorReason.LinkingFailed;
        })
        .finally(() => {
          this.isMcaLinking = false;
        });
    },
    onGoogleAccountConnection() {
      this.$store.dispatch('accounts/SAVE_GOOGLE_CONNECTION_ONCE');
    },
    onGoogleAccountDissociationRequest() {
      this.$bvModal.show(
        this.$refs.googleAccountDisconnectModal.$refs.modal.id,
      );
    },
    onMerchantCenterAccountDissociationRequest() {
      this.$bvModal.show(
        this.$refs.mcaDisconnectModal.$refs.modal.id,
      );
    },
    onSyncToggled() {
      // If user has sync already, we warn the user that the sync won't work anymore with modal
      if (this.$store.state.productFeed.productFeed.status.isSyncEnabled) {
        this.$bvModal.show(
          this.$refs.productFeedDisableModal.$refs.modal.id,
        );
      // Else (user has not sync) we toggle the sync for the user
      } else {
        this.$store.dispatch('productFeed/TOGGLE_SYNCHRONIZATION');
      }
    },
  },
  computed: {
    shopInConflictPsAccount() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_SHOP_IN_CONFLICT'];
    },
    psAccountsContext() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT'];
    },
    shops() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_CONTEXT_SHOPS'];
    },
    psAccountsIsOnboarded() {
      return this.$store.getters['accounts/GET_PS_ACCOUNTS_IS_ONBOARDED'];
    },
    googleAccountIsOnboarded() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_IS_ONBOARDED'];
    },
    getGoogleAccount() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT'];
    },
    googleAccountConnectedOnce() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_CONNECTED_ONCE'];
    },
    merchantCenterAccountIsChosen() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED'];
    },
    showCSSForMCA() {
      return this.$store.getters['app/GET_IS_COUNTRY_MEMBER_OF_EU'];
    },
    productFeedIsConfigured() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED'];
    },
    stepsAreCompleted() {
      return {
        step1: this.psAccountsIsOnboarded,
        step2: this.googleAccountIsOnboarded
          && this.merchantCenterAccountIsChosen
          && this.productFeedIsConfigured,
        step3: false,
      };
    },
  },
  mounted() {
    // Try to retrieve Google account details. If the merchant is not onboarded,
    // this action will dispatch another one to generate the authentication route.
    if (this.psAccountsIsOnboarded === true) {
      this.$store.dispatch('accounts/REQUEST_GOOGLE_ACCOUNT_DETAILS');
    }
  },
  watch: {
    googleAccountIsOnboarded(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        // ToDo: Add a filter to avoid dispatching this action if the GMC is already chosen
        this.$store.dispatch('accounts/REQUEST_GOOGLE_ACCOUNT_GMC_LIST');
      }
    },
  },
};
</script>
