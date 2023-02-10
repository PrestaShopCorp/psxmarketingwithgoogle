/**
 * @jest-environment jsdom
 */
import {mount, MountOptions} from '@vue/test-utils';
import {VBToggle, BCollapse, BButton} from 'bootstrap-vue';
import config, {localVue, addShowdownToVue} from '@/../tests/init';

import TipsAndTricksCard from './tips-and-tricks-card.vue';

describe('Tips & Tricks', () => {
  it('displays the tip from Christophe', () => {
    const wrapper = buildWrapper({
      propsData: {
        content: '**Lorem ipsum** dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        readMore: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
    });

    expect(wrapper.findAll('p').at(0).html()).toBe(
      '<p><strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>',
    );
    expect(wrapper.findComponent(BCollapse).text()).toBe(
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    );
    expect(wrapper.find('[data-test-id="advisor"]').text()).toBe(
      'Christophe PrestaShop eCommerce Expert',
    );
  });

  it('displays a tip without read more', () => {
    const wrapper = buildWrapper({
      propsData: {
        content: '**Lorem ipsum** dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
    });

    expect(wrapper.findAll('p').at(0).html()).toBe(
      '<p><strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>',
    );
    expect(wrapper.findComponent(BButton).exists()).toBe(false);
    expect(wrapper.findComponent(BCollapse).text().length).toBe(0);
  });
});

const buildWrapper = (
  options: MountOptions<any> = {},
) => {
  addShowdownToVue();
  localVue.directive('b-toggle', VBToggle);
  return mount(TipsAndTricksCard, {
    localVue,
    ...config,
    ...options,
  });
};
