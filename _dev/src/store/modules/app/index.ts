import {state as initialState} from './state';
import getters from './getters';

const {
  psGoogleShoppingApiUrl,
  psGoogleShoppingAdminUrl,
  psGoogleShoppingAdminAjaxUrl,
  psGoogleShoppingShopUrl,
  isCountryMemberOfEuropeanUnion,
  psGoogleShoppingShopCurrency,
}: any = window;

const state = Object.assign(
  initialState,
  {psGoogleShoppingApiUrl} || '',
  {psGoogleShoppingAdminUrl} || '',
  {psGoogleShoppingAdminAjaxUrl} || '',
  {psGoogleShoppingShopUrl} || '',
  {isCountryMemberOfEuropeanUnion} || false,
  {psGoogleShoppingShopCurrency} || {},
);

/**
 * Return minimal state with common data for all other stores
 */
export default {
  namespaced: true,
  state,
  getters,
};
