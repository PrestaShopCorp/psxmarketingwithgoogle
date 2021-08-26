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
  [GettersTypes.GET_MERCHANT_SELL_APPAREL_AND_ACCESSORIES](state: LocalState): boolean {
    return !!state.settings.attributeMapping?.customColorAttribute
          || !!state.settings.attributeMapping?.customSizeAttribute
          || !!state.settings.attributeMapping?.customAgeGroupAttribute
          || !!state.settings.attributeMapping?.customGenderGroupAttribute;
  },
  [GettersTypes.GET_MERCHANT_SELL_REFURBISHED_PRODUCTS](state: LocalState): boolean {
    return !!state.settings.attributeMapping?.customConditionAttribute;
  },
  [GettersTypes.GET_ACTIVE_COUNTRIES](state: LocalState) : Array<string> | null {
    if (state.settings.targetCountries !== null) {
      return state.settings.targetCountries;
    }
    if (state.psxMtgWithGoogleDefaultShopCountry !== null) {
      return [state.psxMtgWithGoogleDefaultShopCountry];
    }
    return null;
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
};
