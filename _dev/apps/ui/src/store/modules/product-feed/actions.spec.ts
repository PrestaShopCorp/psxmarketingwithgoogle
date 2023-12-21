import cloneDeep from 'lodash.clonedeep';
import {createProductFeedApiPayload} from './actions';
import {shippingPhpExportWithIssues} from '@/../.storybook/mock/shipping-settings';
import {ShopShippingCollectionType, ShopShippingInterface} from '@/providers/shipping-settings-provider';

const allDetailsFromState = {
  autoImportTaxSettings: false,
  shippingSetup: 'import',
  targetCountries: ['FR', 'IT'],
  shippingSettings: [
    {
      collection: 'carriers',
      id: '189',
      properties: {
        id_carrier: '273',
        id_reference: '189',
        name: 'GLS Chez vous ++',
        carrier_taxes_rates_group_id: '1',
        url: 'https://gls-group.eu/FR/fr/suivi-colis?match=@',
        active: true,
        deleted: false,
        shipping_handling: 0,
        free_shipping_starts_at_price: 0,
        free_shipping_starts_at_weight: 0,
        disable_carrier_when_out_of_range: true,
        is_module: true,
        is_free: false,
        shipping_external: true,
        need_range: true,
        external_module_name: 'nkmgls',
        max_width: 0,
        max_height: 0,
        max_depth: 0,
        max_weight: 129,
        grade: 0,
        delay:
          'Vous êtes prévenus par mail et SMS de la date et du créneau horaire de livraison.',
        currency: 'EUR',
        weight_unit: 'kg',
        country_ids: 'FR,MC',
      },
    },
  ],
  additionalShippingSettings: {
    deliveryDetails: [
      {
        deliveryType: 'delivery',
        minHandlingTimeInDays: 0,
        maxHandlingTimeInDays: 0,
        minTransitTimeInDays: 1,
        maxTransitTimeInDays: 3,
        enabledCarrier: true,
        country: 'FR',
        delay:
          'Vous êtes prévenus par mail et SMS de la date et du créneau horaire de livraison.',
        name: 'Chez vous',
        carrierId: '189',
      },
    ],
  },
  estimateCarriers: [],
  attributeMapping: [
    {
      category: 'commons',
      fields: [
        {
          label: 'Description',
          name: 'description',
          tooltip: true,
          recommended: [{name: ['description'], type: 'product'}],
          mapped: [{name: ['description_short'], type: 'product'}, {name: ['description'], type: 'product'}],
          required: true,
        },
        {
          label: 'GTIN* (EAN, JAN, ISBN, UPC, ITF-14)',
          name: 'gtin',
          tooltip: true,
          recommended: [],
          mapped: [],
          required: false,
        },
        {
          label: 'MPN (Manufacturer Part Number)',
          name: 'mpn',
          tooltip: true,
          recommended: [{name: ['mpn'], type: 'product'}],
          mapped: [
            {name: ['mpn'], type: 'product'},
          ],
          required: true,
        },
        {
          label: 'Brand',
          name: 'brand',
          tooltip: false,
          recommended: [{name: ['manufacturer'], type: 'product'}],
          mapped: [
            {name: ['manufacturer'], type: 'product'},
          ],
          required: true,
        },
      ],
    },
  ],
  selectedProductCategories: ['none'],
  requestSynchronizationNow: false,
};

