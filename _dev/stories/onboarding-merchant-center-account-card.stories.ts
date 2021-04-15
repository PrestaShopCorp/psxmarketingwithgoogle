import MerchantCenterAccountCard from '../src/components/onboarding/merchant-center-account-card.vue'

export default {
  title: 'Onboarding/Components/Card - MCA',
  component: MerchantCenterAccountCard,
  argTypes: {
    error: {
      control: {
        type: 'select',
        options: [null, 'disapproved', 'expiring', 'overwrite'],
      }
    }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountCard },
  template: '<MerchantCenterAccountCard v-bind="$props" />',
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
  error: null,
  websiteClaimStatus: null,
}

export const EnabledNotConnected:any = Template.bind({});
EnabledNotConnected.args = {
  isEnabled: true,
  error: null,
  websiteClaimStatus: null,
}
