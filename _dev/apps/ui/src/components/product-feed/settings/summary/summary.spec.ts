import Vuex from 'vuex';

// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import {cloneStore, localVue} from '@/../tests/init';
import ProductFeedSettingsSummary from '@/components/product-feed/settings/summary/summary.vue';
import ProductFeedCardNextSyncCard from '@/components/product-feed/product-feed-card-next-sync-card.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';

import {
  Summary,
} from '@/../stories/product-feed-settings.stories';
import productFeedSummaryCards from '../../summary/product-feed-summary-cards.vue';

describe('summary', () => {
  const mockRoute = {
    name: 'product-feed-settings',
    params: {
      step: ProductFeedSettingsPages.SUMMARY,
    },
  };
  const mockRouter = {
    history: {
      current: {
        params: {
          step: ProductFeedSettingsPages.SUMMARY,
        },
      },
    },
    push: vi.fn(),
  };
  it('shows datas', () => {
    const wrapper = shallowMount(ProductFeedSettingsSummary, {
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
      },
      propsData: Summary.args,
      beforeMount: Summary.args.beforeMount,
      localVue,
      store: new Vuex.Store(cloneStore()),
    });

    expect(wrapper.findComponent(productFeedSummaryCards).exists()).toBeTruthy();
    expect(wrapper.findComponent(ProductFeedCardNextSyncCard).exists()).toBeTruthy();
  });
  it('shows button cancel and triggers previous step on click', async () => {
    const wrapper = shallowMount(ProductFeedSettingsSummary, {
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
      },
      propsData: Summary.args,
      beforeMount: Summary.args.beforeMount,
      localVue,
      store: new Vuex.Store(cloneStore()),
      stubs: {
        ActionsButtons,
      },
    });
    expect(wrapper.find('b-button').exists()).toBeTruthy();
    await expect(wrapper.find('b-button').trigger('click'));
    wrapper.vm.$emit('cancelProductFeedSettingsConfiguration');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('cancelProductFeedSettingsConfiguration')).toBeTruthy();
  });
});
