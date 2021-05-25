import ProductFeedProductStatusCard from '../src/components/product-feed-page/product-feed-product-status-card.vue';

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
});

export const SyncStatusBusy:any = Template.bind({});
SyncStatusBusy.args = {
  ...commonProps,
  isSyncInProgress: true,
};

export const SyncStatusFailed:any = Template.bind({});
SyncStatusFailed.args = {
  ...commonProps,
  isSyncInProgress: false,
};

export const SyncStatusSuccess:any = Template.bind({});
SyncStatusSuccess.args = {
  ...commonProps,
  isSyncInProgress: false,
};
