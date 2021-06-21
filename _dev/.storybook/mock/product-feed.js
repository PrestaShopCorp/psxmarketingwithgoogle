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
    targetCountries: [],
    productsPerBatchSync: 0,
    autoImportShippingSettings: false,
    exportProductsWithShortDescription: true,
    attributeMapping: {
      customColorAttribute: 'extra:color',
      customSizeAttribute: 'extra:size',
      customAgeGroupAttribute: 'extra:age-group',
      customGenderGroupAttribute: 'extra:gender-group',
      customConditionAttribute: 'extra:condition',
    },
  },
};

export const freeListing = {
  validationList: {},
  summaryValidationList: [],
  status: false,
};

export const alertSuccessValidation = {
  "productFeed": {
    ...productFeed,
    status: {
      enabled: true,
    }
  },
  "freeListing": {
    ...freeListing,
    enabled: true,
  }
};

export const alertEnableFreeListing = {
  "productFeed": {
    ...productFeed,
    status: {
      enabled: true,
    }
  },
  "freeListing": {
    ...freeListing,
    enabled: false,
  }
}

export const alertEnableFreeListingAndProductFeed = {
  "productFeed": {
    ...productFeed,
    status: {
      enabled: false,
    }
  },
  "freeListing": {
    ...freeListing,
    enabled: false,
  }
}

export const alertDisableProductFeed = {
  "productFeed": {
    ...productFeed,
    status: {
      enabled: false,
    }
  },
  "freeListing": {
    ...freeListing,
    enabled: true,
  }
}


export default alertSuccessValidation;
