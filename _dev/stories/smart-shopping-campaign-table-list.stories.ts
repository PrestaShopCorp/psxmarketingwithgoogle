import SmartShoppingCampaignTableList from '../src/components/smart-shopping-campaign/smart-shopping-campaign-table-list.vue'
import {campaigns, campaignsEmpty} from '../.storybook/mock/campaigns-list.js';
import {rest} from 'msw';
import { CampaignTypes } from '@/enums/reporting/CampaignStatus';

export default {
  title: 'Smart Shopping Campaign/Campaigns\'s list',
  component: SmartShoppingCampaignTableList,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignTableList },
  template: `
    <div>
      <SmartShoppingCampaignTableList ref="SmartShoppingCampaignTableList" v-bind="$props" />
    </div>
  `,
  mounted: args.mounted,
  beforeCreate: args.beforeCreate,
});

export const Table:any = Template.bind({});
Table.args = {
  beforeCreate() {
    this.$store.state.smartShoppingCampaigns.campaigns = Object.assign([], campaigns);
  },
  loading: false,
  inNeedOfConfiguration: false,
}

Table.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => {
        const type = new URLSearchParams(req.url.search).get('type');
        if (type === CampaignTypes.SMART_SHOPPING) {
          return res(
            ctx.json(
              [...campaigns]
            )
          );
        }
        if (type === CampaignTypes.PERFORMANCE_MAX) {
          return res(
            ctx.json([
              {"campaignName":"Tartiflette day","startDate":"2021-06-20","endDate":"2021-11-15","targetCountry":"FR","dailyBudget":112,"status":"ELIGIBLE","currencyCode":"EUR","productFilters":[], "type": "PERFORMANCE_MAX"}
            ]
            )
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
    this.$store.state.smartShoppingCampaigns.campaigns = Object.assign([], campaignsEmpty);
  },
  loading: false,
}
