import cloneDeep from 'lodash.clonedeep';
import {rest} from 'msw';
import TunnelProductFeed from '../src/views/tunnel-product-feed.vue';
import {
  productFeed,
  productFeedNoCarriers,
  productFeedIsReadyForExport,
} from '../.storybook/mock/product-feed';
import {shippingPhpExportWithIssues} from '../.storybook/mock/shipping-settings';
import {shippingPhpExportHeavy} from '../.storybook/mock/shipping-settings-heavy';
import {shippingBugExport} from '../.storybook/mock/shipping-settings-bug';
import {initialStateApp} from '../.storybook/mock/state-app';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {
  getEnabledCarriers,
  mergeShippingDetailsSourcesForProductFeedConfiguration,
} from '../src/providers/shipping-settings-provider';
import {deleteProductFeedDataFromLocalStorage} from '../src/utils/LocalStorage';
import {RateType} from '../src/enums/product-feed/rate';

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
        rest.get('/incremental-sync/status/', (req, res, ctx) => res(
          ctx.json({
            syncSchedule: 'At 01:00 AM, every day',
            nextJobAt: '2021-12-16T01:00:00.000Z',
            jobEndedAt: null,
            lastUpdatedAt: null,
            success: true,
          }),
        )),
        rest.get('/incremental-sync/settings/', (req, res, ctx) => res(ctx.status(404))),
        rest.get('/product-feeds/attributes', (req, res, ctx) => res(
          ctx.json({
            gtin: [
              {
                type: 'product',
                id: 'upc',
              },
            ],
            energyEfficiencyClass: [],
            color: [],
            minEnergyEfficiencyClass: [],
            mpn: [
              {
                type: 'product',
                id: 'mpn',
              },
            ],
            brand: [],
            ageGroup: [],
            gender: [],
            description: [
              {
                id: 'description',
                type: 'product',
              },
            ],
            size: [],
            maxEnergyEfficiencyClass: [],
          }),
        )),
        rest.post('/', (req: any, res, ctx) => {
          const payload = req.body.action;
          const {kind} = req.body;

          if (payload === 'getProductsReadyToSync') {
            return res(
              ctx.json({
                total: '717',
              }),
            );
          } if (payload === 'getShopAttributes') {
            return res(ctx.json([]));
          } if (payload === 'getProductFilterOptions') {
            switch (kind) {
              case 'feature':
                return res(
                  ctx.json([
                    {
                      id: '1',
                      key: 'Composition',
                      values: [
                        {
                          id: '4',
                          key: 'Composition',
                          value: 'Coton',
                          language: 'fr',
                        },
                        {
                          id: '5',
                          key: 'Composition',
                          value: 'Carton recycl\u00e9',
                          language: 'fr',
                        },
                        {
                          id: '6',
                          key: 'Composition',
                          value: 'Papier mat',
                          language: 'fr',
                        },
                      ],
                    },
                    {
                      id: '2',
                      key: 'Propri\u00e9t\u00e9',
                      values: [
                        {
                          id: '9',
                          key: 'Propri\u00e9t\u00e9',
                          value: 'Housse amovible',
                          language: 'fr',
                        },
                      ],
                    },
                  ]),
                );
              case 'category':
                return res(
                  ctx.json([
                    {
                      id: '2',
                      value: 'Accueil',
                    },
                    {
                      id: '6',
                      value: 'Accessoires',
                    },
                    {
                      id: '7',
                      value: 'Papeterie',
                    },
                    {
                      id: '8',
                      value: 'Accessoires de maison',
                    },
                    {
                      id: '9',
                      value: 'Art',
                    },
                  ]),
                );
              case 'brand':
                return res(
                  ctx.json([{id: '1', value: 'Studio Design'}]),
                );
              default:
            }
          } if (payload === 'countMatchingProductsFromFilters') {
            return res(ctx.json({numberOfProducts: 120}));
          }
        }),
      ],
    },
  },
};

const Template = (args, {argTypes}) => ({
  props: Object.keys(argTypes),
  components: {TunnelProductFeed},
  template: `<div>
    <TunnelProductFeed v-bind="$props" v-if="!hide"/>
    <p v-else>Some stories are hidden as they may freeze the browser. Use the controls below to display their content.</p>
  </div>`,
  beforeMount: args.beforeMount,
  beforeCreate() {
    deleteProductFeedDataFromLocalStorage();
  },
});

