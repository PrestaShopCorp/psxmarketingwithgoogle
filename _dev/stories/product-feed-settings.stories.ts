import TunnelProductFeed from '../src/views/tunnel-product-feed.vue';
import {productFeed, productFeedNoCarriers ,productFeedIsReadyForExport, productFeedSyncScheduleNow} from '../.storybook/mock/product-feed';
import {initialStateApp, appMultiCountries} from '../.storybook/mock/state-app';
import {rest} from 'msw';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';

export default {
  title: 'Product feed/Settings',
  component: TunnelProductFeed,
  parameters: {
    jest: [
      'tunnel-product-feed.spec.ts',
      'summary.spec.ts',
      'target-countries.spec.ts',
      'shipping-settings-provider.spec.ts',
      'shipping-settings.vue',
      'table-row-carrier.vue',
    ],
    msw: {
      handlers: [
        rest.get('/incremental-sync/status/', (req, res, ctx) => {
          return res(
            ctx.json({
              "syncSchedule": "At 01:00 AM, every day",
              "nextJobAt": "2021-12-16T01:00:00.000Z",
              "jobEndedAt": null,
              "lastUpdatedAt": null,
              "success": true
            }),
          );
        }),
        rest.get('/incremental-sync/settings/', (req, res, ctx) => {
          return res(
            ctx.json({
              "autoImportTaxSettings": false,
              "enabled": true,
              "additionalShippingSettings": {
                  "deliveryDetails": []
              },
              "attributeMapping": {
                  "mpn": [
                      {
                          "ids": [
                              "mpn"
                          ],
                          "type": "product"
                      }
                  ],
                  "gtin": [
                      {
                          "type": "product",
                          "ids": [
                              "mpn"
                          ]
                      }
                  ],
                  "brand": [
                      {
                          "ids": [
                              "manufacturer"
                          ],
                          "type": "product"
                      }
                  ],
                  "description": [
                      {
                          "type": "product",
                          "ids": [
                              "description"
                          ]
                      }
                  ]
              },
              "shippingSettings": [],
              "fullSync": false,
              "updatedAt": "2022-06-14T13:34:20.934Z",
              "selectedProductCategories": [
                  "none"
              ],
              "syncSchedule": "At 03:00 AM, 09:00 AM, 03:00 PM and 09:00 PM, every day",
              "productsPerBatchSync": 100,
              "shopId": "f42b02d8-bbad-43df-8af2-d6bb9df4c245",
              "targetCountries": [
                  "FR"
              ],
              "autoImportShippingSettings": true
          })
          );
        }),
        rest.get('/product-feeds/attributes', (req, res, ctx) => {
          return res(
            ctx.json({
              "gtin": [
                {
                  "type": "product",
                  "id": "upc"
                }
              ],
              "energyEfficiencyClass": [],
              "color": [],
              "minEnergyEfficiencyClass": [],
              "mpn": [
                {
                  "type": "product",
                  "id": "mpn"
                }
              ],
              "brand": [],
              "ageGroup": [],
              "gender": [],
              "description": [
                {
                  "id": "description",
                  "type": "product"
                }
              ],
              "size": [],
              "maxEnergyEfficiencyClass": []
            })
          );
        }),
        rest.post('/', (req: any, res, ctx) => {
          const payload = req.body.action;
          if (payload === 'getProductsReadyToSync') {
            return res(
              ctx.json({
                "total": "717"
              })
            );
          } else if (payload === 'getShopAttributes') {
            return res(
              ctx.json([])
            );
          }
        }),
        rest.post('/', (req: any, res, ctx) => {
          const payload = req.body.action;
          if (payload === 'getCarrierValues') {
            return res(
              ctx.json([
                {
                    "collection": "carrier_details",
                    "id": "32-1-0-33",
                    "properties": {
                        "id_reference": "32",
                        "id_carrier_detail": "33",
                        "shipping_method": "range_weight",
                        "delimiter1": 0,
                        "delimiter2": 1,
                        "country_ids": "ES,FR,IT,PL,GB,HR",
                        "state_ids": "AG,AL,AN,AO,AR,AP,AT,AV,BA,BT,BL,BN,BG,BI,BO,BZ,BS,BR,CA,CL,CB,CI,CE,CT,CZ,CH,CO,CS,CR,KR,CN,EN,FM,FE,FI,FG,FC,FR,GE,GO,GR,IM,IS,AQ,SP,LT,LE,LC,LI,LO,LU,MC,MN,MS,MT,VS,ME,MI,MO,MB,NA,NO,NU,OG,OT,OR,PD,PA,PR,PV,PG,PU,PE,PC,PI,PT,PN,PZ,PO,RG,RA,RC,RE,RI,RN,RM,RO,SA,SS,SV,SI,SR,SO,TA,TE,TR,TO,TP,TN,TV,TS,UD,VA,VE,VB,VC,VR,VV,VI,VT,ES-C,ES-VI,ES-AB,ES-A,ES-AL,ES-O,ES-AV,ES-BA,ES-PM,ES-B,ES-BU,ES-CC,ES-CA,ES-S,ES-CS,ES-CR,ES-CO,ES-CU,ES-GI,ES-GR,ES-GU,ES-SS,ES-H,ES-HU,ES-J,ES-LO,ES-GC,ES-LE,ES-L,ES-LU,ES-M,ES-MA,ES-MU,ES-NA,ES-OR,ES-P,ES-PO,ES-SA,ES-TF,ES-SG,ES-SE,ES-SO,ES-T,ES-TE,ES-TO,ES-V,ES-VA,ES-BI,ES-ZA,ES-Z,ES-CE,ES-ML",
                        "price": 0
                    }
                },
                {
                    "collection": "carriers",
                    "id": "34",
                    "properties": {
                        "id_carrier": "34",
                        "id_reference": "34",
                        "name": "sdhfh",
                        "carrier_taxes_rates_group_id": "11",
                        "url": "",
                        "active": true,
                        "deleted": false,
                        "shipping_handling": 2,
                        "free_shipping_starts_at_price": 0,
                        "free_shipping_starts_at_weight": 0,
                        "disable_carrier_when_out_of_range": false,
                        "is_module": false,
                        "is_free": true,
                        "shipping_external": false,
                        "need_range": false,
                        "external_module_name": "",
                        "max_width": 21,
                        "max_height": 12,
                        "max_depth": 23,
                        "max_weight": 12,
                        "grade": 0,
                        "delay": "sgg",
                        "currency": "EUR",
                        "weight_unit": "Kg",
                        "country_ids": "ES,FR,IT,PL,GB,HR"
                    }
                },
                {
                    "collection": "carrier_taxes",
                    "id": 34,
                    "properties": {
                        "id_reference": "34",
                        "id_carrier_tax": "11",
                        "country_id": "HR",
                        "state_ids": "",
                        "tax_rate": 4
                    }
                },
                {
                    "collection": "carriers",
                    "id": "35",
                    "properties": {
                        "id_carrier": "35",
                        "id_reference": "35",
                        "name": "ee",
                        "carrier_taxes_rates_group_id": "0",
                        "url": "",
                        "active": true,
                        "deleted": false,
                        "shipping_handling": 0,
                        "free_shipping_starts_at_price": 0,
                        "free_shipping_starts_at_weight": 0,
                        "disable_carrier_when_out_of_range": false,
                        "is_module": false,
                        "is_free": false,
                        "shipping_external": false,
                        "need_range": false,
                        "external_module_name": "",
                        "max_width": 0,
                        "max_height": 0,
                        "max_depth": 0,
                        "max_weight": 0,
                        "grade": 0,
                        "delay": "ee",
                        "currency": "EUR",
                        "weight_unit": "Kg",
                        "country_ids": "ES,FR,IT,PL,GB,HR,FI"
                    }
                },
                {
                    "collection": "carrier_details",
                    "id": "35-1-0-34",
                    "properties": {
                        "id_reference": "35",
                        "id_carrier_detail": "34",
                        "shipping_method": "range_weight",
                        "delimiter1": 0,
                        "delimiter2": 1,
                        "country_ids": "ES,FR,IT,PL,GB,HR,FI",
                        "state_ids": "AG,AL,AN,AO,AR,AP,AT,AV,BA,BT,BL,BN,BG,BI,BO,BZ,BS,BR,CA,CL,CB,CI,CE,CT,CZ,CH,CO,CS,CR,KR,CN,EN,FM,FE,FI,FG,FC,FR,GE,GO,GR,IM,IS,AQ,SP,LT,LE,LC,LI,LO,LU,MC,MN,MS,MT,VS,ME,MI,MO,MB,NA,NO,NU,OG,OT,OR,PD,PA,PR,PV,PG,PU,PE,PC,PI,PT,PN,PZ,PO,RG,RA,RC,RE,RI,RN,RM,RO,SA,SS,SV,SI,SR,SO,TA,TE,TR,TO,TP,TN,TV,TS,UD,VA,VE,VB,VC,VR,VV,VI,VT,ES-C,ES-VI,ES-AB,ES-A,ES-AL,ES-O,ES-AV,ES-BA,ES-PM,ES-B,ES-BU,ES-CC,ES-CA,ES-S,ES-CS,ES-CR,ES-CO,ES-CU,ES-GI,ES-GR,ES-GU,ES-SS,ES-H,ES-HU,ES-J,ES-LO,ES-GC,ES-LE,ES-L,ES-LU,ES-M,ES-MA,ES-MU,ES-NA,ES-OR,ES-P,ES-PO,ES-SA,ES-TF,ES-SG,ES-SE,ES-SO,ES-T,ES-TE,ES-TO,ES-V,ES-VA,ES-BI,ES-ZA,ES-Z,ES-CE,ES-ML",
                        "price": 0
                    }
                }
            ])
            );
          }
        }),
      ],
    },
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {TunnelProductFeed},
  template: '<div><TunnelProductFeed v-bind="$props" ref="productFeed" /></div>',
  mounted: args.mounted,
  beforeMount: args.beforeMount,
});

