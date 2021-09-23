import KeyMetricsChartWrapper from '@/components/smart-shopping-campaign/reporting/key-metrics/key-metrics-chart-wrapper.vue';
import {reportingDailyResults, reportingDailyResultsEmpty} from '../.storybook/mock/reporting-kpis';

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
    this.$store.state.smartShoppingCampaigns.reporting.results.dailyResultChart.dailyResultList = reportingDailyResults;
  },
};

export const NoResults: any = Template.bind({});
NoResults.args = {
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.reporting.results.dailyResultChart.dailyResultList = reportingDailyResultsEmpty;
  },
};
