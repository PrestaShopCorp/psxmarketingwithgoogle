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
import semver from 'semver';
import GettersTypes from './getters-types';
import {State as LocalState, HelpInformations, DebugData} from './state';
import countriesSelectionOptions from '../../../assets/json/countries.json';
import symbols from '@/assets/json/symbols.json';
import prestashopUrls from '@/assets/json/prestashopUrl.json';

export default {
  [GettersTypes.GET_IS_COUNTRY_MEMBER_OF_EU](state: LocalState): boolean {
    return state.isCountryMemberOfEuropeanUnion;
  },
  [GettersTypes.GET_CURRENT_LANGUAGE](): string {
    return (new Intl.Locale(window.i18nSettings.languageLocale)).language;
  },
  [GettersTypes.GET_CURRENT_CURRENCY](state: LocalState): string {
    return state.psxMktgWithGoogleShopCurrency.isoCode;
  },
  [GettersTypes.GET_SHOP_CURRENCIES](state: LocalState): string[] {
    return state.psxMktgWithGoogleActiveCurrencies;
  },
  [GettersTypes.GET_DOC_AND_FAQ](state: LocalState): HelpInformations {
    return state.psxMktgWithGoogleDocumentAndFaq;
  },
  [GettersTypes.GET_SUPPORT_URL](
    state: LocalState, getters, rootState, rootGetters,
  ): string {
    const {domain} = rootGetters['accounts/GET_PS_ACCOUNTS_CONTEXT'].currentShop;
    const languageCode = rootGetters[`app/${GettersTypes.GET_CURRENT_LANGUAGE}`];

    return `${prestashopUrls.contactForm[languageCode] ?? prestashopUrls.contactForm.en}?form=support&subject=psgoogle&url=${domain}`;
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
  [GettersTypes.GET_PRODUCTS_CATALOG_URL](state: LocalState): string {
    return state.psxMktgWithGoogleProductsUrl;
  },
  [GettersTypes.GET_CURRENCIES_URL](state: LocalState): string {
    return state.psxMktgWithGoogleCurrenciesUrl;
  },
  [GettersTypes.GET_LANGUAGES_URL](state: LocalState): string {
    return state.psxMktgWithGoogleLanguagesUrl;
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
    const filterByActiveCountriesOnShop = countriesSelectionOptions.filter(
      (country) => state.psxMktgWithGoogleActiveCountries.includes(country.code),
    );

    return filterByActiveCountriesOnShop.reduce((ids : string[], obj) => {
      if (
        // PHP Module providing ONLY default currency
        obj.currency === state.psxMktgWithGoogleShopCurrency.isoCode
        // PHP Module providing all shop currencies
        || state.psxMktgWithGoogleActiveCurrencies.includes(obj.currency)
      ) {
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

      return currencyFormatted.replace(/[\s.,0]*/, '');
    } catch (error) {
      const currency = symbols.find((c) => c.currency === currentCurrency);

      return currency ? currency.symbol : '';
    }
  },
  [GettersTypes.GET_MODULE_NEED_UPGRADE]: (
    state: LocalState,
  ) => (
    moduleName: 'psxmarketingwithgoogle' | 'ps_eventbus',
    currentVesion?: string,
    versionNeeded?: string,
  ) => {
    if (moduleName === 'psxmarketingwithgoogle') {
      return !semver.gte(
        versionNeeded ?? state.psxMktgWithGoogleModuleVersion,
        currentVesion ?? state.psxMktgWithGoogleModuleVersionNeeded,
      );
    } if (moduleName === 'ps_eventbus' && currentVesion) {
      return !semver.gte(currentVesion, state.cloudsyncVersionNeeded);
    }
    throw new Error('Module name not found or the current version is missing');
  },

  [GettersTypes.GET_BILLING_SUBSCRIPTION_ACTIVE](state: LocalState): boolean {
    return !!state.billing.subscription
      // Using the type from billing-cdc prevents the module to work
      && state.billing.subscription.status !== 'cancelled';
  },
  [GettersTypes.GET_BILLING_SUBSCRIPTION_EXPIRING](state: LocalState): boolean {
    return !!state.billing.subscription
      && !!state.billing.subscription.cancelled_at;
  },
};
