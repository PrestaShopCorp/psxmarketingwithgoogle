import SmartShoppingCampaignTableList from '../src/components/smart-shopping-campaign/smart-shopping-campaign-table-list.vue'
import {campaigns, campaignsEmpty} from '../.storybook/mock/campaigns-list.js';

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
}

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
