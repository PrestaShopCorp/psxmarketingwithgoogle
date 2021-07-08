export const freeListing = {
  validationList: {},
  summaryValidationList: [],
  status: false,
  enabled: false,
  errorAPI: false,
};

export const freeListingEnabled = {
  ...freeListing,
  enabled: true,
};

export const freeListingDisabled = {
  ...freeListing,
  enabled: false,
};

export const freeListingErrorAPI = {
  ...freeListingDisabled,
  errorAPI: true,
};

export const freeListingCountryNotEligible = {
  ...freeListingDisabled,
};

export default freeListingEnabled;
