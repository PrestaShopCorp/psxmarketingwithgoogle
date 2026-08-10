import Vuex from 'vuex';
import {mount, shallowMount} from '@vue/test-utils';
import config, {cloneStore, localVue} from '@/../tests/init';
import OnboardingPage from '@/views/onboarding-page.vue';

describe('onboarding-page Merchant selection', () => {
  it('renders direct Tiny Lux onboarding without PrestaShop account or Billing gates', () => {
    const storeDefinition = cloneStore();
    storeDefinition.modules.accounts.state.googleAccount = {
      ...storeDefinition.modules.accounts.state.googleAccount,
      configured: true,
      connected: false,
      authenticationUrl: 'https://accounts.google.test/oauth',
    };
    storeDefinition.modules.accounts.state.warmedUp = true;
    const wrapper = mount(OnboardingPage, {
      ...config,
      localVue,
      store: new Vuex.Store(storeDefinition),
      stubs: {
        AlertCmp: true,
        GoogleCredentialsForm: true,
        MerchantCenterAccountCard: true,
        ProductFeedCard: true,
        GoogleAdsAccountCard: true,
        CampaignCard: true,
        CampaignTracking: true,
        EnhancedConversionsCard: true,
        PromoCard: true,
        GoogleAccountPopinDisconnect: true,
        GoogleAdsAccountPopinDisconnect: true,
        GoogleAdsPopinNew: true,
        TrackingActivationModal: true,
        ModalEcIntro: true,
        PopinModuleConfigured: true,
        PsToast: true,
        VueShowdown: true,
      },
    });

    expect(wrapper.text()).toContain('Tiny Lux Google');
    expect(wrapper.text()).toContain('Connect your Google account');
    expect(wrapper.text()).toContain('Sign in with Google');
    expect(wrapper.text()).not.toContain('PrestaShop account');
    expect(wrapper.text()).not.toContain('Billing information');
  });

  it('selects the local Merchant account without dispatching unsupported verify or claim flows', async () => {
    const store = new Vuex.Store(cloneStore());
    const dispatch = vi.spyOn(store, 'dispatch').mockResolvedValue({id: '123', name: 'Tiny Lux'});
    const wrapper = shallowMount(OnboardingPage, {
      ...config,
      store,
      stubs: ['GoogleCredentialsForm'],
    });

    await wrapper.vm.onMerchantCenterAccountSelected({id: '123', name: 'Tiny Lux'});

    expect(dispatch).toHaveBeenCalledWith(
      'accounts/SAVE_SELECTED_GOOGLE_MERCHANT_ACCOUNT',
      {selectedAccount: {id: '123', name: 'Tiny Lux'}},
    );
    expect(dispatch).not.toHaveBeenCalledWith(
      'accounts/TRIGGER_WEBSITE_VERIFICATION_AND_CLAIMING_PROCESS',
      expect.anything(),
    );
  });
});
