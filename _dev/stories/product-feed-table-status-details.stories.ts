import ProductFeedTableStatusDetails from '../src/components/product-feed-page/product-feed-table-status-details.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
import {
  productFeed,

} from '../.storybook/mock/product-feed';
export default {
  title: 'Product feed page/Table Status Details',
  component: ProductFeedTableStatusDetails,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedTableStatusDetails },
  template: '<div><ProductFeedTableStatusDetails v-bind="$props" ref="testTable"/></div>',
  beforeMount(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
    this.$store.state.productFeed = Object.assign({}, productFeed);
  },
  mounted(this: any) {
    args.loading === true
      ? this.$refs.testTable.$data.loading = true
      : null
  }
});

export const TableStatusDetails:any = Template.bind({});
TableStatusDetails.args = {
  nextToken: null,
}

export const Loading:any = Template.bind({});
Loading.args = {
  nextToken: null,
  loading: true,
}
