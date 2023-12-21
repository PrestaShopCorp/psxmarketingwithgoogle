import Stepper from '@/components/commons/ps-stepper.vue'

export default {
  title: 'Basic Components/Stepper',
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
  activeStep: 3,
  vertical: false,
}

export const VerticalStepper:any = Template.bind({});
VerticalStepper.args = {
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
  activeStep: 3,
  vertical: true,
}
