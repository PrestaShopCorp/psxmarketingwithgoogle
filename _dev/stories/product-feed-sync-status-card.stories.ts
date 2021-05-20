import ProductFeedSyncStatusCard from '../src/components/product-feed-sync-status/product-feed-sync-status-card.vue';

export default {
  title: 'Product Feed Page/Sync Status',
  component: ProductFeedSyncStatusCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedSyncStatusCard },
  template: '<ProductFeedSyncStatusCard v-bind="$props" />',
  syncStatus: {
    control: {
      type: 'select',
      options: [null, 'busy', 'error', 'success'],
    },
  },
});

export const SyncStatusBusy:any = Template.bind({});
SyncStatusBusy.args = {
  nbProductsReadyToSync: 150,
  nbProductsCantSync: 5,
  syncStatus: 'busy',
};

export const SyncStatusFailed:any = Template.bind({});
SyncStatusFailed.args = {
  nbProductsReadyToSync: 150,
  nbProductsCantSync: 5,
  syncStatus: 'error',
};

export const SyncStatusSuccess:any = Template.bind({});
SyncStatusSuccess.args = {
  nbProductsReadyToSync: 150,
  nbProductsCantSync: 5,
  syncStatus: 'success',
};
