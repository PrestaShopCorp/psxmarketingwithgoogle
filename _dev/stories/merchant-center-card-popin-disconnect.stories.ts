import MerchantCenterAccountPopinDisconnect from '../src/components/merchant-center-account/merchant-center-account-popin-disconnect.vue'
import OnboardingPage from '../src/views/onboarding-page.vue'

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
});

export const PopinDisconnect:any = Template.bind({});
PopinDisconnect.args = {
  visible: true,
};
