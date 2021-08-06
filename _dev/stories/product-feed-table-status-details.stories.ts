import ProductFeedTableStatusDetails from '../src/components/product-feed-page/product-feed-table-status-details.vue'
import {initialStateApp} from '../.storybook/mock/state-app';

export default {
  title: 'Product feed page/Table Status Details',
  component: ProductFeedTableStatusDetails,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedTableStatusDetails },
  template: '<div><ProductFeedTableStatusDetails v-bind="$props" /></div>',
  beforeMount(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
  },
});

export const TableStatusDetails:any = Template.bind({});
TableStatusDetails.args = {
}
