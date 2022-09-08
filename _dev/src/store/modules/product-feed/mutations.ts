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
import {DeliveryDetail} from '../../../providers/shipping-settings-provider';
import MutationsTypes from './mutations-types';
import {
  AttributeResponseFromAPI,
  oneInOne,
  deepEqual,
  parseApiResponse,
} from '../../../utils/AttributeMapping';
import {
  State as LocalState,
  ProductInfos,
  ProductFeedValidationSummary,
  AttributesInfos,
  commonAttributes,
  PrevalidationScanSummary,
  PreScanReporting,
} from './state';

type payloadObject = {
  name: string, data: string
}
type payloadAttribute = {
  prestashop: string, google: string
}

type payloadArrayShipping = [{
  collection: string,
  id: string,
  properties: object
}]

export default {
  [MutationsTypes.SET_LAST_SYNCHRONISATION](state: LocalState, payload: payloadObject) {
    state.status[payload.name] = payload.data;
  },
  [MutationsTypes.SAVE_ALL_PRODUCTS](state: LocalState, payload:ProductInfos[]) {
    state.productsDatas.items.push(...payload);
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
    payloadArrayShipping,
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
      shippingSettings: [],
      deliveryDetails: [],
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
  [MutationsTypes.SET_MAPPING_FROM_STORAGE](state: LocalState, payload:AttributeResponseFromAPI[]) {
    if (payload.length) {
      return;
    }

    Object.keys(payload).forEach((key) => {
      state.attributesToMap.forEach((attribute) => {
        const findAttribute = attribute.fields.find((field) => key === field.name);
        const formatObj = payload[key].map((value) => ({
          name: value.ids,
          type: value.type,
        }));

        if (findAttribute) {
          findAttribute.mapped = formatObj;
        }
      });
    });
  },
  [MutationsTypes.SET_SELECTED_PRODUCT_CATEGORIES](state: LocalState, payload) {
    localStorage.setItem('selectedProductCategories', JSON.stringify(payload));
    state.selectedProductCategories = payload;
  },
  [MutationsTypes.SET_SYNC_SCHEDULE](state: LocalState, payload: boolean) {
    state.requestSynchronizationNow = payload;
  },
  [MutationsTypes.SET_PREVALIDATION_SUMMARY](state: LocalState, payload: PrevalidationScanSummary) {
    state.prevalidationScanSummary = payload;
  },
  [MutationsTypes.SET_PRESCAN_LIMIT_PAGE](state: LocalState, payload: number) {
    state.preScanDetail.limit = payload;
  },
  [MutationsTypes.SET_PRESCAN_NEXT_PAGE](state: LocalState, payload: number) {
    state.preScanDetail.currentPage = payload;
  },
  [MutationsTypes.SET_PRESCAN_PRODUCTS](state: LocalState, payload: PreScanReporting[]) {
    state.preScanDetail.products = payload;
  },
  [MutationsTypes.SET_PRESCAN_LANGUAGE_CHOSEN](state: LocalState, payload: string) {
    state.preScanDetail.langChosen = payload;
  },
  [MutationsTypes.SET_PRESCAN_TOTAL_PRODUCT](state: LocalState, payload: number) {
    state.preScanDetail.total = payload;
  },
  [MutationsTypes.SET_SHIPPING_SETUP_SELECTED](state: LocalState, payload) {
    localStorage.setItem('productFeed-shippingSetup', JSON.stringify(payload));
    state.settings.shippingSetup = payload;
  },
};
