export const productFeed = {
  isConfigurationStarted: false,
  isConfigured: false,
  stepper: 1,
  status: {
    failedSyncs: [],
    successfulSyncs: [],
    registerSyncData: {},
  },
  settings: {
    autoImportTaxSettings: false,
    targetCountries: [],
    autoImportShippingSettings: false,
    exportProductsWithShortDescription: true,
    sellApparel: {
      color: 'extra:color',
      size: 'extra:size',
      age: 'extra:age-group',
      gender: 'extra:gender-group',
    },
    sellRefurbished: {
      condition: 'extra:condition',
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
      isSyncEnabled: true,
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
      isSyncEnabled: true,
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
      isSyncEnabled: false,
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
      isSyncEnabled: false,
    }
  },
  "freeListing": {
    ...freeListing,
    enabled: true,
  }
}


export default alertSuccessValidation;
