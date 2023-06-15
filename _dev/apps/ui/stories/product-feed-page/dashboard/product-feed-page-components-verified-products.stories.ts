import VerifiedProducts from '@/components/product-feed-page/dashboard/panel/verified-products.vue';

export default {
  title: 'Product-Feed-Page/Product Feed Page/Components/Verified Products',
};

const ProductFeed = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VerifiedProducts },
  template: `<VerifiedProducts
    ref="VerifiedProducts"
    v-bind="$props"
  />`,
});

export const ProductsAllVerified:any = ProductFeed.bind({});
ProductsAllVerified.args = {
  verificationsStats: {
    productsInCatalog: '12562',
    validProducts: 12562,
    invalidProducts: 0,
  },
  loading: false,
};

export const ProductsWithIssues:any = ProductFeed.bind({});
ProductsWithIssues.args = {
  verificationsStats: {
    productsInCatalog: '1362452',
    validProducts: 1362392,
    invalidProducts: 60,
  },
  loading: false,
};

export const NoData:any = ProductFeed.bind({});
NoData.args = {
  verificationsStats: {
    productsInCatalog: null,
    validProducts: null,
    invalidProducts: null,
  },
  loading: false,
};

export const Loading:any = ProductFeed.bind({});
Loading.args = {
  verificationsStats: {
    productsInCatalog: null,
    validProducts: null,
    invalidProducts: null,
  },
  loading: true,
};
