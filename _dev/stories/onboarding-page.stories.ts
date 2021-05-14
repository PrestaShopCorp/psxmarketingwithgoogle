import OnboardingPage from '../src/views/onboarding-page.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
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
    this.$store.state.accounts.googleAccount = googleAccountConnected;
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
    this.$store.state.accounts.googleMerchantAccount = merchantCenterAccountConnected;
  },
};
