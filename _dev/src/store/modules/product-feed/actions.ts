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
import {getDataFromLocalStorage} from '../../../utils/LocalStorage';
import {deleteProductFeedDataFromLocalStorage} from '@/utils/LocalStorage';
import {
  CarrierIdentifier, DeliveryDetail, getEnabledCarriers,
  mergeShippingDetailsSourcesForProductFeedConfiguration,
  ShopShippingInterface, validateDeliveryDetail,
} from '../../../providers/shipping-settings-provider';
import Categories from '@/enums/product-feed/attribute-mapping-categories';
import {runIf} from '../../../utils/Promise';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {fromApi, toApi} from '@/providers/shipping-rate-provider';

const changeCountriesNamesToCodes = (countries : Array<string>) => countries.map((country) => {
  for (let i = 0; i < countriesSelectionOptions.length; i += 1) {
    if (country === countriesSelectionOptions[i].country) {
      return countriesSelectionOptions[i].code;
    }
  }

  return country;
});

export default {
  async [ActionsTypes.WARMUP_STORE](
    {dispatch, state, getters},
  ) {
    if (state.warmedUp) {
      return;
    }
    state.warmedUp = true;

    await Promise.allSettled([
      runIf(
        !getters.GET_TOTAL_PRODUCTS_READY_TO_SYNC,
        dispatch(ActionsTypes.GET_TOTAL_PRODUCTS_READY_TO_SYNC),
      ),
      runIf(
        state.prevalidationScanSummary.scannedItems === null,
        dispatch(ActionsTypes.GET_PREVALIDATION_SUMMARY),
      ),
      runIf(
        !getters.GET_PRODUCT_FEED_STATUS.syncSchedule?.length,
        dispatch(ActionsTypes.GET_PRODUCT_FEED_SYNC_STATUS),
      ),
      runIf(
        getters.GET_PRODUCT_FEED_SETTINGS.targetCountries === null,
        dispatch(ActionsTypes.GET_PRODUCT_FEED_SETTINGS),
      ),
      runIf(
        getters.GET_PRODUCT_FEED_VALIDATION_SUMMARY.activeItems === null,
        dispatch(ActionsTypes.GET_PRODUCT_FEED_SYNC_SUMMARY),
      ),
    ]);
  },
  async [ActionsTypes.GET_PRODUCT_FEED_SYNC_STATUS]({commit, rootState}) {
    const params = {
      lang: window.i18nSettings.isoCode,
      timezone: encodeURI(Intl.DateTimeFormat().resolvedOptions().timeZone),
    };
    const url = `${rootState.app.psxMktgWithGoogleApiUrl}/incremental-sync/status/?lang=${params.lang}&timezone=${params.timezone}`;

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
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'success', data: json.success});
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'syncSchedule', data: json.syncSchedule});
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_PRODUCT_FEED_SETTINGS]({commit, rootState}) {
    const params = {
      lang: window.i18nSettings.isoCode,
      timezone: encodeURI(Intl.DateTimeFormat().resolvedOptions().timeZone),
    };
    const url = `${rootState.app.psxMktgWithGoogleApiUrl}/incremental-sync/settings/?lang=${params.lang}&timezone=${params.timezone}`;
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
        name: 'deliveryDetails',
        data: json?.additionalShippingSettings?.deliveryDetails || [],
      });
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'shippingSetup',
        data: json?.shippingSetup || null,
      });

      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'estimateCarriers',
        data: fromApi(json?.estimateCarriers),
      });

      if (json.selectedProductCategories) {
        commit(MutationsTypes.SET_SELECTED_PRODUCT_CATEGORIES, json.selectedProductCategories);
      }
      commit(MutationsTypes.SET_SYNC_SCHEDULE, json?.requestSynchronizationNow || false);
      commit(MutationsTypes.TOGGLE_CONFIGURATION_FINISHED, true);
    } catch (error: any) {
      if (error.code === 404) {
        console.log('Incremental-Sync settings not found: ask user to configure it');
      } else {
        console.error(`HttpClientError: ${error}`);
        commit(MutationsTypes.API_ERROR, true);
      }
    }
  },

  async [ActionsTypes.SEND_PRODUCT_FEED_SETTINGS]({
    state, rootState, getters, commit, dispatch,
  }) {
    const productFeedSettings = state.settings;
    const targetCountries = changeCountriesNamesToCodes(getters.GET_TARGET_COUNTRIES);
    const attributeMapping = getDataFromLocalStorage('productFeed-attributeMapping') || {};
    const estimateCarriers = toApi(getDataFromLocalStorage('productFeed-estimateCarriers'));
    const deliveryFiltered: DeliveryDetail[] = productFeedSettings.deliveryDetails.filter(
      (e) => e.enabledCarrier && validateDeliveryDetail(e),
    );
    const shipping: ShopShippingInterface[] = productFeedSettings.shippingSettings
      .filter(
        (s) => deliveryFiltered.find((d) => s.properties.id_reference === d.carrierId),
      );
    commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
      name: 'attributeMapping', data: attributeMapping,
    });

    const selectedProductCategories = getters.GET_PRODUCT_CATEGORIES_SELECTED;
    const requestSynchronizationNow = getters.GET_SYNC_SCHEDULE;
    const newSettings = {
      autoImportTaxSettings: productFeedSettings.autoImportTaxSettings,
      shippingSetup: productFeedSettings.shippingSetup,
      targetCountries,
      shippingSettings: shipping,
      additionalShippingSettings: {
        deliveryDetails: deliveryFiltered,
      },
      estimateCarriers,
      attributeMapping,
      selectedProductCategories,
      requestSynchronizationNow,
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
      deleteProductFeedDataFromLocalStorage();
      await dispatch(ActionsTypes.REQUEST_ATTRIBUTE_MAPPING);
      await dispatch(ActionsTypes.GET_PRODUCT_FEED_SYNC_STATUS);
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
    await Promise.allSettled([
      dispatch(ActionsTypes.GET_SHOP_SHIPPING_SETTINGS),
      dispatch(ActionsTypes.GET_PRODUCT_FEED_SETTINGS),
    ]);

    // Load existing carriers on PrestaShop
    const enabledCarriersFromShop = getEnabledCarriers(
      state.settings.shippingSettings,
    );
    // Load previous configuration temporarly saved on localStorage
    const deliveryFromStorage = getDataFromLocalStorage('productFeed-deliveryDetails') ?? [];

    if (state.settings.shippingSetup === ShippingSetupOption.ESTIMATE) {
      const getEstimateCarriers = getDataFromLocalStorage('productFeed-estimateCarriers');

      if (getEstimateCarriers !== null) {
        commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
          name: 'estimateCarriers',
          data: getEstimateCarriers,
        });
      }
    }

    const carriersList: DeliveryDetail[] = mergeShippingDetailsSourcesForProductFeedConfiguration(
      enabledCarriersFromShop,
      state.settings.deliveryDetails,
      deliveryFromStorage,
    );

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

  async [ActionsTypes.GET_TOTAL_PRODUCTS_READY_TO_SYNC]({rootState, commit}) {
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
    commit(MutationsTypes.SAVE_TOTAL_PRODUCTS_READY_TO_SYNC, Number(result.total));
    return result;
  },
  async [ActionsTypes.REQUEST_REPORTING_PRODUCTS_STATUSES]({rootState, commit}, nextPage) {
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
    commit(MutationsTypes.SAVE_ALL_PRODUCTS, result.results);
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
    const getMappingFromStorage = getDataFromLocalStorage('productFeed-attributeMapping');

    if (getMappingFromStorage !== null) {
      commit(MutationsTypes.SET_MAPPING_FROM_STORAGE, getMappingFromStorage);
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
  async [ActionsTypes.REQUEST_PRODUCT_CATEGORIES_CHANGED]({rootState, commit}, category) {
    let getSelectedCtg = rootState.productFeed.selectedProductCategories;

    if (category === Categories.NONE) {
      getSelectedCtg = getSelectedCtg.filter((cat) => cat === Categories.NONE);
    }
    if (category !== Categories.NONE && getSelectedCtg.includes(Categories.NONE)) {
      getSelectedCtg = getSelectedCtg.filter((cat) => cat !== Categories.NONE);
    }
    commit(MutationsTypes.SET_SELECTED_PRODUCT_CATEGORIES, getSelectedCtg);
  },
  async [ActionsTypes.GET_PREVALIDATION_PRODUCTS]({rootState, commit, state}) {
    const {limit} = state.preScanDetail;
    const offset = ((state.preScanDetail.currentPage - 1) * limit).toString();
    const lang = state.preScanDetail.langChosen;
    let query = `?limit=${limit}&offset=${offset}`;

    if (lang) {
      query += `&lang=${lang.toLowerCase()}`;
    }
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/product-feeds/prevalidation-scan/errors${query}`, {
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

    commit(MutationsTypes.SET_PRESCAN_TOTAL_PRODUCT, json.totalErrors);
    commit(MutationsTypes.SET_PRESCAN_PRODUCTS, json.errors);

    return json.errors;
  },

  async [ActionsTypes.GET_PREVALIDATION_SUMMARY]({rootState, commit}) {
    const response = await fetch(`${rootState.app.psxMktgWithGoogleApiUrl}/product-feeds/prevalidation-scan/summary`, {
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
    commit(MutationsTypes.SET_PREVALIDATION_SUMMARY, json);
  },
};
