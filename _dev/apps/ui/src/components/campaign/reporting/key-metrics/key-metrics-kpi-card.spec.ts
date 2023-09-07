import {MountOptions, mount} from '@vue/test-utils';
import Vuex from 'vuex';

import {BCard, BLink} from 'bootstrap-vue';
import config, {localVue, cloneStore, addBootstrapToVue} from '@/../tests/init';
import KeyMetricsKpiCardVue from './key-metrics-kpi-card.vue';
import KpiType from '@/enums/reporting/KpiType';
import {adsAccountStatus} from '@/../.storybook/mock/google-ads';
import {DailyResultColor} from '@/store/modules/campaigns/state';

describe('KeyMetricsKpiCard', () => {
  const buildDefaultStore = (): ReturnType<typeof cloneStore> => {
    const store = cloneStore();
    store.modules.googleAds.state = adsAccountStatus;
    store.modules.googleAds.state.accountChosen.currencyCode = 'USD';
    return store;
  };

  const buildWrapper = (
    options: MountOptions<any> = {},
    store: ReturnType<typeof cloneStore> = buildDefaultStore(),
  ) => {
    addBootstrapToVue();
    return mount(KeyMetricsKpiCardVue, {
      localVue,
      store: new Vuex.Store(store),
      ...config,
      ...options,
    });
  };

  describe('Kpi', () => {
    it('is displayed as a basic card by default', () => {
      const wrapper = buildWrapper({
        propsData: {
          kpiValue: '1234',
          kpiName: 'Such Kpi!',
          kpiType: KpiType.CLICKS,
          disabled: false,
          activeColor: null,
        },
      });

      const card = wrapper.findComponent(BCard);
      expect(card.attributes('class')).toContain('border-primary');
      expect(card.find('dt').text()).toBe('Such Kpi!');
      expect(card.find('dd').text()).toBe('1234');
      expect(card.attributes('style')).toBe(undefined);
    });

    it('is does not display a number when disabled', () => {
      const wrapper = buildWrapper({
        propsData: {
          kpiValue: '1234',
          kpiName: 'Such Kpi!',
          kpiType: KpiType.CLICKS,
          disabled: true,
          activeColor: null,
        },
      });

      const card = wrapper.findComponent(BCard);
      expect(card.attributes('class')).toContain('border-light');
      expect(card.find('dt').text()).toBe('Such Kpi!');
      expect(card.find('dd').text()).toBe('--');
    });

    it('can display prices', () => {
      const wrapper = buildWrapper({
        propsData: {
          kpiValue: '26000',
          kpiName: 'Such Kpi!',
          kpiType: KpiType.SALES,
          disabled: false,
          activeColor: null,
        },
      });

      const card = wrapper.findComponent(BCard);
      expect(card.attributes('class')).toContain('border-primary');
      expect(card.find('dt').text()).toBe('Such Kpi!');
      expect(card.find('dd').text()).toBe('26\u202f000\xa0$');
    });
  });

  describe('Active status', () => {
    it('has a background color in a active state', () => {
      const wrapper = buildWrapper({
        propsData: {
          kpiValue: '26000',
          kpiName: 'Such Kpi!',
          kpiType: KpiType.SALES,
          disabled: false,
          activeColor: DailyResultColor.YELLOW,
        },
      });

      const card = wrapper.findComponent(BCard);
      expect(card.attributes('class')).toContain('border-primary');
      expect(card.attributes('class')).toContain('text-primary');
      expect(card.attributes('style')).toBe('background-color: rgb(255, 217, 153);');
    });

    it('has a background color in a active state, the text is white when the background is dark', () => {
      const wrapper = buildWrapper({
        propsData: {
          kpiValue: '26000',
          kpiName: 'Such Kpi!',
          kpiType: KpiType.SALES,
          disabled: false,
          activeColor: DailyResultColor.BLUE,
        },
      });

      const card = wrapper.findComponent(BCard);
      expect(card.attributes('class')).toContain('border-primary');
      expect(card.attributes('class')).toContain('text-white');
      expect(card.attributes('style')).toBe('background-color: rgb(23, 78, 239);');
    });
  });

  describe('Active toggle', () => {
    it('can\'t be switched on when disabled', () => {
      const wrapper = buildWrapper({
        propsData: {
          kpiValue: '1234',
          kpiName: 'Such Kpi!',
          kpiType: KpiType.CLICKS,
          disabled: true,
          activeColor: null,
        },
      });

      expect(wrapper.findComponent(BLink).exists()).toBe(false);
    });

    it('can\'t be switched on when all slots are taken', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.reporting.request.dailyResultTypes = {
        [DailyResultColor.BLACK]: KpiType.IMPRESSIONS,
        [DailyResultColor.YELLOW]: KpiType.COSTS,
        [DailyResultColor.BLUE]: KpiType.SALES,
      };
      const wrapper = buildWrapper({
        propsData: {
          kpiValue: '1234',
          kpiName: 'Such Kpi!',
          kpiType: KpiType.CLICKS,
          disabled: false,
          activeColor: null,
        },
      }, store);

      expect(wrapper.findComponent(BLink).exists()).toBe(false);
    });

    it('can be switched on otherwise', () => {
      const wrapper = buildWrapper({
        propsData: {
          kpiValue: '1234',
          kpiName: 'Such Kpi!',
          kpiType: KpiType.CLICKS,
          disabled: false,
          activeColor: null,
        },
      });

      expect(wrapper.findComponent(BLink).exists()).toBe(true);
    });

    it('can\'t be switched off when disabled', () => {
      const wrapper = buildWrapper({
        propsData: {
          kpiValue: '1234',
          kpiName: 'Such Kpi!',
          kpiType: KpiType.CLICKS,
          disabled: true,
          activeColor: DailyResultColor.BLACK,
        },
      });

      expect(wrapper.findComponent(BLink).exists()).toBe(false);
    });

    it('can be switched off otherwise', () => {
      const wrapper = buildWrapper({
        propsData: {
          kpiValue: '1234',
          kpiName: 'Such Kpi!',
          kpiType: KpiType.CLICKS,
          disabled: false,
          activeColor: DailyResultColor.BLACK,
        },
      });

      expect(wrapper.findComponent(BLink).exists()).toBe(true);
    });
  });
});
