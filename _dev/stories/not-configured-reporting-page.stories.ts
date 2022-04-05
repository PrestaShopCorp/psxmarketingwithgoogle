import ReportingPageNotConfigured from '../src/views/not-configured/reporting-page.vue';

export default {
  title: 'Not Configured Pages/Reporting Page',
  component: ReportingPageNotConfigured,
  parameters: {
    jest: ['stepper.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ReportingPageNotConfigured },
  template: '<ReportingPageNotConfigured v-bind="$props" />',
});

export const ReportingPage:any = Template.bind({});
ReportingPage.args = {
};
