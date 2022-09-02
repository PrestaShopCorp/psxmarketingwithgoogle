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
import GettersTypes from './getters-types';
import {State as LocalState, HelpInformations, DebugData} from './state';
import countriesSelectionOptions from '../../../assets/json/countries.json';
import symbols from '@/assets/json/symbols.json';

export default {
  [GettersTypes.GET_IS_COUNTRY_MEMBER_OF_EU](state: LocalState): boolean {
    return state.isCountryMemberOfEuropeanUnion;
  },
  [GettersTypes.GET_CURRENT_CURRENCY](state: LocalState): string {
    return state.psxMktgWithGoogleShopCurrency.isoCode;
  },
  [GettersTypes.GET_DOC_AND_FAQ](state: LocalState): HelpInformations {
    return state.psxMktgWithGoogleDocumentAndFaq;
  },
  [GettersTypes.GET_DEBUG_DATA](state: LocalState): DebugData {
    return state.debugData;
  },
  [GettersTypes.GET_STATUS_SHOP_MAINTENANCE](state: LocalState): boolean {
    return state.shopIsOnMaintenanceMode;
  },
  [GettersTypes.GET_CARRIERS_URL](state: LocalState): string {
    return state.psxMktgWithGoogleCarriersUrl;
  },
  [GettersTypes.GET_ATTRIBUTES_URL](state: LocalState): string {
    return state.psxMktgWithGoogleAttributesUrl;
  },
  [GettersTypes.GET_PRODUCT_DETAIL_BASE_URL](state: LocalState): string {
    return state.psxMktgWithGoogleProductDetailUrl;
  },
  [GettersTypes.GET_STORE_INFORMATION_URL](state: LocalState): string {
    return state.psxMktgWithGoogleStoreSettingsUrl;
  },
  [GettersTypes.GET_ADD_BLOCKER_STATUS](state: LocalState): boolean {
    return state.adBlockerExists;
  },
  [GettersTypes.GET_ACTIVE_COUNTRIES](): string[] {
    return countriesSelectionOptions.map((e) => e.country);
  },
  [GettersTypes.GET_ACTIVE_COUNTRIES_FOR_ACTIVE_CURRENCY](state: LocalState) : string[] {
    return countriesSelectionOptions.reduce((ids : string[], obj) => {
      if (obj.currency === state.psxMktgWithGoogleShopCurrency.isoCode) {
        ids.push(obj.country);
      }
      return ids;
    }, []);
  },
  [GettersTypes.GET_SYMBOL_OF_CURRENT_CURRENCY](state: LocalState, getters) {
    const currentCurrency = state.psxMktgWithGoogleShopCurrency.isoCode;
    const countrySelected = getters['productFeed/GET_TARGET_COUNTRIES'];
    try {
      const displayAmount = 0;
      const country = countrySelected[0];
      const currencyFormatted = displayAmount.toLocaleString(country, {
        style: 'currency',
        currency: currentCurrency,
      });

      return currencyFormatted.replace(/[ .,0]*/, '');
    } catch (error) {
      const currency = symbols.find((c) => c.currency === currentCurrency);

      return currency ? currency.symbol : '';
    }
  },
};
