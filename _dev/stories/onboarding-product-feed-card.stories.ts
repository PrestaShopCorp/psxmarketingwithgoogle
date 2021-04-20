import ProductFeedCard from '../src/components/product-feed/product-feed-card.vue'

export default {
  title: 'Product feed/Card',
  component: ProductFeedCard,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedCard },
  template: '<ProductFeedCard v-bind="$props" />',
});

export const Default:any = Template.bind({});
Default.args = {
  isEnabled: false,
}
