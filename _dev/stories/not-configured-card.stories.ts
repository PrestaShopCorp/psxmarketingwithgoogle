import NotConfiguredCard from '../src/components/commons/not-configured-card.vue'

export default {
  title: 'Basic Components/Not Configured State Card',
  component: NotConfiguredCard,
  parameters: {
    jest: ['stepper.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { NotConfiguredCard },
  template: '<NotConfiguredCard v-bind="$props" />',
});

export const NotConfiguredStateCard:any = Template.bind({});
NotConfiguredStateCard.args = {
};
