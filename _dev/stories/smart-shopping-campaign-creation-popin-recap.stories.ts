import SmartShoppingCampaignCreationPopinRecap from '../src/components/smart-shopping-campaign/smart-shopping-campaign-creation-popin-recap.vue'

export default {
  title: 'Smart Shopping Campaign/Popins/Recap',
  component: SmartShoppingCampaignCreationPopinRecap,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignCreationPopinRecap },
  template: `
    <SmartShoppingCampaignCreationPopinRecap v-bind="$props" />
  `,
});

export const Recap:any = Template.bind({});
Recap.args = {
  visible: true,
};

