import attributesToMap from "@/store/modules/product-feed/attributes-to-map.json";
export const productFeed = {
  isSyncSummaryLoadingInProgress: false,
  errorAPI: false,
  isConfigured: false,
  isConfiguredOnce: false,
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
    targetCountries: ["FR", "EN"],
    autoImportShippingSettings: true,
    attributeMapping: {},
    syncSchedule: "1 * * * * *",
    requestSynchronizationNow: false,
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
    items:  [
      {
          "id": "4",
          "attribute": "0",
          "name": "Charmander",
          "statuses": [
              {
                  "destination": "SurfacesAcrossGoogle",
                  "status": "disapproved",
                  "countries": [
                      "FR"
                  ]
              }
          ]
      },
      {
          "id": "4",
          "attribute": "18",
          "name": "Affiche encadrée The adventure begins",
          "statuses": [
              {
                  "destination": "SurfacesAcrossGoogle",
                  "status": "disapproved",
                  "countries": [
                      "FR"
                  ]
              }
          ]
      },
      {
          "id": "4",
          "attribute": "17",
          "name": "Affiche encadrée The adventure begins",
          "statuses": [
              {
                  "destination": "SurfacesAcrossGoogle",
                  "status": "disapproved",
                  "countries": [
                      "FR"
                  ]
              }
          ]
      },
      {
          "id": "7",
          "attribute": "0",
          "name": "Squirtle",
          "statuses": [
              {
                  "destination": "SurfacesAcrossGoogle",
                  "status": "disapproved",
                  "countries": [
                      "FR"
                  ]
              }
          ],
          "issues": [
            {
                "code": "language_mismatch",
                "servability": "unaffected",
                "resolution": "merchant_action",
                "destination": "Shopping",
                "description": "Incorrect language",
                "detail": "Use a supported language for the country of sale",
                "documentation": "https://support.google.com/merchants/answer/6101164",
                "applicableCountries": [
                    "FR",
                    "IT"
                ]
            },
            {
                "code": "hard_goods_missing_2_out_of_3_identifiers",
                "servability": "demoted",
                "resolution": "merchant_action",
                "destination": "Shopping",
                "description": "Limited performance due to missing identifiers [gtin, mpn, brand]",
                "detail": "Add a brand and either a GTIN or MPN. If this product is one-of-a-kind or vintage, you don’t need to add an identifier.",
                "documentation": "https://support.google.com/merchants/answer/6098295",
                "applicableCountries": [
                    "FR",
                    "IT"
                ]
            },
            {
                "code": "policy_enforcement_account_disapproval",
                "servability": "disapproved",
                "resolution": "merchant_action",
                "destination": "Shopping",
                "description": "Suspended account for policy violation",
                "detail": "Remove products that violate our policies, or request a manual review",
                "documentation": "https://support.google.com/merchants/answer/2948694",
                "applicableCountries": [
                    "BE"
                ]
            }
        ]
      },
      {
          "id": "4",
          "attribute": "16",
          "name": "Affiche encadrée The adventure begins",
          "statuses": [
              {
                  "destination": "SurfacesAcrossGoogle",
                  "status": "disapproved",
                  "countries": [
                      "FR"
                  ]
              }
          ]
      }
  ]
  },
  attributesToMap,
  attributesFromShop: [
    {"name":["ean"],"type":"product"},
    {"name":["isbn"],"type":"product"},
    {"name":["upc"],"type":"product"},
    {"name":["mpn"],"type":"product"},
    {"name":["manufacturer"],"type":"product"},
    {"name":["description"],"type":"product"},
    {"name":["description_short"],"type":"product"},
    {"name":["color"],"type":"custom"},
    {"name":["dimension"],"type":"custom"},
    {"name":["paper type"],"type":"custom"},
    {"name":["size"],"type":"custom"},
    {"name":["composition"],"type":"feature"},
    {"name":["property"],"type":"feature"},
    {"name":["color"],"type":"custom"},
    {"name":["dimension"],"type":"custom"},
    {"name":["paper type"],"type":"custom"},
    {"name":["size"],"type":"custom"},
    {"name":["composition"],"type":"feature"},
    {"name":["property"],"type":"feature"}
  ],
  selectedProductCategories: ['none'],
  preScanDetail: {
    products: [],
    limit: 10,
    currentPage: 1,
    total: 0,
    langChosen: null,
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
  settings: {
    ...productFeed.settings,
    targetCountries: ["FR"],
    attributeMapping: {
      "brand": [],
      "color": [],
      "mpn": [],
      "gtin": [
          {
              "id": "mpn",
              "type": "product"
          }
      ],
      "size": [],
      "gender": [],
      "description": [
          {
              "id": "description",
              "type": "product"
          }
      ],
      "ageGroup": []
    }
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
      "brand": [],
      "color": [],
      "mpn": [],
      "gtin": [
          {
              "id": "mpn",
              "type": "product"
          }
      ],
      "size": [],
      "gender": [],
      "description": [
          {
              "id": "description",
              "type": "product"
          }
      ],
      "ageGroup": []
  }
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
    nextJobAt:null,
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
  ...productFeedIsConfigured,
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
}
export const productFeedWithDisapprovedProductsButNoIssues = {
  ...productFeed,
  productsDatas: {
    items:  [ {
      "id": "4",
      "attribute": "0",
      "name": "Charmander",
      "statuses": [
          {
              "destination": "SurfacesAcrossGoogle",
              "status": "disapproved",
              "countries": [
                  "FR"
              ]
          }
      ]
  },]
  },
}

export const prevalidationScan = {
  errors: [
    {
      productId: 1851,
      attributeId: 0,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 446,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        },
        {
          title: "GBP Performance Sticker",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 447,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        },
        {
          title: "GBP Performance Sticker",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 448,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 449,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1852,
      attributeId: 450,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Logo T-Shirt",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 445,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 446,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        },
        {
          title: "GBP Performance Sticker",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 447,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        },
        {
          title: "GBP Performance Sticker",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 448,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 449,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1852,
      attributeId: 450,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Logo T-Shirt",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 445,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 446,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        },
        {
          title: "GBP Performance Sticker",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 447,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        },
        {
          title: "GBP Performance Sticker",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 448,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 449,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1852,
      attributeId: 450,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Logo T-Shirt",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 445,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 446,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        },
        {
          title: "GBP Performance Sticker",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 447,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        },
        {
          title: "GBP Performance Sticker",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 448,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1851,
      attributeId: 449,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Sticker",
          lang: "en"
        },
        {
          title: "Décalque GBP Performance",
          lang: "fr"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
    {
      productId: 1852,
      attributeId: 450,
      lastValidationDate: 1646189256515,
      titleByLang: [
        {
          title: "GBP Performance Logo T-Shirt",
          lang: "en"
        }
      ],
      isMissingName: false,
      isMissingLink: false,
      isMissingImage: false,
      isMissingPrice: false,
      isMissingDescription: false,
      isMissingBrandOrBarcode: true
    },
  ],
  totalErrors: 24,
}
