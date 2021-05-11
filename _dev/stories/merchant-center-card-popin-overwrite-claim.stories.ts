import MerchantCenterAccountPopinOverwriteClaim from '../src/components/merchant-center-account/merchant-center-account-popin-overwrite-claim.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsNotConnected, contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";

export default {
  title: 'Merchant Center Account/Popins/Overwrite Claim',
  component: MerchantCenterAccountPopinOverwriteClaim, OnboardingPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountPopinOverwriteClaim, OnboardingPage},
  template: `
    <div>
      <OnboardingPage />
      <MerchantCenterAccountPopinOverwriteClaim v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = contextPsAccountsConnectedAndValidated;
  },
});

export const OverwriteClaim:any = Template.bind({});
OverwriteClaim.args = {
  visible: true,
};
