import SyncOverview from '../src/components/product-feed-page/sync-overview.vue';
import {googleAccountConnected} from '../.storybook/mock/google-account';
import {
  productFeedStatusSyncSuccess,
} from '../.storybook/mock/product-feed';

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
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, googleAccountConnected);
  },
};
