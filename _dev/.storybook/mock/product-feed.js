export const productFeed = {
  isSyncSummaryLoadingInProgress: false,
  errorAPI: false,
  isConfigured: false,
  isConfiguredOnce: false,
  psxMtgWithGoogleActiveShopCountry: [],
  totalProducts: 0,
  stepper: 1,
  status: {
    success: true,
    jobEndedAt: '',
    nextJobAt: '',
    lastUpdatedAt: '',
  },
  settings: {
    shippingSettings: [],
    autoImportTaxSettings: false,
    targetCountries: 'FR',
    autoImportShippingSettings: true,
    attributeMapping: {},
    syncSchedule: '1 * * * * *',
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
        id: '12',
        name: 'super produit',
        attribute: "21",
        issues : [
          {
            code: "hard_goods_missing_2_out_of_3_identifiers",
            servability: "demoted",
            resolution: "merchant_action",
            destination: "Shopping",
            description: "Limited performance due to missing identifiers [gtin, mpn, brand]",
            detail: "Provide at least 2 of the missing identifiers",
            documentation: "https://support.google.com/merchants/answer/6098295",
            applicableCountries: [
                "FR"
            ]
          },
          {
            code: "policy_enforcement_account_disapproval",
            servability: "disapproved",
            resolution: "merchant_action",
            destination: "Shopping",
            description: "Suspended account for policy violation",
            detail: "Remove products that violate our policies, or request a manual review",
            documentation: "https://support.google.com/merchants/answer/6098295",
            applicableCountries: [
                "FR"
            ]
          },
        ],
        statuses :
        {
          destination: "Shopping",
          status: "disapproved",
          countries: [
              "FR"
            ]
        },
      },
      {
        id: '11',
        name: 'produit incroyable',
        attribute: "1",
        issues : [],
        statuses :
          {
            destination: "Shopping",
            status: "pending",
            countries: [
                "FR"
            ]
          },
      },
      {
        id: '13',
        name: 'produit formidable',
        attribute: "2",
        issues : [],
        statuses :
          {
            destination: "Shopping",
            status: "approved",
            countries: [
                "FR"
            ]
          },
      }
    ]
  }
};

export const productFeedIsReadyForExport = {
  ...productFeed,
  isConfigured: true,
  status: {
    ...productFeed.status,
    jobEndedAt: null,
    lastUpdatedAt: null,
    nextJobAt: new Date('July 22, 2021 03:24:00'),
    success : false,
  },
  settings: {
    ...productFeed.settings,
    targetCountries: 'FR',
    attributeMapping: {
      exportProductsWithShortDescription: false,
      customColorAttribute: 'extra:color',
      customSizeAttribute: 'extra:size',
      customAgeGroupAttribute: 'extra:age-group',
      customGenderGroupAttribute: 'extra:gender-group',
      customConditionAttribute: 'extra:condition',
    },
  }
};

export const productFeedIsConfigured = {
  ...productFeed,
  isConfigured: true,
  status: {
    ...productFeed.status,
    jobEndedAt: new Date('July 21, 2021 03:24:00'),
    nextJobAt: new Date('July 22, 2021 03:24:00'),
    lastUpdatedAt: new Date('July 22, 2021 03:24:00'),
    success : true,
  },
  settings: {
    ...productFeed.settings,
    targetCountries: 'FR',
    attributeMapping: {
      exportProductsWithShortDescription: false,
      customColorAttribute: 'extra:color',
      customSizeAttribute: 'extra:size',
      customAgeGroupAttribute: 'extra:age-group',
      customGenderGroupAttribute: 'extra:gender-group',
      customConditionAttribute: 'extra:condition',
    },
  }
}

export const productFeedIsConfiguredWithTax = {
  ...productFeedIsConfigured,
  settings: {
    ...productFeedIsConfigured.settings,
    targetCountries: 'FR',
  }
}

export const productFeedMissingFields = {
  ...productFeedIsConfigured,
  settings: {
    ...productFeedIsConfigured.settings,
    autoImportShippingSettings: undefined,
  }
}

export const productFeedStatusSyncFailed = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    success: false,
    jobEndedAt: "12.05",
    lastUpdatedAt: "12.05",
    nextJobAt: "12.05",
  }
}

export const productFeedErrorAPI = {
  ...productFeed,
  errorAPI: true,
}

export const productFeedSyncSummaryInProgress = {
  ...productFeed,
  isSyncSummaryLoadingInProgress: true,
}

export const productFeedStatusSyncScheduled = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    success: false,
    nextJobAt: "12.05",
    lastUpdatedAt: "12.05",
    jobEndedAt: null,
  },
}

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
}

export const productFeedIsConfiguredOnce = {
  ...productFeedIsConfigured,
  isConfiguredOnce: true,
}
