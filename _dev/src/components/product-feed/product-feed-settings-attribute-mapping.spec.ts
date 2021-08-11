/**
 * @jest-environment jsdom
 */
 import Vuex from 'vuex';

 // Import this file first to init mock on window
 import config, {cloneStore} from '@/../tests/init';
 import {mount, shallowMount} from '@vue/test-utils';
 import ProductFeedSettingsAttributeMapping from '@/components/product-feed/product-feed-settings-attribute-mapping.vue';

import {
  AttributeMapping,
} from '@/../stories/product-feed-settings.stories';

 describe('product-feed-settings-attribute-mapping.vue', () => {
  const VBTooltip = jest.fn();

  it('does something', async () => {
    const wrapper = mount(ProductFeedSettingsAttributeMapping, {
      store: new Vuex.Store(cloneStore()),
      propsData: AttributeMapping.args,
      beforeMount: AttributeMapping.args.beforeMount,
      directives: {
        'b-tooltip' : VBTooltip,
      },
      stubs: { sellRefurbished: true }
    });

    // Check if toggle switch is visible and not disabled
    expect(wrapper.find('.ps_gs-attribute-mapping-questions').exists()).toBeTruthy();
    await wrapper.find('[data-test-id="checkbox-sellRefurbished"]').trigger('click');

    expect(wrapper.find('[data-test-id="tutu"]').exists()).toBeTruthy();
  });
});
