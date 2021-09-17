export const initialStateApp = {
    psxMktgWithGoogleApiUrl: 'https://mock-googleshopping-api.psessentials-integration.net/rest/PS+Google+Shopping+all-in-one/1.0',
    psxMktgWithGoogleShopUrl: 'https://my-shop.com',
    psxMktgWithGoogleAdminUrl: 'https://my-shop.com/admin-dev',
    psxMktgWithGoogleAdminAjaxUrl: 'https://mock-googleshopping-api.psessentials-integration.net/rest/Ajax+requests+to+shop+specification/1.0.0/',
    shopIdPsAccounts: '',
    tokenPsAccounts: '',
    psxMtgWithGoogleDefaultShopCountry: null,
    isCountryMemberOfEuropeanUnion: false,
    targetCountries: ['FR'],
    psxMktgWithGoogleShopCurrency: {
      isoCode: 'EUR',
    },
    psxMktgWithGoogleDocumentAndFaq: {
      faq: {},
      doc: '',
      contactUs: '',
    },
    psVersion: '',
    psxMktgWithGoogleModuleVersion: '',
    psxMktgWithGoogleMaintenanceSettingsUrl: '',
    psxMktgWithGoogleStoreSettingsUrl: '',
    shopIsOnMaintenanceMode: false,
    psxMktgWithGoogleProductDetailUrl: 'https://my-shop.com/admin-dev/index.php/sell/catalog/products/1?token=blabla'
};

export const stateWithMaintenanceModeOn = {
  ...initialStateApp,
  shopIsOnMaintenanceMode: true,
}

export default initialStateApp;