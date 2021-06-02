import ProductFeedSyncStatusCard from '../src/components/product-feed-page/product-feed-sync-status-card.vue';

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
        options: ['schedule', 'processed', 'failed'],
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedSyncStatusCard },
  template: '<ProductFeedSyncStatusCard v-bind="$props" />',
});

export const SyncStatusSchedule:any = Template.bind({});
SyncStatusSchedule.args = {
  ...commonProps,
  syncStatus: 'schedule',
};

export const SyncStatusProcessed:any = Template.bind({});
SyncStatusProcessed.args = {
  ...commonProps,
  syncStatus: 'processed',
};

export const SyncStatusFailed:any = Template.bind({});
SyncStatusFailed.args = {
  ...commonProps,
  syncStatus: 'failed',
};
