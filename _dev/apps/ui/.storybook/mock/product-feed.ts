import attributesToMap from "@/store/modules/product-feed/attributes-to-map.json";
import { RateType } from "@/enums/product-feed/rate";
import {
  State,
  AttributesTypes,
  ProductStatus,
  ProductVerificationIssue,
} from "@/store/modules/product-feed/state";
import DeliveryType from "@/enums/product-feed/delivery-type";
import { shippingPhpExport } from "./shipping-settings";
import Categories from "@/enums/product-feed/attribute-mapping-categories";
import { ShippingSetupOption } from "../../src/enums/product-feed/shipping";
import ProductFilterMethodsSynch from "@/enums/product-feed/product-filter-methods-synch";

export const productFeed: State = {
  isSyncSummaryLoadingInProgress: false,
  errorAPI: false,
  isConfigured: false,
  isConfiguredOnce: false,
  totalProducts: 0,
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
  productCount: {
    count: null,
    status: null,
    abortController: null,
  },
  productFilterOptions: {
    features: [],
    categories: [],
    brands: [],
  },
  syncSelected: ProductFilterMethodsSynch.SYNCH_ALL_PRODUCT,
  settings: {
    // Todo: Empty object to avoid trigger of refresh.
    // To fill with actual data.
    shippingSettings: shippingPhpExport,
    shippingSetup: null,
    rate: null,
    estimateCarriers: [],
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
    productFilter: [],
  },
  validationSummary: {
    activeProducts: null,
    expiringProducts: null,
    pendingProducts: null,
    disapprovedProducts: null,
  },
  gmcProductsByStatus: {
    request: {
      numberOfProductsPerPage: 20,
      offsets: {
        [ProductStatus.Approved]: 0,
        [ProductStatus.Disapproved]: 0,
        [ProductStatus.Expiring]: 0,
        [ProductStatus.Pending]: 0,
      },
    },
    totalOfProducts: null,
    results: {
      approved: [],
      disapproved: [],
      expiring: [],
      pending: [],
    },
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
  selectedProductCategories: [Categories.NONE],
  report: {
    lastConfigurationUsed: null,
    productsInCatalog: null,
    invalidProducts: null,
    validProducts: null,
  },
  verificationIssues: null,
  verificationIssuesNumberOfProducts: {},
  verificationIssuesProducts: {},
};
export const productFeedNoCarriers: State = {
  ...productFeed,
  settings: {
    ...productFeed.settings,
    deliveryDetails: [],
  },
};
export const productFeedIsReadyForExport: State = {
  ...productFeed,
  isConfigured: true,
  status: {
    ...productFeed.status,
    jobEndedAt: "2021-10-06T01:00:00.000Z",
    lastUpdatedAt: null,
    nextJobAt: new Date("July 22, 2021 03:24:00").toString(),
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
    shippingSetup: ShippingSetupOption.IMPORT,
  },
};

export const productFeedIsConfigured: State = {
  ...productFeed,
  isConfigured: true,
  status: {
    ...productFeed.status,
    jobEndedAt: "2021-10-06T01:00:00.000Z",
    nextJobAt: new Date("July 22, 2021 03:24:00").toString(),
    lastUpdatedAt: new Date("July 22, 2021 03:24:00").toString(),
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
    shippingSetup: ShippingSetupOption.IMPORT,
  },
  report: {
    lastConfigurationUsed: {
      lastModificationDate: new Date(2023, 6, 31, 13, 37),
      targetCountries: ['FR', 'GB', 'IT'],
      languages: ['it', 'fr', 'de'],
      currencies: ['EUR', 'GBP'],
    },
    productsInCatalog: null,
    invalidProducts: null,
    validProducts: null,
  },
};

export const productFeedEstimateConfigured: State = {
  ...productFeed,
  isConfigured: true,
  status: {
    ...productFeed.status,
    jobEndedAt: "2021-10-06T01:00:00.000Z",
    nextJobAt: new Date("July 22, 2021 03:24:00").toString(),
    lastUpdatedAt: new Date("July 22, 2021 03:24:00").toString(),
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
    shippingSetup: ShippingSetupOption.ESTIMATE,
    rate: RateType.RATE_ALL_COUNTRIES,
    estimateCarriers: [
      {
        offer: null,
        maxDeliveryTime: null,
        minDeliveryTime: null,
        carrierName: '',
        currency: "EUR",
        flatShippingRate: {
          shippingCost: null,
        },
        countries: ["FR"],
        freeShippingOverAmount: {
          shippingCost: null,
          orderPrice: null,
        },
      },
    ],
  },
};

export const productFeedIsConfiguredWithTax: State = {
  ...productFeedIsConfigured,
  settings: {
    ...productFeedIsConfigured.settings,
    targetCountries: ["US"],
  },
};

export const productFeedMissingFields: State = {
  ...productFeedIsConfigured,
  settings: {
    ...productFeedIsConfigured.settings,
    shippingSetup: null,
    autoImportShippingSettings: false,
  },
};

export const productFeedStatusSyncFailed: State = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    success: false,
    jobEndedAt: new Date("July 22, 2021 03:24:00").toString(),
    lastUpdatedAt: new Date("July 22, 2021 03:24:00").toString(),
    nextJobAt: new Date("July 22, 2021 03:24:00").toString(),
  },
  validationSummary: {
    activeProducts: 0,
    expiringProducts: 0,
    pendingProducts: 0,
    disapprovedProducts: 0,
  },
};

