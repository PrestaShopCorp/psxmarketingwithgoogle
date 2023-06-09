import { rest } from 'msw';
import cloneDeep from 'lodash.clonedeep';

import ProductFeedNonCompliant from '@/components/product-feed-page/non-compliant-products-page/non-compliant-products-page.vue'
import { productFeedStatusSyncSuccess } from '../../../.storybook/mock/product-feed';

export default {
  title: 'Product-Feed-Page/Non compliant products Page',
  component: ProductFeedNonCompliant,
};
const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedNonCompliant },
  template: '<ProductFeedNonCompliant ref="page" v-bind="$props" />',
  ...(args.mounted? {mounted: args.mounted} : {}),
});

export const Default: any = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get('/product-feeds/verification/issues', (req, res, ctx) => {
        return res(
          ctx.json(cloneDeep(productFeedStatusSyncSuccess.verificationIssues))
        );
      }),
    ],
  },
};

export const NoData: any = Template.bind({});
NoData.parameters = {
  msw: {
    handlers: [
      rest.get('/product-feeds/verification/issues', (req, res, ctx) => {
        return res(
          ctx.json([])
        );
      }),
    ],
  },
};

export const Loading: any = Template.bind({});
Loading.args = {
  mounted(this: any) {
    setTimeout(() => {
      this.$refs.page.$data.loading = true;
    }, 500);
  }
};
Loading.parameters = {
  msw: {
    handlers: [
      rest.get('/product-feeds/verification/issues', (req, res, ctx) => {
        return res(
          ctx.json([])
        );
      }),
    ],
  },
};

export const ErrorApi: any = Template.bind({});
ErrorApi.parameters = {
  msw: {
    handlers: [
      rest.get('/product-feeds/verification/issues', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
    ],
  },
};