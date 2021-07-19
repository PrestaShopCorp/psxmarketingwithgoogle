import OnboardingPage from '../src/views/onboarding-page.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
import {contextPsAccountsNotConnected} from "../.storybook/mock/ps-accounts";
import {googleAccountNotConnected} from "../.storybook/mock/google-account";
import {merchantCenterAccountNotConnected} from "../.storybook/mock/merchant-center-account";

export default {
  title: 'Multistore/ShopHasChanged',
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
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsNotConnected);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountNotConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountNotConnected);
    this.$store.state.accounts.psAccountShopInConflict = true;
  },
};

