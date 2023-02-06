import MerchantCenterAccountPopinoverwrite from '../src/components/merchant-center-account/merchant-center-account-popin-overwrite-claim.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'
import {contextPsAccountsNotConnected, contextPsAccountsConnectedAndValidated} from "../.storybook/mock/ps-accounts";

export default {
  title: 'Merchant Center Account/Popins/Overwrite Claim',
  component: MerchantCenterAccountPopinoverwrite, OnboardingPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountPopinoverwrite, OnboardingPage},
  template: `
    <div>
      <OnboardingPage />
      <MerchantCenterAccountPopinoverwrite v-bind="$props" />
    </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.accounts.contextPsAccounts = Object.assign({}, contextPsAccountsConnectedAndValidated);
  },
});

export const OverwriteClaim:any = Template.bind({});
OverwriteClaim.args = {
  visible: true,
};
