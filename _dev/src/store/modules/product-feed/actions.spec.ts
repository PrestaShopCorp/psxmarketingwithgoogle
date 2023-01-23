import {createProductFeedApiPayload} from './actions';

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
});
