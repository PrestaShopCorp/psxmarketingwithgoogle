import ProductFeedSyncStatusCard from '../src/components/product-feed-page/product-feed-sync-status-card.vue';
import {productFeedStatusSyncSchedule, productFeedStatusSyncSuccess,productFeedStatusSyncFailed} from '../.storybook/mock/product-feed';
const commonProps = {
  nbProductsReadyToSync: 150,
  nbProductsCantSync: 5,
  nextSyncTime: '06/12/21 02:00',
  lastSyncTime: '21/05/21 02:00',
}

export default {
  title: 'Product Feed Page/Sync Status',
  component: ProductFeedSyncStatusCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedSyncStatusCard },
  template: '<ProductFeedSyncStatusCard v-bind="$props" />',
  beforeMount: args.beforeMount,
});

export const SyncStatusSchedule:any = Template.bind({});
SyncStatusSchedule.args = {
  ...commonProps,
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncSchedule);
  },
};

export const SyncStatusProcessed:any = Template.bind({});
SyncStatusProcessed.args = {
  ...commonProps,
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncSuccess);
  },
};

export const SyncStatusFailed:any = Template.bind({});
SyncStatusFailed.args = {
  ...commonProps,
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncFailed);
  },
};
