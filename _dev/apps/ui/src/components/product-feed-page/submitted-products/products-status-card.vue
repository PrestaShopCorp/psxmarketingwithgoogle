<template>
  <div
    class="border border-600-20 rounded mb-2 px-3 py-2 d-flex"
  >
    <i
      class="material-icons-round ps_gs-fz-24 mr-3 mb-0"
      :class="card.color"
    >
      {{ card.icon }}
    </i>
    <div class="d-flex justify-content-between flex-grow-1">
      <div class="mr-2">
        <h3 class="ps_gs-fz-13 font-weight-600 mb-1 line-height-15">
          {{ card.title }}
        </h3>
        <p class="mb-0 ps_gs-fz-12 line-height-13 text-secondary">
          {{ card.description }}
        </p>
      </div>
      <span
        class="font-weight-700 ml-auto text-dark text-nowrap"
        v-if="syncStatus === 'success' || syncStatus === 'planned' || syncStatus === 'failed'"
      >
        <b-button
          v-if="syncStatus === 'success'
            && productStatus.statusOfProducts === ProductsStatusType.DISAPPROVED "
          variant="invisible"
          :to="{name: 'product-feed-status'}"
          class="bg-transparent p-0 border-0 font-weight-700 ps_gs-fz-13 mr-2"
        >
          {{ productStatus.numberOfProducts }}
        </b-button>

        <span
          v-else-if="syncStatus === 'success'"
        >
          <p class="bg-transparent p-0 border-0 font-weight-700 ps_gs-fz-13 mr-2">
            {{ productStatus.numberOfProducts }}
          </p>
        </span>
        <template
          v-else
        >
          --
        </template>
      </span>
      <span
        v-else
      >
        <i class="icon-busy icon-busy--dark mr-1" />
      </span>
    </div>
  </div>
</template>

<script>
import ProductsStatusType from '@/enums/product-feed/products-status-type';

export default {
  props: {
    productStatus: {
      type: Object,
      required: true,
      validator(obj) {
        const statusOfProductsValidator = Object.values(
          ProductsStatusType,
        ).includes(obj.statusOfProducts);
        const numberOfProductsValidator = typeof obj.numberOfProducts === 'number' || obj.numberOfProducts === null;

        return statusOfProductsValidator && numberOfProductsValidator;
      },
    },
  },
  data() {
    return {
      ProductsStatusType,
    };
  },
  computed: {
    card() {
      if (this.productStatus.statusOfProducts === ProductsStatusType.APPROVED) {
        return {
          icon: 'check_circle',
          color: 'text-success',
          title: this.$i18n.t(
            `productFeedPage.productStatus.${ProductsStatusType.APPROVED}Products`,
          ),
          description: this.$i18n.t(
            `productFeedPage.productStatus.${ProductsStatusType.APPROVED}ProductsDescription`,
          ),
        };
      }
      if (this.productStatus.statusOfProducts === ProductsStatusType.PENDING) {
        return {
          icon: 'autorenew',
          color: 'text-info',
          title: this.$i18n.t(
            `productFeedPage.productStatus.${ProductsStatusType.PENDING}Products`,
          ),
          description: this.$i18n.t(
            `productFeedPage.productStatus.${ProductsStatusType.PENDING}ProductsDescription`,
          ),
        };
      }
      if (this.productStatus.statusOfProducts === ProductsStatusType.EXPIRING) {
        return {
          icon: 'warning',
          color: 'text-warning',
          title: this.$i18n.t(
            `productFeedPage.productStatus.${ProductsStatusType.EXPIRING}Products`,
          ),
          description: this.$i18n.t(
            `productFeedPage.productStatus.${ProductsStatusType.EXPIRING}ProductsDescription`,
          ),
        };
      }
      return {
        icon: 'cancel',
        color: 'text-danger',
        title: this.$i18n.t(
          `productFeedPage.productStatus.${ProductsStatusType.DISAPPROVED}Products`,
        ),
        description: this.$i18n.t(
          `productFeedPage.productStatus.${ProductsStatusType.DISAPPROVED}ProductsDescription`,
        ),
      };
    },
    productFeedStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'];
    },
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
  },

};
</script>
