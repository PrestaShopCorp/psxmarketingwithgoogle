<template>
  <b-col
    cols
    class="ps_gs-productfeed-report-card"
  >
    <div class="px-3 py-2">
      <div class="d-flex justify-content-between font-weight-600 ps_gs-fz-13 mb-2">
        <div class="d-flex align-items-center">
          <i
            v-if="status === 'success'"
            class="material-icons ps_gs-fz-18 mb-0 mr-2"
            :class="`text-${status}`"
          >
            check_circle
          </i>
          <span
            v-else
            class="material-icons-round ps_gs-fz-18 mb-0 mr-2"
            :class="`text-${status}`"
          >
            warning
          </span>
          {{ title }}
        </div>
        <b-link
          :href="linkTo"
          class="text-right"
        >
          {{ link }}
        </b-link>
      </div>
      <i
        v-if="syncStatus === 'busy'"
        class="icon-busy icon-busy--dark d-block"
      />
      <p
        v-else
        class="mb-0 ps_gs-fz-13 font-weight-600"
      >
        {{ nbProducts }}
      </p>
    </div>
  </b-col>
</template>

<script>
export default {
  name: 'ProductFeedCardReportProductsCard',
  props: {
    status: {
      type: String,
      validator(value) {
        return ['success', 'warning'].indexOf(value) !== -1;
      },
    },
    nbProducts: {
      type: Number,
    },
    title: {
      type: String,
    },
    link: {
      type: String,
    },
    linkTo: {
      type: String,
    },
    syncStatus: {
      type: String,
    },
  },
};
</script>
