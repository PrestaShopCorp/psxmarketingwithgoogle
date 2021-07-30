/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import config, {cloneStore} from '@/../tests/init';

import {shallowMount} from '@vue/test-utils';
import Stepper from '@/components/commons/stepper.vue';

const propsData = {
  activeStep: 3,
  steps: [
    {
      title: 'Shipping settings',
    },
    {
      title: 'Export rules',
    },
    {
      title: 'Attribute mapping',
    },
    {
      title: 'Summary',
    },
  ],
};

describe('stepper.vue', () => {
  let methods;
  beforeEach(() => {
    methods = {
      handleClick: jest.fn(),
    };
  });

  it('steps before activeStep are completed', () => {
    const wrapper = shallowMount(Stepper, {
      propsData,
      ...config,
      store: new Vuex.Store(cloneStore()),
    });

    // Check if all steps before the active one have the class .complete
    expect(wrapper.findAll('.complete').length).toEqual(2);
  });

  it('steps before activeStep are <a>', () => {
    const wrapper = shallowMount(Stepper, {
      propsData,
      ...config,
      store: new Vuex.Store(cloneStore()),
    });

    // Check if all steps before the active one are links
    expect(wrapper.findAll('a').length).toEqual(2);
  });

  it('steps active has a class .active', () => {
    const wrapper = shallowMount(Stepper, {
      propsData,
      ...config,
      store: new Vuex.Store(cloneStore()),
    });

    // Check if the active step has the class .active
    expect(wrapper.findAll('li').at(2).classes()).toContain('active');
  });
});
