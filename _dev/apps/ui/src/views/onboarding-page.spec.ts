import Vuex from 'vuex';
import {shallowMount} from '@vue/test-utils';
import config, {cloneStore} from '@/../tests/init';
import OnboardingPage from '@/views/onboarding-page.vue';

describe('onboarding-page Merchant selection', () => {
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
