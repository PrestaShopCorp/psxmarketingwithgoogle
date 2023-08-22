import {rest} from 'msw';
import CampaignPage from '@/views/campaign-page.vue'
import {campaigns} from '@/../.storybook/mock/campaigns-list';

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

export const Default:any = Template.bind({});
Default.args = {
  beforeCreate() {
    this.$store.state.campaigns.campaigns = campaigns;
    this.$router.push({name: 'campaign'});
  },
}

Default.parameters = {
  msw: {
    handlers: [
      rest.get('/shopping-campaigns/list', (req, res, ctx) => res(ctx.json({campaigns}))),
    ],
  },
};
