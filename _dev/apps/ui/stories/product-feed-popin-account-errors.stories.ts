import ProductFeedPopinAccountErrors from '@/components/product-feed/product-feed-popin-account-errors.vue';

export default {
  title: 'Product Feed/Popins/Account errors',
  component: ProductFeedPopinAccountErrors,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedPopinAccountErrors },
  template: `
    <div>
      <ProductFeedPopinAccountErrors v-bind="$props" />
    </div>
  `,
});

export const Default:any = Template.bind({});
Default.args = {
};
