import Vue, {VNode} from 'vue';
import {ShopCurrency} from './store/modules/app/state';

declare global {
  // namespace JSX {
  //   // tslint:disable no-empty-interface
  //   interface Element extends VNode {}
  //   // tslint:disable no-empty-interface
  //   interface ElementClass extends Vue {}

    interface Window {
      psxMtgWithGoogleDefaultShopCountry: Array<string>,
      psxMktgWithGoogleActiveCountries: String[],
      contextPsAccounts: any;
      contextPsEventBus: any
      translations: any;
      i18nSettings: {
        isoCode: string,
        languageLocale: string,
      };
      psxMktgWithGoogleApiUrl: String;
      psxMktgWithGoogleAdminUrl: String;
      psxMktgWithGoogleShopUrl: String;
      shopIdPsAccounts: String;
      tokenPsAccounts: String;
      psxMktgWithGoogleModuleVersion: String,
      psVersion: String,
      psxMktgWithGoogleSegmentId: String,
      psxMktgWithGoogleAdminAjaxUrl: String,
      isCountryMemberOfEuropeanUnion: boolean,
      psxMktgWithGoogleShopCurrency: ShopCurrency,
      psxMktgWithGoogleMaintenanceSettingsUrl: String,
      psxMktgWithGoogleCarriersUrl?: String,
      psxMktgWithGoogleAttributesUrl?: String,
      psxMktgWithGoogleProductDetailUrl: String,
      psxMktgWithGoogleStoreSettingsUrl: String,
      psxMktgWithGoogleOnProductionEnvironment:boolean,
      psxMktgWithGoogleModuleIsEnabled: boolean,
      psxMktgWithGoogleEnableLink: String,
    }
  //   interface IntrinsicElements {
  //     [elem: string]: any;
  //   }
  // }
}
