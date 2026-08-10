import {fetchOnboarding, fetchShop} from 'mktg-with-google-common';
import type {ActionContext} from 'vuex';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {toApi} from '@/providers/shipping-rate-provider';
import {
  type DeliveryDetail,
  type ShopShippingInterface,
  getEnabledCarriers,
  mergeShippingDetailsSourcesForProductFeedConfiguration,
  validateDeliveryDetail,
} from '@/providers/shipping-settings-provider';
import {type FullState, RequestState} from '@/store/types';
import {formatMappingToApi} from '@/utils/AttributeMapping';
import {deleteProductFeedDataFromLocalStorage, getDataFromLocalStorage} from '@/utils/LocalStorage';
import ProductFilterMethodsSynch from '@/enums/product-feed/product-filter-methods-synch';
import ProductFeedCountStatus from '@/enums/product-feed/product-feed-count-status';
import debounce from '@/utils/Debounce';
import ActionsTypes from './actions-types';
import GetterTypes from './getters-types';
import MutationsTypes from './mutations-types';
import type {ProductFeedSettings, State} from './state';

type Context = ActionContext<State, FullState>;

const SAVED_SETTINGS_KEY = 'tinyLuxGoogleProductFeedSettings';
const SAVED_MAPPING_KEY = 'tinyLuxGoogleAttributeMapping';

const readLocalJson = (key: string): unknown => {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

// Kept as a pure formatter because the retained mapping/filter funnel still uses this shape.
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
      shippingSettings: settings.shippingSettings?.filter((setting) => (
        (setting.collection !== 'carriers'
          || (!!setting.properties.active && !setting.properties.deleted))
        && (!setting.properties.country_ids
          || settings.targetCountries.some(
            (country: string) => setting.properties.country_ids.includes(country),
          )))),
      additionalShippingSettings: settings.additionalShippingSettings,
    } : {}
  ),
  attributeMapping: settings.attributeMapping,
  productSelected: settings.productSelected,
  selectedProductCategories: settings.selectedProductCategories,
  languages: settings.languages,
});

