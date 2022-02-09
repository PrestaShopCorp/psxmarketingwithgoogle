import ProductFeedPage from '../src/views/product-feed-page.vue'
import {
  productFeed,
  productFeedStatusSyncScheduled,
  productFeedSyncSummaryInProgress,
  productFeedStatusSyncSuccess,
  productFeedStatusSyncFailed,
} from "../.storybook/mock/product-feed";

export default {
  title: 'Product-Feed-Page/ProductFeedPage',
};

const ProductFeed = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedPage },
  template: `<ProductFeedPage/>`,
  beforeMount: args.beforeMount,

});
export const NeedConfiguration:any = ProductFeed.bind({});
NeedConfiguration.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeed);
  }
};
export const Planned:any = ProductFeed.bind({});
Planned.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncScheduled);
  }
};
export const InProgress:any = ProductFeed.bind({});
InProgress.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedSyncSummaryInProgress);
  }
};
export const Success:any = ProductFeed.bind({});
Success.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncSuccess);
  }
};
export const Failed:any = ProductFeed.bind({});
Failed.args = {
  beforeMount: function(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncFailed);
  }
};
