import Vue, {VNode} from 'vue';

declare global {
  // namespace JSX {
  //   // tslint:disable no-empty-interface
  //   interface Element extends VNode {}
  //   // tslint:disable no-empty-interface
  //   interface ElementClass extends Vue {}

    interface Window {
      psAccountShopInConflict: boolean,
      psxMtgWithGoogleDefaultShopCountry: Array<string>,
      contextPsAccounts: any;
      translations: any;
      i18nSettings: any;
      psxMktgWithGoogleApiUrl: String;
      psxMktgWithGoogleAdminUrl: String;
      psxMktgWithGoogleShopUrl: String;
      shopIdPsAccounts: String;
      tokenPsAccounts: String;
      psxMktgWithGoogleModuleVersion: String,
      psVersion: String,
      psxMktgWithGoogleSegmentId: String,
    }
  //   interface IntrinsicElements {
  //     [elem: string]: any;
  //   }
  // }
}
