/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window
import config from '@/../tests/init';

import {mount} from '@vue/test-utils';
import BadgeListRequirements from '@/components/commons/badge-list-requirements.vue';
import {BadgeList} from '@/../stories/badge-list-requirements.stories';

describe('badge-list-requirements', () => {
  it('on mouseenter, a tooltip directive should have been called', async () => {
    const vBTooltip = jest.fn()

    const wrapper = mount(BadgeListRequirements, {
      ...config,
      propsData: BadgeList.args,
      directives: {
        'b-tooltip': vBTooltip,
      }
    });

    await wrapper.findAll('b-button').at(0).trigger('mouseenter');
    expect(vBTooltip).toHaveBeenCalled()
  });
});
