/**
 * @jest-environment jsdom
*/
import Vuex from 'vuex';

import cloneDeep from 'lodash.clonedeep';
import {MountOptions, shallowMount, Wrapper} from '@vue/test-utils';
import config, {localVue, cloneStore, addBootstrapToVue} from '@/../tests/init';

import {initialStateApp} from '../../../.storybook/mock/state-app';
import SectionTitle from './section-title.vue';

const buildWrapper = (
  options: MountOptions<any> = {},
) => {
  const store = cloneStore();

  store.modules.app.state = cloneDeep(initialStateApp);

  return shallowMount(SectionTitle, {
    localVue,
    store: new Vuex.Store(store),
    ...config,
    stubs: {
      VueShowdown: true,
    },
    ...options,
  });
};
describe('Testing differents case for the sectionTitle components', () => {
  it('should display correctly the stepper when merchant start configuration', () => {
    const store = cloneStore();
    const wrapper = buildWrapper({
      propsData: {
        stepTitle: 'step 1',
        stepNumber: 1,
        isEnabled: true,
        isDone: false,
      },
      store: new Vuex.Store(store),
    });

    expect(wrapper.find('.ps_gs-section-title .circle-stepper-current').text()).toBe('1');
    expect(wrapper.find('.material-icons').exists()).toBeFalsy();
    expect(wrapper.find('.circle-stepper-current').classes()).not.toContain('circle-disabled');
  });

  it('should display a checkmark when merchant finished the first step', () => {
    const store = cloneStore();
    const wrapper = buildWrapper({
      propsData: {
        stepTitle: 'step 1',
        stepNumber: 1,
        isEnabled: true,
        isDone: true,
      },
      store: new Vuex.Store(store),
    });

    expect(wrapper.find('.ps_gs-section-title .circle-stepper-current').exists()).toBeFalsy();
    expect(wrapper.find('.material-icons').exists()).toBeTruthy();
  });

  it('should display a circle disable', () => {
    const store = cloneStore();
    const wrapper = buildWrapper({
      propsData: {
        stepTitle: 'step 2',
        stepNumber: 2,
        isEnabled: false,
        isDone: false,
      },
      store: new Vuex.Store(store),
    });

    expect(wrapper.find('.ps_gs-section-title .circle-stepper-current').classes()).toContain('circle-disabled');
    expect(wrapper.find('.material-icons').exists()).toBeFalsy();
  });

  it('should display checkmark, current, disable steps', () => {
    const store = cloneStore();
    const steps = [
      {
        stepTitle: 'step 1',
        stepNumber: 1,
        isEnabled: true,
        isDone: true,
      },
      {
        stepTitle: 'step 2',
        stepNumber: 2,
        isEnabled: true,
        isDone: false,
      },
      {
        stepTitle: 'step 3',
        stepNumber: 3,
        isEnabled: false,
        isDone: false,
      }
    ]
    const wrapper: any  = [];
    for (let i = 0; i < steps.length; i++) {
      wrapper.push(buildWrapper({
        propsData: steps[i],
        store: new Vuex.Store(store),
      }));
    }

    expect(wrapper[0].find('.ps_gs-section-title .circle-stepper-current').exists()).toBeFalsy();
    expect(wrapper[0].find('.material-icons').exists()).toBeTruthy();

    expect(wrapper[1].find('.material-icons').exists()).toBeFalsy();
    expect(wrapper[1].find('.circle-stepper-current').classes()).not.toContain('circle-disabled');

    expect(wrapper[2].find('.ps_gs-section-title .circle-stepper-current').classes()).toContain('circle-disabled');
    expect(wrapper[2].find('.material-icons').exists()).toBeFalsy();
  });
})
