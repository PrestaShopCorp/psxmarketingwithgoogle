import ProductFeedProductStatusCard from '../src/components/product-feed-page/product-feed-product-status-card.vue';
import {productFeedStatusSyncSchedule, productFeedStatusSyncSuccess} from '../.storybook/mock/product-feed';
import {googleAccountConnected} from '../.storybook/mock/google-account';

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

export const ReadyForExport:any = Template.bind({});
ReadyForExport.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncSchedule);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, googleAccountConnected);
  },
};

export const Default:any = Template.bind({});
Default.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeedStatusSyncSuccess);
    this.$store.state.accounts.googleMerchantAccount = Object.assign({}, googleAccountConnected);
  },
};
