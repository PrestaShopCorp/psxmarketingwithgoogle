<template>
  <b-th
    class="font-weight-600"
    :class="{'b-table-sticky-column b-table-sticky-column--invisible': index === 1}"
  >
    <div class="flex align-items-center text-nowrap">
      <span>{{ $t(`campaigns.labelCol.${type}`) }}</span>
      <b-button
        v-if="tooltip"
        variant="invisible"
        v-b-tooltip:psxMktgWithGoogleApp
        :title="$t(`campaigns.tooltipCol.${type}`)"
        class="p-0 mt-0 ml-1 border-0 d-inline-flex align-items-center"
      >
        <i class="material-icons ps_gs-fz-14 text-secondary">error_outline</i>
      </b-button>
    </div>
  </b-th>
</template>

<script>
import StickyColumnsObserver from '@/utils/StickyColumnsObserver.ts';

export default {
  mixins: [StickyColumnsObserver],
  name: 'ProductsPerformanceTableHeading',
  props: {
    type: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: false,
      default: null,
    },
    index: {
      type: Number,
      required: true,
    },
  },
};
</script>