export const TargetCountry:any = Template.bind({});
TargetCountry.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({},productFeed);
    this.$store.state.app = Object.assign({},initialStateApp);
    this.$store.state.productFeed.stepper = 1;
      this.$router.history.current.params.step = ProductFeedSettingsPages.TARGET_COUNTRY
  },
};

export const ShippingSettings:any = Template.bind({});
ShippingSettings.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({},productFeed);
    this.$store.state.productFeed.stepper = 2;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS
  },
};


export const ShippingSettingsNoCarriers:any = Template.bind({});
ShippingSettingsNoCarriers.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({},productFeedNoCarriers);
    this.$store.state.productFeed.stepper = 2;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS
  },
};

export const AttributeMapping:any = Template.bind({});
AttributeMapping.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({},productFeed);
    this.$store.state.productFeed.stepper = 3;
    this.$router.history.current.params.step = ProductFeedSettingsPages.ATTRIBUTE_MAPPING
  },
};

export const SyncSchedule:any = Template.bind({});
SyncSchedule.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({},productFeedSyncScheduleNow);
    this.$store.state.productFeed.stepper = 4;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SYNC_SCHEDULE
  },
};

export const Summary:any = Template.bind({});
Summary.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = Object.assign({},productFeedIsReadyForExport);
    this.$store.state.productFeed.stepper = 5;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SUMMARY
  },
};
