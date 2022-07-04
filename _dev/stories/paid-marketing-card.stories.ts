import CampaignCard from '../src/components/campaigns/campaign-card-get-started.vue'

export default {
  title: 'Not Configured Pages/Campaign Page Without campaigns',
  component: CampaignCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CampaignCard },
  template: `
    <div>
      <CampaignCard v-bind="$props" />
    </div>
  `,
});

export const Card:any = Template.bind({});
Card.args = {
};
