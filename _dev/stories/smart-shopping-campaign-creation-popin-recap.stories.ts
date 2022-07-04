import CampaignCreationPopinRecap from '../src/components/campaign-creation/campaign-creation-filter-popin/campaign-creation-popin-recap.vue'

export default {
  title: 'Campaign/Popins/Recap',
  component: CampaignCreationPopinRecap,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CampaignCreationPopinRecap },
  template: `
    <CampaignCreationPopinRecap v-bind="$props" />
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

