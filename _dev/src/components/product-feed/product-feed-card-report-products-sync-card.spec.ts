/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window
import {commonOptions} from '@/../tests/init';

import {shallowMount} from '@vue/test-utils';
import ProductFeedCardReportProductsSyncCard from '@/components/product-feed/product-feed-card-report-products-sync-card.vue';

describe('product-feed-card-report-products-sync-card.vue / Product status', () => {
  it('shows spinners when API is being called', () => {
    const wrapper = shallowMount(ProductFeedCardReportProductsSyncCard, {
      ...commonOptions,
      propsData: {
        isLoadingInProgress: true,
      },
    });

    expect(wrapper.find('.icon-busy').exists()).toBe(true);
  });

  it('shows dashes when value is null', () => {
    const wrapper = shallowMount(ProductFeedCardReportProductsSyncCard, {
      ...commonOptions,
      propsData: {
        isLoadingInProgress: false,
        nbProducts: null,
      },
    });

    expect(wrapper.find('[data-test-id="nb-products"]').text()).toEqual('--');
  });

  it('shows the actual value when it gets a number', () => {
    const wrapper = shallowMount(ProductFeedCardReportProductsSyncCard, {
      ...commonOptions,
      propsData: {
        isLoadingInProgress: false,
        nbProducts: 42,
      },
    });

    expect(wrapper.find('[data-test-id="nb-products"]').text()).toEqual('42');
  });
});
