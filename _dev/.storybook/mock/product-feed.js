export const productFeed = {
  errorAPI: false,
  isConfigured: false,
  isConfiguredOnce: false,
  psGoogleShoppingActiveCountries: [],
  totalProducts: 0,
  stepper: 1,
  status: {
    failedSyncs: [],
    successfulSyncs: [],
    shopHealthy: true,
    jobEndedAt: '',
    nextJobAt: '',
  },
  settings: {
    shippingSettings: [],
    autoImportTaxSettings: false,
    targetCountries: null,
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
};



export const productFeedIsConfigured = {
  ...productFeed,
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
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    failedSyncs: ['fail'],
    jobEndedAt: "12.05",
    nextJobAt: "12.05",
  }
}

export const productFeedStatusSyncSchedule = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    failedSyncs: [],
    successfulSyncs: [],
    nextJobAt: "12.05",
  }
}
export const productFeedStatusSyncSuccess = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    failedSyncs: [],
    successfulSyncs: ['what', 'a', 'success'],
    jobEndedAt: "12.05",
    nextJobAt: "12.05",
  }
}

export const productFeedErrorAPI = {
...productFeed,
errorAPI: true,
}
