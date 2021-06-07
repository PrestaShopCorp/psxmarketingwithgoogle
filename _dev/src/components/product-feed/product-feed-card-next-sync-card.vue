<template>
  <b-col
    cols
    class="ps_gs-productfeed-report-card ps_gs-productfeed-report-card--33
      bg-violet_extralight border-0"
  >
    <div class="p-3">
      <div class="d-flex align-items-center font-weight-600 ps_gs-fz-13">
        <i
          class="material-icons ps_gs-fz-20 mr-2"
          :class="`text-purple`"
        >
          {{ icon }}
        </i>
        <span>{{ title }}</span>
      </div>
      <div
        class="font-weight-600 ps_gs-fz-16 mt-1 mb-0"
      >
        {{ description }}
      </div>
    </div>
  </b-col>
</template>

<script>
export default {
  name: 'ProductFeedCardNextSyncCard',
  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
};
</script>
