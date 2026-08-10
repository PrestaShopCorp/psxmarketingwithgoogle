import Vuex from 'vuex';
import {shallowMount} from '@vue/test-utils';
import config, {cloneStore, localVue} from '@/../tests/init';
import ProductFeedCard from '@/components/onboarding/product-feed-card.vue';
import ProductFeedPage from './product-feed-page.vue';

describe('product-feed-page.vue local service layer', () => {
  it('renders the retained feed configuration through the local durable sync card', () => {
    const storeDefinition = cloneStore();
    storeDefinition.modules.accounts.state.googleAccount.merchantAccount = '123';
    storeDefinition.modules.accounts.state.googleAccount.dataSource = 'accounts/123/dataSources/456';
    storeDefinition.modules.accounts.state.googleMerchantAccount.id = '123';
    const wrapper = shallowMount(ProductFeedPage, {
      ...config,
      localVue,
      store: new Vuex.Store(storeDefinition),
      mocks: {...config.mocks, $route: {name: 'product-feed'}},
    });

    expect(wrapper.text()).toContain('Synchronize products');
    expect(wrapper.findComponent(ProductFeedCard).exists()).toBe(true);
    expect(wrapper.findComponent(ProductFeedCard).props('isEnabled')).toBe(true);
    expect(wrapper.find('product-feed-dashboard-page-stub').exists()).toBe(false);
    expect(wrapper.find('disapproved-products-page-stub').exists()).toBe(false);
  });
});
