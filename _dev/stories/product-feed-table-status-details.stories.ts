import ProductFeedTableStatusDetails from '../src/components/product-feed-page/product-feed-table-status-details.vue'
import {initialStateApp} from '../.storybook/mock/state-app';
import {
  productFeed,
} from '../.storybook/mock/product-feed';
import {rest} from 'msw';

export default {
  title: 'Product feed page/Table Status Details',
  component: ProductFeedTableStatusDetails,
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProductFeedTableStatusDetails },
  template: '<div><ProductFeedTableStatusDetails v-bind="$props" ref="testTable"/></div>',
  beforeMount(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
    // this.$store.state.productFeed = Object.assign({}, productFeed);
  },
  mounted(this: any) {
    if (args.loading === true) {
     this.$refs.testTable.$data.loading = true;
    }
  }
});

export const TableStatusDetails:any = Template.bind({});

export const Loading:any = Template.bind({});
Loading.args = {
  loading: true,
}
TableStatusDetails.parameters = {
  msw: {
    handlers: [
      rest.get('/product-feeds/prevalidation-scan', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({'results' : [
            {
              id: 1,
              name: 'Product 1',
              language: 'EN',
              image: 'product-1.jpg',
              description: 'Product 1 description',
              barcode: '',
              price: '$10.00',
            },
            {
              id: 2,
              name: 'Product 2',
              language: 'FR',
              image: 'product-2.jpg',
              description: 'Product 2 description',
              barcode: '',
              price: '$10.00',
            },
            {
              id: 3,
              name: 'Product 3',
              language: 'FR',
              image: 'product-3.jpg',
              description: 'Product 3 description',
              barcode: 'xx',
              price: '',
            },
            {
              id: 4,
              name: 'Product 4',
              language: 'FR',
              image: 'product-4.jpg',
              description: 'Product 4 description',
              barcode: '',
              price: '$10.00',
            },
            {
              id: 5,
              name: 'Product 5',
              language: 'FR',
              image: 'product-5.jpg',
              description: 'Product 5 description',
              barcode: 'xx',
              price: '$10.00',
            },
          ]})
        );
      }),
      rest.get('/product-feeds/validation/list', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({'results' :[
            {
                "id": "8028",
                "attribute": "0",
                "name": "Fantominus",
                "statuses": [
                    {
                        "destination": "Shopping",
                        "status": "disapproved",
                        "countries": [
                            "GB"
                        ]
                    },
                    {
                        "destination": "SurfacesAcrossGoogle",
                        "status": "disapproved",
                        "countries": [
                            "GB"
                        ]
                    }
                ],
                "issues": [
                    {
                        "code": "media_missing_gtin",
                        "servability": "demoted",
                        "resolution": "merchant_action",
                        "attributeName": "gtin",
                        "destination": "Shopping",
                        "description": "Limited performance due to missing ISBN or GTIN",
                        "detail": "Add your product's globally valid ISBN or GTIN",
                        "documentation": "https://support.google.com/merchants/answer/9542185",
                        "applicableCountries": [
                            "GB"
                        ]
                    },
                    {
                        "code": "pending_initial_policy_review_shopping_ads",
                        "servability": "disapproved",
                        "resolution": "pending_processing",
                        "destination": "Shopping",
                        "description": "Pending initial review",
                        "detail": "Please wait up to 3 business days for the review to be completed",
                        "documentation": "https://support.google.com/merchants/answer/2948694",
                        "applicableCountries": [
                            "GB"
                        ]
                    },
                    {
                        "code": "missing_shipping",
                        "servability": "disapproved",
                        "resolution": "merchant_action",
                        "attributeName": "shipping",
                        "destination": "Shopping",
                        "description": "Missing value [shipping]",
                        "detail": "Add shipping costs for your product",
                        "documentation": "https://support.google.com/merchants/answer/6239383",
                        "applicableCountries": [
                            "GB"
                        ]
                    }
                ]
            },
            {
                "id": "7946",
                "attribute": "0",
                "name": "Chenipan",
                "statuses": [
                    {
                        "destination": "Shopping",
                        "status": "disapproved",
                        "countries": [
                            "BE"
                        ]
                    },
                    {
                        "destination": "SurfacesAcrossGoogle",
                        "status": "disapproved",
                        "countries": [
                            "FR",
                            "IT",
                            "BE"
                        ]
                    }
                ],
                "issues": [
                    {
                        "code": "media_missing_gtin",
                        "servability": "demoted",
                        "resolution": "merchant_action",
                        "attributeName": "gtin",
                        "destination": "Shopping",
                        "description": "Limited performance due to missing ISBN or GTIN",
                        "detail": "Add your product's globally valid ISBN or GTIN",
                        "documentation": "https://support.google.com/merchants/answer/9542185",
                        "applicableCountries": [
                            "FR",
                            "IT"
                        ]
                    },
                    {
                        "code": "policy_enforcement_account_disapproval",
                        "servability": "disapproved",
                        "resolution": "merchant_action",
                        "destination": "Shopping",
                        "description": "Suspended account for policy violation",
                        "detail": "Remove products that violate our policies, or request a manual review",
                        "documentation": "https://support.google.com/merchants/answer/2948694",
                        "applicableCountries": [
                            "BE"
                        ]
                    }
                ]
            },
            {
                "id": "7937",
                "attribute": "0",
                "name": "Bulbasaur",
                "statuses": [
                    {
                        "destination": "Shopping",
                        "status": "disapproved",
                        "countries": [
                            "GB"
                        ]
                    },
                    {
                        "destination": "SurfacesAcrossGoogle",
                        "status": "disapproved",
                        "countries": [
                            "GB"
                        ]
                    }
                ],
                "issues": [
                    {
                        "code": "hard_goods_missing_2_out_of_3_identifiers",
                        "servability": "demoted",
                        "resolution": "merchant_action",
                        "destination": "Shopping",
                        "description": "Limited performance due to missing identifiers [gtin, mpn, brand]",
                        "detail": "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don’t need to add an identifier.",
                        "documentation": "https://support.google.com/merchants/answer/6098295",
                        "applicableCountries": [
                            "GB"
                        ]
                    },
                    {
                        "code": "pending_initial_policy_review_shopping_ads",
                        "servability": "disapproved",
                        "resolution": "pending_processing",
                        "destination": "Shopping",
                        "description": "Pending initial review",
                        "detail": "Please wait up to 3 business days for the review to be completed",
                        "documentation": "https://support.google.com/merchants/answer/2948694",
                        "applicableCountries": [
                            "GB"
                        ]
                    },
                    {
                        "code": "missing_shipping",
                        "servability": "disapproved",
                        "resolution": "merchant_action",
                        "attributeName": "shipping",
                        "destination": "Shopping",
                        "description": "Missing value [shipping]",
                        "detail": "Add shipping costs for your product",
                        "documentation": "https://support.google.com/merchants/answer/6239383",
                        "applicableCountries": [
                            "GB"
                        ]
                    }
                ]
            },
            {
                "id": "7945",
                "attribute": "0",
                "name": "Blastoise",
                "statuses": [
                    {
                        "destination": "Shopping",
                        "status": "disapproved",
                        "countries": [
                            "BE"
                        ]
                    },
                    {
                        "destination": "SurfacesAcrossGoogle",
                        "status": "disapproved",
                        "countries": [
                            "FR",
                            "IT",
                            "BE"
                        ]
                    }
                ],
                "issues": [
                    {
                        "code": "language_mismatch",
                        "servability": "unaffected",
                        "resolution": "merchant_action",
                        "destination": "Shopping",
                        "description": "Incorrect language",
                        "detail": "Use a supported language for the country of sale",
                        "documentation": "https://support.google.com/merchants/answer/6101164",
                        "applicableCountries": [
                            "FR",
                            "IT"
                        ]
                    },
                    {
                        "code": "hard_goods_missing_2_out_of_3_identifiers",
                        "servability": "demoted",
                        "resolution": "merchant_action",
                        "destination": "Shopping",
                        "description": "Limited performance due to missing identifiers [gtin, mpn, brand]",
                        "detail": "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don’t need to add an identifier.",
                        "documentation": "https://support.google.com/merchants/answer/6098295",
                        "applicableCountries": [
                            "FR",
                            "IT"
                        ]
                    },
                    {
                        "code": "policy_enforcement_account_disapproval",
                        "servability": "disapproved",
                        "resolution": "merchant_action",
                        "destination": "Shopping",
                        "description": "Suspended account for policy violation",
                        "detail": "Remove products that violate our policies, or request a manual review",
                        "documentation": "https://support.google.com/merchants/answer/2948694",
                        "applicableCountries": [
                            "BE"
                        ]
                    }
                ]
            }
        ]})
        );
      }),
    ],
  },
};
