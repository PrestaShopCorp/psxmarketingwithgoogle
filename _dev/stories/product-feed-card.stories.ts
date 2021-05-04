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

export const Disabled:any = Template.bind({});
Disabled.args = {
  isEnabled: false,
};

export const EnabledToConfigure:any = Template.bind({});
EnabledToConfigure.args = {
  isEnabled: true,
};
