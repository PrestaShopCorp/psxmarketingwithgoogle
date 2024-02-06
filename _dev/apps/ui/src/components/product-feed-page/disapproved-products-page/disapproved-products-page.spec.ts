import Vuex from 'vuex';

// Import this file first to init mock on window
import {MountOptions, mount} from '@vue/test-utils';
import createFetchMock from 'vitest-fetch-mock';

import cloneDeep from 'lodash.clonedeep';
import {BSkeleton, BTbody, BTr} from 'bootstrap-vue';
import config, {
  addBootstrapToVue, addShowdownToVue, cloneStore, localVue,
} from '@/../tests/init';
import DisapprovedProductsRow from '@/components/product-feed-page/disapproved-products-page/disapproved-products-row.vue';
import DisapprovedProductsPage from '@/components/product-feed-page/disapproved-products-page/disapproved-products-page.vue';
import {
  productFeed,
} from '@/../.storybook/mock/product-feed';
import {productValidationListMock} from '@/../.storybook/mock/api-routes/product-validations';
import LanguageFilterSelector from '../language-filter-selector.vue';
import {RequestState} from '@/store/types';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('disapproved-products-page/disapproved-products-page.vue', () => {
  beforeEach(() => {
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  const buildDefaultStore = (): ReturnType<typeof cloneStore> => {
    const store = cloneStore();
    store.modules.productFeed.state = {
      ...cloneDeep(productFeed),
    };
    store.modules.productFeed.state.gmcProductsByStatus.results
      .disapproved = cloneDeep(productValidationListMock.results);
    store.modules.productFeed.actions
      .REQUEST_REPORTING_PRODUCTS_STATUSES = vi.fn().mockImplementation(() => []);
    return store;
  };

  const buildWrapper = (
    options: MountOptions<any> = {},
    store: ReturnType<typeof cloneStore> = buildDefaultStore(),
  ) => {
    addBootstrapToVue();
    addShowdownToVue();
    return mount(DisapprovedProductsPage, {
      localVue,
      ...config,
      store: new Vuex.Store(store),
      ...options,
    });
  };

  it('display products that are disapproved', () => {
    const wrapper = buildWrapper();

    const disapprovedProductRows = wrapper.findAllComponents(DisapprovedProductsRow);
    expect(disapprovedProductRows.exists()).toBeTruthy();
    expect(disapprovedProductRows).toHaveLength(9);
  });

  it('Displays a bouton to load the next page', async () => {
    const wrapper = buildWrapper();

    const allRows = wrapper.findAllComponents(BTr);
    const lastRow = allRows.at(allRows.length - 1);

    expect(lastRow.text()).toEqual('Load next results');
  });

  it('Hides the next page button when the last loaded page did not return results', async () => {
    const wrapper = buildWrapper();

    const allRows = wrapper.findAllComponents(BTr);
    const lastRow = allRows.at(allRows.length - 1);
    expect(allRows).toHaveLength(11);
    expect(lastRow.text()).toEqual('Load next results');

    // Triger load of next page
    await wrapper.vm.getItems();

    expect(wrapper.findAllComponents(BTr)).toHaveLength(10);
  });

  it('enables the filtering by language only when the data is ready', async () => {
    const wrapper = buildWrapper();

    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(LanguageFilterSelector).attributes('disabled')).toBe(undefined);

    wrapper.vm.$data.loadingStatus = RequestState.PENDING;
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(LanguageFilterSelector).attributes('disabled')).toBe('disabled');
  });

  it('filters the displayed product based on the selected language', async () => {
    const wrapper = buildWrapper();

    wrapper.vm.$data.selectedLanguage = 'fr';
    await wrapper.vm.$nextTick();

    const disapprovedProductRows = wrapper.findAllComponents(DisapprovedProductsRow);
    expect(disapprovedProductRows).toHaveLength(1);
    expect(disapprovedProductRows.at(0).props('product').title).toEqual('Pikachu');
  });

  describe('loading states', () => {
    it('shows a skeleton of a table during the first loading', async () => {
      const store = cloneStore();
      store.modules.productFeed.state = {
        ...productFeed,
      };
      const wrapper = buildWrapper({}, store);

      wrapper.vm.$data.loadingStatus = RequestState.PENDING;
      await wrapper.vm.$nextTick();

      const skeletons = wrapper.findComponent(BTbody).findAllComponents(BSkeleton);
      expect(skeletons).toHaveLength(5 /* lines */ * 7 /* columns */);
    });

    it('shows a spinner at the bottom of the table when loading the next page', async () => {
      const wrapper = buildWrapper();

      wrapper.vm.$data.loadingStatus = RequestState.PENDING;
      await wrapper.vm.$nextTick();

      const skeletons = wrapper.findComponent(BTbody).findAllComponents(BSkeleton);
      expect(skeletons).toHaveLength(0);

      const allRows = wrapper.findAll(BTr);
      const lastRow = allRows.at(allRows.length - 1);
      expect(lastRow.html()).toContain('ps_gs-table-products__spinner');
    });
  });
});
