import cloneDeep from 'lodash.clonedeep';
import {rest} from 'msw';
import CampaignTableList from '@/components/campaign/campaign-table-list.vue'
import {campaigns, campaignsListResponse} from '@/../.storybook/mock/campaigns-list';
import { adsAccountStatus } from '@/../.storybook/mock/google-ads';

export default {
  title: 'Campaign/Campaigns page/Components/Campaigns\' list',
  component: CampaignTableList,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CampaignTableList },
  template: `
    <div>
      <CampaignTableList ref="page" v-bind="$props" />
    </div>
  `,
  mounted: args.mounted,
  beforeCreate: args.beforeCreate,
});

export const TableWithCampaigns:any = Template.bind({});
TableWithCampaigns.args = {
  beforeCreate() {
    this.$store.state.googleAds = cloneDeep(adsAccountStatus);
    this.$store.state.campaigns.campaigns.results.campaigns = campaigns;
  },
  loading: false,
}

TableWithCampaigns.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => res(ctx.json(campaignsListResponse))),
    ],
  },
};

export const NoData:any = Template.bind({});
NoData.args = {
  beforeCreate() {
    this.$store.state.campaigns.campaigns.results.campaigns = [];
  },
  loading: false,
}

export const Loading:any = Template.bind({});
Loading.args = {
  loading: true,
}

export const ErrorApi:any = Template.bind({});
ErrorApi.args = {
  loading: false,
  mounted(this: any) {
    this.$refs.page.$data.apiFailed = true;
  },
}
