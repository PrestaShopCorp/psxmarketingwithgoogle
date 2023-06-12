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
  PreScanReporting,
  VerificationStats,
  ProductVerificationIssueOverall,
  ProductVerificationIssueProduct,
  ProductVerificationIssue,
} from './state';
import GettersTypes from './getters-types';
import {filterCountriesCompatible} from '@/utils/TargetCountryValidator';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';
import {AttributeResponseFromAPI} from '@/utils/AttributeMapping';
import {CustomCarrier} from '@/providers/shipping-rate-provider';
import {SelectedProductCategories} from '@/enums/product-feed/attribute-mapping-categories';
import {IncrementalSyncContext} from '@/components/product-feed-page/dashboard/feed-configuration/feed-configuration';

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
  [GettersTypes.GET_TOTAL_PRODUCTS_READY_TO_SYNC](state: LocalState): number {
    return state.totalProducts;
  },
  [GettersTypes.GET_PRODUCT_FEED_VERIFICATION_STATS](state: LocalState) :
  VerificationStats {
    return {
      productsInCatalog: state.report.productsInCatalog,

      invalidProducts: state.report.invalidProducts,
      validProducts: state.report.validProducts,
    };
  },
  [GettersTypes.GET_PRODUCT_FEED_VERIFICATION_ISSUES](state: LocalState) :
    ProductVerificationIssueOverall[]|null {
    return state.verificationIssues;
  },
  [GettersTypes.GET_PRODUCT_FEED_VERIFICATION_ISSUE_PRODUCTS](state: LocalState) {
    return (
      verificationIssue: ProductVerificationIssue,
      numberOfProducts: number,
      offset: number,
    ): ProductVerificationIssueProduct[]|null => {

      const startOfArray = numberOfProducts * offset;
      if (!state.verificationIssuesProducts[verificationIssue]) {
        return null;
      }
      if (state.verificationIssuesProducts[verificationIssue].length < startOfArray) {
        return null;
      }
      return state.verificationIssuesProducts[verificationIssue].slice(startOfArray, startOfArray + numberOfProducts) || null;
    }
  },
  [GettersTypes.GET_PRODUCT_FEED_VERIFICATION_ISSUE_NB_OF_PRODUCTS](state: LocalState) {
    return (
      verificationIssue: ProductVerificationIssue,
    ): number|null => {
      return state.verificationIssuesNumberOfProducts[verificationIssue]|| null;
    }
  },
  [GettersTypes.GET_PRODUCT_FEED_VALIDATION_SUMMARY](state: LocalState) :
  ProductFeedValidationSummary {
    return state.validationSummary;
  },
  [GettersTypes.GET_SYNC_STATUS](state: LocalState, getters) : string {
    if (getters.GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION) {
      return 'warning';
    }
    if (!state.status.success && !state.status.nextJobAt) {
      return 'schedule';
    }
    if (!state.status.success && state.status.jobEndedAt) {
      return 'failed';
    }
    if (!state.status.success
      && state.status.nextJobAt
      && !state.status.jobEndedAt) {
      return 'planned';
    }
    return 'success';
  },
  [GettersTypes.GET_FREE_LISTING_ATTRIBUTES_TO_MAP](state: LocalState): any {
    return state.attributesToMap;
  },
  [GettersTypes.GET_SHOP_ATTRIBUTES](state: LocalState) : AttributesInfos[] {
    return state.attributesFromShop;
  },
  [GettersTypes.GET_TARGET_COUNTRIES](
    state: LocalState,
    getters,
    rootState) : string[] | null {
    if (state.settings.targetCountries !== null) {
      return state.settings.targetCountries;
    }
    if (rootState.app.psxMtgWithGoogleDefaultShopCountry !== null) {
      return filterCountriesCompatible(rootState.app.psxMtgWithGoogleDefaultShopCountry);
    }
    return null;
  },
  [GettersTypes.GET_PRODUCT_CATEGORIES_SELECTED](state: LocalState) : SelectedProductCategories {
    return state.selectedProductCategories;
  },
  [GettersTypes.GET_SYNC_SCHEDULE](state: LocalState) : boolean {
    const requestSyncNow = getDataFromLocalStorage('productFeed-requestSynchronizationNow');

    if (requestSyncNow !== null) {
      state.requestSynchronizationNow = requestSyncNow;
    }

    return state.requestSynchronizationNow;
  },
  // TODO: Remove
  [GettersTypes.GET_PRESCAN_LIMIT_PAGE](state: LocalState): number {
    return state.preScanDetail.limit;
  },
  [GettersTypes.GET_PRESCAN_NEXT_PAGE](state: LocalState): number {
    return state.preScanDetail.currentPage;
  },
  [GettersTypes.GET_PRESCAN_TOTAL_ERROR](state: LocalState): number {
    return state.preScanDetail.total;
  },
  [GettersTypes.GET_PRESCAN_LANGUAGE_CHOSEN](state: LocalState): string {
    return state.preScanDetail.langChosen;
  },
  [GettersTypes.GET_PRESCAN_PRODUCTS](state: LocalState): PreScanReporting[] {
    return state.preScanDetail.products;
  },
  // End of TODO
  [GettersTypes.GET_ATTRIBUTE_MAPPING](state: LocalState): AttributeResponseFromAPI {
    return state.attributeMapping;
  },
  [GettersTypes.GET_SHIPPING_SETUP](state: LocalState) {
    const setupSelected = getDataFromLocalStorage('productFeed-shippingSetup');

    if (setupSelected !== null) {
      state.settings.shippingSetup = setupSelected;
    }

    return state.settings.shippingSetup;
  },
  [GettersTypes.GET_STEP](state: LocalState): number {
    if (state.isConfigured) {
      return state.stepper;
    }

    if (getDataFromLocalStorage('productFeed-shippingSetup') !== null) {
      state.stepper = 2;
    }
    if (getDataFromLocalStorage('productFeed-targetCountries') !== null) {
      state.stepper = 3;
    }
    if (getDataFromLocalStorage('productFeed-attributeMapping') !== null) {
      state.stepper = 4;
    }
    if (getDataFromLocalStorage('productFeed-requestSynchronizationNow') !== null) {
      state.stepper = 5;
    }

    return state.stepper;
  },
  [GettersTypes.GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION](state: LocalState): boolean {
    // Merchants used to be able to choose to configure their carriers later on GMC.
    // With the new shipping settings, we require merchants to redo their product feed
    // when they didn't configure any carrier.
    return state.settings.shippingSetup === null
      && state.settings.autoImportShippingSettings === false;
  },
  [GettersTypes.GET_ESTIMATE_CARRIERS](state: LocalState): CustomCarrier[] {
    return state.settings.estimateCarriers;
  },
  [GettersTypes.GET_PRODUCT_FEED_SYNC_CONTEXT](
    state: LocalState,
  ): IncrementalSyncContext|null {
    return state.report.lastConfigurationUsed;
  },
};
