import attributesToMap from "@/store/modules/product-feed/attributes-to-map.json";
import { OfferType } from "@/enums/product-feed/offer";
import { State, AttributesTypes } from "@/store/modules/product-feed/state";
import DeliveryType from '@/enums/product-feed/delivery-type';

export const productFeed: State = {
  isSyncSummaryLoadingInProgress: false,
  errorAPI: false,
  isConfigured: false,
  isConfiguredOnce: false,
  totalProducts: 0,
  isOnFunnel: false,
  stepper: 1,
  requestSynchronizationNow: false,
  warmedUp: true,
  status: {
    success: true,
    jobEndedAt: "",
    nextJobAt: "2021-10-06T01:00:00.000Z",
    lastUpdatedAt: "",
  },
  attributeMapping: {},
  settings: {
    shippingSettings: [],
    shippingSetup: null,
    estimateCarrier: {
      carrierName: "",
      rate: null,
      offer: null,
      maxDeliveryTime: 0,
      minDeliveryTime: 0,
      countries: [],
      currency: '',
      [OfferType.FREE_SHIPPING_OVER_AMOUNT]: {
        shippingCost: 0,
        orderPrice: 0,
      },
      [OfferType.FLAT_SHIPPING_RATE]: {
        shippingCost: 0,
      },
    },
    targetCountries: ["FR"],
    deliveryDetails: [
      {
        carrierId: "9",
        country: "FR",
        name: "PrestaShop",
        delay: "Pick up in-store",
        deliveryType: undefined,
      },
      {
        carrierId: "9",
        country: "IT",
        name: "PrestaShop",
        delay: "Pick up in-store",
        deliveryType: undefined,
      },
      {
        enabledCarrier: true,
        carrierId: "11",
        country: "FR",
        name: "My carrier",
        delay: "Delivery next day!",
        deliveryType: DeliveryType.DELIVERY,
        maxTransitTimeInDays: 3,
        maxHandlingTimeInDays: 3,
        minTransitTimeInDays: 0,
        minHandlingTimeInDays: 0,
      },
      {
        carrierId: "11",
        country: "IT",
        name: "My carrier",
        delay: "Delivery next day!",
        deliveryType: undefined,
      },
      {
        carrierId: "11",
        country: "US",
        name: "My carrier",
        delay: "Delivery next day!",
        deliveryType: undefined,
      },
      {
        enabledCarrier: true,
        carrierId: "13",
        country: "FR",
        name: "Carrier with fixed price",
        delay: "Maybe 1 day, maybe never",
        deliveryType: DeliveryType.DELIVERY,
        maxTransitTimeInDays: 60,
        minHandlingTimeInDays: 0,
        minTransitTimeInDays: 1,
        maxHandlingTimeInDays: 3,
      },
      {
        carrierId: "13",
        country: "IT",
        name: "Carrier with fixed price",
        delay: "Maybe 1 day, maybe never",
        deliveryType: undefined,
      },
      {
        carrierId: "14",
        country: "IT",
        name: "Carrier #2 with fixed price",
        delay: "Maybe 1 day, maybe never",
        deliveryType: undefined,
      },
    ],
    autoImportTaxSettings: false,
  },
  validationSummary: {
    activeItems: null,
    expiringItems: null,
    pendingItems: null,
    disapprovedItems: null,
  },
  prevalidationScanSummary: {
    scannedItems: 13456,
    invalidItems: 140,
  },
  productsDatas: {
    items: [
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
            destination: "Shopping",
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
            status: "disapproved",
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
  },
  attributesToMap,
  attributesFromShop: [
    { name: ["ean"], type: "product" as AttributesTypes },
    { name: ["isbn"], type: "product" as AttributesTypes },
    { name: ["upc"], type: "product" as AttributesTypes },
    { name: ["mpn"], type: "product" as AttributesTypes },
    { name: ["manufacturer"], type: "product" as AttributesTypes },
    { name: ["description"], type: "product" as AttributesTypes },
    { name: ["description_short"], type: "product" as AttributesTypes },
    { name: ["color"], type: "custom" as AttributesTypes },
    { name: ["dimension"], type: "custom" as AttributesTypes },
    { name: ["paper type"], type: "custom" as AttributesTypes },
    { name: ["size"], type: "custom" as AttributesTypes },
    { name: ["composition"], type: "feature" as AttributesTypes },
    { name: ["property"], type: "feature" as AttributesTypes },
    { name: ["color"], type: "custom" as AttributesTypes },
    { name: ["dimension"], type: "custom" as AttributesTypes },
    { name: ["paper type"], type: "custom" as AttributesTypes },
    { name: ["size"], type: "custom" as AttributesTypes },
    { name: ["composition"], type: "feature" as AttributesTypes },
    { name: ["property"], type: "feature" as AttributesTypes },
  ],
  selectedProductCategories: ["none"],
  preScanDetail: {
    products: [],
    limit: 10,
    currentPage: 1,
    total: 0,
    langChosen: '',
  },
};
export const productFeedNoCarriers = {
  ...productFeed,
  settings: {
    ...productFeed.settings,
    deliveryDetails: [],
  },
};
export const productFeedIsReadyForExport = {
  ...productFeed,
  isConfigured: true,
  status: {
    ...productFeed.status,
    jobEndedAt: "2021-10-06T01:00:00.000Z",
    lastUpdatedAt: null,
    nextJobAt: new Date("July 22, 2021 03:24:00"),
    success: false,
    syncSchedule: "2021-10-06T01:00:00.000Z",
  },
  attributeMapping: {
    brand: [],
    color: [],
    mpn: [],
    gtin: [
      {
        id: "mpn",
        type: "product",
      },
    ],
    size: [],
    gender: [],
    description: [
      {
        id: "description",
        type: "product",
      },
    ],
    ageGroup: [],
  },
  settings: {
    ...productFeed.settings,
    targetCountries: ["FR"],
    shippingSetup: "import",
  },
};

export const productFeedIsConfigured = {
  ...productFeed,
  isConfigured: true,
  status: {
    ...productFeed.status,
    jobEndedAt: "2021-10-06T01:00:00.000Z",
    nextJobAt: new Date("July 22, 2021 03:24:00"),
    lastUpdatedAt: new Date("July 22, 2021 03:24:00"),
    success: true,
  },
  attributeMapping: {
    brand: [],
    color: [],
    mpn: [],
    gtin: [
      {
        id: "mpn",
        type: "product",
      },
    ],
    size: [],
    gender: [],
    description: [
      {
        id: "description",
        type: "product",
      },
    ],
    ageGroup: [],
  },
  settings: {
    ...productFeed.settings,
    targetCountries: ["FR"],
    shippingSetup: "import",
  },
};

export const productFeedIsConfiguredWithTax = {
  ...productFeedIsConfigured,
  settings: {
    ...productFeedIsConfigured.settings,
    targetCountries: ["US"],
  },
};

export const productFeedMissingFields = {
  ...productFeedIsConfigured,
  settings: {
    ...productFeedIsConfigured.settings,
    shippingSetup: null,
    autoImportShippingSettings: false,
  },
};

export const productFeedStatusSyncFailed = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    success: false,
    jobEndedAt: new Date("July 22, 2021 03:24:00"),
    lastUpdatedAt: new Date("July 22, 2021 03:24:00"),
    nextJobAt: new Date("July 22, 2021 03:24:00"),
  },
  validationSummary: {
    activeItems: 0,
    expiringItems: 0,
    pendingItems: 0,
    disapprovedItems: 0,
  },
};

