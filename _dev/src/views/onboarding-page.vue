<template>
  <div class="pt-2">
    <section-title
      :step-number="1"
      :step-title="$t('onboarding.sectionTitle.psAccount')"
      :is-enabled="true"
      :is-done="stepsAreCompleted.step1"
    />
    <b-alert
      v-if="shopInConflictPsAccount"
      show
      variant="warning"
      class="mb-0 mt-3 mb-3"
    >
      <VueShowdown
        :markdown="$t('onboarding.warningMultistore')"
      />
    </b-alert>
    <ps-accounts
      v-if="!shopInConflictPsAccount"
      class="ps_gs-ps-account-card"
      :context="psAccountsContext"
    />
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
      />
      <ProductFeedCard
        v-if="stepsAreCompleted.step1"
        :is-enabled="!shopInConflictPsAccount && merchantCenterAccountIsChosen"
      />

      <FreeListingCard
        v-if="stepsAreCompleted.step1"
        :is-enabled="!shopInConflictPsAccount && productFeedIsConfigured"
        :error-a-p-i="false"
        @openPopin="togglePopinFreeListingDisabled"
      />
      <section-title
        :step-number="3"
        :step-title="$t('onboarding.sectionTitle.smartShoppingCampaign')"
        :is-enabled="!shopInConflictPsAccount && stepsAreCompleted.step2"
        :is-done="stepsAreCompleted.step3"
      />
      <GoogleAdsAccountCard
        :is-enabled="!shopInConflictPsAccount && stepsAreCompleted.step2"
        @selectGoogleAdsAccount="onGoogleAdsAccountSelected($event)"
        @disconnectionGoogleAdsAccount="onGoogleAdsAccountDisconnectionRequest"
        @creationGoogleAdsAccount="onGoogleAdsAccountTogglePopin"
      />
      <SmartShoppingCampaignCard
        :is-enabled="!shopInConflictPsAccount && stepsAreCompleted.step3"
      />
    </template>
    <!-- Modals -->
    <GoogleAccountPopinDisconnect
      ref="googleAccountDisconnectModal"
    />

    <MerchantCenterAccountPopinDisconnect
      ref="mcaDisconnectModal"
    />

    <FreeListingPopinDisable
      ref="PopinFreeListingDisable"
    />

    <GoogleAdsAccountPopinDisconnect
      ref="GoogleAdsAccountPopinDisconnect"
    />

    <GoogleAdsPopinNew
      ref="GoogleAdsAccountPopinNew"
      :user="getGoogleAccount"
      @cancelGoogleAdsCreationNewAccount="onGoogleAdsAccountTogglePopin"
    />
    <!-- Toasts -->
    <PsToast
      v-if="googleAccountConnectedOnce
        || merchantCenterAccountConnectedOnce
        || productFeedIsConfiguredOnce
        || freeListingIsActivatedOnce"
      variant="success"
      @hidden="toastIsClosed"
      :visible="googleAccountConnectedOnce
        || merchantCenterAccountConnectedOnce
        || productFeedIsConfiguredOnce
        || freeListingIsActivatedOnce"
      toaster="b-toaster-top-right"
    >
      <p>{{ insideToast }}</p>
    </PsToast>
  </div>
</template>

<script>
import {PsAccounts} from 'prestashop_accounts_vue_components';
import SectionTitle from '../components/onboarding/section-title';
import GoogleAccountCard from '../components/google-account/google-account-card';
import GoogleAdsAccountCard from '../components/google-ads-account/google-ads-account-card';
import ProductFeedNotice from '../components/onboarding/product-feed-notice.vue';
import MerchantCenterAccountCard from '../components/merchant-center-account/merchant-center-account-card.vue';
import ProductFeedCard from '../components/product-feed/product-feed-card.vue';
import FreeListingPopinDisable from '../components/free-listing/free-listing-popin-disable.vue';
import FreeListingCard from '../components/free-listing/free-listing-card.vue';
import GoogleAccountPopinDisconnect from '../components/google-account/google-account-popin-disconnect.vue';
import MerchantCenterAccountPopinDisconnect from '../components/merchant-center-account/merchant-center-account-popin-disconnect.vue';
import GoogleAdsAccountPopinDisconnect from '../components/google-ads-account/google-ads-account-popin-disconnect.vue';
import GoogleAdsPopinNew from '../components/google-ads-account/google-ads-account-popin-new.vue';
import SmartShoppingCampaignCard from '../components/smart-shopping-campaign/smart-shopping-campaign-card.vue';
import PsToast from '../components/commons/ps-toast';

