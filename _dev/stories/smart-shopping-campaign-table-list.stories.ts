import CampaignTableList from '../src/components/campaign/campaign-table-list.vue'
import {campaigns, campaignsEmpty, onlySsc, onlyPmax, campaignWithOnlySsc, campaignWithOnlyPmax} from '../.storybook/mock/campaigns-list.js';
import {rest} from 'msw';
import { CampaignTypes } from '@/enums/reporting/CampaignStatus';

export default {
  title: 'Campaign/Campaigns\'s list',
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
    this.$store.state.campaigns.campaigns = Object.assign({}, campaigns);
  },
  loading: false,
  inNeedOfConfiguration: false,
}

TableWithCampaigns.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        const type = new URLSearchParams(req.url.search).get('type');
        if (type === CampaignTypes.SMART_SHOPPING) {
          return res(
            ctx.json({
              campaigns: [...onlySsc]
            })
          );
        }
        if (type === CampaignTypes.PERFORMANCE_MAX) {
          return res(
            ctx.json({
              campaigns: [...onlyPmax]
            })
          );
        };
      }),
    ],
  },
};

export const TableWithOnlySsc:any = Template.bind({});
TableWithOnlySsc.args = {
  beforeCreate() {
    this.$store.state.campaigns.campaigns = Object.assign({}, campaignWithOnlySsc);
  },
  loading: false,
  inNeedOfConfiguration: false,
}

TableWithOnlySsc.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        const type = new URLSearchParams(req.url.search).get('type');
        if (type === CampaignTypes.SMART_SHOPPING) {
          return res(
            ctx.json({
              campaigns: [...onlySsc]
            })
          );
        }
        if (type === CampaignTypes.PERFORMANCE_MAX) {
          return res(
            ctx.json({
              campaigns: []
            })
          );
        };
      }),
    ],
  },
};

export const TableWithOnlyPmax:any = Template.bind({});
TableWithOnlyPmax.args = {
  beforeCreate() {
    this.$store.state.campaigns.campaigns = Object.assign({}, campaignWithOnlyPmax);
  },
  loading: false,
  inNeedOfConfiguration: false,
}

TableWithOnlyPmax.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        const type = new URLSearchParams(req.url.search).get('type');
        if (type === CampaignTypes.SMART_SHOPPING) {
          return res(
            ctx.json({
              campaigns: []
            })
          );
        }
        if (type === CampaignTypes.PERFORMANCE_MAX) {
          return res(
            ctx.json({
              campaigns: [...onlyPmax]
            })
          );
        };
      }),
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
    this.$store.state.campaigns.campaigns = Object.assign({}, campaignsEmpty);
  },
  loading: false,
}
