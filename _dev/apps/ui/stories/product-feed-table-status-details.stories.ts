import ProductFeedTableStatusDetails from "../src/components/product-feed-page/product-feed-table-status-details.vue";
import { initialStateApp } from "../.storybook/mock/state-app";
import { productFeed } from "../.storybook/mock/product-feed";
import { rest } from "msw";

export default {
  title: "Product feed page/Table Status Details",
  component: ProductFeedTableStatusDetails,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedTableStatusDetails },
  template:
    '<div><ProductFeedTableStatusDetails v-bind="$props" ref="testTable"/></div>',
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
          ctx.json({
            nextToken: "6d5774328a7deb62",
            results: [
              {
                id: "7939",
                attribute: "0",
                name: "Venusaur",
                language: "en",
                statuses: [
                  {
                    destination: "Shopping",
                    status: "approved",
                    countries: ["FR", "IT", "BE"],
                  },
                  {
                    destination: "SurfacesAcrossGoogle",
                    status: "approved",
                    countries: ["FR", "IT", "BE"],
                  },
                ],
              },
              {
                id: "7990",
                attribute: "0",
                name: "Psykokwak",
                language: "fr",
                statuses: [
                  {
                    destination: "Shopping",
                    status: "disapproved",
                    countries: ["FR", "IT", "BE"],
                  },
                  {
                    destination: "SurfacesAcrossGoogle",
                    status: "disapproved",
                    countries: ["FR", "IT", "BE"],
                  },
                ],
                issues: [
                  {
                    code: "invalid_upc",
                    servability: "disapproved",
                    resolution: "merchant_action",
                    attributeName: "gtin",
                    destination: "SurfacesAcrossGoogle",
                    description: "Invalid value [gtin]",
                    detail: "Use your product's globally valid GTIN",
                    documentation:
                      "https://support.google.com/merchants/answer/6239388",
                    applicableCountries: ["FR", "IT", "BE"],
                  },
                  {
                    code: "policy_enforcement_account_disapproval",
                    servability: "disapproved",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description: "Suspended account for policy violation",
                    detail:
                      "Remove products that violate our policies, or request a manual review",
                    documentation:
                      "https://support.google.com/merchants/answer/2948694",
                    applicableCountries: ["BE"],
                  },
                ],
              },
              {
                id: "8028",
                attribute: "0",
                name: "Fantominus",
                language: "en",
                statuses: [
                  {
                    destination: "Shopping",
                    status: "approved",
                    countries: ["GB"],
                  },
                  {
                    destination: "SurfacesAcrossGoogle",
                    status: "disapproved",
                    countries: ["GB"],
                  },
                ],
                issues: [
                  {
                    code: "language_mismatch",
                    servability: "unaffected",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description: "Incorrect language",
                    detail: "Use a supported language for the country of sale",
                    documentation:
                      "https://support.google.com/merchants/answer/6101164",
                    applicableCountries: ["GB"],
                  },
                  {
                    code: "hard_goods_missing_2_out_of_3_identifiers",
                    servability: "demoted",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description:
                      "Limited performance due to missing identifiers [gtin, mpn, brand]",
                    detail:
                      "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don’t need to add an identifier.",
                    documentation:
                      "https://support.google.com/merchants/answer/6098295",
                    applicableCountries: ["GB"],
                  },
                  {
                    code: "price_mismatch",
                    servability: "disapproved",
                    resolution: "merchant_action",
                    attributeName: "price",
                    destination: "Shopping",
                    description: "Mismatched value (page crawl) [price]",
                    detail:
                      "Update your product's price in your product data to match the price on your landing page",
                    documentation:
                      "https://support.google.com/merchants/answer/6098334",
                    applicableCountries: ["GB"],
                  },
                  {
                    code: "pending_initial_policy_review_shopping_ads",
                    servability: "disapproved",
                    resolution: "pending_processing",
                    destination: "Shopping",
                    description: "Pending initial review",
                    detail:
                      "Please wait up to 3 business days for the review to be completed",
                    documentation:
                      "https://support.google.com/merchants/answer/2948694",
                    applicableCountries: ["GB"],
                  },
                  {
                    code: "missing_shipping",
                    servability: "disapproved",
                    resolution: "merchant_action",
                    attributeName: "shipping",
                    destination: "Shopping",
                    description: "Missing value [shipping]",
                    detail: "Add shipping costs for your product",
                    documentation:
                      "https://support.google.com/merchants/answer/6239383",
                    applicableCountries: ["GB"],
                  },
                ],
              },
              {
                id: "7961",
                attribute: "4",
                name: "Pikachu",
                language: "fr",
                statuses: [
                  {
                    destination: "Shopping",
                    status: "approved",
                    countries: ["FR"],
                  },
                  {
                    destination: "SurfacesAcrossGoogle",
                    status: "approved",
                    countries: ["FR"],
                  },
                ],
                issues: [
                  {
                    code: "language_mismatch",
                    servability: "unaffected",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description: "Incorrect language",
                    detail: "Use a supported language for the country of sale",
                    documentation:
                      "https://support.google.com/merchants/answer/6101164",
                    applicableCountries: ["FR"],
                  },
                  {
                    code: "hard_goods_missing_2_out_of_3_identifiers",
                    servability: "demoted",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description:
                      "Limited performance due to missing identifiers [gtin, mpn, brand]",
                    detail:
                      "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don’t need to add an identifier.",
                    documentation:
                      "https://support.google.com/merchants/answer/6098295",
                    applicableCountries: ["FR"],
                  },
                ],
              },
              {
                id: "7961",
                attribute: "4",
                name: "Pikachu",
                language: "it",
                statuses: [
                  {
                    destination: "Shopping",
                    status: "disapproved",
                    countries: ["BE"],
                  },
                  {
                    destination: "SurfacesAcrossGoogle",
                    status: "disapproved",
                    countries: ["BE"],
                  },
                ],
                issues: [
                  {
                    code: "language_mismatch",
                    servability: "unaffected",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description: "Incorrect language",
                    detail: "Use a supported language for the country of sale",
                    documentation:
                      "https://support.google.com/merchants/answer/6101164",
                    applicableCountries: ["FR", "IT"],
                  },
                  {
                    code: "hard_goods_missing_2_out_of_3_identifiers",
                    servability: "demoted",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description:
                      "Limited performance due to missing identifiers [gtin, mpn, brand]",
                    detail:
                      "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don’t need to add an identifier.",
                    documentation:
                      "https://support.google.com/merchants/answer/6098295",
                    applicableCountries: ["FR", "IT"],
                  },
                  {
                    code: "policy_enforcement_account_disapproval",
                    servability: "disapproved",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description: "Suspended account for policy violation",
                    detail:
                      "Remove products that violate our policies, or request a manual review",
                    documentation:
                      "https://support.google.com/merchants/answer/2948694",
                    applicableCountries: ["BE"],
                  },
                ],
              },
              {
                id: "7961",
                attribute: "3",
                name: "Pikachu",
                language: "de",
                statuses: [
                  {
                    destination: "Shopping",
                    status: "disapproved",
                    countries: ["BE"],
                  },
                  {
                    destination: "SurfacesAcrossGoogle",
                    status: "disapproved",
                    countries: ["BE"],
                  },
                ],
                issues: [
                  {
                    code: "language_mismatch",
                    servability: "unaffected",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description: "Incorrect language",
                    detail: "Use a supported language for the country of sale",
                    documentation:
                      "https://support.google.com/merchants/answer/6101164",
                    applicableCountries: ["FR", "IT"],
                  },
                  {
                    code: "hard_goods_missing_2_out_of_3_identifiers",
                    servability: "demoted",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description:
                      "Limited performance due to missing identifiers [gtin, mpn, brand]",
                    detail:
                      "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don’t need to add an identifier.",
                    documentation:
                      "https://support.google.com/merchants/answer/6098295",
                    applicableCountries: ["FR", "IT"],
                  },
                  {
                    code: "policy_enforcement_account_disapproval",
                    servability: "disapproved",
                    resolution: "merchant_action",
                    destination: "Shopping",
                    description: "Suspended account for policy violation",
                    detail:
                      "Remove products that violate our policies, or request a manual review",
                    documentation:
                      "https://support.google.com/merchants/answer/2948694",
                    applicableCountries: ["BE"],
                  },
                ],
              },
            ],
          })
        );
      }),
    ],
  },
};
