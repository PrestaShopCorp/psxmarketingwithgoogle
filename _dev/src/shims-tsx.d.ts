import Vue, {VNode} from 'vue';

declare global {
  // namespace JSX {
  //   // tslint:disable no-empty-interface
  //   interface Element extends VNode {}
  //   // tslint:disable no-empty-interface
  //   interface ElementClass extends Vue {}

    interface Window {
      contextPsAccounts: any;
      translations: any;
      i18nSettings: any;
      psGoogleShoppingApiUrl: String;
      psGoogleShoppingShopUrl: any;
      psAccountShopId: any;
    }
  //   interface IntrinsicElements {
  //     [elem: string]: any;
  //   }
  // }
}
