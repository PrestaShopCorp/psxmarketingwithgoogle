const {dateGenerator} = require('../.storybook/utils/date-generator');
import CampaignsPerformanceTable from '../src/components/smart-shopping-campaign/reporting/campaigns-performance/campaigns-performance-table.vue';
import {googleAdsAccountChosen} from '../.storybook/mock/google-ads';
import {rest} from 'msw';
import {campaignsPerformanceListEmpty, campaignsPerformanceList} from '../.storybook/mock/reporting/campaigns-performance.js';

export default {
  title: 'Reporting/Campaigns Performance',
  component: CampaignsPerformanceTable,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CampaignsPerformanceTable },
  template: `
    <div>
      <CampaignsPerformanceTable v-bind="$props"/>
    </div>
  `,
  beforeMount: args.beforeMount,
});

export const Table:any = Template.bind({});
Table.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return results
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.startDate = dateGenerator(6);
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.endDate = dateGenerator(0);
    this.$store.state.smartShoppingCampaigns.reporting.results.campaignsPerformancesSection.limitCampaignPerformanceList = 10

  },
}

Table.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/campaigns-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsPerformanceList,
            totalCampaigns : 40,
          })
        );
      }),
    ],
  },
};

export const Empty:any = Template.bind({});
Empty.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
}

Empty.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/campaigns-performances', (req, res, ctx) => {
        return res(
          ctx.json({
            ...campaignsPerformanceListEmpty,
            totalCampaigns : 0,
          })
        );
      }),
    ],
  },
};

export const ErrorApi:any = Template.bind({});
ErrorApi.args = {
  beforeMount(this: any) {
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
    // fake date that will be intercepted by the storybook middleware to return api error
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.startDate = dateGenerator(1);
    this.$store.state.smartShoppingCampaigns.reporting.request.dateRange.endDate = dateGenerator(0);
  },
}

ErrorApi.parameters = {
  msw: {
    handlers: [
      rest.get('/ads-reporting/campaigns-performances', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
    ],
  },
};
