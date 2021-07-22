import ProductFeedProductStatusCard from '../src/components/product-feed-page/product-feed-product-status-card.vue';
import {productFeedStatusSyncSchedule, productFeedStatusSyncSuccess} from '../.storybook/mock/product-feed';

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

export const SyncInProgress:any = Template.bind({});
SyncInProgress.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncSchedule);
  },
};

export const Default:any = Template.bind({});
Default.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncSuccess);
  },
};
