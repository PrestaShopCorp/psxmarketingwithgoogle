import {state as initialState} from './state';
import getters from './getters';

const {
  psGoogleShoppingApiUrl,
  psGoogleShoppingAdminUrl,
  psGoogleShoppingShopUrl,
  isCountryMemberOfEuropeanUnion,
}: any = window;

const state = Object.assign(
  initialState,
  {psGoogleShoppingApiUrl} || '',
  {psGoogleShoppingAdminUrl} || '',
  {psGoogleShoppingShopUrl} || '',
  {isCountryMemberOfEuropeanUnion} || false,
);

/**
 * Return minimal state with common data for all other stores
 */
export default {
  namespaced: true,
  state,
  getters,
};
