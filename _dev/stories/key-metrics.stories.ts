const {dateGenerator} = require('../.storybook/utils/date-generator');
import KeyMetricsBlock from '../src/components/smart-shopping-campaign/reporting/key-metrics/key-metrics-block.vue'
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
});

export const ApiError:any = Template.bind({});
ApiError.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return api error
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.startDate = dateGenerator(1);
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
};

export const WithResults:any = Template.bind({});
WithResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return results
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.startDate = dateGenerator(6);
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
};

export const NoResults:any = Template.bind({});
NoResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.startDate = dateGenerator(13);
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
};