export default {
  name: 'OnboardingPage',
  components: {
    PsAccounts,
    SectionTitle,
    GoogleAccountCard,
    GoogleAdsAccountCard,
    ProductFeedNotice,
    MerchantCenterAccountCard,
    ProductFeedCard,
    FreeListingCard,
    SmartShoppingCampaignCard,
    GoogleAccountPopinDisconnect,
    MerchantCenterAccountPopinDisconnect,
    GoogleAdsAccountPopinDisconnect,
    GoogleAdsPopinNew,
    PsToast,
    FreeListingPopinDisable,
  },
  data() {
    return {
      isMcaLinking: false,
    };
  },
  methods: {
    onMerchantCenterAccountSelected(selectedAccount) {
      this.isMcaLinking = true;
      const correlationId = `${Math.floor(Date.now() / 1000)}`;
      this.$store.dispatch('accounts/SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT', {selectedAccount, correlationId})
        // must wait before to ask for status
        .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
        .then(() => {
          this.$store.dispatch('accounts/TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS', correlationId);
        })
        .finally(() => {
          this.isMcaLinking = false;
        });
    },
    onGoogleAdsAccountSelected(event) {
      this.$store.dispatch('googleAds/SAVE_SELECTED_GOOGLE_ADS_ACCOUNT', event);
    },
    onGoogleAccountConnection() {
      this.$store.commit('accounts/SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE', true);
      this.$store.dispatch('accounts/TOGGLE_GOOGLE_ACCOUNT_IS_REGISTERED', true);
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
    onGoogleAdsAccountDisconnectionRequest() {
      this.$bvModal.show(
        this.$refs.GoogleAdsAccountPopinDisconnect.$refs.modal.id,
      );
    },
    onGoogleAdsAccountTogglePopin() {
      this.$bvModal.show(
        this.$refs.GoogleAdsAccountPopinNew.$refs.modal.id,
      );
    },
    // onCancelGoogleAdsCreationNewAccount() {
    //   this.$bvModal.show(
    //     this.$refs.GoogleAdsAccountPopinNew.$refs.modal.id,
    //   );
    // },
    toastIsClosed() {
      if (this.googleAccountConnectedOnce) {
        this.$store.commit('accounts/SAVE_GOOGLE_ACCOUNT_CONNECTED_ONCE', false);
      } else if (this.merchantCenterAccountConnectedOnce) {
        this.$store.commit('accounts/SAVE_MCA_CONNECTED_ONCE', false);
      } else if (this.productFeedIsConfiguredOnce) {
        this.$store.commit('productFeed/SAVE_CONFIGURATION_CONNECTED_ONCE', false);
      } else if (this.freeListingIsActivatedOnce) {
        this.$store.commit('freeListing/SAVE_ACTIVATED_ONCE', false);
      }
    },
    togglePopinFreeListingDisabled() {
      if (this.$refs.PopinFreeListingDisable) {
        this.$bvModal.show(
          this.$refs.PopinFreeListingDisable.$refs.modal.id,
        );
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
    merchantCenterAccountConnectedOnce() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_CONNECTED_ONCE'];
    },
    productFeedIsConfiguredOnce() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED_ONCE'];
    },
    freeListingIsActivatedOnce() {
      return this.$store.getters['freeListing/GET_FREE_LISTING_IS_ACTIVATED_ONCE'];
    },
    getGoogleAdsAccount() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];
    },
    googleAdsAccountIsChosen() {
      return this.getGoogleAdsAccount && this.getGoogleAdsAccount.id;
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
        step3: this.productFeedIsConfigured
        && this.googleAdsAccountIsChosen,
      };
    },
    insideToast() {
      if (this.googleAccountConnectedOnce) {
        return this.$t('toast.googleAccountConnectedOnceSuccess');
      } if (this.merchantCenterAccountConnectedOnce) {
        return this.$t('toast.MCAConnectedOnceSuccess');
      } if (this.productFeedIsConfiguredOnce) {
        return this.$t('toast.productFeedConfiguredOnceSuccess');
      } if (this.freeListingIsActivatedOnce) {
        return this.$t('toast.alertActivationSuccess');
      }
      return '';
    },
  },
  mounted() {
    // Try to retrieve Google account details. If the merchant is not onboarded,
    // this action will dispatch another one to generate the authentication route.
    // We do it if the state is empty
    if (this.psAccountsIsOnboarded === true && !this.googleAccountIsOnboarded) {
      this.$store.dispatch('accounts/REQUEST_GOOGLE_ACCOUNT_DETAILS');
    }
  },
  watch: {
    merchantCenterAccountIsChosen(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SETTINGS');
        this.$store.dispatch('productFeed/GET_PRODUCT_FEED_SYNC_STATUS');
        this.$store.dispatch('googleAds/GET_GOOGLE_ADS_LIST');
        this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
      }
    },
    productFeedIsConfigured(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.$store.dispatch('freeListing/GET_FREE_LISTING_STATUS');
      }
    },

  },
};
</script>
