import {MountOptions, mount} from '@vue/test-utils';
import Vuex from 'vuex';

import {BSkeleton} from 'bootstrap-vue';
import config, {localVue, cloneStore, addBootstrapToVue} from '@/../tests/init';
import KeyMetricsControlsVue from './key-metrics-controls.vue';
import KeyMetricsPeriodSelectorVue from './key-metrics-period-selector.vue';

describe('keyMetricsControls', () => {
  const buildDefaultStore = (): ReturnType<typeof cloneStore> => cloneStore();

  const buildWrapper = (
    options: MountOptions<any> = {},
    store: ReturnType<typeof cloneStore> = buildDefaultStore(),
  ) => {
    addBootstrapToVue();
    return mount(KeyMetricsControlsVue, {
      localVue,
      store: new Vuex.Store(store),
      ...config,
      ...options,
    });
  };

  it('shows the controls by default', () => {
    const wrapper = buildWrapper({
      propsData: {
        inNeedOfConfiguration: false,
        loading: false,
        accountHasAtLeastOneCampaign: true,
      },
    });
    expect(wrapper.findAllComponents(BSkeleton)).toHaveLength(0);
    expect(wrapper.find('[data-test-id="campaign-creation-button"]').exists()).toBe(true);
    expect(wrapper.findComponent(KeyMetricsPeriodSelectorVue).exists()).toBe(true);
  });

  it('show the skeleton while loading', () => {
    const wrapper = buildWrapper({
      propsData: {
        inNeedOfConfiguration: false,
        loading: true,
        accountHasAtLeastOneCampaign: true,
      },
    });

    expect(wrapper.findAllComponents(BSkeleton)).toHaveLength(2);
    expect(wrapper.find('[data-test-id="campaign-creation-button"]').exists()).toBe(false);
    expect(wrapper.findComponent(KeyMetricsPeriodSelectorVue).exists()).toBe(false);
  });

  it('hides the campaign creation button when the account in not configured yet', () => {
    const wrapper = buildWrapper({
      propsData: {
        inNeedOfConfiguration: true,
        loading: false,
        accountHasAtLeastOneCampaign: false,
      },
    });

    expect(wrapper.findAllComponents(BSkeleton)).toHaveLength(0);
    expect(wrapper.find('[data-test-id="campaign-creation-button"]').exists()).toBe(false);
    const keyMetricsPeriodSelector = wrapper.findComponent(KeyMetricsPeriodSelectorVue);
    expect(keyMetricsPeriodSelector.exists()).toBe(true);
    expect(keyMetricsPeriodSelector.props('inNeedOfConfiguration')).toBe(true);
  });

  it('hides the campaign creation button & disables the time selector when there is no existing campaigns', () => {
    const wrapper = buildWrapper({
      propsData: {
        inNeedOfConfiguration: false,
        loading: false,
        accountHasAtLeastOneCampaign: false,
      },
    });

    expect(wrapper.findAllComponents(BSkeleton)).toHaveLength(0);
    expect(wrapper.find('[data-test-id="campaign-creation-button"]').exists()).toBe(false);
    const keyMetricsPeriodSelector = wrapper.findComponent(KeyMetricsPeriodSelectorVue);
    expect(keyMetricsPeriodSelector.exists()).toBe(true);
    expect(keyMetricsPeriodSelector.props('inNeedOfConfiguration')).toBe(true);
  });
});
