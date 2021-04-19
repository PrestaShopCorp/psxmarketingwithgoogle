import ProductFeedSettings from '../src/components/onboarding/product-feed-settings.vue'

export default {
  title: 'Onboarding/Components/Settings - Product feed',
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
