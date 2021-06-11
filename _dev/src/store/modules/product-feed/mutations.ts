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
import MutationsTypes from './mutations-types';
import {State as LocalState} from './state';

type payloadObject = {
  name: string, data: string
}

export default {
  [MutationsTypes.SET_VALIDATION_LIST_STATEMENT](state: LocalState, payload: any) {
    state.freeListing.validationList = payload;
  },
  [MutationsTypes.SET_SUMMARY_VALIDATION](state: LocalState, payload: any) {
    state.freeListing.summaryValidationList = payload;
  },
  [MutationsTypes.SET_FREE_LISTING_STATUS](state: LocalState, payload: any) {
    state.freeListing.status = payload;
  },
  [MutationsTypes.SET_LAST_SYNCHRONISATION](state: LocalState, payload: payloadObject) {
    state.productFeed.status[payload.name] = payload.data;
  },
  [MutationsTypes.SET_REGISTERED_DATA_SYNC](state: LocalState, payload: any) {
    state.productFeed.status.registerSyncData = payload;
  },
  [MutationsTypes.SET_SUSPENDED_DATA_SYNC](state: LocalState, payload: boolean) {
    state.productFeed.status.isSyncEnabled = payload;
  },

  //  Product Feed Card
  [MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS](state: LocalState, payload: payloadObject) {
    state.productFeed.settings[payload.name] = payload.data;
  },


  [MutationsTypes.TOGGLE_CONFIGURATION_STARTED](state: LocalState) {
    state.productFeed.isConfigurationStarted = !state.productFeed.isConfigurationStarted;
  },

  [MutationsTypes.TOGGLE_CONFIGURATION_FINISHED](state: LocalState, payload: boolean) {
    state.productFeed.isConfigured = payload;
  },

  [MutationsTypes.SET_ACTIVE_CONFIGURATION_STEP](state: LocalState, payload: number) {
    state.productFeed.stepper = payload;
  },
};
