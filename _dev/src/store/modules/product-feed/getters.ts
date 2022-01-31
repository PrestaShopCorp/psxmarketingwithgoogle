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

import {
  State as LocalState,
  ProductFeedSettings,
  ProductFeedStatus,
  ProductFeedValidationSummary,
  AttributesInfos,
} from './state';
import GettersTypes from './getters-types';

export default {
  [GettersTypes.GET_PRODUCT_FEED_IS_CONFIGURED](state: LocalState): boolean {
    return state.isConfigured;
  },
  [GettersTypes.GET_PRODUCT_FEED_IS_CONFIGURED_ONCE](state: LocalState): boolean {
    return state.isConfiguredOnce;
  },
  [GettersTypes.GET_PRODUCT_FEED_SETTINGS](state: LocalState): ProductFeedSettings {
    return state.settings;
  },
  [GettersTypes.GET_PRODUCT_FEED_STATUS](state: LocalState): ProductFeedStatus {
    return state.status;
  },
  [GettersTypes.GET_TOTAL_PRODUCTS](state: LocalState) :number {
    return state.totalProducts;
  },

  [GettersTypes.GET_PRODUCT_FEED_VALIDATION_SUMMARY](state: LocalState) :
  ProductFeedValidationSummary {
    return state.validationSummary;
  },
  [GettersTypes.GET_SYNC_STATUS](state: LocalState) : string {
    if (state.settings.autoImportShippingSettings === undefined) {
      return 'warning';
    }
    if (state.status.lastUpdatedAt === null) {
      return 'schedule';
    }
    if (state.status.success === false) {
      return 'failed';
    }
    return 'success';
  },
  [GettersTypes.GET_FREE_LISTING_ATTRIBUTES_TO_MAP](state: LocalState): any {
    return state.attributesToMap;
  },
  [GettersTypes.GET_SHOP_ATTRIBUTES](state: LocalState) : AttributesInfos[] {
    return state.attributesData.sort((a, b) => a.name.localeCompare(b.name));
  },
  [GettersTypes.GET_TARGET_COUNTRIES](
    state: LocalState,
    getters,
    rootState) : Array<string> | null {
    const targetCountriesFromLocalStorage = localStorage.getItem('productFeed-targetCountries');

    if (targetCountriesFromLocalStorage) {
      state.settings.targetCountries = JSON.parse(targetCountriesFromLocalStorage);
    }
    if (state.settings.targetCountries !== null) {
      return state.settings.targetCountries;
    }
    if (rootState.app.psxMtgWithGoogleDefaultShopCountry !== null) {
      return [rootState.app.psxMtgWithGoogleDefaultShopCountry];
    }
    return null;
  },
  [GettersTypes.GET_PRODUCT_CATEGORIES_SELECTED](state: LocalState) : Array<String> {
    const getCategoriesFromLocalStorage = localStorage.getItem('selectedProductCategories');

    if (getCategoriesFromLocalStorage) {
      state.selectedProductCategories = JSON.parse(getCategoriesFromLocalStorage);
    }
    return state.selectedProductCategories;
  },
  [GettersTypes.GET_SYNC_SCHEDULE](state: LocalState) : boolean {
    return state.requestSynchronizationNow;
  },
};
