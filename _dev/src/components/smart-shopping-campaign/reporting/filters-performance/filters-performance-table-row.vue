<template>
  <b-tr>
    <b-td
      class="b-table-sticky-column text-primary"
    >
      <b-button
        variant="link"
        class="font-weight-normal ps_gs-fz-12 p-0 m-0"
      >
        {{ name }}
      </b-button>
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ productFilter }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ clicks }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ costs }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ averageCpc }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ conversions }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ conversionsRate }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ sales }}
    </b-td>
  </b-tr>
</template>

<script>
import StickyColumnsObserver from '@/utils/StickyColumnsObserver.ts';

export default {
  mixins: [StickyColumnsObserver],
  name: 'FiltersPerformanceTableRow',
  props: {
    name: {
      type: String,
      required: true,
    },
    productFilter: {
      type: String,
      required: true,
    },
    clicks: {
      type: String,
      required: true,
    },
    costs: {
      type: String,
      required: true,
    },
    averageCpc: {
      type: String,
      required: true,
    },
    conversions: {
      type: String,
      required: true,
    },
    conversionsRate: {
      type: String,
      required: true,
    },
    sales: {
      type: String,
      required: true,
    },
  },
};
</script>
