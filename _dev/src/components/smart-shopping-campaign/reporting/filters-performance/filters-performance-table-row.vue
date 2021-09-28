<template>
  <b-tr>
    <b-td
      class="b-table-sticky-column text-primary"
    >
      <b-button
        variant="link"
        class="p-0 m-0 font-weight-normal ps_gs-fz-12"
      >
        {{ partition.campaignName }}
      </b-button>
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ partition.productFilter }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ partition.clicks }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ partition.costs|formatPrice }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ partition.averageCostPerClick|formatPrice }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ partition.conversions }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ partition.conversionsRate }}
    </b-td>
    <b-td class="text-right ps_gs-fz-12">
      {{ partition.sales|formatPrice }}
    </b-td>
  </b-tr>
</template>

<script>
export default {
  name: 'FiltersPerformanceTableRow',
  props: {
    partition: {
      type: Object,
      required: true,
    },
  },
};
</script>
