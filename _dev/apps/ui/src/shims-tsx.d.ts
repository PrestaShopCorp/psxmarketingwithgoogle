// import Vue, {VNode} from 'vue';
import {ShopCurrency} from './store/modules/app/state';

declare global {
  // namespace JSX {
  //   // tslint:disable no-empty-interface
  //   interface Element extends VNode {}
  //   // tslint:disable no-empty-interface
  //   interface ElementClass extends Vue {}

    interface Window {
      tinyLuxGoogleApiUrl: string;
      tinyLuxGoogleOAuthRedirectUri: string;
      tinyLuxGoogleConnection: {
        configured: boolean,
        clientIdSuffix: string,
        redirectUri: string,
        connected: boolean,
        googleEmail: string|null,
        merchantAccount: string|null,
        dataSource: string|null,
      };
      psxMtgWithGoogleDefaultShopCountry: string,
      psxMktgWithGoogleActiveCountries: string[],
      psxMktgWithGoogleActiveCurrencies: string[],
      psxMktgWithGoogleLanguages: string[],
      translations: any;
      i18nSettings: {
        isoCode: string, // ⚠️ Deprecated, this value can be invalid (i.e will return gb with en-gb)
        languageLocale: string,
      };
      psxMktgWithGoogleApiUrl: string;
      psxMktgWithGoogleAdminUrl: string;
      psxMktgWithGoogleShopUrl: string;
      psxMktgWithGoogleModuleVersion: string,
      phpVersion: string,
      psVersion: string,
      psxMktgWithGoogleAdminAjaxUrl: string,
      isCountryMemberOfEuropeanUnion: boolean,
      psxMktgWithGoogleShopCurrency: ShopCurrency,
      psxMktgWithGoogleMaintenanceSettingsUrl: string,
      psxMktgWithGoogleCarriersUrl?: string,
      psxMktgWithGoogleAttributesUrl?: string,
      psxMktgWithGoogleProductsUrl?: string,
      psxMktgWithGoogleCurrenciesUrl?: string,
      psxMktgWithGoogleLanguagesUrl?: string,
      psxMktgWithGoogleProductDetailUrl: string,
      psxMktgWithGoogleStoreSettingsUrl: string,
      psxMktgWithGoogleOnProductionEnvironment:boolean,
      psxMktgWithGoogleModuleIsEnabled: boolean,
      psxMktgWithGoogleEnableLink: string,
      // Other apps
    }
  //   interface IntrinsicElements {
  //     [elem: string]: any;
  //   }
  // }
}
