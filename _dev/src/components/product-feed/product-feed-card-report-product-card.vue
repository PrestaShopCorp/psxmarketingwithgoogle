<template>
  <b-col
    cols
    class="ps_gs-productfeed-report-card ps_gs-productfeed-report-card--33"
  >
    <div class="px-3 py-2">
      <div class="d-flex align-items-center font-weight-600 ps_gs-fz-13">
        <template v-if="variant === 'success'">
          <i class="material-icons text-success ps_gs-fz-20 mr-2">
            check_circle
          </i>
          <span>{{ $t('productFeedPage.productStatus.approvedProducts') }}</span>
        </template>
        <template v-if="variant === 'warning'">
          <i class="material-icons text-warning ps_gs-fz-20 mr-2">
            autorenew
          </i>
          <span>{{ $t('productFeedPage.productStatus.pendingProducts') }}</span>
        </template>
        <template v-if="variant === 'danger'">
          <i class="material-icons text-danger ps_gs-fz-20 mr-2">
            error_outline
          </i>
          <span>{{ $t('productFeedPage.productStatus.disapprovedProducts') }}</span>
        </template>
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
import {
  BIconstack,
  BIconCheck,
  BIconCircleFill,
  BIconExclamationTriangleFill,
} from 'bootstrap-vue';

export default {
  name: 'ProductFeedCardReportProductCard',
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
    BIconExclamationTriangleFill,
  },
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
    }
  },
};
</script>
