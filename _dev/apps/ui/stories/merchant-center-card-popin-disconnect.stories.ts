import MerchantCenterAccountPopinDisconnect from '../src/components/merchant-center-account/merchant-center-account-popin-disconnect.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";
import {googleAccountConnected} from "../.storybook/mock/google-account";
import {merchantCenterAccountConnected} from "../.storybook/mock/merchant-center-account";

export default {
  title: 'Merchant Center Account/Popins/Disconnect',
  component: MerchantCenterAccountPopinDisconnect, OnboardingPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountPopinDisconnect, OnboardingPage},
  template: `
    <div>
      <OnboardingPage />
      <MerchantCenterAccountPopinDisconnect v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
    this.$store.state.accounts.googleAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
  },
});

export const Disconnect:any = Template.bind({});
Disconnect.args = {
  visible: true,
};
