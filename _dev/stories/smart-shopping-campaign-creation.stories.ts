import SmartShoppingCampaignCreation from "../src/components/smart-shopping-campaign-creation/smart-shopping-campaign-creation.vue";
import SmartShoppingCampaignPopin from "../src/components/smart-shopping-campaign-creation/smart-shopping-campaign-creation-filter-popin/smart-shopping-campaign-creation-popin.vue"
import { initialStateApp } from "../.storybook/mock/state-app";
import { googleAdsAccountChosen } from "../.storybook/mock/google-ads.js";
import { campaignWithUnhandledFilters, campaignBasic } from "../.storybook/mock/smart-shopping-campaigns";
import { rest } from "msw";
import { availableFilters } from "../.storybook/mock/smart-shopping-campaigns.js";
import {CampaignTypes} from '@/enums/reporting/CampaignStatus';

export default {
  title: "Smart Shopping Campaign/Creation",
  component: SmartShoppingCampaignCreation,SmartShoppingCampaignPopin,
  parameters: {
    msw: {
      handlers: [
        rest.get("/shopping-campaigns/list",  (req, res, ctx) => {
          return res(ctx.json({"campaigns":[
            {
                "id": "16004060865",
                "resourceName": "customers/4088436776/campaigns/16004060865",
                "campaignName": "rgereegr",
                "startDate": "2022-01-27",
                "endDate": "2037-12-30",
                "targetCountry": "FR",
                "dailyBudget": 3,
                "status": "ELIGIBLE",
                "currencyCode": "EUR",
                "type": "PERFORMANCE_MAX",
                "productFilters": [
                    {
                        "dimension": "categories",
                        "values": [
                            "2169"
                        ]
                    }
                ],
                "hasUnhandledFilters": false
            },
            {
                "id": "16004011605",
                "resourceName": "customers/4088436776/campaigns/16004011605",
                "campaignName": "zret",
                "startDate": "2022-01-27",
                "endDate": "2037-12-30",
                "targetCountry": "FR",
                "dailyBudget": 1,
                "status": "ELIGIBLE",
                "currencyCode": "EUR",
                "type": "SHOPPING_CAMPAIGN",
                "productFilters": [
                    {
                        "dimension": "categories",
                        "values": [
                            "2169",
                            "502981"
                        ]
                    }
                ],
                "hasUnhandledFilters": false
            }
        ]}))}),
        rest.get("/shopping-campaigns/dimensions/filters", (req, res, ctx) => {
          return res(ctx.json({
            "categories": [
                {
                    "name": "Arts et loisirs",
                    "id": "8",
                    "numberOfProductsAssociated": 2,
                    "children": [
                        {
                            "name": "Fêtes et soirées",
                            "id": "5709",
                            "numberOfProductsAssociated": 2,
                            "children": [
                                {
                                    "name": "Articles de fête",
                                    "id": "96",
                                    "numberOfProductsAssociated": 2,
                                    "children": [
                                        {
                                            "name": "Banderoles et rideaux de fête",
                                            "id": "502981",
                                            "numberOfProductsAssociated": 2
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Maison et jardin",
                    "id": "536",
                    "numberOfProductsAssociated": 3,
                    "children": [
                        {
                            "name": "Arts de la table et arts culinaires",
                            "id": "638",
                            "numberOfProductsAssociated": 3,
                            "children": [
                                {
                                    "name": "Arts de la table",
                                    "id": "672",
                                    "numberOfProductsAssociated": 3,
                                    "children": [
                                        {
                                            "name": "Articles de boisson",
                                            "id": "674",
                                            "numberOfProductsAssociated": 3,
                                            "children": [
                                                {
                                                    "name": "Mugs",
                                                    "id": "2169",
                                                    "numberOfProductsAssociated": 3
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            "brands": [
                {
                    "id": "ours",
                    "name": "ours",
                    "numberOfProductsAssociated": 1
                },
                {
                    "id": "Moche",
                    "name": "Moche",
                    "numberOfProductsAssociated": 4
                },
                {
                    "id": "renard",
                    "name": "renard",
                    "numberOfProductsAssociated": 1
                }
            ],
            "products": [
                {
                    "name": "Carnet de notes",
                    "id": "neuhpewg"
                },
                {
                    "name": "Tasse good day",
                    "id": "ofmjpmxs"
                },
                {
                    "name": "Photo de chat aux yeux verts",
                    "id": "ddjdrqcq"
                },
                {
                    "name": "Tasse personnalisable",
                    "id": "ycxyfvcq"
                },
                {
                    "name": "Tasse adventure",
                    "id": "cafzzbyc"
                },
                {
                    "name": "Photo de chat aux yeux bleus",
                    "id": "dwsehafr"
                },
                {
                    "name": "Carnet de notes",
                    "id": "urwpegig"
                },
                {
                    "name": "Tasse adventure",
                    "id": "egbittfl"
                }
            ],
            "conditions": [
                {
                    "id": "used",
                    "name": "used",
                    "numberOfProductsAssociated": 4
                },
                {
                    "id": "new",
                    "name": "new",
                    "numberOfProductsAssociated": 4
                }
            ]
        }));
        }),
      ],
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { SmartShoppingCampaignCreation, SmartShoppingCampaignPopin },
  template: `
  <div>
  <SmartShoppingCampaignCreation v-bind="$props" ref="sscCreation"/>
  <SmartShoppingCampaignPopin v-bind="$props" ref="SmartShoppingCampaignCreationPopin"/>
  </div>
  `,
  beforeCreate(this: any) {
    this.$store.state.app = Object.assign({}, initialStateApp);
    this.$store.state.app.psxMtgWithGoogleDefaultShopCountry = "EN";
    this.$store.state.googleAds = Object.assign({}, googleAdsAccountChosen);
  },
  beforeMount: args.beforeMount,
  mounted: args.mounted,
  
});

export const CreationSSC: any = Template.bind({});
CreationSSC.args = {
  loader: false,
  searchLoader: false,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.errorCampaignNameExists = null;
    this.$store.state.productFeed.validationSummary.activeItems = 2;
    this.$router.history.current.params.type = CampaignTypes.SMART_SHOPPING
  },
};
export const CreationPMax: any = Template.bind({});
CreationPMax.args = {
  loader: false,
  searchLoader: false,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.errorCampaignNameExists = null;
    this.$store.state.productFeed.validationSummary.activeItems = 2;
    this.$router.history.current.params.type = CampaignTypes.PERFORMANCE_MAX
  },
};
export const ErrorAPIWhileCreating: any = Template.bind({});
ErrorAPIWhileCreating.args = {
  loader: false,
  searchLoader: false,
  editMode: true,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.errorCampaignNameExists = null;
    this.$store.state.productFeed.validationSummary.activeItems = 2;
  },
  mounted(this: any) {
    this.$router.history.current.params.id = '16004060865'
    this.$refs.sscCreation.$data.displayError =true;
  }
};

export const CreationWithoutProducts: any = Template.bind({});
CreationWithoutProducts.args = {
  loader: false,
  searchLoader: false,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.errorCampaignNameExists = null;
    this.$store.state.productFeed.validationSummary.activeItems = 0;
  },
};

export const FieldsErrorFeedback: any = Template.bind({});
FieldsErrorFeedback.args = {
  loader: false,
  searchLoader: false,
  mounted(this: any) {
    // set name
    this.$refs.sscCreation.$data.campaignName = "foobar";
    // set invalid budget
    this.$refs.sscCreation.$data.campaignDailyBudget = "foobar";
    // set name to already exist
    const $ = this;
    setTimeout(function () {
      $.$store.commit(
        "smartShoppingCampaigns/SET_ERROR_CAMPAIGN_NAME_EXISTS",
        true
      );
    }, 300);
  },
};

export const Edition: any = Template.bind({});
Edition.args = {
  editMode: true,
  loader: false,
  searchLoader: false,
  mounted(this: any) {
    this.$router.history.current.params.id = '16004060865'
    this.$store.state.smartShoppingCampaigns.filtersChosen = [{dimension: 'bla', values: ['1', '2']}]
    this.$store.state.productFeed.validationSummary.activeItems = 2;
  },
};

export const EditionWithUnhandledFilters: any = Template.bind({});
EditionWithUnhandledFilters.args = {
  editMode: true,
  loader: false,
  searchLoader: false,
  mounted(this: any) {
    this.$store.state.smartShoppingCampaigns.campaigns= Object.assign([], [campaignWithUnhandledFilters]);
    this.$router.history.current.params.id = '16004060865',
    this.$store.state.smartShoppingCampaigns.errorFetchingFilters = false;
    this.$store.state.productFeed.validationSummary.activeItems = 2;
    Object.assign(
      this.$refs.sscCreation.$data,
      campaignWithUnhandledFilters
    );
},
};
EditionWithUnhandledFilters.parameters = {
    msw: {
      handlers: [
        rest.get("/shopping-campaigns/list",  (req, res, ctx) => {
          return res(ctx.json({"campaigns":[
            {
                "id": "16004060865",
                "resourceName": "customers/4088436776/campaigns/16004060865",
                "campaignName": "rgereegr",
                "startDate": "2022-01-27",
                "endDate": "2037-12-30",
                "targetCountry": "FR",
                "dailyBudget": 3,
                "status": "ELIGIBLE",
                "currencyCode": "EUR",
                "productFilters": [
                    {
                        "dimension": "categories",
                        "values": [
                            "2169"
                        ]
                    }
                ],
                "hasUnhandledFilters": true
            },
            {
                "id": "16004011605",
                "resourceName": "customers/4088436776/campaigns/16004011605",
                "campaignName": "zret",
                "startDate": "2022-01-27",
                "endDate": "2037-12-30",
                "targetCountry": "FR",
                "dailyBudget": 1,
                "status": "ELIGIBLE",
                "currencyCode": "EUR",
                "productFilters": [
                    {
                        "dimension": "categories",
                        "values": [
                            "2169",
                            "502981"
                        ]
                    }
                ],
                "hasUnhandledFilters": false
              },
            ],
          })
        );
      }),
    ],
  },
};

export const ErrorRetrievingFilters: any = Template.bind({});
ErrorRetrievingFilters.args = {
  loader: false,
  searchLoader: false,
  mounted(this: any) {
    this.$store.state.productFeed.validationSummary.activeItems = 2;
    // Is empty but is filled right away??
    this.$store.state.smartShoppingCampaigns.sscAvailableFilters = Object.assign([], [])
    this.$store.state.smartShoppingCampaigns.errorFetchingFilters = true
  },
};
ErrorRetrievingFilters.parameters = {
  msw: {
    handlers: [
      rest.get("/shopping-campaigns/list", (req, res, ctx) => {
        return res(ctx.json({ campaigns: [] }));
      }),
    ],
  },
};

export const PopinFiltersDimensionStep: any = Template.bind({});
PopinFiltersDimensionStep.args = {
  visible: true,
  loader: false,
  searchLoader: false,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.errorCampaignNameExists = null;
  },
  mounted(this: any) {
    // @ts-ignore
    this.$store.state.smartShoppingCampaigns.sscAvailableFilters  = Object.assign([], availableFilters);
    this.$store.state.smartShoppingCampaigns.dimensionChosen  = Object.assign({}, availableFilters[0]);
  },
};

export const PopinFiltersFiltersStep: any = Template.bind({});
PopinFiltersFiltersStep.args = {
  step: 2,
  visible: true,
  loader: false,
  searchLoader: false,
  beforeMount(this: any) {
    this.$store.state.smartShoppingCampaigns.errorCampaignNameExists = null;
  },
  mounted(this: any) {
    // @ts-ignore
    this.$store.state.smartShoppingCampaigns.dimensionChosen = Object.assign({}, availableFilters[0]);
    this.$refs.SmartShoppingCampaignCreationPopin.$data.step = 2;
  },
};
