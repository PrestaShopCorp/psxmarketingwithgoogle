<template>
  <b-col
    cols
    class="ps_gs-productfeed-report-card"
    :class="size && `ps_gs-productfeed-report-card--${size}`"
  >
    <div class="px-3 py-2">
      <div class="d-flex align-items-center font-weight-600 ps_gs-fz-13">
        <i
          class="ps_gs-fz-20 mr-2"
          :class="
            [cardTitle.icon === 'warning' ? 'material-icons-round' : 'material-icons-round',
             `text-${variant}`]
          "
        >
          {{ cardTitle.icon }}
        </i>
        <span>{{ cardTitle.text }}</span>
      </div>
      <div
        class="text-center font-weight-600 ps_gs-fz-20 mt-1"
      >
        <span v-if="isLoadingInProgress === true">
          <span class="icon-busy icon-busy--dark" />
        </span>
        <span
          v-else
          data-test-id="nb-products"
        >
          {{ nbProductsText }}
        </span>
      </div>
    </div>
  </b-col>
</template>

<script>
export default {
  name: 'ProductFeedCardReportProductCard',
  props: {
    variant: {
      type: String,
      validator(value) {
        return ['success', 'warning', 'danger', 'primary'].indexOf(value) !== -1;
      },
      default: 'success',
    },
    nbProducts: {
      type: [Number, null],
      default: null,
      required: false,
    },
    isLoadingInProgress: {
      type: Boolean,
      default: false,
      required: false,
    },
    isExpired: {
      type: Boolean,
      default: false,
      required: false,
    },
    size: {
      type: String,
      default: null,
      required: false,

    },
  },
  computed: {
    nbProductsText() {
      if (this.nbProducts !== null) {
        return this.nbProducts;
      }
      return '--';
    },
    cardTitle() {
      if (this.variant === 'danger') {
        return {
          icon: 'info_outlined',
          text: this.$i18n.t('productFeedPage.productStatus.disapprovedProducts'),
        };
      } if (this.variant === 'primary' && !this.isExpired) {
        return {
          icon: 'autorenew',
          text: this.$i18n.t('productFeedPage.productStatus.pendingProducts'),
        };
      }
      if (this.variant === 'warning' && this.isExpired) {
        return {
          icon: 'warning',
          text: this.$i18n.t('productFeedPage.productStatus.expiringProducts'),
        };
      }
      // Act as if (this.variant === 'success')
      // Needed to make the linter happy (vue/return-in-computed-property)
      return {
        icon: 'check_circle',
        text: this.$i18n.t('productFeedPage.productStatus.approvedProducts'),
      };
    },
  },
};
</script>
