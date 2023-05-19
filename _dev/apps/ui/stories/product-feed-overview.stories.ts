import SyncOverview from '../src/components/product-feed-page/dashboard/sync-overview.vue';
import {
  productFeedStatusSyncSuccess,
} from '../.storybook/mock/product-feed';
import merchantCenterAccountConnected from '../.storybook/mock/merchant-center-account';

export default {
  title: 'Product Feed Page/Overview',
  component: SyncOverview,
  parameters: {
    jest: ['product-feed-card-report-products-sync-card.spec.ts'],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SyncOverview },
  template: '<div><SyncOverview v-bind="$props" /></div>',
  beforeMount: args.beforeMount,
});

export const Overview:any = Template.bind({});
Overview.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncSuccess);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, merchantCenterAccountConnected);
  },
  loading: false,
};
