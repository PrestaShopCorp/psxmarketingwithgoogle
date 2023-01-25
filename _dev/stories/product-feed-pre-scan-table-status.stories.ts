import ProductFeedPreScanTableStatusDetails from '../src/components/product-feed-page/product-feed-pre-scan-table-status-details.vue';
import {initialStateApp} from '../.storybook/mock/state-app';
import {
  productFeed,
  prevalidationScan,
  prevalidationScanForFrenchProducts,
  preScanFilteredInFR,
} from '../.storybook/mock/product-feed';

import {rest} from 'msw';

export default {
  title: 'Product feed page/Table PreScan Status Details',
  component: ProductFeedPreScanTableStatusDetails,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedPreScanTableStatusDetails },
  template: '<div><ProductFeedPreScanTableStatusDetails v-bind="$props" ref="preScanTable"/></div>',
  beforeMount: args.beforeMount,
  mounted(this: any) {
    this.$refs.preScanTable.$data.loading = args.loading;
  }
});

export const PreScanTableDetailWithAllLangs:any = Template.bind({});
PreScanTableDetailWithAllLangs.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeed);
    this.$store.state.app = Object.assign({}, initialStateApp);
  },
}
PreScanTableDetailWithAllLangs.parameters = {
  msw: {
    handlers: [
      rest.get('/product-feeds/prevalidation-scan/errors', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(prevalidationScan)
        );
      }),
    ],
  },
};

export const PreScanLangConflict:any = Template.bind({});
PreScanLangConflict.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({}, productFeed);
    this.$store.state.app = Object.assign({}, initialStateApp);
  },
}
PreScanLangConflict.parameters = {
  msw: {
    handlers: [
      rest.get('/product-feeds/prevalidation-scan/errors', (req, res, ctx) => {
        return res(
          ctx.status(409),
          ctx.json([])
        );
      }),
    ],
  },
};

export const PreScanApiError:any = Template.bind({});
PreScanApiError.parameters = {
  msw: {
    handlers: [
      rest.get('/product-feeds/prevalidation-scan/errors', (req, res, ctx) => {
        return res(
          ctx.status(400)
        );
      }),
    ],
  },
};

export const Loading:any = Template.bind({});
Loading.args = {
  loading: true,
}