export const SettingsSetup: any = Template.bind({});
SettingsSetup.argTypes = {
  hide: {
    control: 'boolean',
  },
};
SettingsSetup.args = {
  beforeMount(this: any) {
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.productFeed.stepper = 1;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETUP;
  },
};

export const EstimateDeliveryTimeAndRates: any = Template.bind({});
EstimateDeliveryTimeAndRates.argTypes = {
  hide: {
    control: 'boolean',
  },
};
EstimateDeliveryTimeAndRates.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.ESTIMATE;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
    this.$store.state.productFeed.settings.targetCountries = [];
  },
};

export const EstimateDeliveryTimeAndRatesSeveralCountries: any = Template.bind(
  {},
);
EstimateDeliveryTimeAndRatesSeveralCountries.argTypes = {
  hide: {
    control: 'boolean',
  },
};
EstimateDeliveryTimeAndRatesSeveralCountries.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.ESTIMATE;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
    this.$store.state.productFeed.settings.targetCountries = ['FR', 'IT', 'ES'];
    this.$store.state.productFeed.settings.rate = RateType.RATE_PER_COUNTRY;
    this.$store.state.productFeed.settings.estimateCarriers = [
      {
        carrierName: 'Transporteur Français',
        offer: 'freeShipping',
        countries: ['FR'],
        currency: 'EUR',
        maxDeliveryTime: 1,
        minDeliveryTime: 0,
        freeShippingOverAmount: {shippingCost: null, orderPrice: null},
        flatShippingRate: {shippingCost: null},
      },
      {
        carrierName: 'Transporteur Italy',
        offer: 'flatShippingRate',
        countries: ['IT'],
        currency: 'EUR',
        maxDeliveryTime: 3,
        minDeliveryTime: 2,
        freeShippingOverAmount: {shippingCost: null, orderPrice: null},
        flatShippingRate: {shippingCost: 3},
      },
      {
        carrierName: 'Transporteur Esapgnol',
        offer: 'flatShippingRate',
        countries: ['ES'],
        currency: 'EUR',
        // Set null to force the display of an error at validation,
        // asking to fill the remaining field
        maxDeliveryTime: null,
        minDeliveryTime: 1,
        freeShippingOverAmount: {shippingCost: null, orderPrice: null},
        flatShippingRate: {shippingCost: 3.5},
      },
    ];
  },
};

export const EstimateDeliveryTimeAndRatesSeveralCountriesAndCurrencies: any = Template.bind({});
EstimateDeliveryTimeAndRatesSeveralCountriesAndCurrencies.argTypes = {
  hide: {
    control: 'boolean',
  },
};
EstimateDeliveryTimeAndRatesSeveralCountriesAndCurrencies.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.app.psxMktgWithGoogleActiveCountries.push(...['BR', 'GB', 'PL']);
    this.$store.state.app.psxMktgWithGoogleActiveCurrencies = ['BRL', 'DOP', 'EUR', 'GBP', 'PLN'];
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.ESTIMATE;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
    this.$store.state.productFeed.settings.rate = RateType.RATE_ALL_COUNTRIES;
  },
};

export const EstimateDeliveryTimeAndRatesWithUS: any = Template.bind({});
EstimateDeliveryTimeAndRatesWithUS.argTypes = {
  hide: {
    control: 'boolean',
  },
};
EstimateDeliveryTimeAndRatesWithUS.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode = 'USD';
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.settings.targetCountries = ['US'];
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.ESTIMATE;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
    this.$store.state.productFeed.settings.rate = RateType.RATE_ALL_COUNTRIES;
  },
};

export const ImportDeliveryTimeAndRates: any = Template.bind({});
ImportDeliveryTimeAndRates.argTypes = {
  hide: {
    control: 'boolean',
  },
};
ImportDeliveryTimeAndRates.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.IMPORT;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
  },
};

export const ImportDeliveryTimeAndRatesSeveralCountries: any = Template.bind(
  {},
);
ImportDeliveryTimeAndRatesSeveralCountries.argTypes = {
  hide: {
    control: 'boolean',
  },
};
ImportDeliveryTimeAndRatesSeveralCountries.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.settings.targetCountries = ['FR', 'IT'];
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.IMPORT;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
  },
};

