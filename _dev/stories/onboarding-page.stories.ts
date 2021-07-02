import OnboardingPage from '../src/views/onboarding-page.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
import {productFeedIsConfiguredOnce, productFeedEnabled} from '../.storybook/mock/product-feed';
import {contextPsAccountsNotConnected, contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {googleAccountNotConnected, googleAccountConnected, googleAccountConnectedOnce} from "../.storybook/mock/google-account";
import {merchantCenterAccountNotConnected, merchantCenterAccountConnected, merchantCenterAccountConnectedOnce} from "../.storybook/mock/merchant-center-account";
import Actions from '../.storybook/mock/actions-accounts';

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
    this.$store.state.app = Object.assign(
      this.$store.state.app,
      initialStateApp
    );
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
    this.$store.state.accounts.googleAccount = googleAccountNotConnected;
    this.$store.state.accounts.googleMerchantAccount = merchantCenterAccountNotConnected;
  },
};

export const MerchantCenterAccount:any = TemplatePsAccount.bind({});
MerchantCenterAccount.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      this.$store.state.app,
      initialStateApp
    );
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
    this.$store.state.accounts.googleAccount = googleAccountConnectedOnce;
    this.$store.state.accounts.googleMerchantAccount = merchantCenterAccountNotConnected;
  },
};

export const ProductFeed:any = TemplatePsAccount.bind({});
ProductFeed.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      this.$store.state.app,
      initialStateApp
    );
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
    this.$store.state.accounts.googleAccount = googleAccountConnected;
    this.$store.state.accounts.googleMerchantAccount = merchantCenterAccountConnectedOnce;
    this.$store.state.productFeed = productFeedEnabled;

  },
};

export const FreeListing:any = TemplatePsAccount.bind({});
FreeListing.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      this.$store.state.app,
      initialStateApp
    );
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
    this.$store.state.accounts.googleAccount = googleAccountConnected;
    this.$store.state.accounts.googleMerchantAccount = merchantCenterAccountConnected;
    this.$store.state.productFeed = productFeedIsConfiguredOnce;
  },
};
