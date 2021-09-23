import KeyMetricsBlock from '../src/components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue'
import {reportingDailyResults, reportingDailyResultsEmpty, kpisResults} from '../.storybook/mock/reporting-kpis';
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads.js';

export default {
  title: 'Reporting/Key Metrics',
  component: KeyMetricsBlock,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { KeyMetricsBlock },
  template: `
    <div>
      <KeyMetricsBlock v-bind="$props" ref="KeyMetricsBlock"/>
    </div>
  `,
  beforeMount: args.beforeMount,
  mounted: args.mounted,
});

export const ApiError:any = Template.bind({});
ApiError.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.errorsList.kpis = Object.assign([], true);
    this.$store.state.smartShoppingCampaigns.reporting.errorsList.campaignsPerformancesSection = Object.assign([], true);
    this.$store.state.smartShoppingCampaigns.reporting.errorsList.productsPerformancesSection = Object.assign([], true);
    this.$store.state.smartShoppingCampaigns.reporting.errorsList.productsPartitionsPerformancesSection = Object.assign([], true);
  },
};

export const WithResults:any = Template.bind({});
WithResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.results.dailyResultChart.dailyResultList = reportingDailyResults;
    this.$store.state.smartShoppingCampaigns.reporting.results.kpis = Object.assign({}, kpisResults);
  },
};

export const NoResults:any = Template.bind({});
NoResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.results.dailyResultChart.dailyResultList = reportingDailyResultsEmpty;
  },
};
