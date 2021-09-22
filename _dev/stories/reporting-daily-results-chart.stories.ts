import KeyMetricsChartWrapper from '@/components/smart-shopping-campaign/reporting/key-metrics/key-metrics-chart-wrapper.vue';
import reportingDailyResults from '../.storybook/mock/reporting-kpis';

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

export const DailyResultChart: any = Template.bind({});
DailyResultChart.args = {
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.reporting.results.dailyResultChart.dailyResultList = reportingDailyResults;
  },
};
