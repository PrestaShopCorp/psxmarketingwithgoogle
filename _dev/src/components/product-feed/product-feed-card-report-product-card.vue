<template>
  <b-col
    cols
    class="ps_gs-productfeed-report-card ps_gs-productfeed-report-card--33"
  >
    <div class="px-3 py-2">
      <div class="d-flex align-items-center font-weight-600 ps_gs-fz-13">
        <i
          class="material-icons ps_gs-fz-20 mr-2"
          :class="`text-${variant}`"
        >
          {{ cardTitle.icon }}
        </i>
        <span>{{ cardTitle.text }}</span>
      </div>
      <div
        class="text-center font-weight-600 ps_gs-fz-20 mt-1"
        :class="`text-${variant}`"
      >
        <span v-if="isSyncInProgress === true">-</span>
        <span v-else>{{ nbProducts }}</span>
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
        return ['success', 'warning', 'danger'].indexOf(value) !== -1;
      },
    },
    nbProducts: {
      type: Number,
      default: 0,
    },
    isSyncInProgress: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cardTitle() {
      if (this.variant === 'danger') {
        return {
          icon: 'error_outline',
          text: this.$i18n.t('productFeedPage.productStatus.disapprovedProducts'),
        };
      } if (this.variant === 'warning') {
        return {
          icon: 'autorenew',
          text: this.$i18n.t('productFeedPage.productStatus.pendingProducts'),
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