describe('createProductFeedApiPayload', () => {
  it('should create proper atributes for Estimated method', () => {
    const payload = createProductFeedApiPayload({
      ...allDetailsFromState,
      shippingSetup: 'estimate',
    });

    expect(payload).toEqual({
      autoImportTaxSettings: false,
      shippingSetup: 'estimate',
      targetCountries: ['FR', 'IT'],
      estimateCarriers: [],
      attributeMapping: {
        description: [
          {ids: ['description_short'], type: 'product'},
          {ids: ['description'], type: 'product'},
        ],
        gtin: [],
        mpn: [{ids: ['mpn'], type: 'product'}],
        brand: [{ids: ['manufacturer'], type: 'product'}],
      },
      selectedProductCategories: ['none'],
      requestSynchronizationNow: false,
    });
  });

  it('should create proper atributes for Import method', () => {
    const payload = createProductFeedApiPayload({
      ...allDetailsFromState,
      shippingSetup: 'import',
    });

    expect(payload).toEqual({
      autoImportTaxSettings: false,
      shippingSetup: 'import',
      targetCountries: ['FR', 'IT'],
      shippingSettings: [
        {
          collection: 'carriers',
          id: '189',
          properties: {
            id_carrier: '273',
            id_reference: '189',
            name: 'GLS Chez vous ++',
            carrier_taxes_rates_group_id: '1',
            url: 'https://gls-group.eu/FR/fr/suivi-colis?match=@',
            active: true,
            deleted: false,
            shipping_handling: 0,
            free_shipping_starts_at_price: 0,
            free_shipping_starts_at_weight: 0,
            disable_carrier_when_out_of_range: true,
            is_module: true,
            is_free: false,
            shipping_external: true,
            need_range: true,
            external_module_name: 'nkmgls',
            max_width: 0,
            max_height: 0,
            max_depth: 0,
            max_weight: 129,
            grade: 0,
            delay:
              'Vous êtes prévenus par mail et SMS de la date et du créneau horaire de livraison.',
            currency: 'EUR',
            weight_unit: 'kg',
            country_ids: 'FR,MC',
          },
        },
      ],
      additionalShippingSettings: {
        deliveryDetails: [
          {
            deliveryType: 'delivery',
            minHandlingTimeInDays: 0,
            maxHandlingTimeInDays: 0,
            minTransitTimeInDays: 1,
            maxTransitTimeInDays: 3,
            enabledCarrier: true,
            country: 'FR',
            delay:
              'Vous êtes prévenus par mail et SMS de la date et du créneau horaire de livraison.',
            name: 'Chez vous',
            carrierId: '189',
          },
        ],
      },
      attributeMapping: {
        description: [
          {ids: ['description_short'], type: 'product'},
          {ids: ['description'], type: 'product'},
        ],
        gtin: [],
        mpn: [{ids: ['mpn'], type: 'product'}],
        brand: [{ids: ['manufacturer'], type: 'product'}],
      },
      selectedProductCategories: ['none'],
      requestSynchronizationNow: false,
    });
  });

  it('should filter unecessary carrier details', () => {
    const productFeedSettings = cloneDeep(allDetailsFromState);
    productFeedSettings.targetCountries = ['BE'];
    // Disable all carriers except #219 & #191
    productFeedSettings.shippingSettings = shippingPhpExportWithIssues.map((
      shippingData: ShopShippingInterface,
    ) => {
      if (shippingData.collection !== ShopShippingCollectionType.CARRIERS) {
        return shippingData;
      }

      shippingData.properties.active = (['191', '219'].includes(shippingData.id));
      return shippingData;
    });

    productFeedSettings.additionalShippingSettings.deliveryDetails = [
      {
        deliveryType: 'delivery',
        minHandlingTimeInDays: 0,
        maxHandlingTimeInDays: 0,
        minTransitTimeInDays: 1,
        maxTransitTimeInDays: 3,
        enabledCarrier: true,
        country: 'BE',
        delay:
          'Bla bla bla',
        name: 'Some carrier #1',
        carrierId: '191',
      },
      {
        deliveryType: 'delivery',
        minHandlingTimeInDays: 0,
        maxHandlingTimeInDays: 0,
        minTransitTimeInDays: 1,
        maxTransitTimeInDays: 3,
        enabledCarrier: true,
        country: 'BE',
        delay:
          'Bla bla bla',
        name: 'Some carrier #2',
        carrierId: '219',
      },
    ];
    const payload = createProductFeedApiPayload({
      ...productFeedSettings,
      shippingSetup: 'import',
    });

    expect(payload).toEqual({
      autoImportTaxSettings: false,
      shippingSetup: 'import',
      targetCountries: ['BE'],
      shippingSettings: [
        {
          collection: ShopShippingCollectionType.CARRIERS,
          id: '191',
          properties: {
            id_carrier: '285',
            id_reference: '191',
            name: 'Seur',
            carrier_taxes_rates_group_id: '0',
            url: 'https://www.seur.com/livetracking/pages/seguimiento-online-busqueda.do?faces-Redirect%20=true&segOnlineIdioma=es',
            active: true,
            deleted: false,
            shipping_handling: 0,
            free_shipping_starts_at_price: 0,
            free_shipping_starts_at_weight: 0,
            disable_carrier_when_out_of_range: false,
            is_module: true,
            is_free: false,
            shipping_external: true,
            need_range: true,
            external_module_name: 'seur',
            max_width: 0,
            max_height: 0,
            max_depth: 0,
            max_weight: 0,
            grade: 1,
            delay: '24/48 Horas',
            currency: 'EUR',
            weight_unit: 'kg',
            country_ids: '',
          },
        },
        {
          collection: ShopShippingCollectionType.CARRIERS,
          id: '219',
          properties: {
            id_carrier: '270',
            id_reference: '219',
            name: 'Seur Internacional',
            carrier_taxes_rates_group_id: '0',
            url: 'https://www.seur.com/livetracking/pages/seguimiento-online-busqueda.do?faces-redirect=true&segOnlineIdioma=es',
            active: true,
            deleted: false,
            shipping_handling: 0,
            free_shipping_starts_at_price: 0,
            free_shipping_starts_at_weight: 0,
            disable_carrier_when_out_of_range: false,
            is_module: true,
            is_free: false,
            shipping_external: true,
            need_range: true,
            external_module_name: 'seur',
            max_width: 0,
            max_height: 0,
            max_depth: 0,
            max_weight: 0,
            grade: 1,
            delay: '3-4 d\u00edas',
            currency: 'EUR',
            weight_unit: 'kg',
            country_ids: 'DE,AT,BE,ES,FR,IT,LU,NL,SE,PT',
          },
        },
        {
          collection: ShopShippingCollectionType.CARRIER_DETAILS,
          id: '219-1-1-438',
          properties: {
            id_reference: '219',
            id_carrier_detail: '438',
            shipping_method: 'range_price',
            delimiter1: 0,
            delimiter2: 999999,
            country_ids: 'DE,AT,BE,ES,FR,IT,LU,NL,SE',
            state_ids:
              'AG,AL,AN,AO,AR,AP,AT,AV,BA,BT,BL,BN,BG,BI,BO,BZ,BS,BR,CA,CL,CB,CI,CE,CT,CZ,CH,CO,CS,CR,KR,CN,EN,FM,FE,FI,FG,FC,FR,GE,GO,GR,IM,IS,AQ,SP,LT,LE,LC,LI,LO,LU,MC,MN,MS,MT,VS,ME,MI,MO,MB,NA,NO,NU,OG,OT,PR,PD,PA,PR,PV,PG,PU,PE,PC,PI,PT,PN,PZ,PO,RG,RA,RC,RE,RI,RN,RM,SV,SA,SS,SV,SI,SR,SO,TA,TE,TR,TO,TP,TN,TV,TS,UD,VA,VE,VB,VC,VR,VV,VI,VT,DE-BW,DE-BY,DE-BE,DE-BB,DE-HB,DE-HH,DE-HE,DE-MV,DE-NI,DE-NW,DE-RP,DE-SL,DE-SN,DE-ST,DE-SH,DE-TH,DE-DE,FR-01,FR-02,FR-03,FR-04,FR-05,FR-06,FR-07,FR-08,FR-09,FR-10,FR-11,FR-12,FR-67,FR-13,FR-14,FR-15,FR-16,FR-17,FR-18,FR-19,FR-2A,FR-2B,FR-21,FR-22,FR-23,FR-79,FR-24,FR-25,FR-26,FR-91,FR-27,FR-28,FR-29,FR-30,FR-32,FR-33,FR-GP,FR-31,FR-43,FR-52,FR-70,FR-74,FR-65,FR-87,FR-68,FR-92,FR-34,FR-35,FR-36,FR-37,FR-38,FR-39,FR-40,FR-42,FR-44,FR-45,FR-41,FR-46,FR-47,FR-48,FR-49,FR-50,FR-51,FR-53,FR-YT,FR-54,FR-55,FR-56,FR-57,FR-58,FR-59,FR-60,FR-61,FR-75,FR-62,FR-63,FR-64,FR-66,FR-RE,FR-69,FR-71,FR-72,FR-73,FR-77,FR-76,FR-93,FR-80,FR-81,FR-82,FR-90,FR-94,FR-95,FR-83,FR-84,FR-85,FR-86,FR-88,FR-89,FR-78',
            price: 18,
          },
        },
      ],
      additionalShippingSettings: {
        deliveryDetails: [
          {
            deliveryType: 'delivery',
            minHandlingTimeInDays: 0,
            maxHandlingTimeInDays: 0,
            minTransitTimeInDays: 1,
            maxTransitTimeInDays: 3,
            enabledCarrier: true,
            country: 'BE',
            delay:
              'Bla bla bla',
            name: 'Some carrier #1',
            carrierId: '191',
          },
          {
            deliveryType: 'delivery',
            minHandlingTimeInDays: 0,
            maxHandlingTimeInDays: 0,
            minTransitTimeInDays: 1,
            maxTransitTimeInDays: 3,
            enabledCarrier: true,
            country: 'BE',
            delay:
              'Bla bla bla',
            name: 'Some carrier #2',
            carrierId: '219',
          },
        ],
      },
      attributeMapping: {
        description: [
          {ids: ['description_short'], type: 'product'},
          {ids: ['description'], type: 'product'},
        ],
        gtin: [],
        mpn: [{ids: ['mpn'], type: 'product'}],
        brand: [{ids: ['manufacturer'], type: 'product'}],
      },
      selectedProductCategories: ['none'],
      requestSynchronizationNow: false,
    });
  });
});
