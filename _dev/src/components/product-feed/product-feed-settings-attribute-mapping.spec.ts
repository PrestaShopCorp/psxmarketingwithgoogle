/**
 * @jest-environment jsdom
 */
import Vuex from 'vuex';

// Import this file first to init mock on window
import {mount} from '@vue/test-utils';
import {BFormCheckbox} from 'bootstrap-vue';
import {cloneStore} from '@/../tests/init';
import ProductFeedSettingsAttributeMapping from '@/components/product-feed/product-feed-settings-attribute-mapping.vue';

import {
  AttributeMapping,
} from '@/../stories/product-feed-settings.stories';

describe('product-feed-settings-attribute-mapping.vue', () => {
  let wrapper;

  beforeEach(() => {
    const VBTooltip = jest.fn();

    wrapper = mount(ProductFeedSettingsAttributeMapping, {
      store: new Vuex.Store(cloneStore()),
      propsData: AttributeMapping.args,
      beforeMount: AttributeMapping.args.beforeMount,
      stubs: {
        'b-form-checkbox': BFormCheckbox,
        ProductFeedSettingsAttributeMappingTablerowSpecific: true,
      },
      directives: {
        'b-tooltip': VBTooltip,
      },
    });
  });

  it('check if the table for specific products is hidden by default', () => {
    // check if the table for specific products doesn't exists
    expect(wrapper.find('[data-test-id="table-specific"]').exists()).toBeFalsy();
  });

  it('check if the table for specific products is visible when sellRefurbished is true', async () => {
    await wrapper.find('[data-test-id="checkbox-sellRefurbished"]').setChecked(true);
    wrapper.vm.$forceUpdate();
    // check if the table for specific products exists
    expect(wrapper.find('[data-test-id="table-specific"]').exists()).toBeTruthy();
  });
});
