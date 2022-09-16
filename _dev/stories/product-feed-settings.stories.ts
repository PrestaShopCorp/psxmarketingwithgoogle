import cloneDeep from 'lodash.clonedeep';
import TunnelProductFeed from '../src/views/tunnel-product-feed.vue';
import {productFeed, productFeedNoCarriers ,productFeedIsReadyForExport, productFeedSyncScheduleNow} from '../.storybook/mock/product-feed';
import {shippingPhpExportWithIssues} from '../.storybook/mock/shipping-settings';
import {shippingPhpExportHeavy} from '../.storybook/mock/shipping-settings-heavy';
import {initialStateApp} from '../.storybook/mock/state-app';
import {rest} from 'msw';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import { ShippingSetupOption } from '@/enums/product-feed/shipping';
import { getEnabledCarriers, mergeShippingDetailsSourcesForProductFeedConfiguration } from '../src/providers/shipping-settings-provider';
import { deleteProductFeedDataFromLocalStorage } from '../src/utils/LocalStorage';

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
            ctx.status(404)
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
      ],
    },
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {TunnelProductFeed},
  template: '<div><TunnelProductFeed v-bind="$props" /></div>',
  beforeMount: args.beforeMount,
  beforeCreate() {
    deleteProductFeedDataFromLocalStorage();
  }
});

export const SettingsSetup:any = Template.bind({});
SettingsSetup.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.productFeed.stepper = 1;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETUP
  },
};

export const EstimateDeliveryTimeAndRates:any = Template.bind({});
EstimateDeliveryTimeAndRates.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.ESTIMATE;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS
  },
};

export const ImportDeliveryTimeAndRates:any = Template.bind({});
ImportDeliveryTimeAndRates.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep( productFeed);
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.IMPORT;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS
  },
};


export const ImportDeliveryTimeAndRatesNoCarriers:any = Template.bind({});
ImportDeliveryTimeAndRatesNoCarriers.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedNoCarriers);
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.IMPORT;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
  },
};

export const ImportDeliveryTimeAndRatesWithSpanishShippingModules:any = Template.bind({});
ImportDeliveryTimeAndRatesWithSpanishShippingModules.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.settings.targetCountries = ['ES', 'PT'];
    this.$store.state.productFeed.settings.shippingSettings = shippingPhpExportWithIssues;
    this.$store.state.productFeed.settings.deliveryDetails = Object.assign([], mergeShippingDetailsSourcesForProductFeedConfiguration(getEnabledCarriers(shippingPhpExportWithIssues), []));
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.IMPORT;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
  },
};

export const ImportDeliveryTimeAndRatesWithManyCarriers:any = Template.bind({});
ImportDeliveryTimeAndRatesWithManyCarriers.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.settings.targetCountries = ['SE'];
    this.$store.state.productFeed.settings.shippingSettings = shippingPhpExportWithIssues;
    this.$store.state.productFeed.settings.deliveryDetails = Object.assign([], mergeShippingDetailsSourcesForProductFeedConfiguration(getEnabledCarriers(shippingPhpExportHeavy), []));
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.IMPORT;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
  },
};

export const AttributeMapping:any = Template.bind({});
AttributeMapping.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.stepper = 3;
    this.$router.history.current.params.step = ProductFeedSettingsPages.ATTRIBUTE_MAPPING
  },
};

export const SyncSchedule:any = Template.bind({});
SyncSchedule.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedSyncScheduleNow);
    this.$store.state.productFeed.stepper = 4;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SYNC_SCHEDULE
  },
};

export const Summary:any = Template.bind({});
Summary.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeedIsReadyForExport);
    this.$store.state.productFeed.stepper = 5;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SUMMARY
  },
};
