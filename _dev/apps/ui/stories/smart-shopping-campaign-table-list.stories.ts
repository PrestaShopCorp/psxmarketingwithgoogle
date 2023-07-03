import CampaignTableList from '../src/components/campaign/campaign-table-list.vue'
import {campaigns} from '../.storybook/mock/campaigns-list';
import {rest} from 'msw';
import { CampaignTypes } from '@/enums/reporting/CampaignStatus';

export default {
  title: 'Campaign/Campaigns\' list',
  component: CampaignTableList,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { CampaignTableList },
  template: `
    <div>
      <CampaignTableList ref="CampaignTableList" v-bind="$props" />
    </div>
  `,
  mounted: args.mounted,
  beforeCreate: args.beforeCreate,
});

export const TableWithCampaigns:any = Template.bind({});
TableWithCampaigns.args = {
  beforeCreate() {
    this.$store.state.campaigns.campaigns = campaigns;
  },
  loading: false,
  inNeedOfConfiguration: false,
}

TableWithCampaigns.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => res(ctx.json({campaigns: onlyPmax}))),
    ],
  },
};

export const Loading:any = Template.bind({});
Loading.args = {
  loading: true,
}

export const Empty:any = Template.bind({});
Empty.args = {
  beforeCreate() {
    this.$store.state.campaigns.campaigns = [];
  },
  loading: false,
}
