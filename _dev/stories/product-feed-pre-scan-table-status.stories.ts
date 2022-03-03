import ProductFeedPreScanTableStatusDetails from '../src/components/product-feed-page/product-feed-pre-scan-table-status-details.vue';
import {initialStateApp} from '../.storybook/mock/state-app';
import {
  productFeed,
  prevalidationScan,
} from '../.storybook/mock/product-feed';

import {rest} from 'msw';

export default {
  title: 'Product feed page/Table PreScan Status Details',
  component: ProductFeedPreScanTableStatusDetails,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedPreScanTableStatusDetails },
  template: '<div><ProductFeedPreScanTableStatusDetails v-bind="$props" ref="preScanTable"/></div>',
  beforeMount(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
    this.$store.state.productFeed = Object.assign({}, productFeed);
  },
  mounted(this: any) {
     this.$refs.preScanTable.$data.loading = args.loading;
  }
});

export const PreScanTableDetail:any = Template.bind({});

export const Loading:any = Template.bind({});
Loading.args = {
  loading: true,
}

PreScanTableDetail.parameters = {
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
