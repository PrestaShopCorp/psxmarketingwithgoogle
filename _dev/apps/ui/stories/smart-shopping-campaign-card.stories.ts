import Campaign from '../src/components/campaigns/campaign-card.vue'

export default {
  title: 'Campaign/Card',
  component: Campaign,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Campaign },
  template: '<Campaign v-bind="$props" />',
  beforeMount: args.beforeMount || (() => {}),
});


export const Card:any = Template.bind({});
Card.args = {
  isEnabled: true,
  loading: false,
};
