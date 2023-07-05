import Vuex from 'vuex';

// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import config, {cloneStore} from '@/../tests/init';
import Stepper from '@/components/commons/stepper.vue';

describe('stepper.vue', () => {
  const productFeedSettingsRoute = {
    name: 'product-feed-settings',
    params: {
      step: 'target-country',
    },
  };

  const routeName = {
    name: 'foo',
  };
  const push = vi.fn();
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
    const wrapper = shallowMount(Stepper, {
      propsData,
      ...config,
      store: new Vuex.Store(store),
    });

    // Check if all steps before the active one have the class .complete
    expect(wrapper.findAll('.complete').length).toEqual(2);
  });

  it('steps before activeStep are <a>', () => {
    const wrapper = shallowMount(Stepper, {
      propsData,
      ...config,
      store: new Vuex.Store(store),
    });

    // Check if all steps before the active one are links
    expect(wrapper.findAll('a').length).toEqual(2);
  });

  it('steps active has a class .active', () => {
    const wrapper = shallowMount(Stepper, {
      propsData,
      ...config,
      store: new Vuex.Store(store),
    });

    // Check if the active step has the class .active
    expect(wrapper.findAll('li').at(2).classes()).toContain('active');
  });

  it('test event emited when we click on a previous step on any other page', async () => {
    const wrapper = shallowMount(Stepper, {
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
