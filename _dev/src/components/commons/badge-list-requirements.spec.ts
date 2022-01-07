/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window
import {mount, shallowMount} from '@vue/test-utils';
import config, {localVue} from '@/../tests/init';

import BadgeListRequirements from '@/components/commons/badge-list-requirements.vue';
import {BadgeList} from '@/../stories/badge-list-requirements.stories';

describe('badge-list-requirements', () => {
  it('b-tooltip directive is tied to the badges', () => {
    const wrapper = shallowMount(BadgeListRequirements, {
      ...config,
      localVue,
      propsData: BadgeList.args,
    });
    expect(wrapper.find('b-badge').exists()).toBeTruthy();
  });
});
