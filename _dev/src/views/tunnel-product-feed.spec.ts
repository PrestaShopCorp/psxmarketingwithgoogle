/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window

import {shallowMount} from '@vue/test-utils';
import TunnelProductFeed from '@/views/tunnel-product-feed.vue';
import {commonOptions} from '@/../tests/init';

describe('tunnelproduct-feed.vue', () => {
  it('product feed is being configured', () => {
    const wrapper = shallowMount(TunnelProductFeed, {
      ...commonOptions,
    });

    // expect(wrapper.find('.ps_gs-landingpage').isVisible()).toBe(true);
  });
});
