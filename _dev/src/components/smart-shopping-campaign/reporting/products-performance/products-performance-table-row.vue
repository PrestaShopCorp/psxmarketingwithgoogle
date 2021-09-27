<template>
  <b-tr>
    <b-td
      class="ps_gs-fz-12"
    >
      {{ campaign.id }}{{ campaign.attribute > 0 ? '&#8209;' + campaign.attribute : '' }}
    </b-td>
    <b-td
      class="b-table-sticky-column text-primary"
    >
      <b-button
        variant="link"
        class="p-0 m-0 font-weight-normal ps_gs-fz-12"
      >
        {{ campaign.name }}
      </b-button>
    </b-td>
    <b-td
      class="ps_gs-fz-12"
    >
      {{ campaign.clicks }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.costs|formatPrice }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.averageCostPerClick|formatPrice }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.conversions }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.conversionsRate }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.sales|formatPrice }}
    </b-td>
  </b-tr>
</template>

<script>
export default {
  name: 'ProductsPerformanceTableRow',
  props: {
    campaign: {
      type: Object,
      required: true,
    },
  },
};
</script>
