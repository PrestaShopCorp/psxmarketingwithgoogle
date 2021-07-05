export const productFeed = {
  isConfigured: false,
  isConfiguredOnce: false,
  psGoogleShoppingActiveCountries: ['FR'],
  stepper: 1,
  status: {
    failedSyncs: [],
    successfulSyncs: [],
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
};

export const productFeedEnabled = {
  ...productFeed,
  status: {
    enabled: true,
  }
}

export const productFeedDisabled = {
  ...productFeed,
  status: {
    enabled: false,
  }
}

export const productFeedIsConfigured = {
  ...productFeedEnabled,
  isConfigured: true,
}


export const productFeedMissingFields = {
  ...productFeedIsConfigured,
  settings: {
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
    failedSyncs: ['fail'],
  }
}

export default productFeedEnabled;
