// Import this file first to init mock on window
import {MountOptions, shallowMount} from '@vue/test-utils';
import Vuex from 'vuex';
import cloneDeep from 'lodash.clonedeep';
import config, {cloneStore, localVue} from '@/../tests/init';
import LandingPageFooter from '@/components/landing-page/landing-page-footer.vue';
import initialStateApp from '../../../.storybook/mock/state-app';

const buildWrapper = (
  options: MountOptions<any> = {},
) => {
  const store = cloneStore();

  store.modules.app.state = cloneDeep(initialStateApp);

  return shallowMount(LandingPageFooter, {
    localVue,
    ...options,
  });
};

describe('landing-page-footer.vue', () => {
  const $route = {
    name: 'configuration',
  };
  let store;
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

    await wrapper.find('[data-test-id="lp-footer-cta"]').trigger('click');
    expect(wrapper.vm.$route.name).toBe($route.name);
    expect(wrapper.emitted('hideLandingPage')).toBeTruthy();
  });
});
