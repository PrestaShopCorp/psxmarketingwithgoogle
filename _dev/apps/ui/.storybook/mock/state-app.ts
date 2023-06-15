import {State, state} from "@/store/modules/app/state";

export const initialStateApp: State = {
  ...state,
  psxMktgWithGoogleShopUrl: 'https://my-shop.com',
  psxMktgWithGoogleAdminUrl: 'https://my-shop.com/admin-dev',
  psxMktgWithGoogleAdminAjaxUrl: '/',
  psxMtgWithGoogleDefaultShopCountry: 'FR',
  isCountryMemberOfEuropeanUnion: false,
  psxMktgWithGoogleShopCurrency: {
    isoCode: 'EUR',
  },
  psxMktgWithGoogleModuleVersionNeeded: '1.10.4',
  cloudsyncVersionNeeded: '1.6.5',
  shopIsOnMaintenanceMode: false,
  psxMktgWithGoogleProductDetailUrl: 'https://my-shop.com/admin-dev/index.php/sell/catalog/products/1?token=blabla',
  psxMktgWithGoogleActiveCountries: ['ES', 'FR', 'IT', 'PT', 'SE', 'US'],
  psxMktgWithGoogleActiveCurrencies: ['EUR'],
};

export const stateWithMaintenanceModeOn = {
  ...initialStateApp,
  shopIsOnMaintenanceMode: true,
}

export default initialStateApp;
