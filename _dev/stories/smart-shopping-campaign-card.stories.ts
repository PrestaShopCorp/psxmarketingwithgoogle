import SmartShoppingCampaign from '../src/components/smart-shopping-campaign/smart-shopping-campaign-card.vue'

export default {
  title: 'Smart Shopping Campaign/Card',
  component: SmartShoppingCampaign,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaign },
  template: '<SmartShoppingCampaign v-bind="$props" @selectGoogleAdsAccount="fakeConnection"/>',
});

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
};
