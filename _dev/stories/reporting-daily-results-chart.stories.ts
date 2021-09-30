import KeyMetricsChartWrapper from '@/components/smart-shopping-campaign/reporting/key-metrics/key-metrics-chart-wrapper.vue';
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads.js';

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

export const ApiError:any = Template.bind({});
ApiError.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return results
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.startDate = '11/11/1111';
  },
};

export const WithResults: any = Template.bind({});
WithResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return results
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.startDate = '00/00/0000';
  },
};

export const NoResults: any = Template.bind({});
NoResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
};

export const LotOfResults: any = Template.bind({});
LotOfResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return results
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.startDate = '22/22/2222';
  },
};
