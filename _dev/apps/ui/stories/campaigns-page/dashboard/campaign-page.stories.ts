import {rest} from 'msw';
import CampaignPage from '@/views/campaign-page.vue'
import {campaigns, campaignsListEmptyResponse, campaignsListResponse} from '@/../.storybook/mock/campaigns-list';

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

export const WithSeveralCampaigns:any = Template.bind({});
WithSeveralCampaigns.args = {
  beforeCreate() {
    this.$store.state.campaigns.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
}

WithSeveralCampaigns.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => res(ctx.json(campaignsListResponse))),
    ],
  },
};

export const WithoutCampaigns:any = Template.bind({});
WithoutCampaigns.args = {
  beforeCreate() {
    this.$store.state.campaigns.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
}

WithoutCampaigns.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => res(ctx.json(campaignsListEmptyResponse))),
    ],
  },
};
