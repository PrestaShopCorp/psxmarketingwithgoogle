export const freeListing = {
  isActivatedOnce: false,
  validationList: {},
  summaryValidationList: [],
  status: false,
  errorAPI: false,
};

export const freeListingEnabled = {
  ...freeListing,
  status: true,
};

export const freeListingDisabled = {
  ...freeListing,
  status: false,
};

export const freeListingErrorAPI = {
  ...freeListingDisabled,
  errorAPI: true,
};

export const freeListingCountryNotEligible = {
  ...freeListingDisabled,
};

export default freeListingEnabled;
