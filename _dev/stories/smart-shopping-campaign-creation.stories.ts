import SmartShoppingCampaignCreation from '../src/components/smart-shopping-campaign-creation/smart-shopping-campaign-creation.vue'

export default {
  title: 'Smart Shopping Campaign/Creation',
  component: SmartShoppingCampaignCreation,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignCreation },
  template: `
    <div>
      <SmartShoppingCampaignCreation v-bind="$props" />
    </div>
  `,
});

export const Creation:any = Template.bind({});
Creation.args = {
};
