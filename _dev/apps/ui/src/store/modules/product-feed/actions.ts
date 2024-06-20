import {HttpClientError, fetchOnboarding, fetchShop} from 'mktg-with-google-common';
import type {ActionContext} from 'vuex';
import type {IncrementalSyncContext} from '@/components/product-feed-page/dashboard/feed-configuration/feed-configuration';
import type {ProductIssue} from '@/components/render-issues/types';
import type ProductsStatusType from '@/enums/product-feed/products-status-type';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {fromApi, toApi} from '@/providers/shipping-rate-provider';
import {
  type DeliveryDetail,
  type ShopShippingInterface, getEnabledCarriers,
  mergeShippingDetailsSourcesForProductFeedConfiguration, validateDeliveryDetail,
} from '@/providers/shipping-settings-provider';
import appGetters from '@/store/modules/app/getters-types';
import {type FullState, RequestState} from '@/store/types';
import {formatMappingToApi} from '@/utils/AttributeMapping';
import {deleteProductFeedDataFromLocalStorage, getDataFromLocalStorage} from '@/utils/LocalStorage';
import {runIf} from '@/utils/Promise';
import ActionsTypes from './actions-types';
import MutationsTypes from './mutations-types';
import type {
  ProductFeedSettings, ProductVerificationIssue, ProductVerificationIssueProduct, State,
} from './state';
import GetterTypes from '@/store/modules/product-feed/getters-types';
import ProductFilterMethodsSynch from '@/enums/product-feed/product-filter-methods-synch';
import ProductFeedCountStatus from '@/enums/product-feed/product-feed-count-status';
import debounce from '@/utils/Debounce';

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
  attributeMapping: settings.attributeMapping,
  productSelected: settings.productSelected,
  selectedProductCategories: settings.selectedProductCategories,
  languages: settings.languages,
});

