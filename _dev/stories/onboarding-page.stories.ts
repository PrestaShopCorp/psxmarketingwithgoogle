import {PsAccounts} from 'prestashop_accounts_vue_components';
import SectionTitle from '../src/components/onboarding/section-title.vue'
import GoogleAccountCard from '../src/components/google-account/google-account-card.vue'
import GoogleAdsAccountCard from '../src/components/google-ads-account/google-ads-account-card.vue'
import ProductFeedNotice from '../src/components/onboarding/product-feed-notice.vue'
import MerchantCenterAccountCard from '../src/components/merchant-center-account/merchant-center-account-card.vue'
import ProductFeedCard from '../src/components/product-feed/product-feed-card.vue'
import FreeListingCard from '../src/components/free-listing/free-listing-card.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {initialStateAccounts} from '../.storybook/mock/state-accounts';
import {contextPsAccountsNotConnected, contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {googleAccountNotConnected, googleAccountConnected} from "../.storybook/mock/google-account";
import {merchantCenterAccountNotConnected, merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";

export default {
  title: 'Onboarding/OnboardingPage',
};

const TemplatePsAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OnboardingPage },
  template: `
    <OnboardingPage/>
  `,
  beforeMount: args.beforeMount,
});

export const PsAccount:any = TemplatePsAccount.bind({});
PsAccount.args = {
  beforeMount: function(this: any) {
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsNotConnected;
  }
};

export const GoogleAccount:any = TemplatePsAccount.bind({});
GoogleAccount.args = {
  beforeMount(this: any) {
    this.$store.state.accounts = Object.assign(
      this.$store.state.accounts,
      initialStateAccounts
    );
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
    this.$store.state.accounts.googleAccount = googleAccountNotConnected;
    this.$store.state.accounts.googleMerchantAccount = merchantCenterAccountNotConnected;
  },
};

export const MerchantCenterAccount:any = TemplatePsAccount.bind({});
MerchantCenterAccount.args = {
  beforeMount(this: any) {
    this.$store.state.accounts = Object.assign(
      this.$store.state.accounts,
      initialStateAccounts
    );
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
    this.$store.state.accounts.googleAccount = googleAccountConnected;
    this.$store.state.accounts.googleMerchantAccount = merchantCenterAccountNotConnected;
  },
};

export const ProductFeed:any = TemplatePsAccount.bind({});
ProductFeed.args = {
  beforeMount(this: any) {
    this.$store.state.accounts = Object.assign(
      this.$store.state.accounts,
      initialStateAccounts
    );
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
    this.$store.state.accounts.googleAccount = googleAccountConnected;
    this.$store.state.accounts.googleMerchantAccount = merchantCenterAccountConnected;
  },
};
