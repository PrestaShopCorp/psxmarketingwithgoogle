// Import this file first to init mock on window
import {MountOptions, shallowMount} from '@vue/test-utils';
import Vuex from 'vuex';
import {initialStateApp} from '../../../.storybook/mock/state-app';
import config, {cloneStore, localVue} from '@/../tests/init';
import LandingPageHeader from '@/components/landing-page/landing-page-header.vue';
import cloneDeep from 'lodash.clonedeep';

const buildWrapper = (
  options: MountOptions<any> = {},
) => {
  const store = cloneStore();

  store.modules.app.state = cloneDeep(initialStateApp);

  return shallowMount(LandingPageHeader, {
    localVue,
    ...options,
  });
};

describe('landing-page-header.vue', () => {
  let store;
  const $route = {
    name: 'configuration',
  };
  beforeEach(() => {
    store = cloneStore();
    store.modules.app.state = {
      ...cloneDeep(initialStateApp),
    };
  });

  it('Emit event to route push when click on CTA', async () => {
    const wrapper = buildWrapper({
      ...config,
      store: new Vuex.Store(store),
      mocks: {
        $route,
        $store: {
          getters: {
            'app/GET_MODULE_NEED_UPGRADE': '1.70.0',
          },
        },
      },
    });

    await wrapper.find('[data-test-id="lp-header-cta"]').trigger('click');
    expect(wrapper.vm.$route.name).toBe($route.name);
    expect(wrapper.emitted('hideLandingPage')).toBeTruthy();
  });
});
