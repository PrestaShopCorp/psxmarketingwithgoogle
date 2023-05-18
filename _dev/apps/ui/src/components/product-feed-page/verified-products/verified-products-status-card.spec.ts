/**
 * @jest-environment jsdom
 */

import {BCard, BSkeleton} from 'bootstrap-vue';
import {mount, shallowMount} from '@vue/test-utils';
import StatusCardVue from './verified-products-status-card.vue';
import config, {addBootstrapToVue, localVue} from '@/../tests/init';

describe('verified-products-status-card.vue', () => {
  it('displays the texts & number', () => {
    addBootstrapToVue();
    const wrapper = shallowMount(StatusCardVue, {
      localVue,
      ...config,
      propsData: {
        status: {
          title: 'Some title',
          description: 'Some description',
          value: '125',
          variant: 'warning',
          icon: 'send',
          reverseColors: false,
        },
        loading: false,
      },
    });

    const title = wrapper.find('[data-test-id="pf-status-title"]');
    const description = wrapper.find('[data-test-id="pf-status-description"]');
    const badge = wrapper.findComponent(BCard);

    expect(title.text()).toContain('send'); // Icon
    expect(title.text()).toContain('Some title'); // Title
    expect(description.text()).toEqual('Some description');

    expect(badge.text()).toEqual('125');
    expect(badge.attributes('bordervariant')).toEqual('warning');
    expect(badge.attributes('textvariant')).toEqual('warning');
    expect(badge.attributes('bgvariant')).toEqual('white');
  });

  it('displays a default value when no number is given', () => {
    addBootstrapToVue();
    const wrapper = mount(StatusCardVue, {
      localVue,
      ...config,
      propsData: {
        status: {
          title: 'Some title',
          description: 'Some description',
          value: null,
          variant: 'success',
          icon: 'send',
          reverseColors: false,
        },
        loading: false,
      },
    });

    const title = wrapper.find('[data-test-id="pf-status-title"]');
    const description = wrapper.find('[data-test-id="pf-status-description"]');
    const badge = wrapper.findComponent(BCard);

    expect(title.text()).toContain('send'); // Icon
    expect(title.text()).toContain('Some title'); // Title
    expect(description.text()).toEqual('Some description');

    expect(badge.text()).toEqual('--');
  });

  it('displays a skeleton during loading', () => {
    addBootstrapToVue();
    const wrapper = mount(StatusCardVue, {
      localVue,
      ...config,
      propsData: {
        status: {
          title: 'Some title',
          description: 'Some description',
          value: null,
          variant: 'success',
          icon: 'send',
          reverseColors: false,
        },
        loading: true,
      },
    });

    const loadingTags = wrapper.findAllComponents(BSkeleton);

    expect(loadingTags).toHaveLength(4);
  });

  it('reverses colors on badge when requested', () => {
    addBootstrapToVue();
    const wrapper = shallowMount(StatusCardVue, {
      localVue,
      ...config,
      propsData: {
        status: {
          title: 'Some title',
          description: 'Some description',
          value: '125',
          variant: 'info',
          icon: 'send',
          reverseColors: true,
        },
        loading: false,
      },
    });
    const badge = wrapper.findComponent(BCard);

    expect(badge.text()).toEqual('125');
    expect(badge.attributes('bordervariant')).toBeUndefined();
    expect(badge.attributes('textvariant')).toEqual('white');
    expect(badge.attributes('bgvariant')).toEqual('info');
  });
});
