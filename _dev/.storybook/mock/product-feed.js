import attributesToMap from "@/store/modules/product-feed/attributes-to-map.json";

export const productFeed = {
  isSyncSummaryLoadingInProgress: false,
  errorAPI: false,
  isConfigured: false,
  isConfiguredOnce: false,
  targetCountries: ["FR"],
  totalProducts: 0,
  stepper: 1,
  status: {
    success: true,
    jobEndedAt: "",
    nextJobAt: "2021-10-06T01:00:00.000Z",
    lastUpdatedAt: "",
  },
  settings: {
    shippingSettings: [],
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
        deliveryType: "delivery",
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
        deliveryType: "delivery",
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
    targetCountries: ["FR"],
    autoImportShippingSettings: true,
    attributeMapping: {},
    syncSchedule: "1 * * * * *",
  },
  validationSummary: {
    activeItems: null,
    expiringItems: null,
    pendingItems: null,
    disapprovedItems: null,
  },
  productsDatas: {
    items: [
      {
        id: "12",
        name: "super produit",
        attribute: "21",
        issues: [
          {
            code: "hard_goods_missing_2_out_of_3_identifiers",
            servability: "demoted",
            resolution: "merchant_action",
            destination: "Shopping",
            description:
              "Limited performance due to missing identifiers [gtin, mpn, brand]",
            detail: "Provide at least 2 of the missing identifiers",
            documentation:
              "https://support.google.com/merchants/answer/6098295",
            applicableCountries: ["FR"],
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
              "https://support.google.com/merchants/answer/6098295",
            applicableCountries: ["FR"],
          },
        ],
        statuses: {
          destination: "Shopping",
          status: "disapproved",
          countries: ["FR"],
        },
      },
      {
        id: "11",
        name: "produit incroyable",
        attribute: "1",
        issues: [],
        statuses: {
          destination: "Shopping",
          status: "pending",
          countries: ["FR"],
        },
      },
      {
        id: "13",
        name: "produit formidable",
        attribute: "2",
        issues: [],
        statuses: {
          destination: "Shopping",
          status: "approved",
          countries: ["FR"],
        },
      },
    ],
  },
  attributesToMap,
  attributesData: [
    {"name":"ean13","type":"product"},
    {"name":"isbn","type":"product"},
    {"name":"upc","type":"product"},
    {"name":"mpn","type":"product"},
    {"name":"description","type":"product"},
    {"name":"shortDescription","type":"product"},
    {"name":"color","type":"custom"},
    {"name":"dimension","type":"custom"},
    {"name":"paper type","type":"custom"},
    {"name":"size","type":"custom"},
    {"name":"composition","type":"feature"},
    {"name":"property","type":"feature"},
    {"name":"color","type":"custom"},
    {"name":"dimension","type":"custom"},
    {"name":"paper type","type":"custom"},
    {"name":"size","type":"custom"},
    {"name":"composition","type":"feature"},
    {"name":"property","type":"feature"}
  ],
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
  },
  settings: {
    ...productFeed.settings,
    targetCountries: ["FR"],
    attributeMapping: {
      exportProductsWithShortDescription: false,
      customColorAttribute: "extra:color",
      customSizeAttribute: "extra:size",
      customAgeGroupAttribute: "extra:age-group",
      customGenderGroupAttribute: "extra:gender-group",
      customConditionAttribute: "extra:condition",
    },
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
  settings: {
    ...productFeed.settings,
    targetCountries: ["FR"],
    attributeMapping: {
      exportProductsWithShortDescription: false,
      customColorAttribute: "extra:color",
      customSizeAttribute: "extra:size",
      customAgeGroupAttribute: "extra:age-group",
      customGenderGroupAttribute: "extra:gender-group",
      customConditionAttribute: "extra:condition",
    },
  },
};

export const productFeedIsConfiguredWithTax = {
  ...productFeedIsConfigured,
  settings: {
    ...productFeedIsConfigured.settings,
    targetCountries: ["FR"],
  },
};

export const productFeedMissingFields = {
  ...productFeedIsConfigured,
  settings: {
    ...productFeedIsConfigured.settings,
    autoImportShippingSettings: undefined,
  },
};

export const productFeedStatusSyncFailed = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    success: false,
    jobEndedAt: "12.05",
    lastUpdatedAt: "12.05",
    nextJobAt: "12.05",
  },
};

export const productFeedErrorAPI = {
  ...productFeed,
  errorAPI: true,
};

export const productFeedSyncSummaryInProgress = {
  ...productFeed,
  isSyncSummaryLoadingInProgress: true,
};

export const productFeedStatusSyncScheduled = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    success: false,
    nextJobAt: "12.05",
    lastUpdatedAt: "12.05",
    jobEndedAt: null,
  },
};

export const productFeedStatusSyncSuccess = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    success: true,
    jobEndedAt: "12.05",
    lastUpdatedAt: "12.05",
    nextJobAt: "12.05",
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
