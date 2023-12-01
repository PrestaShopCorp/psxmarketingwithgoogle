import Vuex from 'vuex';

// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import config, {cloneStore} from '@/../tests/init';
import PsStepper from '@/components/commons/ps-stepper.vue';

describe('ps-stepper.vue', () => {
  const routeName = {
    name: 'foo',
  };
  const mockRouter = {
    push: vi.fn(),
  };

  const propsData = {
    activeStep: 3,
    steps: [
      {
        title: 'Target Country',
      },
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
        title: 'Sync schedule',
      },
      {
        title: 'Summary',
      },
    ],
  };

  let mutations;
  let store;
  beforeEach(() => {
    mutations = {
      SET_ACTIVE_CONFIGURATION_STEP: vi.fn(),
    };
    store = cloneStore();
    store.modules.productFeed.mutations = {
      ...store.modules.productFeed.mutations,
      ...mutations,
    };
  });

  it('steps before activeStep are completed', () => {
    const wrapper = shallowMount(PsStepper, {
      propsData,
      ...config,
      store: new Vuex.Store(store),
    });

    // Check if all steps before the active one have the class .complete
    expect(wrapper.findAll('.complete').length).toEqual(2);
  });

  it('steps before activeStep are <a>', () => {
    const wrapper = shallowMount(PsStepper, {
      propsData,
      ...config,
      store: new Vuex.Store(store),
    });

    // Check if all steps before the active one are links
    expect(wrapper.findAll('a').length).toEqual(2);
  });

  it('steps active has a class .active', () => {
    const wrapper = shallowMount(PsStepper, {
      propsData,
      ...config,
      store: new Vuex.Store(store),
    });

    // Check if the active step has the class .active
    expect(wrapper.findAll('li').at(2).classes()).toContain('active');
  });

  it('test event emited when we click on a previous step on any other page', async () => {
    const wrapper = shallowMount(PsStepper, {
      mocks: {
        $route: routeName,
        $router: mockRouter,
      },
      propsData,
      ...config,
      store: new Vuex.Store(store),
    });

    // Check clicking on a previous step is emiting the event changeStep
    await wrapper.findAll('a').at(0).trigger('click');
    expect(wrapper.emitted('changeStep')).toBeTruthy();
  });
});
