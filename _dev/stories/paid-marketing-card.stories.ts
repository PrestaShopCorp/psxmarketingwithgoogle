import PaidMarketingCard from '../src/components/paid-marketing/paid-marketing-card.vue'

export default {
  title: 'Paid Marketing/Card',
  component: PaidMarketingCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PaidMarketingCard },
  template: `
    <div>
      <PaidMarketingCard v-bind="$props" />
    </div>
  `,
});

export const Card:any = Template.bind({});
Card.args = {
};
