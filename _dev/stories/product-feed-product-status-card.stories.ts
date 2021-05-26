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

export const SynInProgress:any = Template.bind({});
SynInProgress.args = {
  ...commonProps,
  isSyncInProgress: true,
};

export const Default:any = Template.bind({});
Default.args = {
  ...commonProps,
  isSyncInProgress: false,
};
