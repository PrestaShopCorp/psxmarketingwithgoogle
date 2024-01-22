import PopinProductIssues from '@/components/product-feed-page/disapproved-products-page/popin-product-issues.vue';
import { ProductIssuesResponse } from '@/components/render-issues/product-issues.types';

export default {
  title: 'Product Feed Page/Disapproved products Page/Popins',
  component: PopinProductIssues,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PopinProductIssues },
  template: `
    <div>
      <PopinProductIssues visible v-bind="$props" />
    </div>
  `,
});

const issuesResponse: ProductIssuesResponse = {
  "issues": [
    {
      "title": "Sale of live animals",
      "impact": {
        "message": "Prevents from showing in Belgium, France and Italy",
        "severity": "ERROR",
        "breakdowns": [
          {
            "regions": [
              {
                "code": "BE",
                "name": "Belgium"
              },
              {
                "code": "FR",
                "name": "France"
              },
              {
                "code": "IT",
                "name": "Italy"
              }
            ],
            "details": [
              "Product not showing in Shopping ads",
              "Product not showing in Dynamic Remarketing",
              "Product not showing in Free listings",
              "Product not showing in Discovery and/or Demand Gen ads",
              "Product not showing in Video ads"
            ]
          }
        ]
      },
      "prerenderedContent": "\u003cdiv class=\"issue-detail\"\u003e\u003cdiv class=\"issue-content\"\u003e\u003cp class=\"content-element\"\u003e\u003cspan class=\"segment\"\u003eThe sale of live animals was found on your online store.\u003c/span\u003e\u003c/p\u003e\u003cp class=\"content-element root-causes-intro\"\u003e\u003cspan class=\"segment\"\u003eMake sure your online store meets the local legal requirements and safety standards\u003c/span\u003e\u003c/p\u003e\u003cul class=\"content-element root-causes\"\u003e\u003cli\u003e\u003cp class=\"tooltip tooltip-style-info\"\u003e\u003cspan class=\"segment\"\u003eDon&#39;t sell live animals or provide services for the transportation of live animals\u003c/span\u003e\u003cspan class=\"tooltip-icon\"\u003e\u003cbr\u003e\u003c/span\u003e\u003cspan class=\"tooltip-text\"\u003e\u003cspan class=\"segment\"\u003eExamples: live fishing bait, coral or selling live animals as pets.\u003c/span\u003e\u003c/span\u003e\u003c/p\u003e\u003c/li\u003e\u003c/ul\u003e\u003ca href=\"https://support.google.com/merchants/answer/6150100?hl=en-US#safety\" class=\"content-element\"\u003eLearn more about regulated products\u003c/a\u003e\u003cp class=\"content-element content-moderation\"\u003eGoogle found this issue through automated checks\u003c/p\u003e\u003c/div\u003e\u003c/div\u003e",
      "actions": [
        {
          "externalAction": {
            "type": "REVIEW_PRODUCT_ISSUE_IN_MERCHANT_CENTER",
            "uri": "https://merchants.google.com/mc/items/details?a=476262275&hl=en-US&offerId=7990-0&channel=0&feedLabel=EUR&language=fr"
          },
          "buttonLabel": "I disagree with the issue",
          "isAvailable": true
        }
      ]
    },
    {
      "title": "Missing shipping in some countries",
      "impact": {
        "message": "Limits visibility in Belgium and Italy",
        "severity": "ERROR",
        "breakdowns": [
          {
            "regions": [
              {
                "code": "BE",
                "name": "Belgium"
              },
              {
                "code": "IT",
                "name": "Italy"
              }
            ],
            "details": [
              "Product not showing in Shopping ads",
              "Product not showing in Free listings",
              "Product not showing in Discovery and/or Demand Gen ads",
              "Product not showing in Video ads"
            ]
          }
        ]
      },
      "prerenderedContent": "\u003cdiv class=\"issue-detail\"\u003e\u003cdiv class=\"issue-content\"\u003e\u003cp class=\"content-element\"\u003e\u003cspan class=\"segment\"\u003eAdd shipping information for all countries you sell products in so customers know the delivery time and cost\u003c/span\u003e\u003c/p\u003e\u003ca href=\"https://support.google.com/merchants/answer/6239383?hl=en-US\" class=\"content-element\"\u003eLearn more\u003c/a\u003e\u003cp class=\"content-element content-moderation\"\u003e\u003c/p\u003e\u003c/div\u003e\u003c/div\u003e"
    },
    {
      "title": "Limited performance due to missing identifiers [gtin, mpn, brand]",
      "impact": {
        "message": "Limits visibility in France and Italy",
        "severity": "WARNING",
        "breakdowns": [
          {
            "regions": [
              {
                "code": "FR",
                "name": "France"
              },
              {
                "code": "IT",
                "name": "Italy"
              }
            ],
            "details": [
              "Limited visibility for product showing in Shopping ads",
              "Limited visibility for product showing in Free listings",
              "Limited visibility for product showing in Discovery and/or Demand Gen ads",
              "Limited visibility for product showing in Video ads"
            ]
          }
        ]
      },
      "prerenderedContent": "\u003cdiv class=\"issue-detail\"\u003e\u003cdiv class=\"issue-content\"\u003e\u003cp class=\"content-element\"\u003e\u003cspan class=\"segment\"\u003eAdd a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don&#39;t need to add an identifier.\u003c/span\u003e\u003c/p\u003e\u003ca href=\"https://support.google.com/merchants/answer/6098295?hl=en-US\" class=\"content-element\"\u003eLearn more\u003c/a\u003e\u003cp class=\"content-element content-moderation\"\u003e\u003c/p\u003e\u003c/div\u003e\u003c/div\u003e",
      "actions": [
        {
          "builtinSimpleAction": {
            "type": "EDIT_ITEM_ATTRIBUTE",
            "attributeCode": "brand"
          },
          "buttonLabel": "Edit brand",
          "isAvailable": true
        }
      ]
    },
    {
      "title": "Title under review",
      "impact": {
        "message": "Limits visibility in Belgium, France and Italy",
        "severity": "WARNING",
        "breakdowns": [
          {
            "regions": [
              {
                "code": "BE",
                "name": "Belgium"
              },
              {
                "code": "FR",
                "name": "France"
              },
              {
                "code": "IT",
                "name": "Italy"
              }
            ],
            "details": [
              "Product not showing in Discovery and/or Demand Gen ads"
            ]
          }
        ]
      },
      "prerenderedContent": "\u003cdiv class=\"issue-detail\"\u003e\u003cdiv class=\"issue-content\"\u003e\u003cp class=\"content-element\"\u003e\u003cspan class=\"segment\"\u003eGoogle is reviewing your product. This may take up to 5 days.\u003c/span\u003e\u003c/p\u003e\u003ca href=\"https://support.google.com/merchants/answer/13389785?hl=en-US\" class=\"content-element\"\u003eLearn more about Discovery and Demand Gen product ads\u003c/a\u003e\u003cp class=\"content-element content-moderation\"\u003e\u003c/p\u003e\u003c/div\u003e\u003c/div\u003e"
    },
    {
      "title": "Invalid image [additional image link]",
      "impact": {
        "severity": "INFO"
      },
      "prerenderedContent": "\u003cdiv class=\"issue-detail\"\u003e\u003cdiv class=\"issue-content\"\u003e\u003cp class=\"content-element\"\u003e\u003cspan class=\"segment\"\u003eEnsure the image is accessible and uses an accepted image format (JPEG, PNG, GIF)\u003c/span\u003e\u003c/p\u003e\u003ca href=\"https://support.google.com/merchants/answer/6098289?hl=en-US\" class=\"content-element\"\u003eLearn more\u003c/a\u003e\u003cp class=\"content-element content-moderation\"\u003e\u003c/p\u003e\u003c/div\u003e\u003c/div\u003e"
    }
  ],
  "alternateDisputeResolution": {
    "uri": "https://support.google.com/european-union-digital-services-act-redress-options?hl=en-US",
    "label": "Additional options available to you"
  }
};


export const ProductIssues:any = Template.bind({});
ProductIssues.args = {
  issues: issuesResponse.issues,
  productId: '1234',
};
