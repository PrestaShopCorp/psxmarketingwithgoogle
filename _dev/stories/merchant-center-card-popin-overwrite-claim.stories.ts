import MerchantCenterAccountPopinOverwriteClaim from '../src/components/merchant-center-account/merchant-center-account-popin-overwrite-claim.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'

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
});

export const PopinOverwriteClaim:any = Template.bind({});
PopinOverwriteClaim.args = {
  visible: true,
};
