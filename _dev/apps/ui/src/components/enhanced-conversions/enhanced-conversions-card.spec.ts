import Vuex from 'vuex';
import {MountOptions, Wrapper, mount} from '@vue/test-utils';
import cloneDeep from 'lodash.clonedeep';
import {BFormCheckbox} from 'bootstrap-vue';
import EnhancedConversionsCard from './enhanced-conversions-card.vue';
import config, {
  localVue, cloneStore, addBootstrapToVue, addShowdownToVue,
} from '@/../tests/init';
import {State as CampaignsState} from '@/store/modules/campaigns/state';
import {State as GoogleAdsState} from '@/store/modules/google-ads/state';
import {adsAccountStatus, googleAdsAccountChosen} from '@/../.storybook/mock/google-ads';
import AlertSignGadsTos from './alert-sign-gads-tos.vue';
import alertEcReadyVue from './alert-ec-ready.vue';

describe('EnhancedConversionsCard', () => {
  describe('Toggle', () => {
    it('is visible when status is known', () => {
      const wrapper = buildWrapper();
      expect(wrapper.isVisible()).toBe(true);
    });

    it('shows an inactive toggle when feature is disabled', () => {
      const wrapper = buildWrapper();
      expect(wrapper.findComponent(BFormCheckbox).props('checked')).toBe(false);
    });

    it('shows an active toggle when feature is enabled', () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.trackingFeature.enhanced = true;
      const wrapper = buildWrapper({}, store);
      expect(wrapper.findComponent(BFormCheckbox).props('checked')).toBe(true);
    });

    it('triggers a call when toggling the feature', async () => {
      const store = buildDefaultStore();
      store.modules.campaigns.state.trackingFeature.enhanced = false;
      store.modules.googleAds.state = adsAccountStatus;
      store.modules.googleAds.state.accountChosen.acceptedCustomerDataTerms = true;
      const wrapper = buildWrapper({}, store);
      const toggle = wrapper.findComponent(BFormCheckbox);
      expect(toggle.props('disabled')).toBe(false);

      expect(store.modules.campaigns.actions.SAVE_ENHANCED_CONVERSIONS_STATUS).toBeCalledTimes(0);
      await toggle.trigger('click');
      expect(store.modules.campaigns.actions.SAVE_ENHANCED_CONVERSIONS_STATUS).toBeCalledTimes(1);
    });
  });

  describe('Terms of services requirement', () => {
    let wrapper: Wrapper<EnhancedConversionsCard>;
    const store = buildDefaultStore();

    beforeEach(() => {
      store.modules.campaigns.state.trackingFeature.enhanced = false;
      store.modules.googleAds.state = adsAccountStatus;
      store.modules.googleAds.state.accountChosen.acceptedCustomerDataTerms = false;
      wrapper = buildWrapper({}, store);
    });

    it('Feature cannot be switched on and off when ToS are not accepted', async () => {
      const toggle = wrapper.findComponent(BFormCheckbox);
      expect(toggle.props('disabled')).toBe(true);

      expect(store.modules.campaigns.actions.SAVE_ENHANCED_CONVERSIONS_STATUS).toBeCalledTimes(0);
      await toggle.trigger('click');
      expect(store.modules.campaigns.actions.SAVE_ENHANCED_CONVERSIONS_STATUS).toBeCalledTimes(0);
    });

    it('An alert is displayed when ToS are not accepted', () => {
      expect(wrapper.findComponent(AlertSignGadsTos).exists()).toBe(true);
    });

    it('Another alert is shown when ToS have just been accepted', async () => {
      expect(wrapper.findComponent(alertEcReadyVue).exists()).toBe(false);
      store.modules.googleAds.state.accountChosen.acceptedCustomerDataTerms = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(BFormCheckbox).props('disabled')).toBe(false);
      expect(wrapper.findComponent(alertEcReadyVue).exists()).toBe(true);
    });
  });
});

const buildDefaultStore = (): ReturnType<typeof cloneStore> => {
  const store = cloneStore();
  (store.modules.campaigns.state as CampaignsState).trackingFeature.enhanced = false;
  (store.modules.googleAds.state as GoogleAdsState) = cloneDeep(googleAdsAccountChosen);

  store.modules.campaigns.actions.SAVE_ENHANCED_CONVERSIONS_STATUS = vi.fn();
  return store;
};
const buildWrapper = (
  options: MountOptions<any> = {},
  store: ReturnType<typeof cloneStore> = buildDefaultStore(),
) => {
  addBootstrapToVue();
  addShowdownToVue();
  return mount(EnhancedConversionsCard, {
    localVue,
    store: new Vuex.Store(store),
    ...config,
    ...options,
  });
};
