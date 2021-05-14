import {state as initialState} from './state';
import getters from './getters';

const {
  psGoogleShoppingApiUrl,
  psGoogleShoppingShopUrl,
  psAccountShopId,
  isCompatibleForCss,
}: any = window;

const state = Object.assign(
  initialState,
  {psGoogleShoppingApiUrl} || '',
  {psGoogleShoppingShopUrl} || '',
  {psAccountShopId} || '',
  {isCompatibleForCss} || null,
);

/**
 * Return minimal state with common data for all other stores
 */
export default {
  namespaced: true,
  state,
  getters,
};
