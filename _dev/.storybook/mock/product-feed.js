export const productFeed = {
  isConfigured: false,
  psGoogleShoppingActiveCountries: ['FR'],
  stepper: 1,
  status: {
    failedSyncs: [],
    successfulSyncs: [],
    enabled: false,
    shopHealthy: true,
  },
  settings: {
    autoImportTaxSettings: false,
    targetCountries: [],
    productsPerBatchSync: 0,
    autoImportShippingSettings: false,
    attributeMapping: {
      exportProductsWithShortDescription: false,
      customColorAttribute: 'extra:color',
      customSizeAttribute: 'extra:size',
      customAgeGroupAttribute: 'extra:age-group',
      customGenderGroupAttribute: 'extra:gender-group',
      customConditionAttribute: 'extra:condition',
    },
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


export default productFeedEnabled;
