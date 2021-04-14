import MerchantCenterAccountCard from '../src/components/onboarding/merchant-center-account-card.vue'

export default {
  title: 'Onboarding/Components/Card - MCA',
  component: MerchantCenterAccountCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MerchantCenterAccountCard },
  template: '<MerchantCenterAccountCard v-bind="$props" />',
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
}

export const NotConnected:any = Template.bind({});
NotConnected.args = {
  isEnabled: true,
}
