<template>
  <b-tr>
    <b-td
      class="ps_gs-fz-12"
    >
      {{ id }}{{ attribute > 0 ? '&#8209;' + attribute : '' }}
    </b-td>
    <b-td
      class="b-table-sticky-column text-primary"
    >
      <a
        href=""
        target="_blank"
        class="external_link-no_icon"
      >
        {{ product }}
      </a>
    </b-td>
    <b-td
      class="ps_gs-fz-12"
    >
      {{ click }}
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
  name: 'ProductsPerformanceTableRow',
  props: {
    id: {
      type: String,
      required: true,
    },
    attribute: {
      type: String,
      required: false,
      default: null,
    },
    product: {
      type: String,
      required: true,
    },
    click: {
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
