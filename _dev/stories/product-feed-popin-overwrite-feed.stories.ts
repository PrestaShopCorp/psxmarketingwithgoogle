import ProductFeedPopinOverwriteFeed from '../src/components/product-feed/product-feed-popin-overwrite-feed.vue'

export default {
  title: 'Product Feed/Popins/Overwrite Feed',
  component: ProductFeedPopinOverwriteFeed,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedPopinOverwriteFeed },
  template: `
    <div>
      <ProductFeedPopinOverwriteFeed v-bind="$props" />
    </div>
  `,
});

export const OverwriteFeed:any = Template.bind({});
OverwriteFeed.args = {
  visible: true,
};
