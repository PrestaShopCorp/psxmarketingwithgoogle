/**
 * 2007-2021 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2021 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */
import {DeliveryDetail, ShopShippingInterface} from '@/providers/shipping-settings-provider';
import MutationsTypes from './mutations-types';
import {
  AttributeResponseFromAPI,
  parseApiResponse,
} from '../../../utils/AttributeMapping';
import {
  State as LocalState,
  ProductInfos,
  ProductFeedValidationSummary,
  ProductStatus,
  AttributesInfos,
  commonAttributes,
  ProductVerificationIssueOverall,
  ProductVerificationIssueProduct,
  ProductVerificationIssue,
} from './state';
import {RateType} from '@/enums/product-feed/rate';
import {SelectedProductCategories} from '@/enums/product-feed/attribute-mapping-categories';
import {IncrementalSyncContext} from '@/components/product-feed-page/dashboard/feed-configuration/feed-configuration';
import ProductFilterMethodsSynch from '@/enums/product-feed/product-filter-methods-synch';

type payloadObject = {
  name: string, data: string
}

export default {
  [MutationsTypes.SET_LAST_SYNCHRONISATION](state: LocalState, payload: payloadObject) {
    state.status[payload.name] = payload.data;
  },

  //  Product Feed Card
  [MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS](state: LocalState, payload: payloadObject) {
    state.settings[payload.name] = payload.data;
  },

  [MutationsTypes.TOGGLE_CONFIGURATION_FINISHED](state: LocalState, payload: boolean) {
    state.isConfigured = payload;
  },

  [MutationsTypes.SAVE_CONFIGURATION_CONNECTED_ONCE](state: LocalState, payload: boolean) {
    state.isConfiguredOnce = payload;
  },
  [MutationsTypes.SET_ACTIVE_CONFIGURATION_STEP](state: LocalState, payload: number) {
    state.stepper = payload;
  },

  [MutationsTypes.SAVE_AUTO_IMPORT_SHIPPING_INFORMATIONS](state: LocalState, payload:
    ShopShippingInterface[],
  ) {
    state.settings.shippingSettings = payload;
  },
  [MutationsTypes.SAVE_SHIPPING_SETTINGS](state: LocalState, payload: DeliveryDetail[],
  ) {
    state.settings.deliveryDetails = payload;
  },
  [MutationsTypes.SET_VALIDATION_SUMMARY](state: LocalState, payload: ProductFeedValidationSummary,
  ) {
    state.validationSummary = payload;
  },
  [MutationsTypes.SAVE_TOTAL_PRODUCTS_READY_TO_SYNC](state: LocalState, payload: number,
  ) {
    state.totalProducts = payload;
  },
  [MutationsTypes.SET_SYNC_SUMMARY_LOADING](state: LocalState, isLoading: boolean) {
    state.isSyncSummaryLoadingInProgress = isLoading;
  },
  [MutationsTypes.API_ERROR](state: LocalState, payload: boolean,
  ) {
    state.errorAPI = payload;
  },
  [MutationsTypes.REMOVE_PRODUCT_FEED](state: LocalState,
  ) {
    state.settings = {
      shippingSetup: null,
      rate: null,
      estimateCarriers: [],
      shippingSettings: [],
      deliveryDetails: [],
      productFilter: [],
      autoImportTaxSettings: false,
      autoImportShippingSettings: undefined,
      targetCountries: null,
    };
  },
  [MutationsTypes.SAVE_ATTRIBUTES_SHOP](state: LocalState, payload: AttributesInfos[]) {
    state.attributesFromShop.push(...payload);

    state.attributesFromShop.forEach((data, indexToDelete) => {
      // remove deleted attributes if new call without total refresh
      const find = payload.findIndex((i) => JSON.stringify(i.name) === JSON.stringify(data.name));

      if (find === -1) {
        state.attributesFromShop.splice(indexToDelete, 1);
      }
    });

    state.attributesFromShop.push(...commonAttributes);
    // remove duplicates attributes if new call without total refresh
    state.attributesFromShop = state.attributesFromShop.reduce((acc: any, cur: AttributesInfos) => {
      const x = acc.find((item) => JSON.stringify(item.name) === JSON.stringify(cur.name));

      if (!x) {
        return acc.concat([cur]);
      }
      return acc;
    }, []);

    const getAttributesNames = state.attributesFromShop.map((attribute) => attribute.name);
    state.attributesToMap.forEach((category) => {
      category.fields.forEach((field) => {
        field.recommended = field.recommended.filter(
          (reco) => getAttributesNames.some((attrName) => attrName.includes(reco.name[0])),
        );
      });
    });
  },
  [MutationsTypes.SET_ATTRIBUTE_MAPPING_SELECTION](state: LocalState, payload) {
    state.attributesToMap
      .reduce((acc, curr) => [...acc, ...curr.fields], [])
      .forEach((fields) => {
        if (fields.name === payload.name) {
          fields.mapped = payload.elements;
        }
      });
  },
  [MutationsTypes.SET_ATTRIBUTES_MAPPED](
    state: LocalState,
    mappingFromApi: AttributeResponseFromAPI,
  ) {
    if (Object.keys(mappingFromApi).length === 0) {
      return;
    }

    state.attributeMapping = mappingFromApi;

    const result = parseApiResponse(
      [...state.attributesToMap],
      state.attributesFromShop,
      mappingFromApi,
    );

    state.attributesToMap.splice(0, result.length, ...result);
  },
  [MutationsTypes.SET_SELECTED_PRODUCT_CATEGORIES](
    state: LocalState,
    payload: SelectedProductCategories,
  ) {
    state.selectedProductCategories = payload;
  },
  [MutationsTypes.SET_SYNC_SCHEDULE](state: LocalState, payload: boolean) {
    state.requestSynchronizationNow = payload;
  },
  [MutationsTypes.SET_RATE_CHOSEN](state: LocalState, payload: RateType) {
    state.settings.rate = payload;
  },
  [MutationsTypes.SET_SHIPPING_SETUP_SELECTED](state: LocalState, payload) {
    localStorage.setItem('productFeed-shippingSetup', JSON.stringify(payload));
    state.settings.shippingSetup = payload;
  },
  [MutationsTypes.SAVE_PRODUCT_FEED_SYNC_CONTEXT](
    state: LocalState,
    syncContext: IncrementalSyncContext,
  ) {
    state.report.lastConfigurationUsed = syncContext;
  },
  [MutationsTypes.SAVE_NUMBER_OF_PRODUCTS_ON_CLOUDSYNC](
    state: LocalState,
    productsInCatalog: string,
  ) {
    state.report.productsInCatalog = productsInCatalog;
  },
  [MutationsTypes.SAVE_VERIFICATION_STATS](
    state: LocalState,
    verificationStats: {
      validProducts: number;
      invalidProducts: number;
    },
  ) {
    state.report.invalidProducts = verificationStats.invalidProducts;
    state.report.validProducts = verificationStats.validProducts;
  },

  [MutationsTypes.SAVE_VERIFICATION_ISSUES](
    state: LocalState,
    verificationIssues: ProductVerificationIssueOverall[],
  ) {
    state.verificationIssues = verificationIssues;
  },

  [MutationsTypes.SAVE_VERIFICATION_ISSUE_PRODUCTS](
    state: LocalState,
    data: {
      originalPayload: {
        verificationIssue: ProductVerificationIssue,
        limit: number,
        offset: number,
      },
      verificationIssueProducts: ProductVerificationIssueProduct[],
    },
  ) {
    if (!state.verificationIssuesProducts[data.originalPayload.verificationIssue]) {
      state.verificationIssuesProducts[data.originalPayload.verificationIssue] = [];
    }

    // Force type after undefined check
    const productsList = state.verificationIssuesProducts[
      data.originalPayload.verificationIssue
    ] as (ProductVerificationIssueProduct|null)[];

    // Fill intermediate indexes with null values
    const emptyValues: null[] = Array(
      Math.max(0, data.originalPayload.offset - productsList.length),
    ).fill(null);

    productsList.splice(
      data.originalPayload.offset,
      data.originalPayload.limit,
      ...emptyValues,
      ...data.verificationIssueProducts,
    );
    state.verificationIssuesProducts = {

      ...state.verificationIssuesProducts,
    };
  },

  [MutationsTypes.SAVE_VERIFICATION_ISSUE_NB_OF_PRODUCTS](
    state: LocalState,
    data: {
      originalPayload: {
        verificationIssue: ProductVerificationIssue,
      },
      verificationIssueNumberOfProducts: number,
    },
  ) {
    state.verificationIssuesNumberOfProducts[
      data.originalPayload.verificationIssue
    ] = data.verificationIssueNumberOfProducts;

    // Force refresh of state
    state.verificationIssuesNumberOfProducts = {
      ...state.verificationIssuesNumberOfProducts,
    };
  },

  // GMC reports overall
  [MutationsTypes.SET_PRODUCTS_VALIDATION_PAGE_SIZE](state: LocalState, payload: number): void {
    state.gmcProductsByStatus.request.numberOfProductsPerPage = payload;
  },
  [MutationsTypes.SET_PRODUCTS_VALIDATION_TOTAL](state: LocalState, payload: number): void {
    state.gmcProductsByStatus.totalOfProducts = payload;
  },

  // GMC reports - disapproved products
  [MutationsTypes.ADD_TO_PRODUCTS_VALIDATION_LIST](
    state: LocalState,
    payload: {
      products: ProductInfos[],
      status: ProductStatus,
    },
  ) {
    state.gmcProductsByStatus.results[payload.status].push(...payload.products);
  },
  [MutationsTypes.RESET_PRODUCTS_VALIDATION_LIST](state: LocalState, payload: {
    status: ProductStatus,
  }): void {
    state.gmcProductsByStatus.results[payload.status] = [];
  },
  [MutationsTypes.SET_PRODUCTS_VALIDATION_OFFSET](state: LocalState, payload: {
    offset: number,
    status: ProductStatus,
  }): void {
    state.gmcProductsByStatus.request.offsets[payload.status] = payload.offset;
  },

  // Product filters
  [MutationsTypes.SET_PRODUCT_FILTER_OPTIONS](state: LocalState, payload: payloadObject): void {
    state.productFilterOptions[payload.name] = payload.data;
  },
  [MutationsTypes.SET_PRODUCT_COUNT](state: LocalState, payload: number): void {
    state.productCount = payload;
  },
  [MutationsTypes.SET_SYNC_METHOD](state: LocalState, payload: ProductFilterMethodsSynch): void {
    state.syncSelected = payload;
  },
};
