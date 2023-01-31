import { State, state } from "@/store/modules/product-feed/state";

export const freeListing: State = {
  ...state,
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

export default freeListingEnabled;
