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
import countriesSelectionOptions from '../../../assets/json/countries.json';
import {
  Carrier, CarrierIdentifier, DeliveryDetail, getEnabledCarriers,
} from '../../../providers/shipping-settings-provider';

const changeCountriesNamesToCodes = (countries : Array<string>) => countries.map((country) => {
  for (let i = 0; i < countriesSelectionOptions.length; i += 1) {
    if (country === countriesSelectionOptions[i].country) {
      return countriesSelectionOptions[i].code;
    }
  }
  return country;
});

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
        name: 'targetCountries', data: json.targetCountries,
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
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'deliveryDetails',
        data: json?.additionalShippingSettings?.deliveryDetails || [],
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
    state, rootState, rootGetters, commit,
  }) {
    const productFeedSettings = state.settings;
    const targetCountries = changeCountriesNamesToCodes(rootGetters['app/GET_ACTIVE_COUNTRIES']);
    const attributeMapping = JSON.parse(localStorage.getItem('productFeed-attributeMapping') || '{}');
    const newSettings = {
      autoImportTaxSettings: productFeedSettings.autoImportTaxSettings,
      autoImportShippingSettings: productFeedSettings.autoImportShippingSettings,
      targetCountries,
      shippingSettings: productFeedSettings.shippingSettings,
      additionalShippingSettings: {
        deliveryDetails: productFeedSettings.deliveryDetails.filter((e) => e.enabledCarrier),
      },
      attributeMapping,
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
      localStorage.removeItem('productFeed-deliveryDetails');
      localStorage.removeItem('productFeed-attributeMapping');
      localStorage.removeItem('productFeed-autoImport');
      localStorage.removeItem('productFeed-targetCountries');
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_SHOP_SHIPPING_SETTINGS]({rootState, commit}) {
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

  async [ActionsTypes.GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS]({state, commit, dispatch}) {
    // TODO: These call may be already done, so we might remove them
    await dispatch(ActionsTypes.GET_SHOP_SHIPPING_SETTINGS);
    await dispatch(ActionsTypes.GET_PRODUCT_FEED_SETTINGS);

    // Load existing carriers on PrestaShop
    const enabledCarriersFromShop = getEnabledCarriers(
      state.settings.shippingSettings,
    );
    // Load previous configuration temporarly saved on localStorage
    const deliveryFromStorage = JSON.parse(localStorage.getItem('productFeed-deliveryDetails') || '[]');

    // Carriers will be all enabled by default if nothing has been configured yet
    const enableCarriersByDefault = !deliveryFromStorage.length
      && !state.settings.deliveryDetails.length;

    // Build carriers list based from PHP data, and on previous configuration in localStorage + API
    const carriersList: DeliveryDetail[] = enabledCarriersFromShop.map((carrierFromShop) => {
      const deliveryDetailsSavedInLocalStorage = deliveryFromStorage.find((c : DeliveryDetail) => (
        (c.carrierId === carrierFromShop.carrierId) && (c.country === carrierFromShop.country)
      ));

      if (deliveryDetailsSavedInLocalStorage) {
        // Add key deliveryType if carrier is from localStorage so it can be changed
        deliveryFromStorage.forEach((c: DeliveryDetail) => {
          if ('deliveryType' in c) {
            return;
          }
          c.deliveryType = null;
        });
        return deliveryDetailsSavedInLocalStorage;
      }

      const deliveryDetailsSavedOnAPI = state.settings.deliveryDetails.find(
        (deliveryDetail: DeliveryDetail) => deliveryDetail.carrierId === carrierFromShop.carrierId
                && carrierFromShop.country === deliveryDetail.country);
      if (deliveryDetailsSavedOnAPI) {
        return {
          enabledCarrier: true,
          ...carrierFromShop,
          ...deliveryDetailsSavedOnAPI,
        };
      }

      return {
        enabledCarrier: enableCarriersByDefault,
        deliveryType: undefined,
        minHandlingTimeInDays: undefined,
        maxHandlingTimeInDays: undefined,
        minTransitTimeInDays: undefined,
        maxTransitTimeInDays: undefined,
        ...carrierFromShop,
      };
    });
    commit(MutationsTypes.SAVE_SHIPPING_SETTINGS, carriersList);
  },

  [ActionsTypes.DUPLICATE_DELIVERY_DETAILS](
    {state, commit},
    payload: {sourceCarrier: CarrierIdentifier, destinationCarriers: CarrierIdentifier[]},
  ) {
    const carriersList = [...state.settings.deliveryDetails];
    const indexToCopy = carriersList
      .findIndex((e) => e.carrierId === payload.sourceCarrier.carrierId
        && e.country === payload.sourceCarrier.country,
      );
    const indexesToReceiveCopy = payload.destinationCarriers
      .map((destinationCarrier) => carriersList
        .findIndex((e) => e.carrierId === destinationCarrier.carrierId
          && e.country === destinationCarrier.country,
        ),
      );

    const {
      name, delay, country, carrierId, ...sourceCarrierData
    } = carriersList[indexToCopy];

    indexesToReceiveCopy.forEach((index) => {
      carriersList.splice(index, 1, {
        ...carriersList[index],
        ...sourceCarrierData,
      });
    });
    commit(MutationsTypes.SAVE_SHIPPING_SETTINGS, carriersList);
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
  async [ActionsTypes.REQUEST_SYNCHRONISATION]({rootState}, full = false) {
    const response = await fetch(`https://eventbus-sync.psessentials.net/sync/trigger${full ? '-full' : ''}`, {
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
  },

  async [ActionsTypes.REQUEST_FULL_SYNCHRONISATION]({dispatch}) {
    dispatch(ActionsTypes.REQUEST_SYNCHRONISATION, true);
  },

  async [ActionsTypes.REQUEST_GOOGLE_SYNCHRONISATION]({rootState}) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/incremental-sync/force-now`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
      },
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }
  },
  async [ActionsTypes.REQUEST_SHOP_TO_GET_ATTRIBUTE]({rootState, commit}) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleAdminAjaxUrl}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        action: 'getShopAttributes',
      }),
    });
    if (!response.ok) {
      throw new HttpClientError(response.statusText, response.status);
    }

    const json = await response.json();
    commit(MutationsTypes.SAVE_ATTRIBUTES_SHOP, json);
    return json;
  },
  async [ActionsTypes.REQUEST_ATTRIBUTE_MAPPING]({rootState, commit}) {
    const getMappingFromStorage = localStorage.getItem('productFeed-attributeMapping');
    if (getMappingFromStorage !== null) {
      commit(MutationsTypes.SET_ATTRIBUTES_MAPPED, JSON.parse(getMappingFromStorage || '{}'));
      return;
    }
    try {
      const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/product-feeds/attributes`, {
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
      commit(MutationsTypes.SET_ATTRIBUTES_MAPPED, json);
    } catch (error) {
      console.log(error);
    }
  },
};
