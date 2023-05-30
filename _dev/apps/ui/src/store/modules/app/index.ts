import {state as initialState, State} from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const {
  psxMktgWithGoogleApiUrl,
  psxMktgWithGoogleAdminUrl,
  psxMktgWithGoogleAdminAjaxUrl,
  psxMktgWithGoogleShopUrl,
  isCountryMemberOfEuropeanUnion,
  psxMktgWithGoogleShopCurrency,
  psVersion,
  phpVersion,
  psxMktgWithGoogleModuleVersion,
  psxMktgWithGoogleMaintenanceSettingsUrl,
  psxMktgWithGoogleCarriersUrl,
  psxMktgWithGoogleAttributesUrl,
  psxMktgWithGoogleProductsUrl,
  psxMktgWithGoogleCurrenciesUrl,
  psxMktgWithGoogleLanguagesUrl,
  psxMktgWithGoogleProductDetailUrl,
  psxMktgWithGoogleStoreSettingsUrl,
  psxMtgWithGoogleDefaultShopCountry,
  psxMktgWithGoogleActiveCountries,
  psxMktgWithGoogleOnProductionEnvironment,
  psxMktgWithGoogleEnableLink,
  psxMktgWithGoogleModuleIsEnabled,
} = window;

const state: State = {
  ...initialState,
  psxMktgWithGoogleApiUrl: psxMktgWithGoogleApiUrl || '',
  psxMktgWithGoogleAdminUrl: psxMktgWithGoogleAdminUrl || '',
  psxMktgWithGoogleAdminAjaxUrl: psxMktgWithGoogleAdminAjaxUrl || '',
  psxMktgWithGoogleShopUrl: psxMktgWithGoogleShopUrl || '',
  isCountryMemberOfEuropeanUnion: isCountryMemberOfEuropeanUnion || false,
  psxMktgWithGoogleShopCurrency: psxMktgWithGoogleShopCurrency || {},
  psVersion: psVersion || '',
  phpVersion: phpVersion || '',
  psxMktgWithGoogleModuleVersion: psxMktgWithGoogleModuleVersion || '',
  psxMktgWithGoogleMaintenanceSettingsUrl: psxMktgWithGoogleMaintenanceSettingsUrl || '',
  psxMktgWithGoogleProductsUrl: psxMktgWithGoogleProductsUrl || document.querySelector('#subtab-AdminProducts a')?.getAttribute('href') || '',
  psxMktgWithGoogleCurrenciesUrl: psxMktgWithGoogleCurrenciesUrl || document.querySelector('#subtab-AdminCurrencies a')?.getAttribute('href') || '',
  psxMktgWithGoogleLanguagesUrl: psxMktgWithGoogleLanguagesUrl || document.querySelector('#subtab-AdminLocalization a')?.getAttribute('href') || '',
  psxMktgWithGoogleProductDetailUrl: psxMktgWithGoogleProductDetailUrl || '',
  psxMktgWithGoogleStoreSettingsUrl: psxMktgWithGoogleStoreSettingsUrl || '',
  psxMtgWithGoogleDefaultShopCountry: psxMtgWithGoogleDefaultShopCountry || '',
  psxMktgWithGoogleActiveCountries: psxMktgWithGoogleActiveCountries || [],
  psxMktgWithGoogleEnableLink: psxMktgWithGoogleEnableLink || '',
  psxMktgWithGoogleModuleIsEnabled: psxMktgWithGoogleModuleIsEnabled || true,
  psxMktgWithGoogleOnProductionEnvironment: psxMktgWithGoogleOnProductionEnvironment || false,
  psxMktgWithGoogleCarriersUrl: psxMktgWithGoogleCarriersUrl || document.querySelector('#subtab-AdminCarriers a')?.getAttribute('href') || '',
  psxMktgWithGoogleAttributesUrl: psxMktgWithGoogleAttributesUrl || document.querySelector('#subtab-AdminParentAttributesGroups a')?.getAttribute('href') || '',
};

/**
 * Return minimal state with common data for all other stores
 */
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
