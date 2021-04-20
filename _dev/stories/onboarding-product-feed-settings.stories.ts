import ProductFeedSettings from '../src/components/product-feed/product-feed-settings.vue'

export default {
  title: 'Product feed/Settings',
  component: ProductFeedSettings,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedSettings },
  template: '<ProductFeedSettings v-bind="$props" />',
});

export const Default:any = Template.bind({});
Default.args = {
}