export const productFeedErrorAPI = {
  ...productFeed,
  errorAPI: true,
};

export const productFeedSyncSummaryInProgress = {
  ...productFeed,
  isConfigured: true,
  isSyncSummaryLoadingInProgress: true,
  status: {
    success: false,
    nextJobAt: null,
    lastUpdatedAt: new Date("July 22, 2021 03:24:00"),
    jobEndedAt: null,
  },
  validationSummary: {
    activeItems: null,
    expiringItems: null,
    pendingItems: null,
    disapprovedItems: null,
  },
};

export const productFeedStatusSyncScheduled = {
  status: {
    success: false,
    nextJobAt: new Date("July 22, 2022 03:24:00"),
    lastUpdatedAt: new Date("July 22, 2021 03:24:00"),
    jobEndedAt: null,
  },
  validationSummary: {
    activeItems: null,
    expiringItems: null,
    pendingItems: null,
    disapprovedItems: null,
  },
};

export const productFeedStatusSyncSuccess = {
  ...productFeedIsConfigured,
  status: {
    success: true,
    jobEndedAt: new Date("July 22, 2021 03:24:00"),
    lastUpdatedAt: new Date("July 22, 2021 03:24:00"),
    nextJobAt: new Date("July 22, 2021 03:24:00"),
  },
  validationSummary: {
    activeItems: 5,
    expiringItems: 2,
    pendingItems: 7,
    disapprovedItems: 1,
  },
};

export const productFeedIsConfiguredOnce = {
  ...productFeedIsConfigured,
  isConfiguredOnce: true,
};

export const productFeedSyncScheduleNow = {
  ...productFeedIsConfigured,
  requestSynchronizationNow: true,
};
export const productFeedWithDisapprovedProductsButNoIssues = {
  ...productFeed,
  productsDatas: {
    items: [
      {
        id: "4",
        attribute: "0",
        name: "Charmander",
        statuses: [
          {
            destination: "SurfacesAcrossGoogle",
            status: "disapproved",
            countries: ["FR"],
          },
        ],
      },
    ],
  },
};

export const prevalidationScan = {
  errors: [
    {
      productId: 1851,
      attributeId: 0,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 446,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 447,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 448,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 449,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1852,
      attributeId: 450,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Logo T-Shirt",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 445,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 446,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 447,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 448,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 449,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1852,
      attributeId: 450,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Logo T-Shirt",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 445,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 446,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 447,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 448,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 449,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1852,
      attributeId: 450,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Logo T-Shirt",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 445,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 446,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 447,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 448,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1851,
      attributeId: 449,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en",
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
    {
      productId: 1852,
      attributeId: 450,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Logo T-Shirt",
          lang: "en",
        },
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true,
    },
  ],
  totalErrors: 24,
};
