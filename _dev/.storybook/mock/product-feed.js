export const productFeed = {
  isConfigured: false,
  stepper: 1,
  status: {
    failedSyncs: [],
    successfulSyncs: [],
    enabled: false,
    shopHealthy: true,
  },
  settings: {
    autoImportTaxSettings: false,
    targetCountries: ['FR'],
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

export const enableProductFeed = {
  ...productFeed,
  status: {
    enabled: true,
  }
}

export const disableProductFeed = {
  ...productFeed,
  status: {
    enabled: false,
  }
}


export default enableProductFeed;
