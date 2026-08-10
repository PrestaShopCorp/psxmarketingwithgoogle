export interface GoogleMerchantAccount {
  id: string|null;
  name?: string|null;
}

export interface GoogleAccountDetails {
  email?: string|null;
  picture?: string|null;
}

export interface GoogleConnectionStatus {
  configured?: boolean;
  clientIdSuffix?: string;
  redirectUri?: string;
  connected: boolean;
  googleEmail: string|null;
  merchantAccount: string|null;
  dataSource: string|null;
}

export interface MerchantDataSource {
  id: string;
  name: string;
  displayName: string;
  input: string;
  primaryProductDataSource?: {
    feedLabel: string;
    contentLanguage: string;
  };
}

export type GoogleAccountContext = GoogleConnectionStatus & {
  details: GoogleAccountDetails;
  mcaSelectionOptions: GoogleMerchantAccount[]|null;
  authenticationUrl: string|Error;
  connectedOnce: boolean;
};

export type MerchantCenterAccountContext = GoogleMerchantAccount & {
  connectedOnce: boolean;
  selectionError: 'LinkingFailed'|null;
};

export interface State {
  warmedUp: boolean;
  googleAccount: GoogleAccountContext;
  googleMerchantAccount: MerchantCenterAccountContext;
  merchantDataSources: MerchantDataSource[];
}

export const state: State = {
  warmedUp: false,
  googleAccount: {
    configured: false,
    connected: false,
    googleEmail: null,
    merchantAccount: null,
    dataSource: null,
    details: {},
    mcaSelectionOptions: null,
    authenticationUrl: '',
    connectedOnce: false,
  },
  googleMerchantAccount: {
    id: null,
    name: null,
    connectedOnce: false,
    selectionError: null,
  },
  merchantDataSources: [],
};
