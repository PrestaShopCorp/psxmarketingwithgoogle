import ProductFeedProductStatusCard from '../src/components/product-feed-page/product-feed-product-status-card.vue';
import {googleAccountConnected} from '../.storybook/mock/google-account';
import {
  productFeedStatusSyncScheduled,
  productFeedStatusSyncSuccess,
  productFeedSyncSummaryInProgress,
} from '../.storybook/mock/product-feed';

export default {
  title: 'Product Feed Page/Product Status',
  component: ProductFeedProductStatusCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedProductStatusCard },
  template: '<ProductFeedProductStatusCard v-bind="$props" />',
  beforeMount: args.beforeMount,
});

export const SyncSummaryLoadingInProgress:any = Template.bind({});
SyncSummaryLoadingInProgress.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedSyncSummaryInProgress);
  },
};

export const ReadyForExport:any = Template.bind({});
ReadyForExport.args = {
  beforeMount(this: any) {
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, googleAccountConnected);
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncScheduled);
  },
};

export const SynchronizationDone:any = Template.bind({});
SynchronizationDone.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncSuccess);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, googleAccountConnected);
  },
};
