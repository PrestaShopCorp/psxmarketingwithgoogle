import ProductFeedNonCompliant from '../src/components/product-feed-page/product-feed-non-compliant.vue'

export default {
  title: 'Product feed page/Non compliant page',
  component: ProductFeedNonCompliant,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedNonCompliant },
  template: '<ProductFeedNonCompliant v-bind="$props" />',
});

export const ProductFeedNonCompliantLoading: any = Template.bind({});
ProductFeedNonCompliantLoading.args = {
  loading: true,
};
