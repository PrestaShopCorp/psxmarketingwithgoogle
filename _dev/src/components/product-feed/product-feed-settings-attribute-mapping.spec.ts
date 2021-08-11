/**
 * @jest-environment jsdom
 */
 import Vuex from 'vuex';

 // Import this file first to init mock on window
 import config, {cloneStore} from '@/../tests/init';
 import {mount, shallowMount} from '@vue/test-utils';
 import ProductFeedSettingsAttributeMapping from '@/components/product-feed/product-feed-settings-attribute-mapping.vue';
 import {BFormCheckbox} from 'bootstrap-vue';

import {
  AttributeMapping,
} from '@/../stories/product-feed-settings.stories';

 describe('product-feed-settings-attribute-mapping.vue', () => {

  it('check if the table for specific products is hidden by default', async () => {
    const VBTooltip = jest.fn();

    const wrapper = mount(ProductFeedSettingsAttributeMapping, {
      store: new Vuex.Store(cloneStore()),
      propsData: AttributeMapping.args,
      beforeMount: AttributeMapping.args.beforeMount,
      stubs: {
        'b-form-checkbox': BFormCheckbox,
        ProductFeedSettingsAttributeMappingTablerowSpecific: true,
      },
      directives: {
        'b-tooltip' : VBTooltip,
      },
    });

    expect(wrapper.find('[data-test-id="table-specific"]').exists()).toBeFalsy();
  });

  it('check if the table for specific products is visible when sellRefurbished is true', async () => {
    const VBTooltip = jest.fn();

    const wrapper = mount(ProductFeedSettingsAttributeMapping, {
      store: new Vuex.Store(cloneStore()),
      propsData: AttributeMapping.args,
      beforeMount: AttributeMapping.args.beforeMount,
      stubs: {
        'b-form-checkbox': BFormCheckbox,
        ProductFeedSettingsAttributeMappingTablerowSpecific: true,
      },
      directives: {
        'b-tooltip' : VBTooltip,
      },
    });

    await wrapper.find('[data-test-id="checkbox-sellRefurbished"]').setChecked(true);
    // manually force Vue to update
    wrapper.vm.$forceUpdate()
    expect(wrapper.find('[data-test-id="table-specific"]').exists()).toBeTruthy();
  });
});
