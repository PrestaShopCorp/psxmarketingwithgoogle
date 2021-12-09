/**
 * @jest-environment jsdom
 */
// Import this file first to init mock on window
import {shallowMount} from '@vue/test-utils';
import {BDropdown, BFormCheckbox} from 'bootstrap-vue';
import {localVue} from '@/../tests/init';
import {productFeed} from '@/../.storybook/mock/product-feed.js';
import AttributeField from '@/components/product-feed/settings/attribute-mapping/attribute-field.vue';

const {attributesData} = productFeed;

describe('attribute-field.vue', () => {
  const VBTooltip = jest.fn();
  const wrapperOptions = {
    stubs: {
      BDropdown,
      BFormCheckbox,
    },
    propsData: {
      field: {
        label: 'Description',
        name: 'description',
        tooltip: true,
        recommended: [
          {
            name: 'description',
            type: 'product',
          },
        ],
        mapped: null,
        required: true,
      },
    },
    computed: {
      options() {
        return attributesData;
      },
    },
  };

  it('is visible', () => {
    const wrapper = shallowMount(AttributeField, {
      ...wrapperOptions,
      localVue,
    });

    expect(wrapper.isVisible()).toBe(true);
  });

  it('displays attribute field label', () => {
    const wrapper = shallowMount(AttributeField, {
      ...wrapperOptions,
      localVue,
    });

    expect(wrapper.find('.dropdown-toggle').text()).toBe('Description');
  });

  it('recommended option is checked when no mapped attribute', () => {
    const wrapper = shallowMount(AttributeField, {
      ...wrapperOptions,
      localVue,
    });

    expect(wrapper.find('[data-test-id="attribute-is-mapped"]').text()).toBe('Description');
  });

  it('mapped option is checked (single)', () => {
    const wrapper = shallowMount(AttributeField, {
      ...wrapperOptions,
      propsData: {
        field: {
          label: 'Description',
          name: 'description',
          tooltip: true,
          recommended: [
            {
              name: 'description',
              type: 'product',
            },
          ],
          mapped: [
            {
              name: 'shortDescription',
              type: 'product',
            },
          ],
          required: true,
        },
      },
      localVue,
    });

    expect(wrapper.find('[data-test-id="attribute-is-mapped"]').text()).toBe('shortDescription');
  });

  it('mapped options are checked (multiple)', () => {
    const wrapper = shallowMount(AttributeField, {
      ...wrapperOptions,
      propsData: {
        field: {
          label: 'Description',
          name: 'description',
          tooltip: true,
          recommended: [
            {
              name: 'description',
              type: 'product',
            },
          ],
          mapped: [
            {
              name: 'description',
              type: 'product',
            },
            {
              name: 'ean13',
              type: 'product',
            },
          ],
          required: true,
        },
      },
      localVue,
    });
    expect(wrapper.findAll('[data-test-id="attribute-is-mapped"]').at(0).text()).toBe('ean13');
    expect(wrapper.findAll('[data-test-id="attribute-is-mapped"]').at(1).text()).toBe('Description');
  });

  it('displays warning message when not availabile is selected', async () => {
    const wrapper = shallowMount(AttributeField, {
      ...wrapperOptions,
      localVue,
      stubs: {
        VueShowdown: true,
      },
      directives: {
        'b-tooltip': VBTooltip,
      },
    });
    await wrapper.setData({notAvailableSelected: true});
    expect(wrapper.find('.attribute-field__warning').exists()).toBeTruthy();
  });
});
