import Stepper from '../src/components/commons/stepper.vue'

export default {
  title: 'Basic Components/Horizontal Stepper',
  component: Stepper,
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
      active: true,
    },
    {
      title: "Export rules",
      active: false,
    },
    {
      title: "Attribute mapping",
      active: false,
    },
    {
      title: "Category mapping",
      active: false,
    },
    {
      title: "Summary",
      active: false,
    },
  ],
}
