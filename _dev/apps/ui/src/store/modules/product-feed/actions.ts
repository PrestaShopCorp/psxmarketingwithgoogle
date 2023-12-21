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
import {ActionContext} from 'vuex';
import {fetchOnboarding, fetchShop, HttpClientError} from 'mktg-with-google-common';
import MutationsTypes from './mutations-types';
import ActionsTypes from './actions-types';
import {getDataFromLocalStorage, deleteProductFeedDataFromLocalStorage} from '@/utils/LocalStorage';
import {
  CarrierIdentifier, DeliveryDetail, getEnabledCarriers,
  mergeShippingDetailsSourcesForProductFeedConfiguration,
  ShopShippingInterface, validateDeliveryDetail,
} from '@/providers/shipping-settings-provider';
import {runIf} from '@/utils/Promise';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {fromApi, toApi} from '@/providers/shipping-rate-provider';
import {
  ProductFeedSettings, ProductVerificationIssue, ProductVerificationIssueProduct, State,
} from './state';
import {formatMappingToApi} from '@/utils/AttributeMapping';
import {IncrementalSyncContext} from '@/components/product-feed-page/dashboard/feed-configuration/feed-configuration';
import {FullState} from '../..';

type Context = ActionContext<State, FullState>;

// ToDo: Get DTO type from API sources
export const createProductFeedApiPayload = (settings:any) => ({
  autoImportTaxSettings: settings.autoImportTaxSettings,
  shippingSetup: settings.shippingSetup,
  targetCountries: settings.targetCountries,
  ...(
    (settings.shippingSetup === ShippingSetupOption.ESTIMATE) ? {
      rate: settings.rate,
      estimateCarriers: settings.estimateCarriers,
    } : {}
  ),
  ...(
    (settings.shippingSetup === ShippingSetupOption.IMPORT) ? {
      // Send in payload data related to active carriers and active countries on shop
      shippingSettings: settings.shippingSettings?.filter((s) => (
        (s.collection !== 'carriers' || (!!s.properties.active && !s.properties.deleted))
        && (!s.properties.country_ids
          || settings.targetCountries.some((tc: string) => s.properties.country_ids.includes(tc)))),
      ),
      additionalShippingSettings: settings.additionalShippingSettings,
    } : {}
  ),
  attributeMapping: formatMappingToApi(settings.attributeMapping),
  selectedProductCategories: settings.selectedProductCategories,
  requestSynchronizationNow: settings.requestSynchronizationNow,
});

