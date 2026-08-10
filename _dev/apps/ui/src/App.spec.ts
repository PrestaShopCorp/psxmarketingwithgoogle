import Vuex from 'vuex';
import {shallowMount} from '@vue/test-utils';
import config, {cloneStore} from '@/../tests/init';
import App from '@/App.vue';

describe('App local Google compatibility', () => {
  it('renders and tracks without removed PrestaShop Accounts identity state', () => {
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

    expect(() => wrapper.vm.throwSegmentEvent()).not.toThrow();
    expect(track).toHaveBeenCalledWith('[GGL] Clicked on reporting tab', expect.not.objectContaining({
      userId: expect.anything(),
    }));
    expect(wrapper.find('#helper-shopid').exists()).toBe(false);
  });
});