export const productFeedErrorAPI: State = {
  ...productFeed,
  errorAPI: true,
};

export const productFeedSyncSummaryInProgress: State = {
  ...productFeed,
  isConfigured: true,
  isSyncSummaryLoadingInProgress: true,
  status: {
    success: false,
    nextJobAt: undefined,
    lastUpdatedAt: new Date("July 22, 2021 03:24:00").toString(),
    jobEndedAt: null,
  },
  validationSummary: {
    activeProducts: null,
    expiringProducts: null,
    pendingProducts: null,
    disapprovedProducts: null,
  },
};

export const productFeedStatusSyncScheduled: State = {
  ...productFeedIsConfigured,
  status: {
    success: false,
    nextJobAt: new Date("July 22, 2022 03:24:00").toString(),
    lastUpdatedAt: new Date("July 22, 2021 03:24:00").toString(),
    jobEndedAt: null,
  },
  validationSummary: {
    activeProducts: null,
    expiringProducts: null,
    pendingProducts: null,
    disapprovedProducts: null,
  },
};

export const productFeedStatusSyncSuccess: State = {
  ...productFeedIsConfigured,
  status: {
    success: true,
    jobEndedAt: new Date("July 22, 2021 03:24:00").toString(),
    lastUpdatedAt: new Date("July 22, 2021 03:24:00").toString(),
    nextJobAt: new Date("July 22, 2021 03:24:00").toString(),
  },
  validationSummary: {
    activeProducts: 1362382,
    expiringProducts: 2,
    pendingProducts: 7,
    disapprovedProducts: 1,
  },
  report: {
    lastConfigurationUsed: {
      lastModificationDate: new Date(2023, 6, 31, 13, 37),
      targetCountries: ['FR', 'GB', 'IT'],
      languages: ['it', 'fr', 'de'],
      currencies: ['EUR'],
    },
    productsInCatalog: "1362452",
    invalidProducts: 60,
    validProducts: 1362392,
  },
  verificationIssues: [
    {
      affected: {
        en: 1,
      },
      name: ProductVerificationIssue.MISSING_NAME,
    },
    {
      affected: {
        en: 5,
        fr: 11,
      },
      name: ProductVerificationIssue.MISSING_DESCRIPTION,
    },
    {
      affected: {
        en: 1455,
      },
      name: ProductVerificationIssue.MISSING_IDENTIFIER,
    },
    {
      affected: {
        en: 5,
      },
      name: ProductVerificationIssue.MISSING_IMAGE,
    },
    {
      affected: {
        fr: 3,
      },
      name: ProductVerificationIssue.MISSING_LINK,
    },
    {
      affected: {
        en: 5,
      },
      name: ProductVerificationIssue.MISSING_PRICE,
    },
  ],
};

export const productFeedIsConfiguredOnce: State = {
  ...productFeedIsConfigured,
  isConfiguredOnce: true,
};

