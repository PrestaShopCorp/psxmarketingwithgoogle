import cloneDeep from 'lodash.clonedeep';
import {rest} from 'msw';
import CampaignPage from '@/views/campaign-page.vue'
import {campaigns, campaignsListEmptyResponse, campaignsListResponse} from '@/../.storybook/mock/campaigns-list';
import {adsAccountStatus} from '@/../.storybook/mock/google-ads';
import { dailyResultNotPerformingData, dailyResultsDatas, dailyResultsEmpty } from '@/../.storybook/mock/reporting/daily-results';
import { kpiDatas, kpisEmpty } from '@/../.storybook/mock/reporting/kpi';
import contextPsAccountsConnectedAndValidated from '@/../.storybook/mock/ps-accounts';

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
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.campaigns.campaigns.results.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
};

export const WithSeveralCampaigns:any = Template.bind({});
WithSeveralCampaigns.args = {
  beforeCreate() {
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
    this.$store.state.googleAds.accountChosen.acceptedCustomerDataTerms = true;
    this.$store.state.campaigns.campaigns.results.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
};

WithSeveralCampaigns.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list*', (req, res, ctx) => res(ctx.json(campaignsListResponse))),
      rest.get('/ads-reporting/daily-results*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultsDatas,
          })
        );
      }),
      rest.get('/ads-reporting/kpis*', (req, res, ctx) => {
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
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
    this.$store.state.googleAds.accountChosen.acceptedCustomerDataTerms = true;
    this.$store.state.campaigns.campaigns.results.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
};

WithSeveralCampaignsNotPerforming.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list*', (req, res, ctx) => res(ctx.json(campaignsListResponse))),
      rest.get('/ads-reporting/daily-results*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultNotPerformingData,
          })
        );
      }),
      rest.get('/ads-reporting/kpis*', (req, res, ctx) => {
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
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
    this.$store.state.campaigns.campaigns.results.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
}

WithoutCampaigns.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list*', (req, res, ctx) => res(ctx.json(campaignsListEmptyResponse))),
      rest.get('/ads-reporting/daily-results*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultsEmpty,
          })
        );
      }),
      rest.get('/ads-reporting/kpis*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...kpisEmpty,
          })
        );
      }),
    ],
  },
};

export const Loading:any = Template.bind({});
Loading.args = {
  beforeCreate() {
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
    this.$store.state.campaigns.campaigns.results.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
  mounted(this: any) {
    setTimeout(() => {
      this.$refs.CampaignPage.$data.allDataLoaded = false;
    }, 1000);
  }
};
Loading.parameters = WithSeveralCampaignsNotPerforming.parameters;

export const EnhancedConversionsNotice:any = Template.bind({});
EnhancedConversionsNotice.args = {
  beforeCreate() {
    this.$store.state.accounts.contextPsAccounts = cloneDeep(contextPsAccountsConnectedAndValidated);
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
    this.$store.state.googleAds.accountChosen.acceptedCustomerDataTerms = false;
    this.$store.state.campaigns.campaigns.results.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
};

EnhancedConversionsNotice.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list*', (req, res, ctx) => res(ctx.json(campaignsListResponse))),
      rest.get('/ads-reporting/daily-results*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...dailyResultNotPerformingData,
          })
        );
      }),
      rest.get('/ads-reporting/kpis*', (req, res, ctx) => {
        return res(
          ctx.json({
            ...kpisEmpty,
          })
        );
      }),
    ],
  },
};
