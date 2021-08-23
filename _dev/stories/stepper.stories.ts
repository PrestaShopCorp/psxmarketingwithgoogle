  import Stepper from '../src/components/commons/stepper.vue'

export default {
  title: 'Basic Components/Horizontal Stepper',
  component: Stepper,
  parameters: {
    jest: ['stepper.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Stepper },
  template: '<Stepper v-bind="$props" />',
});

export const HorizontalStepper:any = Template.bind({});
HorizontalStepper.args = {
  steps: [
    {
      title: "Shipping settings",
    },
    {
      title: "Export rules",
    },
    {
      title: "Attribute mapping",
    },
    {
      title: "Summary",
    },
  ],
  activeStep: 3
}
