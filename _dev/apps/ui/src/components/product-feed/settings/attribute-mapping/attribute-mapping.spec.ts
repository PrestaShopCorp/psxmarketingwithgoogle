import Vuex from 'vuex';
import {shallowMount} from '@vue/test-utils';
import {BFormCheckboxGroup, BFormCheckbox} from 'bootstrap-vue';
import config, {cloneStore, localVue} from '@/../tests/init';
import AttributeMapping from '@/components/product-feed/settings/attribute-mapping/attribute-mapping.vue';
import CategoryButton from '@/components/product-feed/settings/attribute-mapping/category-button.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import Categories from '@/enums/product-feed/attribute-mapping-categories';

describe('attribute-mapping.vue', () => {
  const wrapperOptions = {
    stubs: {
      ActionsButtons,
      CategoryButton,
      BFormCheckboxGroup,
      BFormCheckbox,
    },
    computed: {
      attributeToEdit() {
        return null;
      },
    },
  };

  let actions;
  let store;
  beforeEach(() => {
    actions = {
      REQUEST_ATTRIBUTE_MAPPING: vi.fn(),
      REQUEST_SHOP_TO_GET_ATTRIBUTE: vi.fn(),
    };
    store = cloneStore();
    store.modules.productFeed.actions = {
      ...store.modules.productFeed.actions,
      ...actions,
    };
  });

  it('is visible', () => {
    const wrapper = shallowMount(AttributeMapping, {
      ...wrapperOptions,
      ...config,
      localVue,
      store: new Vuex.Store(store),
    });

    expect(wrapper.isVisible()).toBe(true);
  });

  it('hides attribute mapping section when no category are selected', async () => {
    const wrapper = shallowMount(AttributeMapping, {
      ...wrapperOptions,
      ...config,
      localVue,
      store: new Vuex.Store(store),
    });

    await wrapper.setData({selectedProductCategories: []});
    expect(wrapper.find('[data-test-id="section-attribute-field"]').exists()).toBeFalsy();
  });

  it('displays attribute mapping section when at least one category is selected', async () => {
    const wrapper = shallowMount(AttributeMapping, {
      ...wrapperOptions,
      ...config,
      localVue,
      store: new Vuex.Store(store),
    });

    await wrapper.setData({selectedProductCategories: [Categories.NONE]});
    expect(wrapper.find('[data-test-id="section-attribute-field"]').exists()).toBeTruthy();
  });

  it('displays more attributes to map when at least one category is selected', async () => {
    const wrapper = shallowMount(AttributeMapping, {
      ...wrapperOptions,
      ...config,
      localVue,
      store: new Vuex.Store(store),
    });

    await wrapper.setData({
      selectedProductCategories: [Categories.NONE],
      loading: false,
    });
    expect(wrapper.find('[data-test-id="section-attribute-field"]').findAll('.row').length).toBe(4);

    await wrapper.setData({selectedProductCategories: [Categories.APPAREL_AND_ACCESSORIES]});
    expect(wrapper.find('[data-test-id="section-attribute-field"]').findAll('.row').length).toBeGreaterThan(4);
  });

  it('disables the button "Continue" if no category are selected', async () => {
    const wrapper = shallowMount(AttributeMapping, {
      ...wrapperOptions,
      ...config,
      localVue,
      store: new Vuex.Store(store),
    });

    await wrapper.setData({selectedProductCategories: []});
    expect(wrapper.find('[data-test-id="continueButton"]').attributes('disabled')).toBeTruthy();
  });

  it('allows to "Continue" if at least one category is selected', async () => {
    const wrapper = shallowMount(AttributeMapping, {
      ...wrapperOptions,
      ...config,
      localVue,
      store: new Vuex.Store(store),
    });

    await wrapper.setData({selectedProductCategories: [Categories.NONE]});
    expect(wrapper.find('[data-test-id="continueButton"]').attributes('disabled')).toBeFalsy();
  });

  test.todo('checking any category unchecks "none" category');
});
