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
    console.log('plop', this.$store.state.googleAds);
  },
};

export const WithResults:any = Template.bind({});
WithResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return results
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.startDate = '00/00/0000';
  },
};

export const NoResults:any = Template.bind({});
NoResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
};
