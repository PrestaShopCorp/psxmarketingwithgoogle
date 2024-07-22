import Vuex from 'vuex';

// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import {cloneStore, localVue} from '@/../tests/init';
import ProductFeedSettingsSummary from '@/components/product-feed/settings/summary/summary.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import ProductFeedSummaryCard from '@/components/product-feed/summary/product-feed-summary-card.vue';

import {
  Summary,
} from '@/../stories/product-feed-settings.stories';

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

    expect(wrapper.findComponent(ProductFeedSummaryCard).exists()).toBeTruthy();
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
