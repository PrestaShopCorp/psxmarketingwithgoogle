import Vuex from 'vuex';
import {shallowMount} from '@vue/test-utils';
import config, {cloneStore} from '@/../tests/init';
import App from '@/App.vue';

describe('App local Google compatibility', () => {
  it('renders without remote health checks or telemetry events', () => {
    const track = vi.fn();
    const store = new Vuex.Store(cloneStore());
    vi.spyOn(store, 'dispatch').mockResolvedValue(undefined);
    const wrapper = shallowMount(App, {
      ...config,
      store,
      mocks: {
        ...config.mocks,
        $route: {name: 'configuration'},
        $segment: {track},
      },
      stubs: ['router-view'],
    });

    expect(store.dispatch).not.toHaveBeenCalledWith('app/CHECK_FOR_AD_BLOCKER');
    expect(track).not.toHaveBeenCalled();
    expect(wrapper.find('#helper-shopid').exists()).toBe(false);
  });
});