export const productFeedSyncScheduleNow: State = {
  ...productFeedIsConfigured,
  requestSynchronizationNow: true,
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

export const partialStateForVerificationIssuesProducts: Pick<
  State,
  "verificationIssuesProducts"
> = {
  verificationIssuesProducts: {
    MISSING_DESCRIPTION: [
      // page 0
      { id: "7938", variationCount: "2", name: "Ivysaur", langs: ["en", "fr"] },
      {
        id: "7939",
        variationCount: "2",
        name: "Venusaur",
        langs: ["en", "fr"],
      },
      {
        id: "7941",
        variationCount: "2",
        name: "Charmeleon",
        langs: ["en", "fr"],
      },
      {
        id: "7944",
        variationCount: "2",
        name: "Wartortle",
        langs: ["en", "fr"],
      },
      { id: "7947", variationCount: "2", name: "Metapod", langs: ["en", "fr"] },
      // page 1
      { id: "7948", variationCount: "1", name: "Butterfree", langs: ["en"] },
      { id: "7949", variationCount: "2", name: "Weedle", langs: ["en", "fr"] },
      { id: "7950", variationCount: "2", name: "Kakuna", langs: ["en", "fr"] },
      {
        id: "7951",
        variationCount: "2",
        name: "Beedrill",
        langs: ["en", "fr"],
      },
      { id: "7952", variationCount: "2", name: "Pidgey", langs: ["en", "fr"] },
      // page 2
      {
        id: "7953",
        variationCount: "2",
        name: "Pidgeotto",
        langs: ["en", "fr"],
      },
      {
        id: "7954",
        variationCount: "2",
        name: "Pidgeot",
        langs: ["en", "fr"],
      },
      {
        id: "7955",
        variationCount: "2",
        name: "Rattata",
        langs: ["en", "fr"],
      },
      {
        id: "7956",
        variationCount: "2",
        name: "Raticate",
        langs: ["en", "fr"],
      },
      {
        id: "7957",
        variationCount: "2",
        name: "Spearow",
        langs: ["en", "fr"],
      },
      // page 3
      {
        id: "7958",
        variationCount: "2",
        name: "Fearow",
        langs: ["en", "fr"],
      },
      {
        id: "7959",
        variationCount: "2",
        name: "Ekans",
        langs: ["en", "fr"],
      },
      {
        id: "7960",
        variationCount: "2",
        name: "Arbok",
        langs: ["en", "fr"],
      },
      {
        id: "7962",
        variationCount: "2",
        name: "Raichu",
        langs: ["en", "fr"],
      },
      {
        id: "7963",
        variationCount: "2",
        name: "Sandshrew",
        langs: ["en", "fr"],
      },
      // page 4
      {
        id: "7964",
        variationCount: "2",
        name: "Sandslash",
        langs: ["en", "fr"],
      },
      {
        id: "7965",
        variationCount: "2",
        name: "Nidoran-f",
        langs: ["en", "fr"],
      },
      {
        id: "7966",
        variationCount: "2",
        name: "Nidorina",
        langs: ["en", "fr"],
      },
      {
        id: "7967",
        variationCount: "2",
        name: "Nidoqueen",
        langs: ["en", "fr"],
      },
      {
        id: "7968",
        variationCount: "2",
        name: "Nidoran-m",
        langs: ["en", "fr"],
      },
      // page 5
      {
        id: "7969",
        variationCount: "2",
        name: "Nidorino",
        langs: ["en", "fr"],
      },
      {
        id: "7970",
        variationCount: "2",
        name: "Nidoking",
        langs: ["en", "fr"],
      },
      {
        id: "7971",
        variationCount: "2",
        name: "Clefairy",
        langs: ["en", "fr"],
      },
      {
        id: "7972",
        variationCount: "2",
        name: "Clefable",
        langs: ["en", "fr"],
      },
      {
        id: "7973",
        variationCount: "2",
        name: "Vulpix",
        langs: ["en", "fr"],
      },
      // page 6
      {
        id: "7969",
        variationCount: "2",
        name: "Nidorino",
        langs: ["en", "fr"],
      },
      {
        id: "7970",
        variationCount: "2",
        name: "Nidoking",
        langs: ["en", "fr"],
      },
      {
        id: "7971",
        variationCount: "2",
        name: "Clefairy",
        langs: ["en", "fr"],
      },
      {
        id: "7972",
        variationCount: "2",
        name: "Clefable",
        langs: ["en", "fr"],
      },
      {
        id: "7973",
        variationCount: "2",
        name: "Vulpix",
        langs: ["en", "fr"],
      },
    ],
  },
};
