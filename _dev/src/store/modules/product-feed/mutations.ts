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
import {LogarithmicScale} from 'chart.js';
import {DeliveryDetail} from '../../../providers/shipping-settings-provider';
import MutationsTypes from './mutations-types';
import {
  State as LocalState,
  ProductInfos,
  ProductFeedValidationSummary,
  AttributesInfos,
} from './state';

type payloadObject = {
  name: string, data: string
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
  [MutationsTypes.SAVE_ALL_PRODUCTS](state: LocalState, payload:ProductInfos) {
    state.productsDatas.items.push(payload);
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

  [MutationsTypes.TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_REFURBISHED](
    state: LocalState, payload: boolean,
  ) {
    if (payload) {
      state.settings.attributeMapping.customConditionAttribute = 'extra:condition';
    } else {
      delete state.settings.attributeMapping.customConditionAttribute;
    }
    state.settings.attributeMapping = {...state.settings.attributeMapping};
  },
  [MutationsTypes.TOGGLE_PRODUCT_FEED_SETTINGS_ATTRIBUTE_MAPPING_SELL_APPAREL](
    state: LocalState, payload: boolean,
  ) {
    if (payload) {
      state.settings.attributeMapping.customColorAttribute = 'extra:color';
      state.settings.attributeMapping.customSizeAttribute = 'extra:size';
      state.settings.attributeMapping.customAgeGroupAttribute = 'extra:age-group';
      state.settings.attributeMapping.customGenderGroupAttribute = 'extra:gender-group';
    } else {
      delete state.settings.attributeMapping.customColorAttribute;
      delete state.settings.attributeMapping.customSizeAttribute;
      delete state.settings.attributeMapping.customAgeGroupAttribute;
      delete state.settings.attributeMapping.customGenderGroupAttribute;
    }
    state.settings.attributeMapping = {...state.settings.attributeMapping};
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
  [MutationsTypes.SAVE_TOTAL_PRODUCTS](state: LocalState, payload: number,
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
      shippingSettings: [],
      deliveryDetails: [],
      autoImportTaxSettings: false,
      autoImportShippingSettings: true,
      attributeMapping: {},
      syncSchedule: '1 * * * * *',
    };
  },
  [MutationsTypes.SAVE_ATTRIBUTES_SHOP](state: LocalState, payload: AttributesInfos[]) {
    state.attributesData.push(...payload);
    // remove duplicates if new call without total refresh
    state.attributesData = state.attributesData.reduce((acc: any, current: AttributesInfos) => {
      const x = acc.find((item) => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      }
      return acc;
    }, []);

    // state.attributesData.forEach((data, indexToDelete) => {
    //   // remove deleted attributes if new call without total refresh
    //   const find = payload.findIndex((i) => i.name === data.name);
    //   if (find == -1) {
    //     state.attributesData.splice(indexToDelete, 1)
    //   }
    // });

    const getAttributesNames = state.attributesData.map((attribute) => attribute.name);
    state.attributesToMap.forEach((category) => {
      category.fields.forEach((field) => {
        field.recommended = field.recommended.filter(
          (reco) => getAttributesNames.includes(reco.name),
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
  [MutationsTypes.SET_ATTRIBUTES_MAPPED](state: LocalState, payload) {
    if (payload.length) {
      return;
    }
    const getKeys = Object.keys(payload);
    getKeys.forEach((key) => {
      state.attributesToMap.forEach((attribute) => {
        const findAttr = attribute.fields.find((field) => field.name === key);
        const changeMappingObj = payload[key].map((value) => ({
          name: value.id,
          type: value.type,
        }));
        if (findAttr) {
          findAttr.mapped = changeMappingObj;
        }
      });
    });
  },
};
