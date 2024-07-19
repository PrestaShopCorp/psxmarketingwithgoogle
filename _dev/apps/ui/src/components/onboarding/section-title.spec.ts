import cloneDeep from 'lodash.clonedeep';
import {MountOptions, shallowMount} from '@vue/test-utils';
import {localVue, cloneStore} from '@/../tests/init';

import {initialStateApp} from '../../../.storybook/mock/state-app';
import SectionTitle from './section-title.vue';

const buildWrapper = (
  options: MountOptions<any> = {},
) => {
  const store = cloneStore();

  store.modules.app.state = cloneDeep(initialStateApp);

  return shallowMount(SectionTitle, {
    localVue,
    ...options,
  });
};
describe('Testing differents case for the sectionTitle components', () => {
  it('should display correctly the stepper title', () => {
    const wrapper = buildWrapper({
      propsData: {
        stepTitle: 'Step Title',
        isEnabled: true,
      },
    });
    expect(wrapper.find('.ps_gs-section-title').text()).toBe('Step Title');
  });
  it('should have disabled title', () => {
    const wrapper = buildWrapper({
      propsData: {
        stepTitle: 'Step Title',
        isEnabled: false,
      },
    });

    expect(wrapper.find('.ps_gs-section-title').classes()).toContain('ps_gs-section-title--disabled');
  });
});
