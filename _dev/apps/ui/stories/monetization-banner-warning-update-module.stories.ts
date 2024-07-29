import MonetizatizationAlertWarningUpdateModule from '../src/components/monetization/monetization-alert-warning-update-module.vue';

export default {
  title: 'Onboarding/Alerts',
  component: MonetizatizationAlertWarningUpdateModule,
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {MonetizatizationAlertWarningUpdateModule},
  template:
    '<div><MonetizatizationAlertWarningUpdateModule v-bind="$props" /></div>',
});

export const UpdateModule: any = Template.bind({});
UpdateModule.args = {
  loading: false,
};
