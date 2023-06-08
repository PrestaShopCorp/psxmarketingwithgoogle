import ProductFeedNonCompliant from '@/components/product-feed-page/non-compliant-products-page/non-compliant-products-page.vue'

export default {
  title: 'Product-Feed-Page/Non compliant products Page',
  component: ProductFeedNonCompliant,
};
const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedNonCompliant },
  template: '<ProductFeedNonCompliant v-bind="$props" />',
});

export const Default: any = Template.bind({});
Default.args = {
  loading: false,
};

export const NoData: any = Template.bind({});
NoData.args = {
  loading: false,
};

export const Loading: any = Template.bind({});
Loading.args = {
  loading: true,
};
