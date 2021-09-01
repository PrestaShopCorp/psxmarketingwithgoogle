import CampaignCard from '../src/components/campaign/campaign-card.vue'

export default {
  title: 'Campaign/Card',
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
