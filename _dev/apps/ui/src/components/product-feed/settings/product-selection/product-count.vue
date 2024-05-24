<template>
  <b-alert
    class="mt-3"
    :variant="variant"
    show
  >
    <div>
      <b v-if="productCount">{{ productCount }}</b> {{ message }}
      <b-btn
        v-if="status === ProductFeedCountStatus.ERROR"
        :variant="variant"
      >
        Try Again
      </b-btn>
    </div>
  </b-alert>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import GetterTypes from '@/store/modules/product-feed/getters-types';
import ProductFeedCountStatus from '@/enums/product-feed/product-feed-count-status';

export default defineComponent({
  name: 'ProductFeedSettingsProductCount',
  data() {
    return {
      ProductFeedCountStatus,
    };
  },
  computed: {
    ...mapGetters({
      productCount: `productFeed/${GetterTypes.GET_PRODUCT_COUNT}`,
      status: `productFeed/${GetterTypes.GET_PRODUCT_COUNT_STATUS}`,
      currentFilters: `productFeed/${GetterTypes.GET_PRODUCT_FILTER}`,
    }),
    variant(): string {
      if (this.status === ProductFeedCountStatus.ERROR) {
        return 'danger';
      }

      if (this.status === ProductFeedCountStatus.SUCCESS && this.productCount === 0) {
        return 'warning';
      }

      return 'info';
    },
    message(): string {
      if (this.status === ProductFeedCountStatus.PENDING) {
        return this.$t('productFeedSettings.productSelection.productCount.pending') as string;
      }

      if (this.status === ProductFeedCountStatus.ERROR) {
        return this.$t('productFeedSettings.productSelection.productCount.error') as string;
      }

      if (this.status === ProductFeedCountStatus.SUCCESS && this.productCount === 0) {
        return this.$t('productFeedSettings.productSelection.productCount.nothingFound') as string;
      }

      return this.$tc('productFeedSettings.productSelection.productCount.productSelected', this.productCount) as string;
    },
  },
});
</script>
