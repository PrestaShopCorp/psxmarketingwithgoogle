export const productFeed = {
  isConfigured: false,
  isConfiguredOnce: false,
  psGoogleShoppingActiveCountries: ['FR'],
  stepper: 1,
  status: {
    failedSyncs: [],
    successfulSyncs: ['oc'],
    enabled: false,
    shopHealthy: true,
    jobEndedAt: "",
    nextJobAt: "",
  },
  settings: {
    autoImportTaxSettings: false,
    targetCountries: ['FR'],
    productsPerBatchSync: 200,
    autoImportShippingSettings: false,
    attributeMapping: {
      exportProductsWithShortDescription: false,
      customColorAttribute: 'extra:color',
      customSizeAttribute: 'extra:size',
      customAgeGroupAttribute: 'extra:age-group',
      customGenderGroupAttribute: 'extra:gender-group',
      customConditionAttribute: 'extra:condition',
    },
    syncSchedule: '1 * * * * *',
  },
  validationSummary: {
    activeItems: 113,
    expiringItems: 13,
    pendingItems: 23,
    disapprovedItems: 57,
  },
};

export const productFeedEnabled = {
  ...productFeed,
  status: {
    ...productFeed.status,
    enabled: true,
  }
}

export const productFeedIsConfigured = {
  ...productFeedEnabled,
  isConfigured: true,
}


export const productFeedMissingFields = {
  ...productFeedIsConfigured,
  settings: {
    ...productFeedIsConfigured.settings,
    targetCountries: [],
    attributeMapping: {},
    autoImportShippingSettings: false,
  }
}

export const productFeedIsConfiguredOnce = {
  ...productFeedIsConfigured,
  isConfiguredOnce: true,
}

export const productFeedStatusSyncFailed = {
  ...productFeedEnabled,
  status: {
    ...productFeedEnabled.status,
    failedSyncs: ['fail'],
    jobEndedAt: "12.05",
    nextJobAt: "12.05",
  }
}

export const productFeedStatusSyncSchedule = {
  ...productFeedEnabled,
  status: {
    ...productFeedEnabled.status,
    failedSyncs: [],
    successfulSyncs: [],
    nextJobAt: "12.05",
  }
}
export const productFeedStatusSyncSuccess = {
  ...productFeedEnabled,
  status: {
    ...productFeedEnabled.status,
    failedSyncs: [],
    successfulSyncs: ['what', 'a', 'success'],
    jobEndedAt: "12.05",
    nextJobAt: "12.05",
  }
}

export default productFeedEnabled;