export const ImportDeliveryTimeAndRatesNoCarriers: any = Template.bind({});
ImportDeliveryTimeAndRatesNoCarriers.argTypes = {
  hide: {
    control: 'boolean',
  },
};
ImportDeliveryTimeAndRatesNoCarriers.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.productFeed = cloneDeep(productFeedNoCarriers);
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.IMPORT;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
  },
};

export const ImportDeliveryTimeAndRatesWithManyCarriers: any = Template.bind(
  {},
);
ImportDeliveryTimeAndRatesWithManyCarriers.argTypes = {
  hide: {
    control: 'boolean',
  },
};
ImportDeliveryTimeAndRatesWithManyCarriers.args = {
  // Modify this to display the story
  hide: true,
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.settings.targetCountries = ['SE'];
    this.$store.state.productFeed.settings.shippingSettings = shippingPhpExportWithIssues;
    this.$store.state.productFeed.settings.deliveryDetails = Object.assign(
      [],
      mergeShippingDetailsSourcesForProductFeedConfiguration(
        getEnabledCarriers(shippingPhpExportHeavy),
        [],
      ),
    );
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.IMPORT;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
  },
};

export const ImportDeliveryTimeAndRatesBug: any = Template.bind({});
ImportDeliveryTimeAndRatesBug.argTypes = {
  hide: {
    control: 'boolean',
  },
};
ImportDeliveryTimeAndRatesBug.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.stepper = 2;
    this.$store.state.productFeed.settings.shippingSetup = ShippingSetupOption.IMPORT;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SHIPPING_SETTINGS;
    this.$store.state.productFeed.settings.targetCountries = ['IT'];
    this.$store.state.productFeed.settings.deliveryDetails = Object.assign(
      [],
      mergeShippingDetailsSourcesForProductFeedConfiguration(
        getEnabledCarriers(shippingBugExport),
        [],
      ),
    );
  },
};

export const AttributeMapping: any = Template.bind({});
AttributeMapping.argTypes = {
  hide: {
    control: 'boolean',
  },
};
AttributeMapping.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.stepper = 3;
    this.$router.history.current.params.step = ProductFeedSettingsPages.ATTRIBUTE_MAPPING;
  },
};
AttributeMapping.parameters = {
  msw: {
    handlers: [
      rest.post('/', async (req, res, ctx) => {
        // @ts-ignore
        if (req?.body?.action === 'getShopAttributes') {
          // Otherwise, always respond with a mocked response.
          return res(ctx.json(productFeed.attributesFromShop));
        }
        // Bypass this request, returning an actual response
        return undefined;
      }),
      rest.get('/product-feeds/attributes', (req, res, ctx) => res(
        ctx.json({
          description: [
            {
              id: 'description',
              type: 'product',
            },
          ],
          color: [
            {
              id: 'Color',
              type: 'custom',
            },
          ],
          ageGroup: [
            {
              id: 'Size',
              type: 'custom',
            },
          ],
          gender: [
            {
              id: 'Dimension',
              type: 'custom',
            },
          ],
          size: [
            {
              id: 'Size',
              type: 'custom',
            },
          ],
          mpn: [
            {
              id: 'mpn',
              type: 'product',
            },
          ],
          gtin: [
            {
              id: 'ean',
              type: 'product',
            },
          ],
          brand: [
            {
              id: 'manufacturer',
              type: 'product',
            },
          ],
        }),
      )),
    ],
  },
};

export const ProductSelection: any = Template.bind({});
ProductSelection.argTypes = {
  hide: {
    control: 'boolean',
  },
};
ProductSelection.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.app.psxMktgWithGoogleModuleVersion = '1.73.0';
    this.$store.state.productFeed = cloneDeep(productFeed);
    this.$store.state.productFeed.stepper = 4;
    this.$router.history.current.params.step = ProductFeedSettingsPages.PRODUCT_SELECTION;
  },
};

export const Summary: any = Template.bind({});
Summary.argTypes = {
  hide: {
    control: 'boolean',
  },
};
Summary.args = {
  beforeMount(this: any) {
    this.$store.state.app = cloneDeep(initialStateApp);
    this.$store.state.app.psxMktgWithGoogleModuleVersion = '1.73.0';
    this.$store.state.productFeed = cloneDeep(productFeedIsReadyForExport);
    this.$store.state.productFeed.stepper = 5;
    this.$router.history.current.params.step = ProductFeedSettingsPages.SUMMARY;
  },
};
