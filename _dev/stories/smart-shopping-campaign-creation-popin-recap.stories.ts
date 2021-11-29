import SmartShoppingCampaignCreationPopinRecap from '../src/components/smart-shopping-campaign-creation/smart-shopping-campaign-creation-popin-recap.vue'

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
  newCampaign: {
    campaignName: 'Tartiflette',
    startDate: 1637943824888,
    endDate: null,
    targetCountry: 'France',
    dailyBudget : 25,
    currencyCode: 'EUR',
    productFilters: [],
  }
};

