// import Vue, {VNode} from 'vue';
import {ShopCurrency} from './store/modules/app/state';

declare global {
  // namespace JSX {
  //   // tslint:disable no-empty-interface
  //   interface Element extends VNode {}
  //   // tslint:disable no-empty-interface
  //   interface ElementClass extends Vue {}

    interface Window {
      psxMtgWithGoogleDefaultShopCountry: string,
      psxMktgWithGoogleActiveCountries: string[],
      psxMktgWithGoogleActiveCurrencies: string[],
      contextPsAccounts: any;
      contextPsEventBus: any
      translations: any;
      i18nSettings: {
        isoCode: string,
        languageLocale: string,
      };
      psxMktgWithGoogleApiUrl: string;
      psxMktgWithGoogleAdminUrl: string;
      psxMktgWithGoogleShopUrl: string;
      shopIdPsAccounts: string;
      tokenPsAccounts: string;
      psxMktgWithGoogleModuleVersion: string,
      phpVersion: string,
      psVersion: string,
      psxMktgWithGoogleSegmentId: string,
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
      psxMktgWithGoogleDsnSentry: string,

      // Other apps
      psaccountsVue?: any,
    }
  //   interface IntrinsicElements {
  //     [elem: string]: any;
  //   }
  // }
}
