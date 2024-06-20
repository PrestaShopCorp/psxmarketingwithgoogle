<template>
  <div class="product-feed-summary">
    <ProductFeedSummaryStep
      :status="shippingSetupStatus"
      :link-to="{ name: 'product-feed-settings',
                  step: 1, params: ProductFeedSettingsPages.SHIPPING_SETUP }"
    >
      {{ $t('productFeedSettings.steps.shippingSetup') }}
    </ProductFeedSummaryStep>
    <ProductFeedSummaryStep
      :status="targetCountriesStatus"
      :link-to="{ name: 'product-feed-settings',
                  step: 2, params: ProductFeedSettingsPages.SHIPPING_SETTINGS }"
    >
      {{ $t('productFeedSettings.steps.deliveryTimesAndRates') }}
    </ProductFeedSummaryStep>
    <ProductFeedSummaryStep
      v-if="isUS"
      :status="taxSettingsStatus"
      :link-to="{ name: 'product-feed-settings',
                  step: 2, params: ProductFeedSettingsPages.SHIPPING_SETTINGS }"
    >
      {{ $t('productFeedSettings.deliveryTimeAndRates.taxSettings') }}
    </ProductFeedSummaryStep>
    <ProductFeedSummaryStep
      :status="attributeMappingStatus"
      :link-to="{ name: 'product-feed-settings',
                  step: 3, params: ProductFeedSettingsPages.ATTRIBUTE_MAPPING}"
    >
      {{ $t('productFeedSettings.steps.attributeMapping') }}
    </ProductFeedSummaryStep>
    <ProductFeedSummaryStep
      :status="productSelectionStatus"
      :link-to="{ name: 'product-feed-settings',
                  step: 4, params: ProductFeedSettingsPages.PRODUCT_SELECTION}"
    >
      {{ $t('productFeedSettings.steps.productSelection') }}
    </ProductFeedSummaryStep>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ProductFeedSummaryStep from '@/components/onboarding/product-feed-summary-step.vue';
import ProductFeedMixin from '@/components/mixins/Product-Feed-Mixin';

export default defineComponent({
  name: 'ProductFeedSummary',
  mixins: [ProductFeedMixin],
  components: {
    ProductFeedSummaryStep,
  },
});
</script>
