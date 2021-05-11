<template>
  <div>
    <section-title
      :step-number="1"
      :step-title="$t('onboarding.sectionTitle.psAccount')"
      :is-enabled="true"
      :is-done="stepsAreCompleted.step1"
    />
    <MultiStoreSelector
      v-if="!psAccountsContext.isShopContext && shops.length"
      :shops="shops"
      @shop-selected="onShopSelected($event)"
    />
    <ps-accounts
      v-else
      :context="psAccountsContext"
    />
    <section-title
      :step-number="2"
      :step-title="$t('onboarding.sectionTitle.freeListing')"
      :is-enabled="stepsAreCompleted.step1"
      :is-done="stepsAreCompleted.step2"
    />
    <ProductFeedNotice
      v-if="stepsAreCompleted.step1"
    />
    <google-account-card
      :is-enabled="stepsAreCompleted.step1"
      :user="getGoogleAccount"
    />
    <MerchantCenterAccountCard
      v-if="stepsAreCompleted.step1"
      :is-connected="merchantCenterAccountIsChosen"
      :is-enabled="googleAccountIsOnboarded"
      @selectMerchantCenterAccount="onMerchantCenterAccountSelected($event)"
      @dissociateMerchantCenterAccount="onMerchantCenterAccountDissociated"
    />
    <ProductFeedCard
      v-if="stepsAreCompleted.step1"
      :is-enabled="merchantCenterAccountIsChosen"
    />
    <FreeListingCard
      v-if="stepsAreCompleted.step1"
      :is-enabled="productFeedIsConfigured"
    />
    <section-title
      :step-number="3"
      :step-title="$t('onboarding.sectionTitle.smartShoppingCampaign')"
      :is-enabled="stepsAreCompleted.step2"
      :is-done="stepsAreCompleted.step3"
    />
    <google-ads-account-card
      :is-enabled="stepsAreCompleted.step2"
      :is-connected="false"
    />
  </div>
</template>

<script>
import {MultiStoreSelector, PsAccounts} from 'prestashop_accounts_vue_components';
import SectionTitle from '../components/onboarding/section-title';
import GoogleAccountCard from '../components/google-account/google-account-card';
import GoogleAdsAccountCard from '../components/google-ads-account/google-ads-account-card';
import ProductFeedNotice from '../components/onboarding/product-feed-notice.vue';
import MerchantCenterAccountCard from '../components/merchant-center-account/merchant-center-account-card.vue';
import ProductFeedCard from '../components/product-feed/product-feed-card.vue';
import FreeListingCard from '../components/free-listing/free-listing-card.vue';

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
    FreeListingCard,
  },
  data() {
    return {
    };
  },
  methods: {
    onShopSelected(shopSelected) {
      window.location.href = shopSelected.url;
    },
    onMerchantCenterAccountSelected(selectedAccount) {
      this.$store.dispatch('accounts/SAVE_SELECTED_GOOGLE_ACCOUNT', selectedAccount);
    },
    onMerchantCenterAccountDissociated() {
      this.$store.commit('accounts/REMOVE_MCA_ACCOUNT');
    },
  },
  computed: {
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
    merchantCenterAccountIsChosen() {
      return !!this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED'];
    },
    productFeedIsConfigured() {
      return false;
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
  created() {
    // ToDo : Add condition to this action call:
    // - As soon as psAccountShopId is set
    // - When the Google authentication is not done yet
    this.$store.dispatch('accounts/REQUEST_ROUTE_TO_GOOGLE_AUTH');
  },
};
</script>

<style lang="">
</style>
