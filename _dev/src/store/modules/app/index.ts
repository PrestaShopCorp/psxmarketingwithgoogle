import {state as initialState} from './state';

const {
  psGoogleShoppingApiUrl,
  psGoogleShoppingShopUrl,
  psAccountShopId,
}: any = window;

const state = Object.assign(
  initialState,
  {psGoogleShoppingApiUrl} || '',
  {psGoogleShoppingShopUrl} || '',
  {psAccountShopId} || '',
);

/**
 * Return minimal state with common data for all other stores
 */
export default {
  state,
};
