import ProductFeedNotice from '../src/components/onboarding/product-feed-notice.vue'

export default {
  title: 'Onboarding/Components/Notice',
  component: ProductFeedNotice,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedNotice },
  template: '<ProductFeedNotice v-bind="$props" />',
});

export const Notice:any = Template.bind({});
Notice.args = {
}
