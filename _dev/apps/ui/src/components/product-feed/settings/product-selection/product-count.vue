<template>
  <b-alert
    class="mt-3"
    :variant="variant"
    show
  >
    <div>
      <p class="d-flex align-items-center">
        <b
          v-if="productCount
            && status === ProductFeedCountStatus.SUCCESS"
          class="mr-1"
        >
          {{ productCount }}
        </b>
        <span
          v-if="status === ProductFeedCountStatus.PENDING"
          class="icon-busy icon-busy--dark mr-2 flex-shrink-0"
        />
        {{ message }}
      </p>
      <b-btn
        v-if="status === ProductFeedCountStatus.ERROR"
        :variant="variant"
        @click="relaunchCount"
      >
        {{ $t('productFeedSettings.productSelection.productCount.tryAgain') }}
      </b-btn>
    </div>
  </b-alert>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters, mapActions} from 'vuex';
import GetterTypes from '@/store/modules/product-feed/getters-types';
import ProductFeedCountStatus from '@/enums/product-feed/product-feed-count-status';
import ActionsTypes from '@/store/modules/product-feed/actions-types';

export default defineComponent({
  name: 'ProductFeedSettingsProductCount',
  data() {
    return {
      ProductFeedCountStatus,
      isPendingLong: false,
      pendingTimeout: null as ReturnType<typeof setTimeout> | null,
    };
  },
  methods: {
    ...mapActions({
      relaunchCount: `productFeed/${ActionsTypes.TRIGGER_PRODUCT_COUNT}`,
    }),
    startPendingTimeout() {
      if (this.pendingTimeout) {
        clearTimeout(this.pendingTimeout);
      }
      this.pendingTimeout = setTimeout(() => {
        this.isPendingLong = true;
      }, 5000);
    },
    clearPendingTimeout() {
      if (this.pendingTimeout) {
        clearTimeout(this.pendingTimeout);
        this.pendingTimeout = null;
      }
    },
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
        if (this.isPendingLong) {
          return this.$t('productFeedSettings.productSelection.productCount.pendingLong') as string;
        }
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
  watch: {
    status(newStatus) {
      if (newStatus === ProductFeedCountStatus.PENDING) {
        this.isPendingLong = false;
        this.startPendingTimeout();
      } else {
        this.isPendingLong = false;
        this.clearPendingTimeout();
      }
    },
  },
  mounted() {
    if (this.status === ProductFeedCountStatus.PENDING) {
      this.startPendingTimeout();
    }
  },
  beforeDestroy() {
    this.clearPendingTimeout();
  },
});
</script>
