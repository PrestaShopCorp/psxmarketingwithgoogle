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
    verifiedProducts: 12562,
    nonCompliantProducts: 0,
  },
  loading: false,
};

export const ProductsWithIssues:any = ProductFeed.bind({});
ProductsWithIssues.args = {
  verificationsStats: {
    productsInCatalog: '1362452',
    verifiedProducts: 1362392,
    nonCompliantProducts: 60,
  },
  loading: false,
};

export const NoData:any = ProductFeed.bind({});
NoData.args = {
  verificationsStats: {
    productsInCatalog: null,
    verifiedProducts: null,
    nonCompliantProducts: null,
  },
  loading: false,
};

export const Loading:any = ProductFeed.bind({});
Loading.args = {
  verificationsStats: {
    productsInCatalog: null,
    verifiedProducts: null,
    nonCompliantProducts: null,
  },
  loading: true,
};
