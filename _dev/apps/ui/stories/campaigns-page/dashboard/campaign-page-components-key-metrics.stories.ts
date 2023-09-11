import {dateGenerator} from '@/../.storybook/utils/date-generator';
import KeyMetricsBlock from '@/components/campaign/reporting/key-metrics/key-metrics-block.vue'
import {googleAdsAccountChosen} from '@/../.storybook/mock/google-ads';
import {rest} from 'msw';
import {dailyResultsEmpty, dailyResultsDatas} from '@/../.storybook/mock/reporting/daily-results.js';
import {kpisEmpty, kpiDatas} from '@/../.storybook/mock/reporting/kpi';
import {campaigns} from '@/../.storybook/mock/campaigns-list';
import cloneDeep from 'lodash.clonedeep';
import contextPsAccountsConnectedAndValidated from '@/../.storybook/mock/ps-accounts';



export default {
  title: 'Campaign/Campaigns page/Components/Key Metrics',
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

export const WithResults:any = Template.bind({});
WithResults.args = {
  inNeedOfConfiguration: false,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return results
    this.$store.state.campaigns.reporting.request.dateRange.startDate = dateGenerator(6);
    this.$store.state.campaigns.reporting.request.dateRange.endDate = dateGenerator(0);
    this.$store.state.campaigns.campaigns.results.campaigns = cloneDeep(campaigns);
    this.$store.state.campaigns.campaigns.results.totalCount = 6000;
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
    ],
  },
};


export const NoResults:any = Template.bind({});
NoResults.args = {
  inNeedOfConfiguration: false,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    this.$store.state.campaigns.reporting.request.dateRange.startDate = dateGenerator(13);
    this.$store.state.campaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
};

NoResults.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/daily-results*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultsEmpty
          })
        );
      }),
      rest.get('/ads-reporting/kpis*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...kpisEmpty
          })
        );
      }),
    ],
  },
};

export const Loading:any = Template.bind({});
Loading.args = {
  inNeedOfConfiguration: false,
  loading: true,
  beforeMount(this: any) {
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return api error
    this.$store.state.campaigns.reporting.request.dateRange.startDate = dateGenerator(1);
    this.$store.state.campaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
};

Loading.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/daily-results*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultsEmpty
          })
        );
      }),
      rest.get('/ads-reporting/kpis*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...kpisEmpty
          })
        );
      }),
    ],
  },
};

export const ApiError:any = Template.bind({});
ApiError.args = {
  inNeedOfConfiguration: false,
  loading: false,
  beforeMount(this: any) {
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return api error
    this.$store.state.campaigns.reporting.request.dateRange.startDate = dateGenerator(1);
    this.$store.state.campaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
};

ApiError.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/daily-results*', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
      rest.get('/ads-reporting/kpis*', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
    ],
  },
};