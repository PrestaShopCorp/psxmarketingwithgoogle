import ProductFeedProductStatusCard from '../src/components/product-feed-page/product-feed-product-status-card.vue';
import {productFeedStatusSyncSchedule, productFeedStatusSyncSuccess} from '../.storybook/mock/product-feed';

const commonProps = {
  nbProductsSuccess: 200,
  nbProductsPending: 4,
  nbProductsDisapproved: 4,
}

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
  ...commonProps,
  beforeMount(this: any) {
    this.$store.state.productFeed = productFeedStatusSyncSchedule;
  },
};

export const Default:any = Template.bind({});
Default.args = {
  ...commonProps,
  beforeMount(this: any) {
    this.$store.state.productFeed = productFeedStatusSyncSuccess;
  },  
};