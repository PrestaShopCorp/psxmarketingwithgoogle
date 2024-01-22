import { rest } from "msw";
import DisapprovedProductsPage from "@/components/product-feed-page/disapproved-products-page/disapproved-products-page.vue";
import { initialStateApp } from "@/../.storybook/mock/state-app";
import { productFeed } from "@/../.storybook/mock/product-feed";
import {disapprovedProductsMock} from '@/../.storybook/mock/product-feeds/validation/list';

export default {
  title: "Product feed page/Disapproved products Page",
  component: DisapprovedProductsPage,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DisapprovedProductsPage },
  template:
    '<div><DisapprovedProductsPage v-bind="$props" ref="testTable"/></div>',
  beforeMount(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
    this.$store.state.productFeed = Object.assign({}, productFeed);
    this.$store.state.productFeed.productsDatas.items = [];
  },
  mounted(this: any) {
    if (args.loading === true) {
      this.$refs.testTable.$data.loading = true;
    }
  },
});

export const TableStatusDetails: any = Template.bind({});

export const Loading: any = Template.bind({});
Loading.args = {
  loading: true,
};
TableStatusDetails.parameters = {
  msw: {
    handlers: [
      rest.get("/product-feeds/prevalidation-scan", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            result: [
              {
                id: 1,
                name: "Product 1",
                language: "EN",
                image: "product-1.jpg",
                description: "Product 1 description",
                barcode: "",
                price: "$10.00",
              },
              {
                id: 2,
                name: "Product 2",
                language: "FR",
                image: "product-2.jpg",
                description: "Product 2 description",
                barcode: "",
                price: "$10.00",
              },
              {
                id: 3,
                name: "Product 3",
                language: "FR",
                image: "product-3.jpg",
                description: "Product 3 description",
                barcode: "xx",
                price: "",
              },
              {
                id: 4,
                name: "Product 4",
                language: "FR",
                image: "product-4.jpg",
                description: "Product 4 description",
                barcode: "",
                price: "$10.00",
              },
              {
                id: 5,
                name: "Product 5",
                language: "FR",
                image: "product-5.jpg",
                description: "Product 5 description",
                barcode: "xx",
                price: "$10.00",
              },
            ],
          })
        );
      }),
      rest.get("/product-feeds/validation/list*", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(disapprovedProductsMock),
        );
      }),
    ],
  },
};
