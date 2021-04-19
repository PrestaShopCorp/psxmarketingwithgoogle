import ProductFeedCard from '../src/components/onboarding/product-feed-card.vue'

export default {
  title: 'Onboarding/Components/Card - Product feed',
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
