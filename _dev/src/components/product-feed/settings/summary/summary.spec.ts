/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount, shallowMount} from '@vue/test-utils';
import config, {localVue, cloneStore, filters} from '@/../tests/init';
import ProductFeedSettingsSummary from '@/components/product-feed/settings/summary/summary.vue';
import ProductFeedCardNextSyncCard from '@/components/product-feed/product-feed-card-next-sync-card.vue';
import Stepper from '@/components/commons/stepper.vue';
import PsSelect from '@/components/commons/ps-select.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';

import {
  Summary,
} from '@/../stories/product-feed-settings.stories';

describe('summary', () => {
  it('shows datas', () => {
    const wrapper = shallowMount(ProductFeedSettingsSummary, {
      propsData: Summary.args,
      beforeMount: Summary.args.beforeMount,
      localVue,
      store: new Vuex.Store(cloneStore()),
    });

    expect(filters.changeCountriesCodesToNames).toHaveBeenCalledTimes(1);
    expect(wrapper.findComponent(ProductFeedCardNextSyncCard).exists()).toBeTruthy();
  });
  it('shows button cancel and triggers previous step on click', async () => {
    const wrapper = shallowMount(ProductFeedSettingsSummary, {
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
