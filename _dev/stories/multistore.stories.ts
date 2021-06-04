import OnboardingPage from '../src/views/onboarding-page.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
import {contextPsAccountsNotConnected} from "../.storybook/mock/ps-accounts";
import {googleAccountNotConnected, googleAccountConnected} from "../.storybook/mock/google-account";
import {merchantCenterAccountNotConnected, merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";
import Actions from '../.storybook/mock/actions-accounts';

export default {
  title: 'Multistore/OnboardingPage',
};

const TemplatePsAccount = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { OnboardingPage },
  template: `

    <OnboardingPage/>
  `,
  beforeMount: args.beforeMount,
});

export const ShopHasChanged:any = TemplatePsAccount.bind({});
ShopHasChanged.args = {
  beforeMount(this: any) {
    this.$store.state.app = Object.assign(
      this.$store.state.app,
      initialStateApp
    );
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsNotConnected;
    this.$store.state.accounts.googleAccount = googleAccountNotConnected;
    this.$store.state.accounts.googleMerchantAccount = merchantCenterAccountNotConnected;
    this.$store.state.accounts.psAccountShopInConflict = true;
  },
};

