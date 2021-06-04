export const productFeedMock = {
  productFeed: {
    status: {
      lastSync: {},
      registerSyncData: {},
      isSuspendSync: null,
    },
    settings: {
      enabled: false,
    },
  },
};

export const freeListingMock = {
  freeListing: {
    validationList: {},
    summaryValidationList: [],
    status: false,
    enabled: false,
  },
}

export const freeListingActivation = {
  ...productFeedMock,
  "settings": {
    "enabled": true,
  },
  ...freeListingMock,
  "enabled": true,
}

export default freeListingActivation;
