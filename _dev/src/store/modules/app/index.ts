import {state as initialState} from './state';
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
}: any = window;

const state = Object.assign(
  initialState,
  {psxMktgWithGoogleApiUrl} || '',
  {psxMktgWithGoogleAdminUrl} || '',
  {psxMktgWithGoogleAdminAjaxUrl} || '',
  {psxMktgWithGoogleShopUrl} || '',
  {isCountryMemberOfEuropeanUnion} || false,
  {psxMktgWithGoogleShopCurrency} || {},
);

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
