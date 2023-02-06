const {dateGenerator} = require('../.storybook/utils/date-generator');
import KeyMetricsChartWrapper from '@/components/campaign/reporting/key-metrics/key-metrics-chart-wrapper.vue';
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';
import {rest} from 'msw';
import {dailyResultsEmpty, dailyResultsDatas, dailyResultsBigDatas} from '../.storybook/mock/reporting/daily-results.js';

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
    this.$store.state.campaigns.reporting.request.dateRange.startDate = dateGenerator(1);
    this.$store.state.campaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
};

ApiError.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/daily-results', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
    ],
  },
};

export const WithResults: any = Template.bind({});
WithResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return results
    this.$store.state.campaigns.reporting.request.dateRange.startDate = dateGenerator(6);
    this.$store.state.campaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
};

WithResults.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/daily-results', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultsDatas
          })
        );
      }),
    ],
  },
};

export const NoResults: any = Template.bind({});
NoResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
};

NoResults.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/daily-results', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultsEmpty
          })
        );
      }),
    ],
  },
};

export const LotOfResults: any = Template.bind({});
LotOfResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return results
    this.$store.state.campaigns.reporting.request.dateRange.startDate = dateGenerator(59);
    this.$store.state.campaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
};

LotOfResults.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/daily-results', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultsBigDatas
          })
        );
      }),
    ],
  },
};