export default {
  async [ActionsTypes.WARMUP_STORE](
    {dispatch, state, getters}: Context,
  ) {
    if ([
      RequestState.PENDING,
      RequestState.SUCCESS,
    ].includes(state.warmedUp)) {
      return;
    }
    state.warmedUp = RequestState.PENDING;

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
        dispatch(ActionsTypes.REQUEST_VERIFICATION_STATS),
      ),
      runIf(
        !state.report.invalidProducts,
        dispatch(ActionsTypes.REQUEST_VERIFICATION_STATS),
      ),
    ]);

    state.warmedUp = RequestState.SUCCESS;
  },
  async [ActionsTypes.GET_PRODUCT_FEED_SYNC_STATUS]({commit, rootGetters}: Context) {
    const params = {
      lang: rootGetters[`app/${appGetters.GET_CURRENT_LANGUAGE}`],
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

  async [ActionsTypes.GET_PRODUCT_FILTER_SETTINGS](
    {commit}: Context,
  ) {
    try {
      const json = await (await fetchOnboarding('GET', 'product-filters')).json();

      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'productFilter', data: json,
      });
    } catch (error) {
      console.error(error);
    }
  },

  async [ActionsTypes.GET_PRODUCT_FEED_SETTINGS](
    {commit, rootGetters}: Context,
  ): Promise<ProductFeedSettings|null> {
    const params = {
      lang: rootGetters[`app/${appGetters.GET_CURRENT_LANGUAGE}`],
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
    state, rootState, getters, commit,
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
    const attributeMapping = (getDataFromLocalStorage('productFeed-attributeMapping')
      ? formatMappingToApi(getDataFromLocalStorage('productFeed-attributeMapping'))
      : state.attributeMapping) || {};
    // Product filter
    const productFiltered = getDataFromLocalStorage('productFeed-productFilter') || productFeedSettings.productFilter;
    // Product categories
    const selectedProductCategories = getDataFromLocalStorage('productFeed-selectedProductCategories') || getters.GET_PRODUCT_CATEGORIES_SELECTED;

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
      languages: rootState.app.psxMktgWithGoogleLanguages,
    });

    try {
      await fetchOnboarding(
        'POST',
        'incremental-sync/settings',
        {body: newSettings},
      );
      await fetchOnboarding(
        'POST',
        'product-filters',
        {body: productFiltered || []},
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
      commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
        name: 'productFilter',
        data: productFeedSettings.productFilter,
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

  async [ActionsTypes.GET_PRODUCT_FEED_SYNC_SUMMARY]({commit}: Context) {
    commit(MutationsTypes.SET_SYNC_SUMMARY_LOADING, true);
    try {
      const result = await (await fetchOnboarding(
        'GET',
        'product-validations/stats',
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

  async [ActionsTypes.REQUEST_SYNCHRONISATION]({rootState}: Context, full = false) {
    const response = await fetch(`https://api.cloudsync.prestashop.com/sync/v1/sync/trigger${full ? '-full' : ''}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${rootState.accounts.tokenPsAccounts}`,
      },
      body: JSON.stringify({shopId: rootState.accounts.shopIdPsAccounts}),
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

  async [ActionsTypes.REQUEST_REPORTING_PRODUCTS_BY_STATUS_LIST](
    {commit, getters}: Context,
    payload: {
      status: ProductsStatusType,
      limit: number,
    },
  ) {
    if (getters.GET_PRODUCTS_VALIDATION_PAGE_SIZE !== payload.limit) {
      // If the number of product per page has changed, reset the list
      commit(MutationsTypes.RESET_PRODUCTS_VALIDATION_LIST, {
        status: payload.status,
      });
      commit(MutationsTypes.SET_PRODUCTS_VALIDATION_OFFSET, {
        offset: 0,
        status: payload.status,
      });
      commit(MutationsTypes.SET_PRODUCTS_VALIDATION_PAGE_SIZE, payload.limit);
    }

    const offset = getters.GET_PRODUCTS_VALIDATION_DISAPPROVED_OFFSET;

    const params = new URLSearchParams({
      ...(offset && {offset}),
      limit: payload.limit,
      status: payload.status,
    });
    const result = await (await fetchOnboarding(
      'GET',
      `product-validations?${params.toString()}`,
    )).json();

    commit(MutationsTypes.ADD_TO_PRODUCTS_VALIDATION_LIST, {
      products: result.results,
      status: payload.status,
    });
    commit(MutationsTypes.SET_PRODUCTS_VALIDATION_OFFSET, {
      offset: offset + payload.limit,
      status: payload.status,
    });
    if (result.total) {
      commit(MutationsTypes.SET_PRODUCTS_VALIDATION_TOTAL, +result.total);
    }
    return result.results;
  },

  async [ActionsTypes.REQUEST_REPORTING_PRODUCT_ISSUES]({rootGetters}: Context, payload: {
    productId: string,
  }): Promise<ProductIssue[]> {
    const params = new URLSearchParams({
      language: rootGetters[`app/${appGetters.GET_CURRENT_LANGUAGE}`],
      timezone: encodeURI(Intl.DateTimeFormat().resolvedOptions().timeZone),
    });
    const result = await (await fetchOnboarding(
      'GET',
      `product-validations/${payload.productId}?${params.toString()}`,
    )).json();

    return result.issues || [];
  },

  /* PRODUCT FILTERS */
  async [ActionsTypes.GET_SHOP_PRODUCT_FEATURES_OPTIONS](
    {commit}: Context,
  ) {
    const result = await fetchShop('getShopAttributes', {action: 'getProductFilterOptions', kind: 'feature'});
    commit(MutationsTypes.SET_PRODUCT_FILTER_OPTIONS, {name: 'features', data: result});
  },

  async [ActionsTypes.GET_SHOP_CATEGORIES_OPTIONS](
    {commit}: Context,
  ) {
    const result = await fetchShop('getShopAttributes', {action: 'getProductFilterOptions', kind: 'category'});
    commit(MutationsTypes.SET_PRODUCT_FILTER_OPTIONS, {name: 'categories', data: result});
  },

  async [ActionsTypes.GET_SHOP_BRANDS_OPTIONS](
    {commit}: Context,
  ) {
    const result = await fetchShop('getShopAttributes', {action: 'getProductFilterOptions', kind: 'brand'});
    commit(MutationsTypes.SET_PRODUCT_FILTER_OPTIONS, {name: 'brands', data: result});
  },

  async [ActionsTypes.GET_SHOPS_PRODUCTS_INFOS]({dispatch}: Context) {
    await dispatch(ActionsTypes.GET_SHOP_PRODUCT_FEATURES_OPTIONS);
    await dispatch(ActionsTypes.GET_SHOP_CATEGORIES_OPTIONS);
    await dispatch(ActionsTypes.GET_SHOP_BRANDS_OPTIONS);
  },

  [ActionsTypes.GET_PRODUCT_COUNT]: debounce(async (context : Context) => {
    const {commit, state, getters} = context;

    const filters = (getters[GetterTypes.GET_METHOD_SYNC]
        === ProductFilterMethodsSynch.SYNCH_ALL_PRODUCT)
      ? []
      : state.settings.productFilter;

    const abortController = getters[GetterTypes.GET_PRODUCT_COUNT_ABORT_CONTROLLER];

    if (abortController) {
      abortController.abort();
    }

    const controller = new AbortController();
    const {signal} = controller;

    commit(MutationsTypes.SET_PRODUCT_COUNT_ABORT_CONTROLLER, controller);

    try {
      const response = await fetchShop('countMatchingProductsFromFilters', {filters}, signal);
      commit(MutationsTypes.SET_PRODUCT_COUNT_STATUS, ProductFeedCountStatus.SUCCESS);
      commit(MutationsTypes.SET_PRODUCT_COUNT, response.numberOfProducts);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        commit(MutationsTypes.SET_PRODUCT_COUNT_STATUS, ProductFeedCountStatus.ERROR);
      }
    } finally {
      commit(MutationsTypes.SET_PRODUCT_COUNT_ABORT_CONTROLLER, null);
    }
  }, 500),

  async [ActionsTypes.TRIGGER_PRODUCT_COUNT]({commit, dispatch}: Context) {
    commit(MutationsTypes.SET_PRODUCT_COUNT_STATUS, null);
    // we used this to restart loading status on product count pending
    setTimeout(async () => {
      commit(MutationsTypes.SET_PRODUCT_COUNT_STATUS, ProductFeedCountStatus.PENDING);
      commit(MutationsTypes.SET_PRODUCT_COUNT, null);
      await dispatch(ActionsTypes.GET_PRODUCT_COUNT);
    }, 1);
  },
};
