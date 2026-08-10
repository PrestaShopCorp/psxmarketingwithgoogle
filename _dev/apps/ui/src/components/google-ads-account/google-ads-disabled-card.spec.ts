import Vuex from 'vuex';
import {mount} from '@vue/test-utils';
import config, {localVue} from '@/../tests/init';
import GoogleAdsDisabledCard from './google-ads-disabled-card.vue';

describe('GoogleAdsDisabledCard', () => {
  it('explains the missing Developer Token without dispatching Ads actions', () => {
    const store = new Vuex.Store({});
    const dispatch = vi.spyOn(store, 'dispatch');

    const wrapper = mount(GoogleAdsDisabledCard, {
      ...config,
      localVue,
      store,
    });

    expect(wrapper.text()).toContain('Developer token required.');
    expect(dispatch).not.toHaveBeenCalled();
  });
});
