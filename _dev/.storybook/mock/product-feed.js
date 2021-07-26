export const productFeed = {
  errorAPI: false,
  isConfigured: false,
  isConfiguredOnce: false,
  psxMktgWithGoogleActiveCountries: [],
  totalProducts: 0,
  stepper: 1,
  status: {
    success: true,
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

export const productFeedIsReadyForExport = {
  ...productFeed,
  isConfigured: true,
  settings: {
    ...productFeed.settings,
    targetCountries: ['FR'],
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
    success : true,
  },
  settings: {
    ...productFeed.settings,
    targetCountries: ['FR'],
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
    targetCountries: ['FR', 'US'],
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
    nextJobAt: "12.05",
  }
}

export const productFeedErrorAPI = {
...productFeed,
errorAPI: true,
}

export const productFeedStatusSyncSchedule = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    success: false,
    nextJobAt: "12.05",
    jobEndedAt: null,
  }
}

export const productFeedStatusSyncSuccess = {
  ...productFeedIsConfigured,
  status: {
    ...productFeedIsConfigured.status,
    success: true,
    jobEndedAt: "12.05",
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
