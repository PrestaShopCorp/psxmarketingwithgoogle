import SmartShoppingCampaignTableList from '../src/components/smart-shopping-campaign/smart-shopping-campaign-table-list.vue'

export default {
  title: 'Smart Shopping Campaign/Campaigns\'s list',
  component: SmartShoppingCampaignTableList,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignTableList },
  template: `
    <div>
      <SmartShoppingCampaignTableList ref="SmartShoppingCampaignTableList" />
    </div>
  `,
  mounted: args.mounted,
});

export const Table:any = Template.bind({});
Table.args = {
}

export const Loading:any = Template.bind({});
Loading.args = {
  mounted() {
    this.$refs.SmartShoppingCampaignTableList.$data.loading = true;
  },
}
