import SubmittedProducts from '@/components/product-feed-page/dashboard/panel/submitted-products.vue';
import { productFeedIsConfigured } from '../.storybook/mock/product-feed';

export default {
  title: 'Product-Feed-Page/Product Feed Page/Components/Submitted Products',
};

const ProductFeed = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SubmittedProducts },
  template: `<SubmittedProducts
    ref="SubmittedProducts"
    v-bind="$props"
  />`,
  beforeMount: args.beforeMount,
});

export const ProductsAllSubmitted:any = ProductFeed.bind({});
ProductsAllSubmitted.args = {
  loading: false,
  beforeMount(this:any){
    this.$store.state.productFeed = Object.assign({},
      productFeedIsConfigured,
      {
        validationSummary: {
          activeItems: 359850012,
          expiringItems: 50,
          pendingItems: 0,
          disapprovedItems: 0,
        }
      },
    );
  },
};

export const ProductsWithIssues:any = ProductFeed.bind({});
ProductsWithIssues.args = {
  loading: false,
  beforeMount(this:any){
    this.$store.state.productFeed = Object.assign({},
      productFeedIsConfigured,
      {
        validationSummary: {
          activeItems: 359812,
          expiringItems: 0,
          pendingItems: 3,
          disapprovedItems: 45230,
        }
      },
    );
  },
};

export const NoData:any = ProductFeed.bind({});
NoData.args = {
  loading: false,
};

export const Loading:any = ProductFeed.bind({});
Loading.args = {
  loading: true,
};
