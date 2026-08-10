import Vuex from 'vuex';
import {shallowMount} from '@vue/test-utils';
import config, {cloneStore, localVue} from '@/../tests/init';
import ProductFeedCard from './product-feed-card.vue';

describe('product-feed-card.vue local synchronization', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keeps product synchronization disabled until Merchant Center is selected', () => {
    const wrapper = shallowMount(ProductFeedCard, {
      ...config,
      localVue,
      store: new Vuex.Store(cloneStore()),
      propsData: {isEnabled: false, loading: false},
    });

    expect(wrapper.find('.ps_gs-onboardingcard--disabled').exists()).toBe(true);
    expect(wrapper.find('[data-test="create-data-source"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="start-sync"]').exists()).toBe(false);
  });

  it('creates or reuses a primary API data source through the local account store', async () => {
    const store = new Vuex.Store(cloneStore());
    const dispatch = vi.spyOn(store, 'dispatch').mockResolvedValue({
      id: '456',
      name: 'accounts/123/dataSources/456',
      input: 'API',
    });
    const wrapper = shallowMount(ProductFeedCard, {
      ...config,
      localVue,
      store,
      propsData: {isEnabled: true, loading: false},
    });

    await wrapper.find('[data-test="create-data-source"]').trigger('click');

    expect(dispatch).toHaveBeenCalledWith('accounts/CREATE_DATA_SOURCE', {
      contentLanguage: 'fr',
      feedLabel: 'GB',
    });
  });

  it('keeps the retained product mapping and filter route available', async () => {
    const storeDefinition = cloneStore();
    storeDefinition.modules.accounts.state.googleAccount.dataSource = 'accounts/123/dataSources/456';
    const push = vi.fn();
    const wrapper = shallowMount(ProductFeedCard, {
      ...config,
      localVue,
      store: new Vuex.Store(storeDefinition),
      mocks: {...config.mocks, $router: {push}},
      propsData: {isEnabled: true, loading: false},
    });

    await wrapper.find('[data-test="configure-products"]').trigger('click');

    expect(push).toHaveBeenCalledWith({
      name: 'product-feed-settings',
      params: {step: 'target-country'},
    });
  });

  it('starts a durable local synchronization after a data source is ready', async () => {
    const storeDefinition = cloneStore();
    storeDefinition.modules.accounts.state.googleAccount.dataSource = 'accounts/123/dataSources/456';
    const store = new Vuex.Store(storeDefinition);
    const dispatch = vi.spyOn(store, 'dispatch').mockResolvedValue({
      jobId: 91,
      status: 'completed',
      total: 10,
      succeeded: 10,
      failed: 0,
      skipped: 0,
      pending: 0,
      errors: [],
    });
    const wrapper = shallowMount(ProductFeedCard, {
      ...config,
      localVue,
      store,
      propsData: {isEnabled: true, loading: false},
    });

    const synchronize = wrapper.find('[data-test="start-sync"]');
    expect(synchronize.text()).toBe('Synchronize products');
    await synchronize.trigger('click');

    expect(dispatch).toHaveBeenCalledWith('productFeed/START_SYNC_JOB', {full: true});
  });

  it('polls status only while a durable synchronization job is active', async () => {
    vi.useFakeTimers();
    const storeDefinition = cloneStore();
    storeDefinition.modules.accounts.state.googleAccount.dataSource = 'accounts/123/dataSources/456';
    storeDefinition.modules.productFeed.state.syncJob = {
      jobId: 91,
      status: 'running',
      total: 10,
      succeeded: 4,
      failed: 0,
      skipped: 0,
      pending: 6,
      errors: [],
    };
    const store = new Vuex.Store(storeDefinition);
    const completed = {
      jobId: 91,
      status: 'completed',
      total: 10,
      succeeded: 10,
      failed: 0,
      skipped: 0,
      pending: 0,
      errors: [],
    };
    const dispatch = vi.spyOn(store, 'dispatch').mockResolvedValue(completed);
    const wrapper = shallowMount(ProductFeedCard, {
      ...config,
      localVue,
      store,
      propsData: {isEnabled: true, loading: false},
    });

    try {
      await vi.advanceTimersByTimeAsync(1500);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('productFeed/GET_SYNC_JOB_STATUS', {jobId: 91});
      await vi.advanceTimersByTimeAsync(5000);
      expect(dispatch).toHaveBeenCalledTimes(1);
    } finally {
      wrapper.destroy();
      vi.useRealTimers();
    }
  });

  it('renders a generic local operation failure without leaking the thrown value', async () => {
    const store = new Vuex.Store(cloneStore());
    vi.spyOn(store, 'dispatch').mockRejectedValue(new Error('secret-upstream-payload'));
    const wrapper = shallowMount(ProductFeedCard, {
      ...config,
      localVue,
      store,
      propsData: {isEnabled: true, loading: false},
    });

    await wrapper.find('[data-test="create-data-source"]').trigger('click');
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('The operation could not be completed. Try again.');
    expect(wrapper.text()).not.toContain('secret-upstream-payload');
  });
});
