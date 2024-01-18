import {createWrapper, mount} from '@vue/test-utils';
// Import this file first to init mock on window
import {BButton} from 'bootstrap-vue';
import config, {addBootstrapToVue, localVue} from '@/../tests/init';
import CardCollapse from './card-collapse.vue';

describe('CardCollapse', () => {
  beforeEach(() => {
    addBootstrapToVue();
  });

  it('hides the content by default', () => {
    const wrapper = mount(CardCollapse, {
      localVue,
      ...config,
    });

    // Check if the component is rendered
    expect(wrapper.exists()).toBe(true);

    // Check if default props are applied
    expect(wrapper.props('visible')).toBe(false);

    // Check if the component has a button for toggling
    expect(wrapper.findComponent(BButton).exists()).toBe(true);
  });

  it('shows the content if requested in props', () => {
    const wrapper = mount(CardCollapse, {
      localVue,
      ...config,
      propsData: {
        visible: true,
      },
    });

    // Check if custom props are applied
    expect(wrapper.props('visible')).toBe(true);
  });

  it('toggles the collapse when button is clicked', async () => {
    const wrapper = mount(CardCollapse, {
      localVue,
      ...config,
      slots: {
        title: 'Custom Title',
        content: 'Custom Content',
      },
    });

    const rootWrapper = createWrapper(wrapper.vm.$root);

    expect(rootWrapper.emitted('bv::collapse::state')).toEqual(undefined);
    // Check if the collapse is initially closed
    expect(wrapper.find('.collapse').classes()).toEqual(['collapse']);

    const button = wrapper.findComponent(BButton);
    // Click the button to toggle the collapse
    await button.trigger('click');
    expect(rootWrapper.emitted('bv::collapse::state')).toEqual([['11', false]]);

    await new Promise((resolve) => { setTimeout(resolve, 50); });
    await button.trigger('click');

    // Check if the collapse is now open
    expect(wrapper.find('.collapse').classes()).toEqual(['collapse', 'show']);
    expect(rootWrapper.emitted('bv::collapse::state')).toEqual([['11', false], ['11', true]]);
  });

  it('renders slot content', () => {
    const wrapper = mount(CardCollapse, {
      localVue,
      ...config,
      slots: {
        title: 'Custom Title',
        content: 'Custom Content',
      },
    });

    // Check if slot content is rendered
    expect(wrapper.text()).toContain('Custom Title');
    expect(wrapper.text()).toContain('Custom Content');
  });
});
