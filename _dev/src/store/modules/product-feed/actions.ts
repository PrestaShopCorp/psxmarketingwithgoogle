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
import ActionsTypes from './actions-types';
import HttpClientError from '../../../utils/HttpClientError';

export default {
  async [ActionsTypes.GET_VALIDATION_LIST]({commit, rootState}) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`);
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_VALIDATION_LIST_STATEMENT, json);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_SUMMARY_VALIDATION]({commit, rootState}) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`);
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_SUMMARY_VALIDATION, json);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.SEND_FREE_LISTING_STATEMENT]({commit, rootState}, payload: any) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_FREE_LISTING_STATUS, json);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_LAST_SYNCHRONISATION]({commit, rootState}) {
    //  TODO : CONNECT BACKEND
    // try {
    //   const response = await fetch(
    //     `${rootState.app.psGoogleShoppingApiUrl}/incremental-sync/status`
    //   );
    //   if (!response.ok) {
    //     throw new HttpClientError(response.statusText, response.status);
    //   }
    //   const json = await response.json();
    // ! FOR TESTING ONLY / WAINTING FOR THE BACKEND TO BE CONNECTED AND CALLED
    const json = {
      jobEndedAt: '2021-04-13T13:59:01.440Z',
      nextJobAt: '2021-05-13T13:59:01.440Z',
      shopHealthy: true,
      successfulSyncs: [
        'info',
        'modules',
        'themes',
      ],
      failedSyncs: [
        /* 'products',
        'google-taxonomies', */
      ],
      suspended: true,
    };
    commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'lastSync', data: json.jobEndedAt});
    commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'nextSync', data: json.nextJobAt});
    commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'isSyncEnabled', data: json.suspended});
    commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'successfulSyncs', data: json.successfulSyncs});
    commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'failedSyncs', data: json.failedSyncs});
    // } catch (error) {
    //   console.error(error);
    // }
  },

  async [ActionsTypes.REGISTER_SYNCHRONISATION]({commit, rootState}, payload: any) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/...`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_REGISTERED_DATA_SYNC, json);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.TOGGLE_SYNCHRONIZATION]({commit, rootState}, payload: boolean) {
    commit(MutationsTypes.SET_SUSPENDED_DATA_SYNC,
      !rootState.productFeed.productFeed.status.isSyncEnabled);
    const route = payload ? `${rootState.app.psGoogleShoppingApiUrl}/incremental-sync/register`
      : `${rootState.app.psGoogleShoppingApiUrl}/incremental-sync/suspend`;
    try {
      const response = await fetch(route, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      response.json();
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_PRODUCT_FEED_SETTINGS]({commit, rootState}) {
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/incremental-sync/settings`);
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {name: 'autoImportShippingSettings', data: json.autoImportShippingSettings});
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {name: 'targetCountries', data: json.targetCountries});
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {name: 'autoImportTaxSettings', data: json.autoImportTaxSettings});
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'sellApparel',
        data: Object.assign(
          (json.customColorAttribute) ? {color: json.customColorAttribute} : {},
          (json.customAgeGroupAttribute) ? {age: json.customAgeGroupAttribute} : {},
          (json.customSizeAttribute) ? {size: json.customSizeAttribute} : {},
          (json.customGenderGroupAttribute) ? {gender: json.customGenderGroupAttribute} : {},
        ),
      });
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'sellRefurbished',
        data: Object.assign(
          (json.customConditionAttribute) ? {condition: json.customConditionAttribute} : {},
        ),
      });
      commit(MutationsTypes.TOGGLE_CONFIGURATION_FINISHED, true);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.SEND_PRODUCT_FEED_SETTINGS]({state, rootState}) {
    const productFeedSettings = state.productFeed.settings;
    const newSettings = {
      autoImportTaxSettings: productFeedSettings.autoImportTaxSettings,
      autoImportShippingSettings: productFeedSettings.autoImportShippingSettings,
      exportProductsWithShortDescription: productFeedSettings.exportProductsWithShortDescription,
      targetCountries: productFeedSettings.targetCountries,
      customConditionAttribute: productFeedSettings?.sellRefurbished?.condition || null,
      customColorAttribute: productFeedSettings?.sellApparel?.color || null,
      customSizeAttribute: productFeedSettings?.sellApparel?.size || null,
      customAgeGroupAttribute: productFeedSettings?.sellApparel?.age || null,
      customGenderGroupAttribute: productFeedSettings?.sellApparel?.gender || null,
    };
    try {
      const response = await fetch(`${rootState.app.psGoogleShoppingApiUrl}/incremental-sync/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      response.json();
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_SHIPPING_SETTINGS]({rootState}) {
    const response = await fetch(`${rootState.app.psGoogleShoppingAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'getCarrierValues',
      }),
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    return response.json();
  },
};
