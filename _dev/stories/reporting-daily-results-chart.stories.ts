import KeyMetricsChartWrapper from '@/components/smart-shopping-campaign/reporting/key-metrics/key-metrics-chart-wrapper.vue';

export default {
  title: 'Reporting/Daily Result Chart',
  component: KeyMetricsChartWrapper,
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {KeyMetricsChartWrapper},
  template: `
    <div>
      <KeyMetricsChartWrapper v-bind="$props"/>
    </div>
  `,
  beforeMount: args.beforeMount,
});

export const WithResults: any = Template.bind({});
WithResults.args = {
  beforeMount(this: any) {

  },
};

export const NoResults: any = Template.bind({});
NoResults.args = {
  beforeMount(this: any) {

  },
};
