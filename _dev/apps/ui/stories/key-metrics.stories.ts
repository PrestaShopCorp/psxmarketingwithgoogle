const {dateGenerator} = require('../.storybook/utils/date-generator');
import KeyMetricsBlock from '../src/components/campaign/reporting/key-metrics/key-metrics-block.vue'
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';
import {rest} from 'msw';
import {dailyResultsEmpty, dailyResultsDatas} from '../.storybook/mock/reporting/daily-results.js';
import {kpisEmpty, kpiDatas} from '../.storybook/mock/reporting/kpi.js';
import {campaignsPerformanceListEmpty, campaignsPerformanceList} from '../.storybook/mock/reporting/campaigns-performance.js';
import {productsPerformanceListEmpty, productsPerformanceList} from '../.storybook/mock/reporting/products-performance.js';
import {productsPartitionsPerformanceListEmpty, productsPartitionsPerformanceList} from '../.storybook/mock/reporting/products-partitions-performance.js';
import {nextPageTokenEmpty} from '../.storybook/mock/reporting/next-page-token.js';



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
      rest.get('/ads-reporting/kpis', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
      rest.get('/ads-reporting/campaigns-performances', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
      rest.get('/ads-reporting/products-partitions-performances', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
      rest.get('/ads-reporting/products-performances', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
    ],
  },
};


export const WithResults:any = Template.bind({});
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
      rest.get('/ads-reporting/kpis', (req, res, ctx) => {
        return res(
          ctx.json({
            ...kpiDatas
          })
        );
      }),
      rest.get('/ads-reporting/campaigns-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsPerformanceList,
            ...nextPageTokenEmpty,
          })
        );
      }),
      rest.get('/ads-reporting/products-partitions-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productsPartitionsPerformanceList,
            ...nextPageTokenEmpty,
          })
        );
      }),
      rest.get('/ads-reporting/products-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productsPerformanceList,
            ...nextPageTokenEmpty,
          })
        );
      }),
    ],
  },
};


export const NoResults:any = Template.bind({});
NoResults.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.campaigns.reporting.request.dateRange.startDate = dateGenerator(13);
    this.$store.state.campaigns.reporting.request.dateRange.endDate = dateGenerator(0);
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
      rest.get('/ads-reporting/kpis', (req, res, ctx) => {
        return res(
          ctx.json({
            ...kpisEmpty
          })
        );
      }),
      rest.get('/ads-reporting/campaigns-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsPerformanceListEmpty,
            ...nextPageTokenEmpty,
          })
        );
      }),
      rest.get('/ads-reporting/products-partitions-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productsPartitionsPerformanceListEmpty,
            ...nextPageTokenEmpty,
          })
        );
      }),
      rest.get('/ads-reporting/products-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...productsPerformanceListEmpty,
            ...nextPageTokenEmpty,
          })
        );
      })
    ],
  },
};
