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
  async [ActionsTypes.GET_PRODUCT_FEED_SYNC_STATUS]({commit, rootState}) {
    const params = {
      lang: window.i18nSettings.languageLocale.split('-')[0],
    };
    const url = `${rootState.app.psxMktgWithGoogleApiUrl}/incremental-sync/status/?lang=${params.lang}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
      },
      );
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'jobEndedAt', data: json.jobEndedAt});
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'lastUpdatedAt', data: json.lastUpdatedAt});
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'nextJobAt', data: json.nextJobAt});
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'syncSchedule', data: json.syncSchedule});
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'success', data: json.success});
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_PRODUCT_FEED_SETTINGS]({commit, rootState}) {
    const params = {
      lang: window.i18nSettings.languageLocale.split('-')[0],
    };
    const url = `${rootState.app.psxMktgWithGoogleApiUrl}/incremental-sync/settings/?lang=${params.lang}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'autoImportShippingSettings', data: json.autoImportShippingSettings,
      });
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'targetCountries', data: json.targetCountries[0],
      });
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'autoImportTaxSettings', data: json.autoImportTaxSettings,
      });
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'syncSchedule', data: json.syncSchedule,
      });
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'attributeMapping',
        data: Object.assign(
          (json.attributeMapping?.exportProductsWithShortDescription) ? {
            exportProductsWithShortDescription:
            json.attributeMapping?.exportProductsWithShortDescription,
          } : {},
          (json.attributeMapping?.customColorAttribute) ? {
            customColorAttribute: json.attributeMapping?.customColorAttribute,
          } : {},
          (json.attributeMapping?.customAgeGroupAttribute) ? {
            customAgeGroupAttribute: json.attributeMapping?.customAgeGroupAttribute,
          } : {},
          (json.attributeMapping?.customSizeAttribute) ? {
            customSizeAttribute: json.attributeMapping?.customSizeAttribute,
          } : {},
          (json.attributeMapping?.customGenderGroupAttribute) ? {
            customGenderGroupAttribute:
            json.attributeMapping?.customGenderGroupAttribute,
          } : {},
          (json.attributeMapping?.customConditionAttribute) ? {
            customConditionAttribute: json.attributeMapping?.customConditionAttribute,
          } : {},
        ),
      });
      commit(MutationsTypes.TOGGLE_CONFIGURATION_FINISHED, true);
    } catch (error) {
      if (error.code === 404) {
        console.log('Incremental-Sync settings not found: ask user to configure it');
      } else {
        console.error(`HttpClientError: ${error}`);
        commit(MutationsTypes.API_ERROR, true);
      }
    }
  },

  async [ActionsTypes.SEND_PRODUCT_FEED_SETTINGS]({
    state, rootState, getters, commit,
  }) {
    const productFeedSettings = state.settings;
    const targetCountries = [getters.GET_ACTIVE_COUNTRIES];
    const newSettings = {
      autoImportTaxSettings: productFeedSettings.autoImportTaxSettings,
      autoImportShippingSettings: productFeedSettings.autoImportShippingSettings,
      targetCountries,
      shippingSettings: productFeedSettings.shippingSettings,
      attributeMapping: {
        exportProductsWithShortDescription:
        productFeedSettings?.attributeMapping?.exportProductsWithShortDescription
        || null,
        customConditionAttribute: productFeedSettings?.attributeMapping?.customConditionAttribute
        || null,
        customColorAttribute: productFeedSettings?.attributeMapping?.customColorAttribute
        || null,
        customSizeAttribute: productFeedSettings?.attributeMapping?.customSizeAttribute
        || null,
        customAgeGroupAttribute: productFeedSettings?.attributeMapping?.customAgeGroupAttribute
        || null,
        customGenderGroupAttribute:
        productFeedSettings?.attributeMapping?.customGenderGroupAttribute
        || null,
      },
    };
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/incremental-sync/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) {
        commit(MutationsTypes.API_ERROR, true);
        throw new HttpClientError(response.statusText, response.status);
      }
      const json = await response.json();
      commit(MutationsTypes.TOGGLE_CONFIGURATION_FINISHED, true);
      commit(MutationsTypes.SAVE_CONFIGURATION_CONNECTED_ONCE, true);
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_SHIPPING_SETTINGS]({rootState, commit}) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'getCarrierValues',
      }),
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const result = await response.json();
    commit(MutationsTypes.SAVE_AUTO_IMPORT_SHIPPING_INFORMATIONS, result);
    return result;
  },

  async [ActionsTypes.GET_PRODUCT_FEED_SYNC_SUMMARY]({rootState, commit}) {
    commit(MutationsTypes.SET_SYNC_SUMMARY_LOADING, true);
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/product-feeds/validation/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
        },
      });
      if (!response.ok) {
        throw new HttpClientError(response.statusText, response.status);
      }
      const result = await response.json();
      commit(MutationsTypes.SET_VALIDATION_SUMMARY, result);
    } catch (error) {
      console.error(error);
    } finally {
      commit(MutationsTypes.SET_SYNC_SUMMARY_LOADING, false);
    }
  },

  async [ActionsTypes.GET_TOTAL_PRODUCTS]({rootState, commit}) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'getProductsReadyToSync',
      }),
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const result = await response.json();
    commit(MutationsTypes.SAVE_TOTAL_PRODUCTS, Number(result.total));
    return result;
  },
  async [ActionsTypes.REQUEST_REPORTING_PRODUCTS_STATUSES]({rootState}, nextPage) {
    const nextToken = nextPage ? `?next_token=${nextPage}` : '';
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/product-feeds/validation/list${nextToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
      },
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
    const result = await response.json();
    return result;
  },
};
