import cloneDeep from 'lodash.clonedeep';
import {rest} from 'msw';
import CampaignPage from '@/views/campaign-page.vue'
import {campaigns, campaignsListEmptyResponse, campaignsListResponse} from '@/../.storybook/mock/campaigns-list';
import {adsAccountStatus} from '@/../.storybook/mock/google-ads';
import { dailyResultsDatas, dailyResultsEmpty } from '@/../.storybook/mock/reporting/daily-results';
import { kpiDatas, kpisEmpty } from '@/../.storybook/mock/reporting/kpi';

export default {
  title: 'Campaign/Campaigns page',
  component: CampaignPage,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CampaignPage },
  template: `
    <div>
      <CampaignPage ref="CampaignPage" v-bind="$props" />
    </div>
  `,
  mounted: args.mounted,
  beforeCreate: args.beforeCreate,
});

export const NeedConfiguration:any = Template.bind({});
NeedConfiguration.args = {
  beforeCreate() {
    this.$store.state.campaigns.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
};

export const WithSeveralCampaigns:any = Template.bind({});
WithSeveralCampaigns.args = {
  beforeCreate() {
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
    this.$store.state.campaigns.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
};

WithSeveralCampaigns.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => res(ctx.json(campaignsListResponse))),
      rest.get('/ads-reporting/daily-results', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultsDatas,
          })
        );
      }),
      rest.get('/ads-reporting/kpis', (req, res, ctx) => {
        return res(
          ctx.json({
            ...kpiDatas,
          })
        );
      }),
    ],
  },
};

export const WithSeveralCampaignsNotPerforming:any = Template.bind({});
WithSeveralCampaignsNotPerforming.args = {
  beforeCreate() {
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
    this.$store.state.campaigns.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
};

WithSeveralCampaignsNotPerforming.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => res(ctx.json(campaignsListResponse))),
      rest.get('/ads-reporting/daily-results', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultsEmpty,
          })
        );
      }),
      rest.get('/ads-reporting/kpis', (req, res, ctx) => {
        return res(
          ctx.json({
            ...kpisEmpty,
          })
        );
      }),
    ],
  },
};

export const WithoutCampaigns:any = Template.bind({});
WithoutCampaigns.args = {
  beforeCreate() {
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
    this.$store.state.campaigns.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
}

WithoutCampaigns.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => res(ctx.json(campaignsListEmptyResponse))),
      rest.get('/ads-reporting/daily-results', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultsEmpty,
          })
        );
      }),
      rest.get('/ads-reporting/kpis', (req, res, ctx) => {
        return res(
          ctx.json({
            ...kpisEmpty,
          })
        );
      }),
    ],
  },
};
