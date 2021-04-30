<template>
  <div>
    <section-title
      :step-number="1"
      :step-title="$t('onboarding.sectionTitle.psAccount')"
      :is-enabled="true"
      :is-done="false"
    />
    <MultiStoreSelector
      v-if="!psAccountsContext.isShopContext && shops.length"
      :shops="shops"
      class="m-3"
      @shop-selected="onShopSelected($event)"
    />
    <ps-accounts
      v-else
      :context="psAccountsContext"
      class="m-3"
    />
    <section-title
      :step-number="2"
      :step-title="$t('onboarding.sectionTitle.freeListing')"
      :is-enabled="false"
      :is-done="false"
    />
    <google-account-card
      :is-enabled="false"
      :is-connected="false"
    />
    <section-title
      :step-number="3"
      :step-title="$t('onboarding.sectionTitle.smartShoppingCampaign')"
      :is-enabled="false"
      :is-done="false"
    />
    <google-ads-account-card
      :is-enabled="false"
      :is-connected="false"
    />
  </div>
</template>

<script>
import {MultiStoreSelector, PsAccounts} from 'prestashop_accounts_vue_components';
import SectionTitle from '../components/onboarding/section-title';
import GoogleAccountCard from '../components/google-account/google-account-card';
import GoogleAdsAccountCard from '../components/google-ads-account/google-ads-account-card';

export default {
  name: 'OnboardingPage',
  components: {
    PsAccounts, MultiStoreSelector, SectionTitle, GoogleAccountCard, GoogleAdsAccountCard,
  },
  data() {
    return {
      psAccountsContext: this.$store.getters.getPsAccountsContext,
      shops: this.$store.getters.getPsAccountsContext.shops,
    };
  },
  methods: {
    onShopSelected(shopSelected) {
      window.location.href = shopSelected.url;
    },
  },
};
</script>

<style lang="">
</style>
