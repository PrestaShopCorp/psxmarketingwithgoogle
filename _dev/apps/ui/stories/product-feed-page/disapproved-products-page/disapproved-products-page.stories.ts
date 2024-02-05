import { rest } from "msw";
import DisapprovedProductsPage from "@/components/product-feed-page/disapproved-products-page/disapproved-products-page.vue";
import { initialStateApp } from "@/../.storybook/mock/state-app";
import { productFeed } from "@/../.storybook/mock/product-feed";
import {productValidationListMock} from '@/../.storybook/mock/api-routes/product-validations';
import {defaultProductIssuesMock} from '@/../.storybook/mock/api-routes/product-feeds/validation/product';
import { RequestState } from "@/store/types";
import {State as ProductFeedState} from '@/store/modules/product-feed/state';

export default {
  title: "Product feed page/Disapproved products Page",
  component: DisapprovedProductsPage,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DisapprovedProductsPage },
  template:
    '<div><DisapprovedProductsPage v-bind="$props" ref="page"/></div>',
  beforeMount(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
    (this.$store.state.productFeed as ProductFeedState) = Object.assign({}, productFeed);
    (this.$store.state.productFeed as ProductFeedState).gmcProductsByStatus.results.disapproved = [];
  },
  ...(args.mounted? {mounted: args.mounted} : {}),
});

export const TableStatusDetails: any = Template.bind({});
TableStatusDetails.parameters = {
  msw: {
    handlers: [
      rest.get("/product-validations", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(productValidationListMock),
        );
      }),

      rest.get("/product-feeds/validation/product/*", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(defaultProductIssuesMock),
        );
      }),
    ],
  },
};

export const Loading: any = Template.bind({});
Loading.args = {
  mounted(this: any) {
    setTimeout(() => {
      this.$refs.page.$data.loadingStatus = RequestState.PENDING;
    }, 500);
  }
};
Loading.parameters = {
  msw: {
    handlers: [
      rest.get('/product-feeds/validation/list', (req, res, ctx) => {
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
      rest.get('/product-feeds/validation/list', (req, res, ctx) => {
        return res(
          ctx.status(500)
        );
      }),
    ],
  },
};