export default {
  async [ActionsTypes.START_SYNC_JOB]({commit, dispatch}: Context, payload: {full: boolean}) {
    const created = await (await fetchOnboarding('POST', 'sync/jobs', {
      body: {full: payload.full},
    })).json();
    const jobId = Number(created.jobId);

    localStorage.setItem('tinyLuxGoogleSyncJobId', String(jobId));
    commit(MutationsTypes.SET_SYNC_JOB, {
      jobId,
      status: 'pending',
      total: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0,
      pending: 0,
      errors: [],
    });

    return dispatch(ActionsTypes.RUN_SYNC_JOB, {jobId});
  },

  async [ActionsTypes.RUN_SYNC_JOB]({commit}: Context, payload: {jobId: number}) {
    const job = await (await fetchOnboarding('POST', 'sync/jobs/run', {
      body: {jobId: payload.jobId, limit: 25},
    })).json();

    commit(MutationsTypes.SET_SYNC_JOB, job);
    return job;
  },

  async [ActionsTypes.GET_SYNC_JOB_STATUS]({commit}: Context, payload: {jobId: number}) {
    const job = await (await fetchOnboarding('GET', 'sync/jobs/status', {
      body: {jobId: payload.jobId},
    })).json();

    commit(MutationsTypes.SET_SYNC_JOB, job);
    return job;
  },

  async [ActionsTypes.RETRY_FAILED_SYNC_JOB]({dispatch}: Context, payload: {jobId: number}) {
    await fetchOnboarding('POST', 'sync/jobs/retry', {
      body: {jobId: payload.jobId},
    });

    return dispatch(ActionsTypes.RUN_SYNC_JOB, {jobId: payload.jobId});
  },

  async [ActionsTypes.WARMUP_STORE]({dispatch, state}: Context) {
    if ([RequestState.PENDING, RequestState.SUCCESS].includes(state.warmedUp)) {
      return;
    }
    state.warmedUp = RequestState.PENDING;

    const storedJobId = localStorage.getItem('tinyLuxGoogleSyncJobId');

    if (storedJobId && /^[1-9][0-9]*$/.test(storedJobId)) {
      try {
        await dispatch(ActionsTypes.GET_SYNC_JOB_STATUS, {jobId: Number(storedJobId)});
      } catch (error) {
        // The page remains usable and displays only its generic local error state.
      }
    }

    state.warmedUp = RequestState.SUCCESS;
  },

  async [ActionsTypes.GET_PRODUCT_FEED_SETTINGS]({commit, state}: Context) {
    const saved = readLocalJson(SAVED_SETTINGS_KEY);

    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      Object.entries(saved).forEach(([name, data]) => {
        commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {name, data});
      });
      commit(MutationsTypes.TOGGLE_CONFIGURATION_FINISHED, true);
    }

    return state.settings;
  },

  async [ActionsTypes.GET_PRODUCT_FILTER_SETTINGS]({commit}: Context) {
    const response = await fetchOnboarding('GET', 'product-filters');
    const {filters} = await response.json();
    commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
      name: 'productFilter', data: filters,
    });

    return filters;
  },

  async [ActionsTypes.SAVE_PRODUCT_FILTER_SETTINGS]({commit}: Context, payload) {
    const response = await fetchOnboarding('POST', 'product-filters', {
      body: {filters: payload.filters},
    });
    const {filters} = await response.json();
    commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
      name: 'productFilter', data: filters,
    });

    return filters;
  },

  async [ActionsTypes.SEND_PRODUCT_FEED_SETTINGS]({
    state, rootState, getters, commit, dispatch,
  }: Context) {
    commit(MutationsTypes.API_ERROR, false);
    const productFeedSettings: ProductFeedSettings = {...state.settings};
    const targetCountries = getDataFromLocalStorage('productFeed-targetCountries')
      || productFeedSettings.targetCountries;
    const deliveryFiltered: DeliveryDetail[] = (
      getDataFromLocalStorage('productFeed-deliveryDetails')
      || productFeedSettings.deliveryDetails
    ).filter((detail: DeliveryDetail) => detail.enabledCarrier && validateDeliveryDetail(detail));
    const shippingSettingsFromShop: ShopShippingInterface[] = productFeedSettings.shippingSettings
      .filter((setting) => deliveryFiltered.find(
        (detail) => setting.properties.id_reference === detail.carrierId,
      ));
    const rate = getDataFromLocalStorage('productFeed-rateChosen')
      || productFeedSettings.rate
      || undefined;
    const estimateCarriers = toApi(
      getDataFromLocalStorage('productFeed-estimateCarriers')
        || productFeedSettings.estimateCarriers,
      rootState.app.psxMtgWithGoogleShopCurrency.isoCode,
    );
    const draftMapping = getDataFromLocalStorage('productFeed-attributeMapping');
    const attributeMapping = (draftMapping
      ? formatMappingToApi(draftMapping)
      : state.attributeMapping) || {};
    const productFiltered = getDataFromLocalStorage('productFeed-productFilter')
      || productFeedSettings.productFilter;
    const selectedProductCategories = getDataFromLocalStorage(
      'productFeed-selectedProductCategories',
    ) || getters.GET_PRODUCT_CATEGORIES_SELECTED;
    const newSettings = createProductFeedApiPayload({
      autoImportTaxSettings: productFeedSettings.autoImportTaxSettings,
      shippingSetup: productFeedSettings.shippingSetup,
      targetCountries,
      shippingSettings: shippingSettingsFromShop,
      additionalShippingSettings: {deliveryDetails: deliveryFiltered},
      rate,
      estimateCarriers,
      attributeMapping,
      selectedProductCategories,
      languages: rootState.app.psxMtgWithGoogleLanguages,
    });

    await dispatch(ActionsTypes.SAVE_PRODUCT_FILTER_SETTINGS, {
      filters: productFiltered || [],
    });
    localStorage.setItem(SAVED_SETTINGS_KEY, JSON.stringify(newSettings));
    localStorage.setItem(SAVED_MAPPING_KEY, JSON.stringify(attributeMapping));
    state.settings = {...state.settings, ...newSettings} as ProductFeedSettings;
    commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
      name: 'deliveryDetails', data: productFeedSettings.deliveryDetails,
    });
    commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
      name: 'shippingSettings', data: productFeedSettings.shippingSettings,
    });
    commit(MutationsTypes.SET_SELECTED_PRODUCT_FEED_SETTINGS, {
      name: 'productFilter', data: productFiltered || [],
    });
    commit(MutationsTypes.SET_ATTRIBUTES_MAPPED, attributeMapping);
    commit(MutationsTypes.TOGGLE_CONFIGURATION_FINISHED, true);
    commit(MutationsTypes.SAVE_CONFIGURATION_CONNECTED_ONCE, true);
    deleteProductFeedDataFromLocalStorage();
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
    const enabledCarriersFromShop = getEnabledCarriers(state.settings.shippingSettings);
    const deliveryFromStorage = getDataFromLocalStorage('productFeed-deliveryDetails') ?? [];
    const carriersList: DeliveryDetail[] = mergeShippingDetailsSourcesForProductFeedConfiguration(
      enabledCarriersFromShop,
      state.settings.deliveryDetails,
      deliveryFromStorage,
    );
    commit(MutationsTypes.SAVE_SHIPPING_SETTINGS, carriersList);
  },

  async [ActionsTypes.GET_TOTAL_PRODUCTS_READY_TO_SYNC]({commit}: Context) {
    const result = await fetchShop('getProductsReadyToSync');
    commit(MutationsTypes.SAVE_TOTAL_PRODUCTS_READY_TO_SYNC, Number(result.total));
    return result;
  },

  async [ActionsTypes.REQUEST_SYNCHRONISATION]() {
    return false;
  },

  async [ActionsTypes.REQUEST_FULL_SYNCHRONISATION]() {
    return false;
  },

  async [ActionsTypes.REQUEST_SHOP_TO_GET_ATTRIBUTE]({commit}: Context) {
    const json = await fetchShop('getShopAttributes');
    commit(MutationsTypes.SAVE_ATTRIBUTES_SHOP, json);
    return json;
  },

  async [ActionsTypes.REQUEST_ATTRIBUTE_MAPPING]({commit, state}: Context) {
    const saved = readLocalJson(SAVED_MAPPING_KEY);
    const mapping = saved && typeof saved === 'object' && !Array.isArray(saved)
      ? saved
      : state.attributeMapping;
    commit(MutationsTypes.SET_ATTRIBUTES_MAPPED, mapping);
    return mapping;
  },

  async [ActionsTypes.GET_SHOP_PRODUCT_FEATURES_OPTIONS]({commit}: Context) {
    const result = await fetchShop(
      'getShopAttributes',
      {action: 'getProductFilterOptions', kind: 'feature'},
    );
    commit(MutationsTypes.SET_PRODUCT_FILTER_OPTIONS, {name: 'features', data: result});
  },

  async [ActionsTypes.GET_SHOP_CATEGORIES_OPTIONS]({commit}: Context) {
    const result = await fetchShop(
      'getShopAttributes',
      {action: 'getProductFilterOptions', kind: 'category'},
    );
    commit(MutationsTypes.SET_PRODUCT_FILTER_OPTIONS, {name: 'categories', data: result});
  },

  async [ActionsTypes.GET_SHOP_BRANDS_OPTIONS]({commit}: Context) {
    const result = await fetchShop(
      'getShopAttributes',
      {action: 'getProductFilterOptions', kind: 'brand'},
    );
    commit(MutationsTypes.SET_PRODUCT_FILTER_OPTIONS, {name: 'brands', data: result});
  },

  async [ActionsTypes.GET_SHOPS_PRODUCTS_INFOS]({dispatch}: Context) {
    await dispatch(ActionsTypes.GET_SHOP_PRODUCT_FEATURES_OPTIONS);
    await dispatch(ActionsTypes.GET_SHOP_CATEGORIES_OPTIONS);
    await dispatch(ActionsTypes.GET_SHOP_BRANDS_OPTIONS);
  },

  [ActionsTypes.GET_PRODUCT_COUNT]: debounce(async (context: Context) => {
    const {commit, state, getters} = context;
    const filters = getters[GetterTypes.GET_METHOD_SYNC]
      === ProductFilterMethodsSynch.SYNCH_ALL_PRODUCT
      ? []
      : state.settings.productFilter;
    const previousController = getters[GetterTypes.GET_PRODUCT_COUNT_ABORT_CONTROLLER];
    previousController?.abort();
    const controller = new AbortController();
    commit(MutationsTypes.SET_PRODUCT_COUNT_ABORT_CONTROLLER, controller);
    try {
      const response = await fetchShop(
        'countMatchingProductsFromFilters',
        {filters},
        controller.signal,
      );
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
    commit(MutationsTypes.SET_PRODUCT_COUNT_STATUS, ProductFeedCountStatus.PENDING);
    commit(MutationsTypes.SET_PRODUCT_COUNT, null);
    await dispatch(ActionsTypes.GET_PRODUCT_COUNT);
  },
};
