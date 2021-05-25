import ProductFeedSyncStatusCard from '../src/components/product-feed-sync-status/product-feed-sync-status-card.vue';

const commonProps = {
  nbProductsReadyToSync: 150,
  nbProductsCantSync: 5,
  nextSyncTime: '06/12/21 02:00',
  lastSyncTime: '21/05/21 02:00',
}

export default {
  title: 'Product Feed Page/Sync Status',
  component: ProductFeedSyncStatusCard,
  argTypes: {
    syncStatus: {
      control: {
        type: 'select',
        // @ts-ignore
        options: ['busy', 'error', 'success'],
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedSyncStatusCard },
  template: '<ProductFeedSyncStatusCard v-bind="$props" />',
});

export const SyncStatusBusy:any = Template.bind({});
SyncStatusBusy.args = {
  ...commonProps,
  syncStatus: 'busy',
};

export const SyncStatusFailed:any = Template.bind({});
SyncStatusFailed.args = {
  ...commonProps,
  syncStatus: 'error',
};

export const SyncStatusSuccess:any = Template.bind({});
SyncStatusSuccess.args = {
  ...commonProps,
  syncStatus: 'success',
};
