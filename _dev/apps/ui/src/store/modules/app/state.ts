import {ISubscription} from '@prestashopcorp/billing-cdc/dist/@types/Subscription';

export interface State {
  isCountryMemberOfEuropeanUnion: boolean;
  psxMktgWithGoogleApiUrl: string;
  psxMktgWithGoogleAdminUrl: string;
  psxMktgWithGoogleAdminAjaxUrl: string;
  psxMktgWithGoogleShopUrl: string;
  psxMktgWithGoogleActiveCountries: string[];
  psxMktgWithGoogleActiveCurrencies: string[];
  psxMktgWithGoogleShopCurrency: ShopCurrency;
  psxMtgWithGoogleDefaultShopCountry: string | null;
  psxMktgWithGoogleDocumentAndFaq: HelpInformations;
  psVersion: string;
  phpVersion: string;
  psxMktgWithGoogleModuleVersion: string;
  shopIsOnMaintenanceMode: boolean;
  psxMktgWithGoogleMaintenanceSettingsUrl: string;
  psxMktgWithGoogleCarriersUrl: string;
  psxMktgWithGoogleAttributesUrl: string;
  psxMktgWithGoogleProductsUrl: string;
  psxMktgWithGoogleCurrenciesUrl: string;
  psxMktgWithGoogleLanguagesUrl: string;
  psxMktgWithGoogleProductDetailUrl: string;
  psxMktgWithGoogleStoreSettingsUrl: string;
  psxMktgWithGoogleOnProductionEnvironment: boolean;
  debugData: DebugData;
  adBlockerExists: boolean;
  cloudsyncVersionNeeded: string;
  psxMktgWithGoogleModuleVersionNeeded: string;
  psxMktgWithGoogleModuleIsEnabled: boolean;
  psxMktgWithGoogleEnableLink: string;
  backOfficeUserIsLoggedIn: boolean;

  featureFlags: {
    enhancedConversions: boolean;
  },

  billing: {
    subscription?: ISubscription;
  },
}

export interface ShopCurrency {
  isoCode: string;
}

export interface HelpInformations {
  faq: object;
  doc: string;
  contactUs: string;
}

export interface DebugData {
  urlEventBusHealthCheck?: string;
  typesOfSync: string[];
}

export const state: State = {
  psxMktgWithGoogleApiUrl: '',
  psxMktgWithGoogleActiveCountries: [],
  psxMktgWithGoogleActiveCurrencies: [],
  psxMktgWithGoogleAdminUrl: '',
  psxMktgWithGoogleAdminAjaxUrl: '',
  psxMktgWithGoogleShopUrl: '',
  isCountryMemberOfEuropeanUnion: false,
  psxMtgWithGoogleDefaultShopCountry: null,
  psxMktgWithGoogleShopCurrency: {
    isoCode: '',
  },
  psxMktgWithGoogleDocumentAndFaq: {
    faq: {},
    doc: '',
    contactUs: '',
  },
  psVersion: '',
  phpVersion: '',
  psxMktgWithGoogleMaintenanceSettingsUrl: '',
  shopIsOnMaintenanceMode: document.getElementById('maintenance-mode') !== null,
  psxMktgWithGoogleCarriersUrl: '',
  psxMktgWithGoogleAttributesUrl: '',
  psxMktgWithGoogleProductsUrl: '',
  psxMktgWithGoogleCurrenciesUrl: '',
  psxMktgWithGoogleLanguagesUrl: '',
  psxMktgWithGoogleProductDetailUrl: '',
  psxMktgWithGoogleStoreSettingsUrl: '',
  psxMktgWithGoogleOnProductionEnvironment: false,
  debugData: {
    typesOfSync: [],
  },
  adBlockerExists: false,
  psxMktgWithGoogleModuleVersion: '',
  cloudsyncVersionNeeded: import.meta.env.VITE_MIN_VERSION_NEEDED_CLOUD_SYNC || '',
  psxMktgWithGoogleModuleVersionNeeded: import.meta.env.VITE_MIN_VERSION_NEEDED_MKTG_GOOGLE || '',
  psxMktgWithGoogleModuleIsEnabled: true,
  psxMktgWithGoogleEnableLink: '',
  backOfficeUserIsLoggedIn: true,

  featureFlags: {
    enhancedConversions: false,
  },

  billing: {
    subscription: window.psBillingSubscription,
  },
};