export default {
  async [ActionsTypes.WARMUP_STORE](
    {dispatch, state, getters}: Context,
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
        !getters.GET_PRODUCT_FEED_STATUS.syncSchedule?.length,
        dispatch(ActionsTypes.GET_PRODUCT_FEED_SYNC_STATUS),
      ),
      runIf(
        getters.GET_PRODUCT_FEED_SETTINGS.targetCountries === null,
        dispatch(ActionsTypes.GET_PRODUCT_FEED_SETTINGS),
      ),
      runIf(
        getters.GET_PRODUCT_FEED_VALIDATION_SUMMARY.activeProducts === null,
        dispatch(ActionsTypes.GET_PRODUCT_FEED_SYNC_SUMMARY),
      ),
      runIf(
        !getters.GET_PRODUCT_FEED_SYNC_CONTEXT,
        dispatch(ActionsTypes.REQUEST_PRODUCT_FEED_SYNC_CONTEXT),
      ),
      runIf(
        !state.report.productsInCatalog,
        dispatch(ActionsTypes.REQUEST_PRODUCTS_ON_CLOUDSYNC),
      ),
      runIf(
        !state.report.invalidProducts,
        dispatch(ActionsTypes.REQUEST_VERIFICATION_STATS),
      ),
    ]);
  },
  async [ActionsTypes.GET_PRODUCT_FEED_SYNC_STATUS]({commit}: Context) {
    const params = {
      lang: window.i18nSettings.isoCode,
      timezone: encodeURI(Intl.DateTimeFormat().resolvedOptions().timeZone),
    };
    try {
      const json = await (
        await fetchOnboarding('GET', `incremental-sync/status/?lang=${params.lang}&timezone=${params.timezone}`)
      ).json();
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'jobEndedAt', data: json.jobEndedAt});
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'lastUpdatedAt', data: json.lastUpdatedAt});
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'nextJobAt', data: json.nextJobAt});
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'success', data: json.success});
      commit(MutationsTypes.SET_LAST_SYNCHRONISATION, {name: 'syncSchedule', data: json.syncSchedule});
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_PRODUCT_FEED_SETTINGS](
    {commit}: Context,
  ): Promise<ProductFeedSettings|null> {
    const params = {
      lang: window.i18nSettings.isoCode,
      timezone: encodeURI(Intl.DateTimeFormat().resolvedOptions().timeZone),
    };
    try {
      const json = await (await fetchOnboarding('GET', `incremental-sync/settings/?lang=${params.lang}&timezone=${params.timezone}`)).json();
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
        name: 'rate',
        data: json?.rate || null,
      });
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'estimateCarriers',
        data: json?.estimateCarriers ? fromApi(json.estimateCarriers) : [],
      });

      if (json.selectedProductCategories) {
        commit(MutationsTypes.SET_SELECTED_PRODUCT_CATEGORIES, json.selectedProductCategories);
      }
      commit(MutationsTypes.SET_SYNC_SCHEDULE, json?.requestSynchronizationNow || false);
      commit(MutationsTypes.TOGGLE_CONFIGURATION_FINISHED, true);

      return json;
    } catch (error: any) {
      if (error.code === 404) {
        console.log('Incremental-Sync settings not found: ask user to configure it');
      } else {
        console.error(`HttpClientError: ${error}`);
        commit(MutationsTypes.API_ERROR, true);
      }
      return null;
    }
  },

  async [ActionsTypes.SEND_PRODUCT_FEED_SETTINGS]({
    state, getters, commit,
  }: Context) {
    commit(MutationsTypes.API_ERROR, false);

    const productFeedSettings: ProductFeedSettings = {
      ...state.settings,
    };

    // We prepare the new payload by looking in the localstorage (new settings in draft)
    // and in the API by default.

    // Shipping setup
    //    ...
    // Delivery times & rates - Common
    const targetCountries = getDataFromLocalStorage('productFeed-targetCountries') || productFeedSettings.targetCountries;
    // Delivery times & rates - Import method
    const deliveryFiltered: DeliveryDetail[] = (getDataFromLocalStorage('productFeed-deliveryDetails') || productFeedSettings.deliveryDetails).filter(
      (e: DeliveryDetail) => e.enabledCarrier && validateDeliveryDetail(e),
    );
    const shippingSettingsFromShop: ShopShippingInterface[] = productFeedSettings.shippingSettings
      .filter(
        (s) => deliveryFiltered.find((d) => s.properties.id_reference === d.carrierId),
      );
    // Delivery times & rates - Estimate method
    const rate = getDataFromLocalStorage('productFeed-rateChosen') || productFeedSettings.rate || undefined;
    const estimateCarriers = toApi(
      getDataFromLocalStorage('productFeed-estimateCarriers') || productFeedSettings.estimateCarriers,
    );
    // Attributes mapping
    const attributeMapping = getDataFromLocalStorage('productFeed-attributeMapping') || state.attributeMapping || {};
    const selectedProductCategories = getDataFromLocalStorage('productFeed-selectedProductCategories') || getters.GET_PRODUCT_CATEGORIES_SELECTED;
    // Next synchronization request
    const requestSynchronizationNow = getters.GET_SYNC_SCHEDULE;

    const newSettings = createProductFeedApiPayload({
      autoImportTaxSettings: productFeedSettings.autoImportTaxSettings,
      shippingSetup: productFeedSettings.shippingSetup,
      targetCountries,
      shippingSettings: shippingSettingsFromShop,
      additionalShippingSettings: {
        deliveryDetails: deliveryFiltered,
      },
      rate,
      estimateCarriers,
      attributeMapping,
      selectedProductCategories,
      requestSynchronizationNow,
    });

    try {
      await fetchOnboarding(
        'POST',
        'incremental-sync/settings',
        {body: newSettings},
      );
      commit(MutationsTypes.TOGGLE_CONFIGURATION_FINISHED, true);
      commit(MutationsTypes.SAVE_CONFIGURATION_CONNECTED_ONCE, true);
      deleteProductFeedDataFromLocalStorage();

      // Reset & fill store with data from the configuration we just made.
      // We could call the API to get a fresh version from it,
      // but there is a risk to retrieve the old version when it is overloaded.
      commit(MutationsTypes.REMOVE_PRODUCT_FEED);
      state.settings = {
        ...state.settings,
        ...newSettings,
      } as ProductFeedSettings;
      // Some data were filtered before being sent to the API, i.e to remove diabled carriers.
      // However in the store we need all the data.
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'deliveryDetails',
        data: productFeedSettings.deliveryDetails,
      });
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'shippingSettings',
        data: productFeedSettings.shippingSettings,
      });
      commit(MutationsTypes.SET_ATTRIBUTES_MAPPED, newSettings.attributeMapping);
    } catch (error) {
      commit(MutationsTypes.API_ERROR, true);
      console.error(error);
    }
  },

  async [ActionsTypes.GET_SHOP_SHIPPING_SETTINGS]({commit}: Context) {
    const result = await fetchShop('getCarrierValues');
    commit(MutationsTypes.SAVE_AUTO_IMPORT_SHIPPING_INFORMATIONS, result);
    return result;
  },

  async [ActionsTypes.GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS]({state, commit, dispatch}: Context) {
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
    {state, commit}: Context,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async [ActionsTypes.GET_PRODUCT_FEED_SYNC_SUMMARY]({commit}: Context) {
    commit(MutationsTypes.SET_SYNC_SUMMARY_LOADING, true);
    try {
      const result = await (await fetchOnboarding(
        'GET',
        'product-feeds/stats/gmc',
      )).json();
      commit(MutationsTypes.SET_VALIDATION_SUMMARY, result);
    } catch (error) {
      console.error(error);
    } finally {
      commit(MutationsTypes.SET_SYNC_SUMMARY_LOADING, false);
    }
  },

  async [ActionsTypes.GET_TOTAL_PRODUCTS_READY_TO_SYNC]({commit}: Context) {
    const result = await fetchShop('getProductsReadyToSync');
    commit(MutationsTypes.SAVE_TOTAL_PRODUCTS_READY_TO_SYNC, Number(result.total));
    return result;
  },
  async [ActionsTypes.REQUEST_REPORTING_PRODUCTS_STATUSES]({commit}: Context, nextPage) {
    const nextToken = nextPage ? `?next_token=${nextPage}` : '';
    const result = await (await fetchOnboarding(
      'GET',
      `product-feeds/validation/list${nextToken}`,
    )).json();
    commit(MutationsTypes.SAVE_ALL_PRODUCTS, result.results);
    return result;
  },
  async [ActionsTypes.REQUEST_SYNCHRONISATION]({rootState}: Context, full = false) {
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

  async [ActionsTypes.REQUEST_FULL_SYNCHRONISATION]({dispatch}: Context) {
    dispatch(ActionsTypes.REQUEST_SYNCHRONISATION, true);
  },

  async [ActionsTypes.REQUEST_GOOGLE_SYNCHRONISATION]() {
    await fetchOnboarding(
      'POST',
      'incremental-sync/force-now',
    );
  },
  async [ActionsTypes.REQUEST_SHOP_TO_GET_ATTRIBUTE]({commit}: Context) {
    const json = await fetchShop('getShopAttributes');
    commit(MutationsTypes.SAVE_ATTRIBUTES_SHOP, json);
    return json;
  },
  async [ActionsTypes.REQUEST_ATTRIBUTE_MAPPING]({commit}: Context) {
    try {
      const json = await (await fetchOnboarding(
        'GET',
        'product-feeds/attributes',
      )).json();
      commit(MutationsTypes.SET_ATTRIBUTES_MAPPED, json);
    } catch (error) {
      console.log(error);
    }
  },
  async [ActionsTypes.REQUEST_PRODUCTS_ON_CLOUDSYNC]({commit}: Context) {
    const json: {totalProducts: string} = await (await fetchOnboarding(
      'GET',
      'product-feeds/stats/shop',
    )).json();

    commit(MutationsTypes.SAVE_NUMBER_OF_PRODUCTS_ON_CLOUDSYNC, json.totalProducts);
  },

  // eslint-disable-next-line no-empty-pattern
  async [ActionsTypes.SEND_PRODUCT_FEED_FLAGS]({}: Context, flags) {
    await fetchOnboarding(
      'POST',
      'debug/migration',
      {body: flags},
    );
  },

  async [ActionsTypes.REQUEST_PRODUCT_FEED_SYNC_CONTEXT]({commit}: Context) {
    const json: IncrementalSyncContext = await (await fetchOnboarding(
      'GET',
      'incremental-sync/context/',
    )).json();

    commit(MutationsTypes.SAVE_PRODUCT_FEED_SYNC_CONTEXT, json);
  },

  async [ActionsTypes.REQUEST_VERIFICATION_STATS]({commit}: Context) {
    const json = await (await fetchOnboarding(
      'GET',
      'product-feeds/stats/verification',
    )).json();

    commit(MutationsTypes.SAVE_VERIFICATION_STATS, json);
  },

  async [ActionsTypes.REQUEST_VERIFICATION_ISSUES]({commit}: Context) {
    const json = await (await fetchOnboarding(
      'GET',
      'product-feeds/verification/issues',
    )).json();

    commit(MutationsTypes.SAVE_VERIFICATION_ISSUES, json);
  },

  async [ActionsTypes.REQUEST_VERIFICATION_ISSUE_PRODUCTS](
    {commit}: Context,
    payload: {
      verificationIssue: ProductVerificationIssue,
      limit: number,
      offset: number,
    },
  ) {
    const json: {
      products: ProductVerificationIssueProduct[],
      totalCount: string,
    } = await (await fetchOnboarding(
      'GET',
      `product-feeds/verification/issues/${payload.verificationIssue}/products?limit=${payload.limit}&offset=${payload.offset}`,
    )).json();

    commit(MutationsTypes.SAVE_VERIFICATION_ISSUE_PRODUCTS, {
      originalPayload: payload,
      verificationIssueProducts: json.products,
    });
    commit(MutationsTypes.SAVE_VERIFICATION_ISSUE_NB_OF_PRODUCTS, {
      originalPayload: payload,
      verificationIssueNumberOfProducts: json.totalCount,
    });
  },
};
